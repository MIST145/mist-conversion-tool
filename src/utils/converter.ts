import {
  FileContent,
  ConversionResult,
  ConversionStats,
  ConversionPattern,
  ManualItem,
  PatternScope
} from '@/types';

/** Sort patterns so the most specific / highest priority ones run first. */
export function sortPatterns(patterns: ConversionPattern[]): ConversionPattern[] {
  return [...patterns].sort((a, b) => {
    const pa = a.priority ?? 0;
    const pb = b.priority ?? 0;
    if (pb !== pa) return pb - pa;
    return b.from.length - a.from.length;
  });
}

/** Infer client/server scope from the file path. */
export function detectFileScope(path: string): PatternScope {
  const name = path.toLowerCase();
  if (/(^|[\\/_.-])client([\\/_.-]|\.lua$)/.test(name)) return 'client';
  if (/(^|[\\/_.-])server([\\/_.-]|\.lua$)/.test(name)) return 'server';
  return 'shared';
}

function scopeAllows(fileScope: PatternScope, patternScope?: PatternScope): boolean {
  if (!patternScope || patternScope === 'shared') return true;
  if (fileScope === 'shared') return true;
  return fileScope === patternScope;
}

export function convertFiles(
  files: FileContent[],
  patterns: ConversionPattern[]
): { results: ConversionResult[]; stats: ConversionStats } {
  const results: ConversionResult[] = [];
  const patternUsage: Record<string, number> = {};
  const sorted = sortPatterns(patterns);
  const requiredResources = new Set<string>();

  let totalChanges = 0;
  let filesChanged = 0;
  let manualCount = 0;

  for (const file of files) {
    const result = convertFile(file, sorted, patternUsage);
    results.push(result);
    result.requiredResources?.forEach(r => requiredResources.add(r));
    manualCount += result.manualItems?.length ?? 0;

    if (result.changes > 0) {
      filesChanged++;
      totalChanges += result.changes;
    }
  }

  const stats: ConversionStats = {
    totalFiles: files.length,
    filesChanged,
    filesUnchanged: files.length - filesChanged,
    totalChanges,
    patternUsage,
    manualCount,
    requiredResources: Array.from(requiredResources).sort()
  };

  return { results, stats };
}

function convertFile(
  file: FileContent,
  patterns: ConversionPattern[],
  patternUsage: Record<string, number>
): ConversionResult {
  let convertedContent = file.content;
  const patternsApplied: string[] = [];
  const manualItems: ManualItem[] = [];
  const requiredResources = new Set<string>();
  const fileScope = detectFileScope(file.path);
  let changes = 0;

  for (const pattern of patterns) {
    if (!scopeAllows(fileScope, pattern.scope)) continue;

    const regex = new RegExp(escapeRegex(pattern.from), 'g');
    const matches = convertedContent.match(regex);
    if (!matches || matches.length === 0) continue;

    if (pattern.manual) {
      // Non 1:1 logic — never rewritten automatically, only reported.
      for (const line of findLines(convertedContent, pattern.from)) {
        manualItems.push({
          from: pattern.from,
          suggestion: pattern.to,
          category: pattern.category,
          line,
          notes: pattern.notes,
          confidence: pattern.confidence
        });
      }
      continue;
    }

    convertedContent = convertedContent.replace(regex, pattern.to);
    patternsApplied.push(pattern.from);
    changes += matches.length;
    pattern.requires?.forEach(r => requiredResources.add(r));

    patternUsage[pattern.from] = (patternUsage[pattern.from] ?? 0) + matches.length;
  }

  return {
    path: file.path,
    originalContent: file.content,
    convertedContent,
    changes,
    patternsApplied,
    manualItems,
    requiredResources: Array.from(requiredResources).sort()
  };
}

function findLines(content: string, needle: string): number[] {
  const lines: number[] = [];
  content.split('\n').forEach((line, i) => {
    if (line.includes(needle)) lines.push(i + 1);
  });
  return lines;
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

export function generateConversionReport(
  stats: ConversionStats,
  results: ConversionResult[],
  direction: string
): string {
  const timestamp = new Date().toISOString();
  const directionText = direction === 'esx-to-qb' ? 'ESX → QB-Core' : 'QB-Core → ESX';
  
  let report = `# FiveM Conversion Report\n\n`;
  report += `**Conversion Direction:** ${directionText}\n`;
  report += `**Generated:** ${timestamp}\n\n`;
  
  report += `## Summary\n\n`;
  report += `- Total Files: ${stats.totalFiles}\n`;
  report += `- Files Changed: ${stats.filesChanged}\n`;
  report += `- Files Unchanged: ${stats.filesUnchanged}\n`;
  report += `- Total Patterns Applied: ${stats.totalChanges}\n\n`;

  if (stats.requiredResources?.length) {
    report += `## Required Resources\n\n`;
    for (const res of stats.requiredResources) report += `- ${res}\n`;
    report += `\n`;
  }
  
  report += `## Pattern Usage\n\n`;
  const sortedPatterns = Object.entries(stats.patternUsage)
    .sort(([, a], [, b]) => b - a);
  
  for (const [pattern, count] of sortedPatterns) {
    report += `- \`${pattern}\`: ${count}x\n`;
  }
  
  report += `\n## File Changes\n\n`;
  
  for (const result of results) {
    if (result.changes > 0) {
      report += `### ${result.path}\n`;
      report += `**Changes:** ${result.changes}\n`;
      report += `**Patterns Applied:**\n`;
      for (const pattern of result.patternsApplied) {
        report += `- \`${pattern}\`\n`;
      }
      report += `\n`;
    }
  }
  
  const unchangedFiles = results.filter(r => r.changes === 0);
  if (unchangedFiles.length > 0) {
    report += `## Unchanged Files\n\n`;
    for (const result of unchangedFiles) {
      report += `- ${result.path}\n`;
    }
    report += `\n`;
  }

  const manualFiles = results.filter(r => (r.manualItems?.length ?? 0) > 0);
  if (manualFiles.length > 0) {
    report += `## Manual Conversion Required\n\n`;
    for (const result of manualFiles) {
      report += `### ${result.path}\n`;
      for (const item of result.manualItems!) {
        report += `- Line ${item.line} \`${item.from}\` → ${item.suggestion}\n`;
        if (item.notes) report += `  - ${item.notes}\n`;
      }
      report += `\n`;
    }
  }
  
  return report;
}

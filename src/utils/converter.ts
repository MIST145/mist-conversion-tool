import { FileContent, ConversionResult, ConversionStats, ConversionPattern } from '@/types';

export function convertFiles(
  files: FileContent[],
  patterns: ConversionPattern[]
): { results: ConversionResult[]; stats: ConversionStats } {
  const results: ConversionResult[] = [];
  const patternUsage: Record<string, number> = {};
  
  let totalChanges = 0;
  let filesChanged = 0;
  
  for (const file of files) {
    const result = convertFile(file, patterns, patternUsage);
    results.push(result);
    
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
    patternUsage
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
  let changes = 0;
  
  for (const pattern of patterns) {
    const regex = new RegExp(escapeRegex(pattern.from), 'g');
    const matches = convertedContent.match(regex);
    
    if (matches && matches.length > 0) {
      convertedContent = convertedContent.replace(regex, pattern.to);
      patternsApplied.push(pattern.from);
      changes += matches.length;
      
      // Track pattern usage
      if (!patternUsage[pattern.from]) {
        patternUsage[pattern.from] = 0;
      }
      patternUsage[pattern.from] += matches.length;
    }
  }
  
  return {
    path: file.path,
    originalContent: file.content,
    convertedContent,
    changes,
    patternsApplied
  };
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
  }
  
  return report;
}

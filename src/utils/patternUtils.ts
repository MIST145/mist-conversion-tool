import { ConversionPattern } from '@/types';
import { ESX_TO_QB_PATTERNS, QB_TO_ESX_PATTERNS, SQL_PATTERNS } from '@/data/patterns';

export interface PatternLibraryExport {
  version: string;
  exportDate: string;
  patterns: {
    esxToQb: ConversionPattern[];
    qbToEsx: ConversionPattern[];
    sql: ConversionPattern[];
    custom: ConversionPattern[];
  };
}

export interface PatternValidationResult {
  valid: boolean;
  errors: string[];
}

export function validatePattern(pattern: Partial<ConversionPattern>): PatternValidationResult {
  const errors: string[] = [];

  if (!pattern.from?.trim()) {
    errors.push('From pattern cannot be empty');
  }

  if (!pattern.to?.trim()) {
    errors.push('To pattern cannot be empty');
  }

  if (!pattern.category?.trim()) {
    errors.push('Category cannot be empty');
  }

  if (!pattern.direction || !['esx-to-qb', 'qb-to-esx'].includes(pattern.direction)) {
    errors.push('Direction must be either "esx-to-qb" or "qb-to-esx"');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function exportPatternsToJson(customPatterns: ConversionPattern[]): string {
  const library: PatternLibraryExport = {
    version: '1.0',
    exportDate: new Date().toISOString(),
    patterns: {
      esxToQb: ESX_TO_QB_PATTERNS,
      qbToEsx: QB_TO_ESX_PATTERNS,
      sql: SQL_PATTERNS,
      custom: customPatterns
    }
  };

  return JSON.stringify(library, null, 2);
}

export function downloadPatternLibrary(customPatterns: ConversionPattern[]) {
  const jsonContent = exportPatternsToJson(customPatterns);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `pattern-library-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function parseImportedPatterns(jsonContent: string): {
  success: boolean;
  patterns?: ConversionPattern[];
  error?: string;
} {
  try {
    const parsed = JSON.parse(jsonContent);
    
    // Check if it's our export format
    if (parsed.patterns && parsed.version) {
      const allPatterns: ConversionPattern[] = [
        ...(parsed.patterns.custom || [])
      ];
      
      return {
        success: true,
        patterns: allPatterns
      };
    }
    
    // Check if it's just an array of patterns
    if (Array.isArray(parsed)) {
      return {
        success: true,
        patterns: parsed
      };
    }
    
    return {
      success: false,
      error: 'Invalid file format. Expected pattern library export or pattern array.'
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid JSON file'
    };
  }
}

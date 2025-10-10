export type ConversionDirection = 'esx-to-qb' | 'qb-to-esx';

export interface ConversionPattern {
  from: string;
  to: string;
  category: string;
  direction: ConversionDirection;
}

export interface FileContent {
  path: string;
  content: string;
  size: number;
}

export interface ConversionResult {
  path: string;
  originalContent: string;
  convertedContent: string;
  changes: number;
  patternsApplied: string[];
}

export interface ConversionStats {
  totalFiles: number;
  filesChanged: number;
  filesUnchanged: number;
  totalChanges: number;
  patternUsage: Record<string, number>;
}

export interface InputMethod {
  type: 'upload' | 'github' | 'paste';
  files?: FileContent[];
  githubUrl?: string;
  pasteContent?: string;
  pasteFileName?: string;
}

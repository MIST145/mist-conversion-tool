export type ConversionDirection = 'esx-to-qb' | 'qb-to-esx';

export type SourceFramework = 'esx' | 'qbcore' | 'qbox';

export type PatternScope = 'client' | 'server' | 'shared';

export type PatternConfidence = 'high' | 'medium' | 'low';

export interface ConversionPattern {
  from: string;
  to: string;
  category: string;
  direction: ConversionDirection;
  /** Which source framework(s) this pattern applies to. Undefined = any. */
  sourceFramework?: SourceFramework[];
  /** client / server / shared. Undefined = shared. */
  scope?: PatternScope;
  confidence?: PatternConfidence;
  /** Higher wins when several patterns could match. */
  priority?: number;
  /** Resources required by the target snippet (ox_lib, ox_inventory, ...). */
  requires?: string[];
  notes?: string;
  /** Not a safe 1:1 replacement — reported for manual conversion instead. */
  manual?: boolean;
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
  manualItems?: ManualItem[];
  requiredResources?: string[];
}

export interface ManualItem {
  from: string;
  suggestion: string;
  category: string;
  line: number;
  notes?: string;
  confidence?: PatternConfidence;
}

export interface ConversionStats {
  totalFiles: number;
  filesChanged: number;
  filesUnchanged: number;
  totalChanges: number;
  patternUsage: Record<string, number>;
  manualCount?: number;
  requiredResources?: string[];
}

export interface InputMethod {
  type: 'upload' | 'github' | 'paste';
  files?: FileContent[];
  githubUrl?: string;
  pasteContent?: string;
  pasteFileName?: string;
}

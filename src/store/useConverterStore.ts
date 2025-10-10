import { create } from 'zustand';
import { ConversionDirection, FileContent, ConversionResult, ConversionStats, ConversionPattern } from '@/types';
import { ESX_TO_QB_PATTERNS, QB_TO_ESX_PATTERNS, SQL_PATTERNS } from '@/data/patterns';

interface ConverterStore {
  // Input
  inputFiles: FileContent[];
  inputMethod: 'upload' | 'github' | 'paste';
  
  // Settings
  direction: ConversionDirection;
  includeSqlPatterns: boolean;
  createBackup: boolean;
  
  // Results
  conversionResults: ConversionResult[];
  conversionStats: ConversionStats | null;
  selectedFile: string | null;
  
  // Patterns
  customPatterns: ConversionPattern[];
  
  // Actions
  setInputFiles: (files: FileContent[]) => void;
  setInputMethod: (method: 'upload' | 'github' | 'paste') => void;
  setDirection: (direction: ConversionDirection) => void;
  setIncludeSqlPatterns: (include: boolean) => void;
  setCreateBackup: (create: boolean) => void;
  setConversionResults: (results: ConversionResult[]) => void;
  setConversionStats: (stats: ConversionStats) => void;
  setSelectedFile: (path: string | null) => void;
  addCustomPattern: (pattern: ConversionPattern) => void;
  removeCustomPattern: (pattern: ConversionPattern) => void;
  resetCustomPatterns: () => void;
  clearResults: () => void;
  reset: () => void;
  
  // Getters
  getAllPatterns: () => ConversionPattern[];
}

export const useConverterStore = create<ConverterStore>((set, get) => ({
  // Initial state
  inputFiles: [],
  inputMethod: 'upload',
  direction: 'esx-to-qb',
  includeSqlPatterns: true,
  createBackup: false,
  conversionResults: [],
  conversionStats: null,
  selectedFile: null,
  customPatterns: [],
  
  // Actions
  setInputFiles: (files) => set({ inputFiles: files }),
  
  setInputMethod: (method) => set({ inputMethod: method }),
  
  setDirection: (direction) => set({ direction }),
  
  setIncludeSqlPatterns: (include) => set({ includeSqlPatterns: include }),
  
  setCreateBackup: (create) => set({ createBackup: create }),
  
  setConversionResults: (results) => set({ conversionResults: results }),
  
  setConversionStats: (stats) => set({ conversionStats: stats }),
  
  setSelectedFile: (path) => set({ selectedFile: path }),
  
  addCustomPattern: (pattern) => set((state) => ({
    customPatterns: [...state.customPatterns, pattern]
  })),
  
  removeCustomPattern: (pattern) => set((state) => ({
    customPatterns: state.customPatterns.filter(p => 
      p.from !== pattern.from || p.to !== pattern.to
    )
  })),
  
  resetCustomPatterns: () => set({ customPatterns: [] }),
  
  clearResults: () => set({
    conversionResults: [],
    conversionStats: null,
    selectedFile: null
  }),
  
  reset: () => set({
    inputFiles: [],
    inputMethod: 'upload',
    direction: 'esx-to-qb',
    includeSqlPatterns: true,
    createBackup: false,
    conversionResults: [],
    conversionStats: null,
    selectedFile: null
  }),
  
  getAllPatterns: () => {
    const state = get();
    const basePatterns = state.direction === 'esx-to-qb' 
      ? ESX_TO_QB_PATTERNS 
      : QB_TO_ESX_PATTERNS;
    
    const patterns = [...basePatterns];
    
    if (state.includeSqlPatterns) {
      patterns.push(...SQL_PATTERNS);
    }
    
    // Add custom patterns
    const relevantCustom = state.customPatterns.filter(p => p.direction === state.direction);
    patterns.push(...relevantCustom);
    
    // Sort by length (descending) to match longer patterns first
    return patterns.sort((a, b) => b.from.length - a.from.length);
  }
}));

import JSZip from 'jszip';
import { ConversionResult, ConversionStats } from '@/types';
import { generateConversionReport } from './converter';

export async function downloadAsZip(
  results: ConversionResult[],
  stats: ConversionStats,
  direction: string,
  includeOriginals: boolean = false
): Promise<void> {
  const zip = new JSZip();
  
  // Add converted files
  const convertedFolder = zip.folder('converted');
  if (convertedFolder) {
    for (const result of results) {
      convertedFolder.file(result.path, result.convertedContent);
    }
  }
  
  // Add originals if requested
  if (includeOriginals) {
    const originalFolder = zip.folder('original');
    if (originalFolder) {
      for (const result of results) {
        originalFolder.file(result.path, result.originalContent);
      }
    }
  }
  
  // Add conversion report
  const report = generateConversionReport(stats, results, direction);
  zip.file('CONVERSION_REPORT.md', report);
  
  // Generate and download
  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `fivem-conversion-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadText(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

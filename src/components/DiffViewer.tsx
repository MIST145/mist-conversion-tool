import { useMemo } from 'react';
import { diffLines } from 'diff';
import { ConversionResult } from '@/types';
import { Button } from './ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DiffViewerProps {
  result: ConversionResult;
}

export default function DiffViewer({ result }: DiffViewerProps) {
  const diff = useMemo(() => {
    return diffLines(result.originalContent, result.convertedContent);
  }, [result.originalContent, result.convertedContent]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(result.convertedContent);
    toast.success('Converted code copied to clipboard');
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{result.path}</h3>
          {result.changes > 0 ? (
            <p className="text-sm text-muted-foreground">
              {result.changes} change{result.changes !== 1 ? 's' : ''} made
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No changes needed</p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy Code
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 h-[calc(100vh-350px)]">
        {/* Original */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Original</div>
          <div className="h-full overflow-auto rounded border border-border bg-code-bg p-4">
            <pre className="text-xs font-mono leading-relaxed">
              {diff.map((part, index) => {
                if (part.removed) {
                  return (
                    <div key={index} className="bg-destructive/20 text-destructive-foreground">
                      {part.value}
                    </div>
                  );
                }
                if (!part.added) {
                  return <div key={index}>{part.value}</div>;
                }
                return null;
              })}
            </pre>
          </div>
        </div>
        
        {/* Converted */}
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">Converted</div>
          <div className="h-full overflow-auto rounded border border-border bg-code-bg p-4">
            <pre className="text-xs font-mono leading-relaxed">
              {diff.map((part, index) => {
                if (part.added) {
                  return (
                    <div key={index} className="bg-success/20 text-success-foreground">
                      {part.value}
                    </div>
                  );
                }
                if (!part.removed) {
                  return <div key={index}>{part.value}</div>;
                }
                return null;
              })}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

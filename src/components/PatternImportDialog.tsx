import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ConversionPattern } from '@/types';
import { parseImportedPatterns } from '@/utils/patternUtils';
import { useToast } from '@/hooks/use-toast';
import { Upload } from 'lucide-react';

interface PatternImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (patterns: ConversionPattern[], mode: 'merge' | 'replace') => void;
}

export default function PatternImportDialog({ open, onOpenChange, onImport }: PatternImportDialogProps) {
  const { toast } = useToast();
  const [importMode, setImportMode] = useState<'merge' | 'replace'>('merge');
  const [parsedPatterns, setParsedPatterns] = useState<ConversionPattern[] | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const result = parseImportedPatterns(content);
      
      if (result.success && result.patterns) {
        setParsedPatterns(result.patterns);
      } else {
        toast({
          title: 'Import Error',
          description: result.error || 'Failed to parse file',
          variant: 'destructive'
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    if (!parsedPatterns || parsedPatterns.length === 0) {
      toast({
        title: 'No Patterns',
        description: 'Please select a valid pattern file',
        variant: 'destructive'
      });
      return;
    }

    onImport(parsedPatterns, importMode);
    setParsedPatterns(null);
    onOpenChange(false);
    
    toast({
      title: 'Patterns Imported',
      description: `Successfully imported ${parsedPatterns.length} pattern(s)`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Import Patterns</DialogTitle>
          <DialogDescription>
            Upload a pattern library JSON file to import custom patterns
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file-upload">Select File</Label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => document.getElementById('file-upload')?.click()}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                Choose JSON File
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            {parsedPatterns && (
              <p className="text-sm text-muted-foreground">
                Found {parsedPatterns.length} pattern(s) to import
              </p>
            )}
          </div>
          
          {parsedPatterns && parsedPatterns.length > 0 && (
            <div className="grid gap-2">
              <Label>Import Mode</Label>
              <RadioGroup value={importMode} onValueChange={(v) => setImportMode(v as 'merge' | 'replace')}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="merge" id="merge" />
                  <Label htmlFor="merge" className="font-normal">
                    Merge with existing patterns
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="replace" id="replace" />
                  <Label htmlFor="replace" className="font-normal">
                    Replace all custom patterns
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleImport} disabled={!parsedPatterns || parsedPatterns.length === 0}>
            Import Patterns
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

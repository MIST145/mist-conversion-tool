import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConversionPattern, ConversionDirection } from '@/types';
import { validatePattern } from '@/utils/patternUtils';
import { useToast } from '@/hooks/use-toast';

interface PatternEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pattern?: ConversionPattern;
  mode: 'create' | 'edit';
  onSave: (pattern: ConversionPattern, oldPattern?: ConversionPattern) => void;
}

export default function PatternEditDialog({ open, onOpenChange, pattern, mode, onSave }: PatternEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<ConversionPattern>>({
    from: '',
    to: '',
    category: '',
    direction: 'esx-to-qb'
  });

  useEffect(() => {
    if (pattern && mode === 'edit') {
      setFormData(pattern);
    } else if (mode === 'create') {
      setFormData({
        from: '',
        to: '',
        category: '',
        direction: 'esx-to-qb'
      });
    }
  }, [pattern, mode, open]);

  const handleSave = () => {
    const validation = validatePattern(formData);
    
    if (!validation.valid) {
      toast({
        title: 'Validation Error',
        description: validation.errors.join(', '),
        variant: 'destructive'
      });
      return;
    }

    onSave(formData as ConversionPattern, pattern);
    onOpenChange(false);
    
    toast({
      title: mode === 'create' ? 'Pattern Added' : 'Pattern Updated',
      description: `Pattern ${mode === 'create' ? 'added' : 'updated'} successfully`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Add New Pattern' : 'Edit Pattern'}</DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Create a custom conversion pattern for your project'
              : 'Modify the conversion pattern'
            }
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="from">From Pattern</Label>
            <Input
              id="from"
              placeholder="e.g., ESX.PlayerData"
              value={formData.from}
              onChange={(e) => setFormData({ ...formData, from: e.target.value })}
              className="font-mono"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="to">To Pattern</Label>
            <Input
              id="to"
              placeholder="e.g., QBCore.PlayerData"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              className="font-mono"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Core Functions"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="direction">Direction</Label>
            <Select
              value={formData.direction}
              onValueChange={(value) => setFormData({ ...formData, direction: value as ConversionDirection })}
            >
              <SelectTrigger id="direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="esx-to-qb">ESX → QB-Core</SelectItem>
                <SelectItem value="qb-to-esx">QB-Core → ESX</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {mode === 'create' ? 'Add Pattern' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

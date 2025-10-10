import { useState } from 'react';
import { FileText } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { useConverterStore } from '@/store/useConverterStore';
import { toast } from 'sonner';

export default function PasteInput() {
  const [fileName, setFileName] = useState('script.lua');
  const [code, setCode] = useState('');
  
  const { setInputFiles } = useConverterStore();
  
  const handleLoad = () => {
    if (!code.trim()) {
      toast.error('Please paste some code');
      return;
    }
    
    if (!fileName.trim()) {
      toast.error('Please provide a file name');
      return;
    }
    
    const name = fileName.endsWith('.lua') ? fileName : `${fileName}.lua`;
    
    setInputFiles([{
      path: name,
      content: code,
      size: new Blob([code]).size
    }]);
    
    toast.success('Code loaded successfully');
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="filename">File Name</Label>
        <Input
          id="filename"
          placeholder="script.lua"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="code">Lua Code</Label>
        <Textarea
          id="code"
          placeholder="-- Paste your Lua code here&#10;ESX = nil&#10;&#10;TriggerEvent('esx:getSharedObject', function(obj) ESX = obj end)"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="font-mono text-sm min-h-[300px]"
        />
      </div>
      
      <Button onClick={handleLoad} className="w-full">
        <FileText className="mr-2 h-4 w-4" />
        Load Code
      </Button>
    </div>
  );
}

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File } from 'lucide-react';
import { useConverterStore } from '@/store/useConverterStore';
import { FileContent } from '@/types';
import { Button } from './ui/button';
import { formatBytes } from '@/utils/converter';
import { toast } from 'sonner';

export default function UploadInput() {
  const { inputFiles, setInputFiles } = useConverterStore();
  
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const luaFiles = acceptedFiles.filter(file => file.name.endsWith('.lua'));
    
    if (luaFiles.length === 0) {
      toast.error('No .lua files found in selection');
      return;
    }
    
    const fileContents: FileContent[] = [];
    
    for (const file of luaFiles) {
      try {
        const content = await file.text();
        fileContents.push({
          path: file.webkitRelativePath || file.name,
          content,
          size: file.size
        });
      } catch (error) {
        console.error(`Failed to read ${file.name}:`, error);
      }
    }
    
    setInputFiles(fileContents);
    toast.success(`Loaded ${fileContents.length} .lua files`);
  }, [setInputFiles]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.lua']
    }
  });
  
  const removeFile = (path: string) => {
    setInputFiles(inputFiles.filter(f => f.path !== path));
  };
  
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary bg-primary/10'
            : 'border-border hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        {isDragActive ? (
          <p className="text-lg font-medium">Drop your .lua files here...</p>
        ) : (
          <>
            <p className="text-lg font-medium mb-2">Drag & drop .lua files here</p>
            <p className="text-sm text-muted-foreground">or click to browse files</p>
          </>
        )}
      </div>
      
      {inputFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {inputFiles.length} file{inputFiles.length !== 1 ? 's' : ''} loaded
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setInputFiles([])}
            >
              Clear all
            </Button>
          </div>
          
          <div className="max-h-64 overflow-y-auto space-y-2 rounded-md border border-border p-2">
            {inputFiles.map((file) => (
              <div
                key={file.path}
                className="flex items-center justify-between p-2 rounded bg-muted/50 hover:bg-muted transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <File className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span className="text-sm truncate">{file.path}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatBytes(file.size)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 flex-shrink-0"
                  onClick={() => removeFile(file.path)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

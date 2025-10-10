import { useState } from 'react';
import { Github, Loader2, AlertCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { useConverterStore } from '@/store/useConverterStore';
import { parseGitHubUrl, fetchGitHubFiles } from '@/utils/github';
import { toast } from 'sonner';

export default function GitHubInput() {
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { setInputFiles } = useConverterStore();
  
  const handleFetch = async () => {
    setError('');
    
    if (!githubUrl.trim()) {
      setError('Please enter a GitHub URL');
      return;
    }
    
    const parsed = parseGitHubUrl(githubUrl);
    if (!parsed) {
      setError('Invalid GitHub URL format');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const files = await fetchGitHubFiles(parsed);
      setInputFiles(files);
      toast.success(`Fetched ${files.length} .lua files from GitHub`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch files';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="https://github.com/user/repo or github.com/user/repo/tree/main/folder"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
          disabled={isLoading}
        />
        <Button onClick={handleFetch} disabled={isLoading || !githubUrl.trim()}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching...
            </>
          ) : (
            <>
              <Github className="mr-2 h-4 w-4" />
              Fetch
            </>
          )}
        </Button>
      </div>
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="text-sm text-muted-foreground space-y-1">
        <p className="font-medium">Supported URL formats:</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li><code className="bg-muted px-1.5 py-0.5 rounded">github.com/user/repo</code> - Full repository</li>
          <li><code className="bg-muted px-1.5 py-0.5 rounded">github.com/user/repo/tree/main/folder</code> - Specific folder</li>
          <li><code className="bg-muted px-1.5 py-0.5 rounded">github.com/user/repo/blob/main/file.lua</code> - Single file</li>
        </ul>
        <p className="text-xs mt-2 text-muted-foreground/80">
          Note: GitHub API rate limit is 60 requests/hour for unauthenticated users
        </p>
      </div>
    </div>
  );
}

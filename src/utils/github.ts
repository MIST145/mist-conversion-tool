import { FileContent } from '@/types';

interface GitHubFile {
  path: string;
  type: string;
  url: string;
  size: number;
}

interface GitHubTree {
  tree: GitHubFile[];
}

export interface ParsedGitHubUrl {
  owner: string;
  repo: string;
  branch: string;
  path?: string;
}

export function parseGitHubUrl(url: string): ParsedGitHubUrl | null {
  // Remove trailing slash
  url = url.replace(/\/$/, '');
  
  // Handle various GitHub URL formats
  const patterns = [
    // github.com/owner/repo/tree/branch/path
    /github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.+))?/,
    // github.com/owner/repo/blob/branch/file
    /github\.com\/([^/]+)\/([^/]+)\/blob\/([^/]+)\/(.+)/,
    // github.com/owner/repo
    /github\.com\/([^/]+)\/([^/]+)$/,
    // raw.githubusercontent.com/owner/repo/branch/path
    /raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)(?:\/(.+))?/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
        branch: match[3] || 'main',
        path: match[4]
      };
    }
  }
  
  return null;
}

export async function fetchGitHubFiles(
  parsedUrl: ParsedGitHubUrl
): Promise<FileContent[]> {
  const { owner, repo, branch, path } = parsedUrl;
  
  // Fetch repository tree
  const treeUrl = `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`;
  
  const treeResponse = await fetch(treeUrl);
  if (!treeResponse.ok) {
    if (treeResponse.status === 404) {
      throw new Error('Repository not found or branch does not exist');
    } else if (treeResponse.status === 403) {
      throw new Error('GitHub API rate limit exceeded. Please try again later.');
    }
    throw new Error(`Failed to fetch repository: ${treeResponse.statusText}`);
  }
  
  const treeData: GitHubTree = await treeResponse.json();
  
  // Filter .lua files and match path if specified
  let luaFiles = treeData.tree.filter(file => 
    file.type === 'blob' && file.path.endsWith('.lua')
  );
  
  if (path) {
    luaFiles = luaFiles.filter(file => file.path.startsWith(path));
  }
  
  if (luaFiles.length === 0) {
    throw new Error('No .lua files found in the specified location');
  }
  
  // Fetch content for each file
  const fileContents: FileContent[] = [];
  
  for (const file of luaFiles) {
    try {
      const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file.path}`;
      const contentResponse = await fetch(rawUrl);
      
      if (contentResponse.ok) {
        const content = await contentResponse.text();
        fileContents.push({
          path: file.path,
          content,
          size: file.size
        });
      }
    } catch (error) {
      console.error(`Failed to fetch ${file.path}:`, error);
    }
  }
  
  return fileContents;
}

export function getRateLimitInfo(): Promise<{
  limit: number;
  remaining: number;
  reset: Date;
}> {
  return fetch('https://api.github.com/rate_limit')
    .then(res => res.json())
    .then(data => ({
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      reset: new Date(data.rate.reset * 1000)
    }));
}

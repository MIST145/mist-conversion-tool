import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Code2, Layers, FileText, Info } from 'lucide-react';

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Help & Documentation</h1>
          
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  About FiveM Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  FiveM Converter is a powerful tool for transforming Lua scripts between ESX and QB-Core frameworks.
                  It automatically applies pattern-based conversions to help you migrate resources between frameworks quickly and accurately.
                </p>
                <p className="text-muted-foreground">
                  <strong>ESX</strong> and <strong>QB-Core</strong> are popular FiveM server frameworks with different APIs and conventions.
                  This tool helps bridge that gap.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Input Methods
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">1. Upload Files</h3>
                  <p className="text-muted-foreground">
                    Drag and drop .lua files or folders directly into the upload area.
                    You can also use the file picker to select multiple files or entire directories.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">2. GitHub Integration</h3>
                  <p className="text-muted-foreground mb-2">
                    Fetch files directly from GitHub repositories. Supported URL formats:
                  </p>
                  <ul className="list-disc list-inside text-muted-foreground space-y-1 pl-4">
                    <li><code className="text-xs bg-muted px-2 py-1 rounded">github.com/user/repo</code> - Entire repository</li>
                    <li><code className="text-xs bg-muted px-2 py-1 rounded">github.com/user/repo/tree/main/folder</code> - Specific folder</li>
                    <li><code className="text-xs bg-muted px-2 py-1 rounded">github.com/user/repo/blob/main/file.lua</code> - Single file</li>
                  </ul>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Note: GitHub API has a rate limit of 60 requests per hour for unauthenticated users.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">3. Direct Paste</h3>
                  <p className="text-muted-foreground">
                    Paste your Lua code directly into the text editor. Don't forget to give your file a name!
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code2 className="h-5 w-5" />
                  Conversion Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Direction</h3>
                  <p className="text-muted-foreground">
                    Choose whether you're converting from ESX to QB-Core or vice versa.
                    Different pattern sets are applied based on your selection.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Include SQL Patterns</h3>
                  <p className="text-muted-foreground">
                    Enable this to also convert SQL library calls (ghmattimysql, MySQL.Async, etc.) to oxmysql format.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Create Backup ZIP</h3>
                  <p className="text-muted-foreground">
                    When enabled, the downloaded ZIP will include both original and converted files in separate folders.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5" />
                  Pattern Manager
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  The Pattern Manager allows you to view, add, edit, and organize conversion patterns.
                  You can also import/export custom pattern sets and test patterns before applying them.
                </p>
                <p className="text-muted-foreground">
                  Custom patterns are stored in your browser's local storage and will be automatically
                  applied during conversions alongside the default patterns.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Always review converted code before using it in production</li>
                  <li>Test converted resources thoroughly in a development environment</li>
                  <li>Some conversions may require manual adjustments for complex logic</li>
                  <li>Keep backups of your original files</li>
                  <li>Use the diff viewer to understand what changed</li>
                  <li>Download the conversion report for detailed change logs</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

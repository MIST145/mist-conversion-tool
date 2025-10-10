import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, RotateCcw, Search, File, CheckCircle2 } from 'lucide-react';
import { useConverterStore } from '@/store/useConverterStore';
import { downloadAsZip, downloadText } from '@/utils/download';
import { generateConversionReport } from '@/utils/converter';
import { toast } from 'sonner';
import DiffViewer from '@/components/DiffViewer';

export default function Results() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyChanged, setShowOnlyChanged] = useState(false);
  
  const {
    conversionResults,
    conversionStats,
    selectedFile,
    setSelectedFile,
    direction,
    createBackup,
    reset
  } = useConverterStore();
  
  if (!conversionStats) {
    navigate('/');
    return null;
  }
  
  const filteredResults = conversionResults.filter(result => {
    const matchesSearch = result.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = !showOnlyChanged || result.changes > 0;
    return matchesSearch && matchesFilter;
  });
  
  const selectedResult = conversionResults.find(r => r.path === selectedFile);
  
  const handleDownloadZip = async () => {
    try {
      await downloadAsZip(conversionResults, conversionStats, direction, createBackup);
      toast.success('ZIP file downloaded successfully');
    } catch (error) {
      toast.error('Failed to download ZIP');
    }
  };
  
  const handleDownloadReport = () => {
    const report = generateConversionReport(conversionStats, conversionResults, direction);
    downloadText(report, 'conversion-report.md');
    toast.success('Report downloaded successfully');
  };
  
  const handleNewConversion = () => {
    reset();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Stats Header */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-6 w-6 text-success" />
                  <h2 className="text-2xl font-bold">Conversion Complete</h2>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span>{conversionStats.totalFiles} files processed</span>
                  <span>•</span>
                  <span>{conversionStats.filesChanged} converted</span>
                  <span>•</span>
                  <span>{conversionStats.totalChanges} changes</span>
                </div>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleDownloadZip}>
                  <Download className="mr-2 h-4 w-4" />
                  Download ZIP
                </Button>
                <Button variant="outline" onClick={handleDownloadReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  Download Report
                </Button>
                <Button variant="outline" onClick={handleNewConversion}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  New Conversion
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6">
          {/* File List Sidebar */}
          <Card>
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show-changed"
                    checked={showOnlyChanged}
                    onCheckedChange={(checked) => setShowOnlyChanged(checked as boolean)}
                  />
                  <Label htmlFor="show-changed" className="text-sm cursor-pointer">
                    Only changed files
                  </Label>
                </div>
                
                <div className="space-y-1 max-h-[calc(100vh-300px)] overflow-y-auto">
                  {filteredResults.map((result) => (
                    <button
                      key={result.path}
                      onClick={() => setSelectedFile(result.path)}
                      className={`w-full text-left p-2 rounded-md transition-colors ${
                        selectedFile === result.path
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <File className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm truncate">{result.path}</span>
                        </div>
                        {result.changes > 0 && (
                          <Badge variant="secondary" className="text-xs flex-shrink-0">
                            {result.changes}
                          </Badge>
                        )}
                      </div>
                    </button>
                  ))}
                  
                  {filteredResults.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No files found
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Diff Viewer */}
          <Card>
            <CardContent className="p-4">
              {selectedResult ? (
                <DiffViewer result={selectedResult} />
              ) : (
                <div className="flex items-center justify-center h-96 text-muted-foreground">
                  <div className="text-center">
                    <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a file to view the diff</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

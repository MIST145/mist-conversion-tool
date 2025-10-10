import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Upload, Github, FileText, ArrowRight, ArrowLeftRight } from 'lucide-react';
import { useConverterStore } from '@/store/useConverterStore';
import { convertFiles } from '@/utils/converter';
import { toast } from 'sonner';
import UploadInput from '@/components/UploadInput';
import GitHubInput from '@/components/GitHubInput';
import PasteInput from '@/components/PasteInput';

export default function Home() {
  const navigate = useNavigate();
  const [isConverting, setIsConverting] = useState(false);
  
  const {
    inputFiles,
    direction,
    includeSqlPatterns,
    createBackup,
    setDirection,
    setIncludeSqlPatterns,
    setCreateBackup,
    setConversionResults,
    setConversionStats,
    getAllPatterns
  } = useConverterStore();
  
  const handleConvert = async () => {
    if (inputFiles.length === 0) {
      toast.error('Please select files to convert');
      return;
    }
    
    setIsConverting(true);
    
    try {
      // Simulate processing time for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const patterns = getAllPatterns();
      const { results, stats } = convertFiles(inputFiles, patterns);
      
      setConversionResults(results);
      setConversionStats(stats);
      
      toast.success(`Converted ${stats.filesChanged} files with ${stats.totalChanges} changes`);
      navigate('/results');
    } catch (error) {
      console.error('Conversion error:', error);
      toast.error('Failed to convert files');
    } finally {
      setIsConverting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Convert FiveM Scripts
            </h1>
            <p className="text-lg text-muted-foreground">
              Transform your resources between ESX and QB-Core frameworks
            </p>
          </div>
          
          {/* Input Methods */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Select Input Method</CardTitle>
              <CardDescription>
                Choose how you want to provide your Lua files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="upload" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="upload" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Files
                  </TabsTrigger>
                  <TabsTrigger value="github" className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    GitHub
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Paste Code
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="upload" className="mt-6">
                  <UploadInput />
                </TabsContent>
                
                <TabsContent value="github" className="mt-6">
                  <GitHubInput />
                </TabsContent>
                
                <TabsContent value="paste" className="mt-6">
                  <PasteInput />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Conversion Settings */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Conversion Settings</CardTitle>
              <CardDescription>
                Configure how your files will be converted
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Direction Toggle */}
              <div>
                <Label className="text-base font-semibold mb-3 block">Conversion Direction</Label>
                <div className="flex items-center gap-4">
                  <Button
                    variant={direction === 'esx-to-qb' ? 'default' : 'outline'}
                    onClick={() => setDirection('esx-to-qb')}
                    className="flex-1"
                  >
                    <span>ESX</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span>QB-Core</span>
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDirection(direction === 'esx-to-qb' ? 'qb-to-esx' : 'esx-to-qb')}
                  >
                    <ArrowLeftRight className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant={direction === 'qb-to-esx' ? 'default' : 'outline'}
                    onClick={() => setDirection('qb-to-esx')}
                    className="flex-1"
                  >
                    <span>QB-Core</span>
                    <ArrowRight className="h-4 w-4 mx-2" />
                    <span>ESX</span>
                  </Button>
                </div>
              </div>
              
              {/* Options */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sql-patterns"
                    checked={includeSqlPatterns}
                    onCheckedChange={(checked) => setIncludeSqlPatterns(checked as boolean)}
                  />
                  <Label
                    htmlFor="sql-patterns"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Include SQL pattern conversions
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="create-backup"
                    checked={createBackup}
                    onCheckedChange={(checked) => setCreateBackup(checked as boolean)}
                  />
                  <Label
                    htmlFor="create-backup"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Create backup ZIP of originals
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Convert Button */}
          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleConvert}
              disabled={inputFiles.length === 0 || isConverting}
              className="w-full max-w-md"
            >
              {isConverting ? (
                'Converting...'
              ) : (
                <>
                  Convert Files ({inputFiles.length} selected)
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

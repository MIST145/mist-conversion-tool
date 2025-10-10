import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Search, Plus, Download, Upload, Trash2, Edit, RotateCcw } from 'lucide-react';
import { ESX_TO_QB_PATTERNS, QB_TO_ESX_PATTERNS, SQL_PATTERNS } from '@/data/patterns';
import { ConversionPattern } from '@/types';
import { useConverterStore } from '@/store/useConverterStore';
import { downloadPatternLibrary } from '@/utils/patternUtils';
import PatternEditDialog from '@/components/PatternEditDialog';
import PatternImportDialog from '@/components/PatternImportDialog';
import { useToast } from '@/hooks/use-toast';

export default function Patterns() {
  const { toast } = useToast();
  const { customPatterns, addCustomPattern, updateCustomPattern, removeCustomPattern, importCustomPatterns, resetCustomPatterns } = useConverterStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'esx-to-qb' | 'qb-to-esx'>('esx-to-qb');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState<'create' | 'edit'>('create');
  const [selectedPattern, setSelectedPattern] = useState<ConversionPattern | undefined>();
  const [patternToDelete, setPatternToDelete] = useState<ConversionPattern | undefined>();
  
  const builtInPatterns = activeTab === 'esx-to-qb' ? ESX_TO_QB_PATTERNS : QB_TO_ESX_PATTERNS;
  const customPatternsForTab = customPatterns.filter(p => p.direction === activeTab);
  const patterns = [...builtInPatterns, ...customPatternsForTab];
  
  const filteredPatterns = patterns.filter(p =>
    p.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.to.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const groupedPatterns = filteredPatterns.reduce((acc, pattern) => {
    if (!acc[pattern.category]) {
      acc[pattern.category] = [];
    }
    acc[pattern.category].push(pattern);
    return acc;
  }, {} as Record<string, ConversionPattern[]>);
  
  const isCustomPattern = (pattern: ConversionPattern) => {
    return customPatterns.some(p => p.from === pattern.from && p.to === pattern.to);
  };
  
  const handleAddPattern = () => {
    setEditMode('create');
    setSelectedPattern(undefined);
    setEditDialogOpen(true);
  };
  
  const handleEditPattern = (pattern: ConversionPattern) => {
    setEditMode('edit');
    setSelectedPattern(pattern);
    setEditDialogOpen(true);
  };
  
  const handleDeletePattern = (pattern: ConversionPattern) => {
    setPatternToDelete(pattern);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (patternToDelete) {
      removeCustomPattern(patternToDelete);
      toast({
        title: 'Pattern Deleted',
        description: 'Custom pattern removed successfully'
      });
    }
    setDeleteDialogOpen(false);
    setPatternToDelete(undefined);
  };
  
  const handleSavePattern = (pattern: ConversionPattern, oldPattern?: ConversionPattern) => {
    if (editMode === 'edit' && oldPattern) {
      updateCustomPattern(oldPattern, pattern);
    } else {
      addCustomPattern(pattern);
    }
  };
  
  const handleDownload = () => {
    downloadPatternLibrary(customPatterns);
    toast({
      title: 'Library Downloaded',
      description: 'Pattern library exported successfully'
    });
  };
  
  const handleImport = (patterns: ConversionPattern[], mode: 'merge' | 'replace') => {
    importCustomPatterns(patterns, mode);
  };
  
  const handleReset = () => {
    resetCustomPatterns();
    setResetDialogOpen(false);
    toast({
      title: 'Custom Patterns Reset',
      description: 'All custom patterns have been removed'
    });
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">Pattern Library</h1>
                <p className="text-muted-foreground">
                  View and manage conversion patterns used to transform code between frameworks
                </p>
              </div>
              
              <div className="flex gap-2 flex-wrap">
                <Button onClick={handleAddPattern}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Pattern
                </Button>
                <Button variant="outline" onClick={() => setImportDialogOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline" onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {customPatterns.length > 0 && (
                  <Button variant="outline" onClick={() => setResetDialogOpen(true)}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset Custom
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Conversion Patterns</CardTitle>
                  <CardDescription>
                    {filteredPatterns.length} patterns ({customPatternsForTab.length} custom)
                  </CardDescription>
                </div>
                
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patterns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="esx-to-qb">ESX → QB-Core</TabsTrigger>
                  <TabsTrigger value="qb-to-esx">QB-Core → ESX</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-6">
                  <div className="space-y-6">
                    {Object.entries(groupedPatterns).map(([category, categoryPatterns]) => (
                      <div key={category}>
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold">{category}</h3>
                          <Badge variant="secondary">{categoryPatterns.length}</Badge>
                        </div>
                        
                        <div className="space-y-2">
                          {categoryPatterns.map((pattern, index) => {
                            const isCustom = isCustomPattern(pattern);
                            return (
                              <div
                                key={index}
                                className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                                  isCustom 
                                    ? 'border-primary/30 bg-primary/5 hover:bg-primary/10' 
                                    : 'border-border hover:bg-muted/50'
                                }`}
                              >
                                <div className="flex-1 min-w-0">
                                  <code className="text-sm bg-destructive/10 text-destructive px-2 py-1 rounded">
                                    {pattern.from}
                                  </code>
                                </div>
                                
                                <div className="text-muted-foreground">→</div>
                                
                                <div className="flex-1 min-w-0">
                                  <code className="text-sm bg-success/10 text-success px-2 py-1 rounded">
                                    {pattern.to}
                                  </code>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  {isCustom ? (
                                    <>
                                      <Badge variant="default" className="text-xs">Custom</Badge>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => handleEditPattern(pattern)}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        onClick={() => handleDeletePattern(pattern)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  ) : (
                                    <Badge variant="outline" className="text-xs">Built-in</Badge>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                    
                    {Object.keys(groupedPatterns).length === 0 && (
                      <div className="text-center py-12 text-muted-foreground">
                        <p>No patterns found matching your search</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* SQL Patterns Section */}
              <div className="mt-8 pt-8 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-semibold">SQL Patterns</h3>
                  <Badge variant="secondary">{SQL_PATTERNS.length}</Badge>
                  <Badge variant="outline">Optional</Badge>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4">
                  These patterns are applied when "Include SQL pattern conversions" is enabled
                </p>
                
                <div className="space-y-2">
                  {SQL_PATTERNS.map((pattern, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <code className="text-sm bg-destructive/10 text-destructive px-2 py-1 rounded">
                          {pattern.from}
                        </code>
                      </div>
                      
                      <div className="text-muted-foreground">→</div>
                      
                      <div className="flex-1 min-w-0">
                        <code className="text-sm bg-success/10 text-success px-2 py-1 rounded">
                          {pattern.to}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <PatternEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        pattern={selectedPattern}
        mode={editMode}
        onSave={handleSavePattern}
      />
      
      <PatternImportDialog
        open={importDialogOpen}
        onOpenChange={setImportDialogOpen}
        onImport={handleImport}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pattern</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this custom pattern? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Custom Patterns</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all {customPatterns.length} custom pattern(s). Built-in patterns will not be affected. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Reset All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

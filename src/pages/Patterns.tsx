import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search } from 'lucide-react';
import { ESX_TO_QB_PATTERNS, QB_TO_ESX_PATTERNS, SQL_PATTERNS } from '@/data/patterns';
import { ConversionPattern } from '@/types';

export default function Patterns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'esx-to-qb' | 'qb-to-esx'>('esx-to-qb');
  
  const patterns = activeTab === 'esx-to-qb' ? ESX_TO_QB_PATTERNS : QB_TO_ESX_PATTERNS;
  
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
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Pattern Library</h1>
            <p className="text-muted-foreground">
              View all conversion patterns used to transform code between frameworks
            </p>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Conversion Patterns</CardTitle>
                  <CardDescription>
                    {filteredPatterns.length} patterns available
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
                          {categoryPatterns.map((pattern, index) => (
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
    </div>
  );
}

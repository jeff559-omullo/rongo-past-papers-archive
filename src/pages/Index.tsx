
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, BookOpen, GraduationCap, School } from 'lucide-react';
import PaperUpload from '@/components/PaperUpload';
import PapersDisplay from '@/components/PapersDisplay';
import { Paper } from '@/types/papers';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const [papers, setPapers] = useState<Paper[]>([]);

  const handlePaperUpload = (paperData: Omit<Paper, 'id' | 'uploadDate' | 'downloadCount'>) => {
    const newPaper: Paper = {
      ...paperData,
      id: `paper-${Date.now()}`,
      uploadDate: new Date(),
      downloadCount: 0
    };

    setPapers(prev => [...prev, newPaper]);
    
    toast({
      title: "Paper uploaded successfully!",
      description: `${paperData.title} has been added to the collection.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <School className="h-8 w-8 text-blue-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Rongo University</h1>
                  <p className="text-sm text-gray-600">Past Papers Collection</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{papers.length} Papers Available</p>
                <p className="text-xs text-gray-500">Organized by academic year</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome to Rongo University Past Papers</h2>
                  <p className="text-blue-100 text-lg">
                    Access and contribute to our comprehensive collection of past examination papers, 
                    organized by academic year and course.
                  </p>
                </div>
                <GraduationCap className="h-16 w-16 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="browse" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Browse Papers
            </TabsTrigger>
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Paper
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Past Papers Collection
                  </CardTitle>
                  <CardDescription>
                    Browse and download past papers organized by year of study. 
                    Papers are categorized from 1st year to 4th year across all schools and departments.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <PapersDisplay papers={papers} />
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Contribute to the Collection
                  </CardTitle>
                  <CardDescription>
                    Help fellow students by uploading past papers. Please ensure you have permission to share the papers.
                  </CardDescription>
                </CardHeader>
              </Card>
              
              <PaperUpload onUpload={handlePaperUpload} />
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{papers.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">1st Year Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {papers.filter(p => p.year === 1).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">2nd Year Papers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {papers.filter(p => p.year === 2).length}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">3rd & 4th Year</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {papers.filter(p => p.year >= 3).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;

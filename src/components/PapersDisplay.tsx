
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, BookOpen, GraduationCap, Lock, CreditCard, Download } from 'lucide-react';
import { Paper } from '@/types/papers';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PapersDisplayProps {
  hasAccess?: boolean;
  onRequestPayment?: () => void;
}

const PapersDisplay: React.FC<PapersDisplayProps> = ({ 
  hasAccess = false, 
  onRequestPayment 
}) => {
  const { toast } = useToast();
  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Fetch approved papers from database
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        const { data, error } = await supabase
          .from('papers')
          .select('*')
          .eq('status', 'approved')
          .order('upload_date', { ascending: false });

        if (error) throw error;
        setPapers(data || []);
      } catch (error) {
        console.error('Error fetching papers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch papers.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [toast]);

  // Content protection for premium papers
  useEffect(() => {
    if (!hasAccess) {
      const preventScreenshot = (e: KeyboardEvent) => {
        if (e.key === 'PrintScreen') {
          e.preventDefault();
          return false;
        }
        if (e.ctrlKey && e.shiftKey && e.key === 'I') {
          e.preventDefault();
          return false;
        }
        if (e.key === 'F12') {
          e.preventDefault();
          return false;
        }
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          return false;
        }
      };

      const preventRightClick = (e: MouseEvent) => {
        e.preventDefault();
        return false;
      };

      const preventDragStart = (e: DragEvent) => {
        e.preventDefault();
        return false;
      };

      document.addEventListener('keydown', preventScreenshot);
      document.addEventListener('contextmenu', preventRightClick);
      document.addEventListener('dragstart', preventDragStart);

      return () => {
        document.removeEventListener('keydown', preventScreenshot);
        document.removeEventListener('contextmenu', preventRightClick);
        document.removeEventListener('dragstart', preventDragStart);
      };
    }
  }, [hasAccess]);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.course_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.course_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesExamType = selectedExamType === 'all' || paper.exam_type === selectedExamType;
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;

    return matchesSearch && matchesExamType && matchesYear;
  });

  const papersByYear = {
    1: filteredPapers.filter(p => p.year === 1),
    2: filteredPapers.filter(p => p.year === 2),
    3: filteredPapers.filter(p => p.year === 3),
    4: filteredPapers.filter(p => p.year === 4),
  };

  const getExamTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'end-semester': return 'bg-blue-100 text-blue-800';
      case 'mid-semester': return 'bg-green-100 text-green-800';
      case 'cat': return 'bg-yellow-100 text-yellow-800';
      case 'assignment': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownload = async (paper: any) => {
    if (!hasAccess) {
      onRequestPayment?.();
      return;
    }

    try {
      // Increment download count
      await supabase
        .from('papers')
        .update({ 
          download_count: (paper.download_count || 0) + 1 
        })
        .eq('id', paper.id);

      // Open file in new tab
      window.open(paper.file_url, '_blank');
      
      toast({
        title: "Download Started",
        description: "Paper is opening in a new tab.",
      });
    } catch (error) {
      console.error('Error downloading paper:', error);
      toast({
        title: "Download Failed",
        description: "There was an error downloading the paper.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">Loading papers...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter Papers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedExamType} onValueChange={setSelectedExamType}>
              <SelectTrigger>
                <SelectValue placeholder="All Exam Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="end-semester">End Semester</SelectItem>
                <SelectItem value="mid-semester">Mid Semester</SelectItem>
                <SelectItem value="cat">CAT</SelectItem>
                <SelectItem value="assignment">Assignment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="1">1st Year</SelectItem>
                <SelectItem value="2">2nd Year</SelectItem>
                <SelectItem value="3">3rd Year</SelectItem>
                <SelectItem value="4">4th Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Premium Access Notice - Only show if user doesn't have access */}
      {!hasAccess && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <Lock className="h-12 w-12 text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-orange-800 mb-2">Premium Access Required</h3>
                <p className="text-orange-700 mb-4">
                  Our extensive collection of past papers is available for a one-time payment of <strong>KSH 10</strong>.
                  Get access to all papers across all years and courses.
                </p>
                <div className="space-y-2 text-sm text-orange-600">
                  <p>✓ {papers.length} Past Papers Available</p>
                  <p>✓ All Schools & Departments</p>
                  <p>✓ Secure & Protected Content</p>
                  <p>✓ Instant Access After Payment</p>
                </div>
              </div>
              <Button 
                onClick={onRequestPayment}
                className="bg-orange-600 hover:bg-orange-700 text-white"
                size="lg"
              >
                <CreditCard className="h-5 w-5 mr-2" />
                Pay KSH 10 - Get Full Access
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success message for premium users */}
      {hasAccess && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="text-center text-green-800">
              <p className="font-semibold">🎉 Premium Access Active!</p>
              <p className="text-sm">You have full access to all past papers. Happy studying!</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Papers by Year Tabs */}
      <Tabs defaultValue="1" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="1" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            1st Year ({papersByYear[1].length})
          </TabsTrigger>
          <TabsTrigger value="2" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            2nd Year ({papersByYear[2].length})
          </TabsTrigger>
          <TabsTrigger value="3" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            3rd Year ({papersByYear[3].length})
          </TabsTrigger>
          <TabsTrigger value="4" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            4th Year ({papersByYear[4].length})
          </TabsTrigger>
        </TabsList>

        {[1, 2, 3, 4].map(year => (
          <TabsContent key={year} value={year.toString()}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {papersByYear[year as keyof typeof papersByYear].map(paper => (
                <Card 
                  key={paper.id} 
                  className={`hover:shadow-lg transition-shadow ${!hasAccess ? 'opacity-75' : ''}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      {!hasAccess && <Lock className="h-4 w-4 text-gray-500" />}
                      {paper.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {paper.course_code} - {paper.course_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getExamTypeBadgeColor(paper.exam_type)}>
                            {paper.exam_type.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            Year {paper.year}
                          </Badge>
                          <Badge variant="outline">
                            Semester {paper.semester}
                          </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {paper.academic_year}
                          </div>
                          <div>Downloads: {paper.download_count || 0}</div>
                          <div className="text-xs">{new Date(paper.upload_date).toLocaleDateString()}</div>
                        </div>

                        {hasAccess ? (
                          <Button 
                            className="w-full"
                            onClick={() => handleDownload(paper)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download Paper
                          </Button>
                        ) : (
                          <>
                            <Button 
                              onClick={onRequestPayment}
                              className="w-full"
                              variant="outline"
                              disabled
                            >
                              <Lock className="h-4 w-4 mr-2" />
                              Locked - Pay to Access
                            </Button>
                            <div className="text-xs text-orange-600 bg-orange-50 p-2 rounded text-center">
                              Premium Content - KSH 10 for Full Access
                            </div>
                          </>
                        )}
                      </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {papersByYear[year as keyof typeof papersByYear].length === 0 && (
              <Card className="p-8 text-center">
                <CardContent>
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No papers found</h3>
                  <p className="text-gray-600">
                    No papers available for {year === 1 ? '1st' : year === 2 ? '2nd' : year === 3 ? '3rd' : '4th'} year with current filters.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Security Notice - Only show if user doesn't have access */}
      {!hasAccess && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <Lock className="h-5 w-5" />
              <div>
                <p className="font-semibold">Secure & Protected Content</p>
                <p className="text-sm">
                  All papers are securely stored and protected. Access requires payment verification for copyright protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PapersDisplay;

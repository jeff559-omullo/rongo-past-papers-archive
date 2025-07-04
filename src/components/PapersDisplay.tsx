
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Calendar, BookOpen, GraduationCap, Eye } from 'lucide-react';
import { Paper } from '@/types/papers';

interface PapersDisplayProps {
  papers: Paper[];
}

const PapersDisplay: React.FC<PapersDisplayProps> = ({ papers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

  // Prevent screenshots and right-click
  useEffect(() => {
    const preventScreenshot = (e: KeyboardEvent) => {
      // Prevent Print Screen
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        alert('Screenshots are not allowed for security reasons.');
        return false;
      }
      
      // Prevent Ctrl+Shift+I (Developer Tools)
      if (e.ctrlKey && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        return false;
      }
      
      // Prevent F12 (Developer Tools)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      
      // Prevent Ctrl+U (View Source)
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

    // Add CSS to prevent text selection and drag
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';

    return () => {
      document.removeEventListener('keydown', preventScreenshot);
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('dragstart', preventDragStart);
      
      // Reset styles
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.mozUserSelect = '';
      document.body.style.msUserSelect = '';
    };
  }, []);

  const filteredPapers = papers.filter(paper => {
    const matchesSearch = paper.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         paper.course.code.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSchool = selectedSchool === 'all' || paper.course.school === selectedSchool;
    const matchesExamType = selectedExamType === 'all' || paper.examType === selectedExamType;
    const matchesYear = selectedYear === 'all' || paper.year.toString() === selectedYear;

    return matchesSearch && matchesSchool && matchesExamType && matchesYear;
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

  const handleViewPaper = (paper: Paper) => {
    // Show paper in a modal or new tab for viewing only
    console.log('Viewing paper:', paper.title);
    alert(`Viewing: ${paper.title}\n\nThis is a view-only mode. Downloads and screenshots are not permitted.`);
  };

  const uniqueSchools = Array.from(new Set(papers.map(p => p.course.school)));

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6" style={{ userSelect: 'none', webkitUserSelect: 'none' }}>
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
            
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger>
                <SelectValue placeholder="All Schools" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Schools</SelectItem>
                {uniqueSchools.map(school => (
                  <SelectItem key={school} value={school}>{school}</SelectItem>
                ))}
              </SelectContent>
            </Select>

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
                <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{paper.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      {paper.course.code} - {paper.course.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge className={getExamTypeBadgeColor(paper.examType)}>
                          {paper.examType.replace('-', ' ').toUpperCase()}
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
                          {paper.academicYear}
                        </div>
                        <div>{paper.course.department}</div>
                        <div className="text-xs">{paper.course.school}</div>
                      </div>

                      <Button 
                        onClick={() => handleViewPaper(paper)}
                        className="w-full"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Paper ({paper.downloadCount} views)
                      </Button>

                      <div className="text-xs text-red-600 bg-red-50 p-2 rounded text-center">
                        View Only Mode - Downloads & Screenshots Disabled
                      </div>
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

      {/* Security Notice */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-red-800">
            <Eye className="h-5 w-5" />
            <div>
              <p className="font-semibold">Security Notice</p>
              <p className="text-sm">
                This system is for viewing purposes only. Screenshots, downloads, and copying are disabled for security and copyright protection.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PapersDisplay;

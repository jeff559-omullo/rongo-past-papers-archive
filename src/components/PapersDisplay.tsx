
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Search, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { Paper } from '@/types/papers';

interface PapersDisplayProps {
  papers: Paper[];
}

const PapersDisplay: React.FC<PapersDisplayProps> = ({ papers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [selectedExamType, setSelectedExamType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState<string>('all');

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

  const handleDownload = (paper: Paper) => {
    // This would implement actual file download logic
    console.log('Downloading paper:', paper.title);
    // For now, just show an alert
    alert(`Downloading: ${paper.title}`);
  };

  const uniqueSchools = Array.from(new Set(papers.map(p => p.course.school)));

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
                        onClick={() => handleDownload(paper)}
                        className="w-full"
                        variant="outline"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download ({paper.downloadCount} downloads)
                      </Button>
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
    </div>
  );
};

export default PapersDisplay;

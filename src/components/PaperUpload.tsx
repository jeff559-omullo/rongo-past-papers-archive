
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { Course, Paper } from '@/types/papers';
import { rongoUniversityData } from '@/data/rongoUniversityCourses';

interface PaperUploadProps {
  onUpload: (paper: Omit<Paper, 'id' | 'uploadDate' | 'downloadCount'>) => void;
}

const PaperUpload: React.FC<PaperUploadProps> = ({ onUpload }) => {
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paperData, setPaperData] = useState({
    title: '',
    year: 1 as 1 | 2 | 3 | 4,
    examType: 'end-semester' as 'mid-semester' | 'end-semester' | 'cat' | 'assignment',
    academicYear: '',
    semester: 1 as 1 | 2,
    fileName: ''
  });

  const allCourses = rongoUniversityData.flatMap(school => 
    school.departments.flatMap(dept => dept.courses)
  );

  const filteredDepartments = selectedSchool 
    ? rongoUniversityData.find(s => s.id === selectedSchool)?.departments || []
    : [];

  const filteredCourses = selectedDepartment
    ? filteredDepartments.find(d => d.id === selectedDepartment)?.courses || []
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;

    onUpload({
      title: paperData.title,
      courseId: selectedCourse.id,
      course: selectedCourse,
      year: paperData.year,
      examType: paperData.examType,
      academicYear: paperData.academicYear,
      semester: paperData.semester,
      fileName: paperData.fileName,
      fileUrl: '#' // This would be replaced with actual file upload logic
    });

    // Reset form
    setPaperData({
      title: '',
      year: 1,
      examType: 'end-semester',
      academicYear: '',
      semester: 1,
      fileName: ''
    });
    setSelectedSchool('');
    setSelectedDepartment('');
    setSelectedCourse(null);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Upload Past Paper
        </CardTitle>
        <CardDescription>
          Add a new past paper to the Rongo University collection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="school">School</Label>
              <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {rongoUniversityData.map(school => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="department">Department</Label>
              <Select 
                value={selectedDepartment} 
                onValueChange={setSelectedDepartment}
                disabled={!selectedSchool}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {filteredDepartments.map(dept => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="course">Course</Label>
            <Select 
              value={selectedCourse?.id || ''} 
              onValueChange={(value) => {
                const course = filteredCourses.find(c => c.id === value);
                setSelectedCourse(course || null);
              }}
              disabled={!selectedDepartment}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {filteredCourses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.code} - {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="title">Paper Title</Label>
            <Input
              id="title"
              value={paperData.title}
              onChange={(e) => setPaperData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Mid-Semester Examination 2024"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year">Year of Study</Label>
              <Select 
                value={paperData.year.toString()} 
                onValueChange={(value) => setPaperData(prev => ({ ...prev, year: parseInt(value) as 1 | 2 | 3 | 4 }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="examType">Exam Type</Label>
              <Select 
                value={paperData.examType} 
                onValueChange={(value) => setPaperData(prev => ({ ...prev, examType: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="end-semester">End Semester</SelectItem>
                  <SelectItem value="mid-semester">Mid Semester</SelectItem>
                  <SelectItem value="cat">CAT</SelectItem>
                  <SelectItem value="assignment">Assignment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                value={paperData.academicYear}
                onChange={(e) => setPaperData(prev => ({ ...prev, academicYear: e.target.value }))}
                placeholder="e.g., 2023/2024"
                required
              />
            </div>

            <div>
              <Label htmlFor="semester">Semester</Label>
              <Select 
                value={paperData.semester.toString()} 
                onValueChange={(value) => setPaperData(prev => ({ ...prev, semester: parseInt(value) as 1 | 2 }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="file">File Name</Label>
            <Input
              id="file"
              value={paperData.fileName}
              onChange={(e) => setPaperData(prev => ({ ...prev, fileName: e.target.value }))}
              placeholder="Enter file name (file upload functionality to be implemented)"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={!selectedCourse}>
            <FileText className="h-4 w-4 mr-2" />
            Upload Paper
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaperUpload;

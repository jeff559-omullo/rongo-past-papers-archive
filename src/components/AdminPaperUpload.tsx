import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Shield } from 'lucide-react';
import { Course } from '@/types/papers';
import { rongoUniversityData } from '@/data/rongoUniversityCourses';
import FileUpload from '@/components/FileUpload';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface AdminPaperUploadProps {
  onUpload: () => void;
}

const AdminPaperUpload: React.FC<AdminPaperUploadProps> = ({ onUpload }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [paperData, setPaperData] = useState({
    title: '',
    year: 1 as 1 | 2 | 3 | 4,
    examType: 'end-semester' as 'mid-semester' | 'end-semester' | 'cat' | 'assignment',
    academicYear: '',
    semester: 1 as 1 | 2,
    fileName: '',
    fileUrl: ''
  });
  const [uploading, setUploading] = useState(false);

  const filteredDepartments = selectedSchool 
    ? rongoUniversityData.find(s => s.id === selectedSchool)?.departments || []
    : [];

  const filteredCourses = selectedDepartment
    ? filteredDepartments.find(d => d.id === selectedDepartment)?.courses || []
    : [];

  const handleFileUpload = (fileUrl: string, fileName: string) => {
    setPaperData(prev => ({
      ...prev,
      fileName,
      fileUrl
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse || !paperData.fileUrl || !user) return;

    setUploading(true);
    try {
      // Admin uploads are auto-approved and immediately available
      const { error } = await supabase
        .from('papers')
        .insert({
          title: paperData.title,
          course_id: selectedCourse.id,
          course_name: selectedCourse.name,
          course_code: selectedCourse.code,
          year: paperData.year,
          exam_type: paperData.examType,
          academic_year: paperData.academicYear,
          semester: paperData.semester,
          file_name: paperData.fileName,
          file_url: paperData.fileUrl,
          uploaded_by: user.id,
          status: 'approved', // Auto-approved for admin uploads
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          review_notes: 'Auto-approved: Admin upload'
        });

      if (error) throw error;

      toast({
        title: "Paper uploaded successfully!",
        description: "The paper has been uploaded and is immediately available to users.",
      });

      // Reset form
      setPaperData({
        title: '',
        year: 1,
        examType: 'end-semester',
        academicYear: '',
        semester: 1,
        fileName: '',
        fileUrl: ''
      });
      setSelectedSchool('');
      setSelectedDepartment('');
      setSelectedCourse(null);

      // Refresh the papers list
      onUpload();

    } catch (error) {
      console.error('Error uploading paper:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading the paper. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="border-blue-200 bg-blue-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Shield className="h-5 w-5" />
            Admin Paper Upload
          </CardTitle>
          <CardDescription className="text-blue-600">
            Upload papers directly as administrator. These papers will be automatically approved and immediately available to users who have paid access.
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white rounded-lg">
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
                placeholder="e.g., End Semester Examination 2024"
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
              <Label>Upload File</Label>
              <FileUpload onFileUpload={handleFileUpload} />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              disabled={!selectedCourse || !paperData.fileUrl || uploading}
            >
              <FileText className="h-4 w-4 mr-2" />
              {uploading ? 'Uploading...' : 'Upload Paper (Auto-Approved)'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPaperUpload;
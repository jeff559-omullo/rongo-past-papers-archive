
export interface Course {
  id: string;
  code: string;
  name: string;
  department: string;
  school: string;
}

export interface Paper {
  id: string;
  title: string;
  courseId: string;
  course: Course;
  year: 1 | 2 | 3 | 4;
  examType: 'mid-semester' | 'end-semester' | 'cat' | 'assignment';
  academicYear: string; // e.g., "2023/2024"
  semester: 1 | 2;
  fileUrl?: string;
  fileName?: string;
  uploadDate: Date;
  downloadCount: number;
}

export interface School {
  id: string;
  name: string;
  departments: Department[];
}

export interface Department {
  id: string;
  name: string;
  schoolId: string;
  courses: Course[];
}


import { School, Department, Course } from '@/types/papers';

export const rongoUniversityData: School[] = [
  {
    id: 'school-education',
    name: 'School of Education',
    departments: [
      {
        id: 'dept-early-childhood',
        name: 'Department of Early Childhood Development Education',
        schoolId: 'school-education',
        courses: [
          { id: 'ecd-101', code: 'ECD 101', name: 'Introduction to Early Childhood Development', department: 'Early Childhood Development Education', school: 'School of Education' },
          { id: 'ecd-102', code: 'ECD 102', name: 'Child Psychology', department: 'Early Childhood Development Education', school: 'School of Education' },
          { id: 'ecd-201', code: 'ECD 201', name: 'Curriculum Development for Early Years', department: 'Early Childhood Development Education', school: 'School of Education' },
          { id: 'ecd-301', code: 'ECD 301', name: 'Assessment in Early Childhood Education', department: 'Early Childhood Development Education', school: 'School of Education' },
        ]
      },
      {
        id: 'dept-primary-education',
        name: 'Department of Primary Teacher Education',
        schoolId: 'school-education',
        courses: [
          { id: 'pte-101', code: 'PTE 101', name: 'Foundations of Education', department: 'Primary Teacher Education', school: 'School of Education' },
          { id: 'pte-102', code: 'PTE 102', name: 'Educational Psychology', department: 'Primary Teacher Education', school: 'School of Education' },
          { id: 'pte-201', code: 'PTE 201', name: 'Curriculum and Instruction', department: 'Primary Teacher Education', school: 'School of Education' },
          { id: 'pte-301', code: 'PTE 301', name: 'Classroom Management', department: 'Primary Teacher Education', school: 'School of Education' },
        ]
      }
    ]
  },
  {
    id: 'school-business',
    name: 'School of Business and Economics',
    departments: [
      {
        id: 'dept-business-admin',
        name: 'Department of Business Administration',
        schoolId: 'school-business',
        courses: [
          { id: 'bus-101', code: 'BUS 101', name: 'Principles of Management', department: 'Business Administration', school: 'School of Business and Economics' },
          { id: 'bus-102', code: 'BUS 102', name: 'Business Mathematics', department: 'Business Administration', school: 'School of Business and Economics' },
          { id: 'bus-201', code: 'BUS 201', name: 'Marketing Management', department: 'Business Administration', school: 'School of Business and Economics' },
          { id: 'bus-301', code: 'BUS 301', name: 'Strategic Management', department: 'Business Administration', school: 'School of Business and Economics' },
        ]
      },
      {
        id: 'dept-economics',
        name: 'Department of Economics',
        schoolId: 'school-business',
        courses: [
          { id: 'eco-101', code: 'ECO 101', name: 'Microeconomics', department: 'Economics', school: 'School of Business and Economics' },
          { id: 'eco-102', code: 'ECO 102', name: 'Macroeconomics', department: 'Economics', school: 'School of Business and Economics' },
          { id: 'eco-201', code: 'ECO 201', name: 'Development Economics', department: 'Economics', school: 'School of Business and Economics' },
          { id: 'eco-301', code: 'ECO 301', name: 'International Trade', department: 'Economics', school: 'School of Business and Economics' },
        ]
      }
    ]
  },
  {
    id: 'school-applied-sciences',
    name: 'School of Applied and Health Sciences',
    departments: [
      {
        id: 'dept-public-health',
        name: 'Department of Public Health',
        schoolId: 'school-applied-sciences',
        courses: [
          { id: 'pub-101', code: 'PUB 101', name: 'Introduction to Public Health', department: 'Public Health', school: 'School of Applied and Health Sciences' },
          { id: 'pub-102', code: 'PUB 102', name: 'Epidemiology', department: 'Public Health', school: 'School of Applied and Health Sciences' },
          { id: 'pub-201', code: 'PUB 201', name: 'Health Promotion', department: 'Public Health', school: 'School of Applied and Health Sciences' },
          { id: 'pub-301', code: 'PUB 301', name: 'Health Policy and Management', department: 'Public Health', school: 'School of Applied and Health Sciences' },
        ]
      },
      {
        id: 'dept-applied-sciences',
        name: 'Department of Applied Sciences',
        schoolId: 'school-applied-sciences',
        courses: [
          { id: 'app-101', code: 'APP 101', name: 'General Chemistry', department: 'Applied Sciences', school: 'School of Applied and Health Sciences' },
          { id: 'app-102', code: 'APP 102', name: 'General Physics', department: 'Applied Sciences', school: 'School of Applied and Health Sciences' },
          { id: 'app-201', code: 'APP 201', name: 'Organic Chemistry', department: 'Applied Sciences', school: 'School of Applied and Health Sciences' },
          { id: 'app-301', code: 'APP 301', name: 'Research Methods', department: 'Applied Sciences', school: 'School of Applied and Health Sciences' },
        ]
      }
    ]
  }
];

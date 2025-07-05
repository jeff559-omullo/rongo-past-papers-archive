
import { School } from '@/types/papers';

export const rongoUniversityData: School[] = [
  {
    id: 'school-agriculture',
    name: 'School of Agriculture and Food Security',
    departments: [
      {
        id: 'dept-agricultural-economics',
        name: 'Department of Agricultural Economics and Agribusiness Management',
        schoolId: 'school-agriculture',
        courses: [
          { id: 'course-agec-101', code: 'AGEC 101', name: 'Introduction to Agricultural Economics', department: 'Agricultural Economics and Agribusiness Management', school: 'School of Agriculture and Food Security' },
          { id: 'course-agec-201', code: 'AGEC 201', name: 'Farm Management', department: 'Agricultural Economics and Agribusiness Management', school: 'School of Agriculture and Food Security' },
          { id: 'course-agec-301', code: 'AGEC 301', name: 'Agricultural Marketing', department: 'Agricultural Economics and Agribusiness Management', school: 'School of Agriculture and Food Security' },
          { id: 'course-agec-401', code: 'AGEC 401', name: 'Agricultural Policy Analysis', department: 'Agricultural Economics and Agribusiness Management', school: 'School of Agriculture and Food Security' }
        ]
      },
      {
        id: 'dept-animal-science',
        name: 'Department of Animal Science',
        schoolId: 'school-agriculture',
        courses: [
          { id: 'course-ansc-101', code: 'ANSC 101', name: 'Introduction to Animal Science', department: 'Animal Science', school: 'School of Agriculture and Food Security' },
          { id: 'course-ansc-201', code: 'ANSC 201', name: 'Animal Nutrition', department: 'Animal Science', school: 'School of Agriculture and Food Security' },
          { id: 'course-ansc-301', code: 'ANSC 301', name: 'Animal Breeding and Genetics', department: 'Animal Science', school: 'School of Agriculture and Food Security' },
          { id: 'course-ansc-401', code: 'ANSC 401', name: 'Livestock Production Systems', department: 'Animal Science', school: 'School of Agriculture and Food Security' }
        ]
      },
      {
        id: 'dept-crop-science',
        name: 'Department of Crop Science and Horticulture',
        schoolId: 'school-agriculture',
        courses: [
          { id: 'course-crsc-101', code: 'CRSC 101', name: 'Introduction to Crop Science', department: 'Crop Science and Horticulture', school: 'School of Agriculture and Food Security' },
          { id: 'course-crsc-201', code: 'CRSC 201', name: 'Plant Breeding', department: 'Crop Science and Horticulture', school: 'School of Agriculture and Food Security' },
          { id: 'course-crsc-301', code: 'CRSC 301', name: 'Horticulture Production', department: 'Crop Science and Horticulture', school: 'School of Agriculture and Food Security' },
          { id: 'course-crsc-401', code: 'CRSC 401', name: 'Sustainable Agriculture', department: 'Crop Science and Horticulture', school: 'School of Agriculture and Food Security' }
        ]
      },
      {
        id: 'dept-soil-science',
        name: 'Department of Soil Science',
        schoolId: 'school-agriculture',
        courses: [
          { id: 'course-soil-101', code: 'SOIL 101', name: 'Introduction to Soil Science', department: 'Soil Science', school: 'School of Agriculture and Food Security' },
          { id: 'course-soil-201', code: 'SOIL 201', name: 'Soil Chemistry', department: 'Soil Science', school: 'School of Agriculture and Food Security' },
          { id: 'course-soil-301', code: 'SOIL 301', name: 'Soil Fertility Management', department: 'Soil Science', school: 'School of Agriculture and Food Security' },
          { id: 'course-soil-401', code: 'SOIL 401', name: 'Soil Conservation', department: 'Soil Science', school: 'School of Agriculture and Food Security' }
        ]
      }
    ]
  },
  {
    id: 'school-business',
    name: 'School of Business and Economics',
    departments: [
      {
        id: 'dept-accounting',
        name: 'Department of Accounting and Finance',
        schoolId: 'school-business',
        courses: [
          { id: 'course-acc-101', code: 'ACC 101', name: 'Principles of Accounting', department: 'Accounting and Finance', school: 'School of Business and Economics' },
          { id: 'course-acc-201', code: 'ACC 201', name: 'Financial Accounting', department: 'Accounting and Finance', school: 'School of Business and Economics' },
          { id: 'course-acc-301', code: 'ACC 301', name: 'Management Accounting', department: 'Accounting and Finance', school: 'School of Business and Economics' },
          { id: 'course-fin-101', code: 'FIN 101', name: 'Corporate Finance', department: 'Accounting and Finance', school: 'School of Business and Economics' },
          { id: 'course-fin-201', code: 'FIN 201', name: 'Investment Analysis', department: 'Accounting and Finance', school: 'School of Business and Economics' }
        ]
      },
      {
        id: 'dept-economics',
        name: 'Department of Economics',
        schoolId: 'school-business',
        courses: [
          { id: 'course-econ-101', code: 'ECON 101', name: 'Microeconomics', department: 'Economics', school: 'School of Business and Economics' },
          { id: 'course-econ-102', code: 'ECON 102', name: 'Macroeconomics', department: 'Economics', school: 'School of Business and Economics' },
          { id: 'course-econ-201', code: 'ECON 201', name: 'Development Economics', department: 'Economics', school: 'School of Business and Economics' },
          { id: 'course-econ-301', code: 'ECON 301', name: 'International Economics', department: 'Economics', school: 'School of Business and Economics' }
        ]
      },
      {
        id: 'dept-management',
        name: 'Department of Management Science',
        schoolId: 'school-business',
        courses: [
          { id: 'course-mgmt-101', code: 'MGMT 101', name: 'Principles of Management', department: 'Management Science', school: 'School of Business and Economics' },
          { id: 'course-mgmt-201', code: 'MGMT 201', name: 'Human Resource Management', department: 'Management Science', school: 'School of Business and Economics' },
          { id: 'course-mgmt-301', code: 'MGMT 301', name: 'Strategic Management', department: 'Management Science', school: 'School of Business and Economics' },
          { id: 'course-mkt-101', code: 'MKT 101', name: 'Principles of Marketing', department: 'Management Science', school: 'School of Business and Economics' }
        ]
      }
    ]
  },
  {
    id: 'school-health-sciences',
    name: 'School of Health Sciences',
    departments: [
      {
        id: 'dept-community-health',
        name: 'Department of Community Health',
        schoolId: 'school-health-sciences',
        courses: [
          { id: 'course-ch-101', code: 'CH 101', name: 'Introduction to Community Health', department: 'Community Health', school: 'School of Health Sciences' },
          { id: 'course-ch-201', code: 'CH 201', name: 'Epidemiology', department: 'Community Health', school: 'School of Health Sciences' },
          { id: 'course-ch-301', code: 'CH 301', name: 'Health Promotion', department: 'Community Health', school: 'School of Health Sciences' },
          { id: 'course-ch-401', code: 'CH 401', name: 'Environmental Health', department: 'Community Health', school: 'School of Health Sciences' }
        ]
      },
      {
        id: 'dept-nursing',
        name: 'Department of Nursing',
        schoolId: 'school-health-sciences',
        courses: [
          { id: 'course-nurs-101', code: 'NURS 101', name: 'Fundamentals of Nursing', department: 'Nursing', school: 'School of Health Sciences' },
          { id: 'course-nurs-201', code: 'NURS 201', name: 'Medical-Surgical Nursing', department: 'Nursing', school: 'School of Health Sciences' },
          { id: 'course-nurs-301', code: 'NURS 301', name: 'Pediatric Nursing', department: 'Nursing', school: 'School of Health Sciences' },
          { id: 'course-nurs-401', code: 'NURS 401', name: 'Community Health Nursing', department: 'Nursing', school: 'School of Health Sciences' }
        ]
      },
      {
        id: 'dept-nutrition',
        name: 'Department of Nutrition and Dietetics',
        schoolId: 'school-health-sciences',
        courses: [
          { id: 'course-nutr-101', code: 'NUTR 101', name: 'Introduction to Nutrition', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' },
          { id: 'course-nutr-201', code: 'NUTR 201', name: 'Clinical Nutrition', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' },
          { id: 'course-nutr-301', code: 'NUTR 301', name: 'Community Nutrition', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' },
          { id: 'course-nutr-401', code: 'NUTR 401', name: 'Food Service Management', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' }
        ]
      },
      {
        id: 'dept-educational-psychology',
        name: 'Department of Educational Psychology',
        schoolId: 'school-health-sciences',
        courses: [
          { id: 'course-edps-101', code: 'EDPS 101', name: 'Introduction to Educational Psychology', department: 'Educational Psychology', school: 'School of Health Sciences' },
          { id: 'course-edps-201', code: 'EDPS 201', name: 'Child Development', department: 'Educational Psychology', school: 'School of Health Sciences' },
          { id: 'course-edps-301', code: 'EDPS 301', name: 'Learning Theories', department: 'Educational Psychology', school: 'School of Health Sciences' },
          { id: 'course-edps-401', code: 'EDPS 401', name: 'Assessment and Evaluation', department: 'Educational Psychology', school: 'School of Health Sciences' }
        ]
      }
    ]
  },
  {
    id: 'school-science-technology',
    name: 'School of Science and Technology',
    departments: [
      {
        id: 'dept-mathematics-cs',
        name: 'Department of Mathematics and Computer Science',
        schoolId: 'school-science-technology',
        courses: [
          { id: 'course-math-101', code: 'MATH 101', name: 'Calculus I', department: 'Mathematics and Computer Science', school: 'School of Science and Technology' },
          { id: 'course-math-201', code: 'MATH 201', name: 'Linear Algebra', department: 'Mathematics and Computer Science', school: 'School of Science and Technology' },
          { id: 'course-cs-101', code: 'CS 101', name: 'Introduction to Programming', department: 'Mathematics and Computer Science', school: 'School of Science and Technology' },
          { id: 'course-cs-201', code: 'CS 201', name: 'Data Structures', department: 'Mathematics and Computer Science', school: 'School of Science and Technology' },
          { id: 'course-cs-301', code: 'CS 301', name: 'Database Systems', department: 'Mathematics and Computer Science', school: 'School of Science and Technology' }
        ]
      },
      {
        id: 'dept-biological-sciences',
        name: 'Department of Biological Sciences',
        schoolId: 'school-science-technology',
        courses: [
          { id: 'course-bio-101', code: 'BIO 101', name: 'General Biology', department: 'Biological Sciences', school: 'School of Science and Technology' },
          { id: 'course-bio-201', code: 'BIO 201', name: 'Genetics', department: 'Biological Sciences', school: 'School of Science and Technology' },
          { id: 'course-bio-301', code: 'BIO 301', name: 'Ecology', department: 'Biological Sciences', school: 'School of Science and Technology' },
          { id: 'course-bio-401', code: 'BIO 401', name: 'Molecular Biology', department: 'Biological Sciences', school: 'School of Science and Technology' }
        ]
      },
      {
        id: 'dept-chemistry',
        name: 'Department of Chemistry',
        schoolId: 'school-science-technology',
        courses: [
          { id: 'course-chem-101', code: 'CHEM 101', name: 'General Chemistry', department: 'Chemistry', school: 'School of Science and Technology' },
          { id: 'course-chem-201', code: 'CHEM 201', name: 'Organic Chemistry', department: 'Chemistry', school: 'School of Science and Technology' },
          { id: 'course-chem-301', code: 'CHEM 301', name: 'Physical Chemistry', department: 'Chemistry', school: 'School of Science and Technology' },
          { id: 'course-chem-401', code: 'CHEM 401', name: 'Analytical Chemistry', department: 'Chemistry', school: 'School of Science and Technology' }
        ]
      },
      {
        id: 'dept-physics',
        name: 'Department of Physics',
        schoolId: 'school-science-technology',
        courses: [
          { id: 'course-phys-101', code: 'PHYS 101', name: 'General Physics', department: 'Physics', school: 'School of Science and Technology' },
          { id: 'course-phys-201', code: 'PHYS 201', name: 'Classical Mechanics', department: 'Physics', school: 'School of Science and Technology' },
          { id: 'course-phys-301', code: 'PHYS 301', name: 'Electromagnetism', department: 'Physics', school: 'School of Science and Technology' },
          { id: 'course-phys-401', code: 'PHYS 401', name: 'Quantum Physics', department: 'Physics', school: 'School of Science and Technology' }
        ]
      },
      {
        id: 'dept-languages-literature',
        name: 'Department of Languages and Literature',
        schoolId: 'school-science-technology',
        courses: [
          { id: 'course-eng-101', code: 'ENG 101', name: 'English Literature', department: 'Languages and Literature', school: 'School of Science and Technology' },
          { id: 'course-eng-201', code: 'ENG 201', name: 'Creative Writing', department: 'Languages and Literature', school: 'School of Science and Technology' },
          { id: 'course-kis-101', code: 'KIS 101', name: 'Kiswahili Grammar', department: 'Languages and Literature', school: 'School of Science and Technology' },
          { id: 'course-kis-201', code: 'KIS 201', name: 'Kiswahili Literature', department: 'Languages and Literature', school: 'School of Science and Technology' }
        ]
      }
    ]
  }
];

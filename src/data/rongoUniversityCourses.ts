
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
    id: 'school-education',
    name: 'School of Education',
    departments: [
      {
        id: 'dept-curriculum',
        name: 'Department of Curriculum Instruction and Educational Media',
        schoolId: 'school-education',
        courses: [
          { id: 'course-curr-101', code: 'CURR 101', name: 'Curriculum Development', department: 'Curriculum Instruction and Educational Media', school: 'School of Education' },
          { id: 'course-curr-201', code: 'CURR 201', name: 'Instructional Design', department: 'Curriculum Instruction and Educational Media', school: 'School of Education' },
          { id: 'course-edm-101', code: 'EDM 101', name: 'Educational Media', department: 'Curriculum Instruction and Educational Media', school: 'School of Education' },
          { id: 'course-edm-201', code: 'EDM 201', name: 'Educational Technology', department: 'Curriculum Instruction and Educational Media', school: 'School of Education' }
        ]
      },
      {
        id: 'dept-educational-admin',
        name: 'Department of Educational Administration and Planning',
        schoolId: 'school-education',
        courses: [
          { id: 'course-edap-101', code: 'EDAP 101', name: 'Educational Administration', department: 'Educational Administration and Planning', school: 'School of Education' },
          { id: 'course-edap-201', code: 'EDAP 201', name: 'Educational Planning', department: 'Educational Administration and Planning', school: 'School of Education' },
          { id: 'course-edap-301', code: 'EDAP 301', name: 'School Management', department: 'Educational Administration and Planning', school: 'School of Education' },
          { id: 'course-edap-401', code: 'EDAP 401', name: 'Educational Leadership', department: 'Educational Administration and Planning', school: 'School of Education' }
        ]
      },
      {
        id: 'dept-educational-psych',
        name: 'Department of Educational Psychology',
        schoolId: 'school-education',
        courses: [
          { id: 'course-edps-101', code: 'EDPS 101', name: 'Introduction to Educational Psychology', department: 'Educational Psychology', school: 'School of Education' },
          { id: 'course-edps-201', code: 'EDPS 201', name: 'Child Development', department: 'Educational Psychology', school: 'School of Education' },
          { id: 'course-edps-301', code: 'EDPS 301', name: 'Learning Theories', department: 'Educational Psychology', school: 'School of Education' },
          { id: 'course-edps-401', code: 'EDPS 401', name: 'Assessment and Evaluation', department: 'Educational Psychology', school: 'School of Education' }
        ]
      },
      {
        id: 'dept-special-needs',
        name: 'Department of Special Needs Education',
        schoolId: 'school-education',
        courses: [
          { id: 'course-sne-101', code: 'SNE 101', name: 'Introduction to Special Needs Education', department: 'Special Needs Education', school: 'School of Education' },
          { id: 'course-sne-201', code: 'SNE 201', name: 'Inclusive Education', department: 'Special Needs Education', school: 'School of Education' },
          { id: 'course-sne-301', code: 'SNE 301', name: 'Learning Disabilities', department: 'Special Needs Education', school: 'School of Education' },
          { id: 'course-sne-401', code: 'SNE 401', name: 'Assistive Technology', department: 'Special Needs Education', school: 'School of Education' }
        ]
      }
    ]
  },
  {
    id: 'school-health',
    name: 'School of Health Sciences',
    departments: [
      {
        id: 'dept-community-health',
        name: 'Department of Community Health',
        schoolId: 'school-health',
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
        schoolId: 'school-health',
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
        schoolId: 'school-health',
        courses: [
          { id: 'course-nutr-101', code: 'NUTR 101', name: 'Introduction to Nutrition', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' },
          { id: 'course-nutr-201', code: 'NUTR 201', name: 'Clinical Nutrition', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' },
          { id: 'course-nutr-301', code: 'NUTR 301', name: 'Community Nutrition', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' },
          { id: 'course-nutr-401', code: 'NUTR 401', name: 'Food Service Management', department: 'Nutrition and Dietetics', school: 'School of Health Sciences' }
        ]
      }
    ]
  },
  {
    id: 'school-arts',
    name: 'School of Humanities and Social Sciences',
    departments: [
      {
        id: 'dept-languages',
        name: 'Department of Languages and Literature',
        schoolId: 'school-arts',
        courses: [
          { id: 'course-eng-101', code: 'ENG 101', name: 'English Literature', department: 'Languages and Literature', school: 'School of Humanities and Social Sciences' },
          { id: 'course-eng-201', code: 'ENG 201', name: 'Creative Writing', department: 'Languages and Literature', school: 'School of Humanities and Social Sciences' },
          { id: 'course-kis-101', code: 'KIS 101', name: 'Kiswahili Grammar', department: 'Languages and Literature', school: 'School of Humanities and Social Sciences' },
          { id: 'course-kis-201', code: 'KIS 201', name: 'Kiswahili Literature', department: 'Languages and Literature', school: 'School of Humanities and Social Sciences' }
        ]
      },
      {
        id: 'dept-history',
        name: 'Department of History and Archaeology',
        schoolId: 'school-arts',
        courses: [
          { id: 'course-hist-101', code: 'HIST 101', name: 'African History', department: 'History and Archaeology', school: 'School of Humanities and Social Sciences' },
          { id: 'course-hist-201', code: 'HIST 201', name: 'Kenyan History', department: 'History and Archaeology', school: 'School of Humanities and Social Sciences' },
          { id: 'course-arch-101', code: 'ARCH 101', name: 'Introduction to Archaeology', department: 'History and Archaeology', school: 'School of Humanities and Social Sciences' },
          { id: 'course-arch-201', code: 'ARCH 201', name: 'Cultural Heritage', department: 'History and Archaeology', school: 'School of Humanities and Social Sciences' }
        ]
      },
      {
        id: 'dept-philosophy',
        name: 'Department of Philosophy and Religious Studies',
        schoolId: 'school-arts',
        courses: [
          { id: 'course-phil-101', code: 'PHIL 101', name: 'Introduction to Philosophy', department: 'Philosophy and Religious Studies', school: 'School of Humanities and Social Sciences' },
          { id: 'course-phil-201', code: 'PHIL 201', name: 'Ethics and Morality', department: 'Philosophy and Religious Studies', school: 'School of Humanities and Social Sciences' },
          { id: 'course-rel-101', code: 'REL 101', name: 'Comparative Religion', department: 'Philosophy and Religious Studies', school: 'School of Humanities and Social Sciences' },
          { id: 'course-rel-201', code: 'REL 201', name: 'African Traditional Religion', department: 'Philosophy and Religious Studies', school: 'School of Humanities and Social Sciences' }
        ]
      },
      {
        id: 'dept-sociology',
        name: 'Department of Sociology and Social Work',
        schoolId: 'school-arts',
        courses: [
          { id: 'course-soc-101', code: 'SOC 101', name: 'Introduction to Sociology', department: 'Sociology and Social Work', school: 'School of Humanities and Social Sciences' },
          { id: 'course-soc-201', code: 'SOC 201', name: 'Social Research Methods', department: 'Sociology and Social Work', school: 'School of Humanities and Social Sciences' },
          { id: 'course-sw-101', code: 'SW 101', name: 'Introduction to Social Work', department: 'Sociology and Social Work', school: 'School of Humanities and Social Sciences' },
          { id: 'course-sw-201', code: 'SW 201', name: 'Community Development', department: 'Sociology and Social Work', school: 'School of Humanities and Social Sciences' }
        ]
      }
    ]
  },
  {
    id: 'school-science',
    name: 'School of Physical and Biological Sciences',
    departments: [
      {
        id: 'dept-biological',
        name: 'Department of Biological Sciences',
        schoolId: 'school-science',
        courses: [
          { id: 'course-bio-101', code: 'BIO 101', name: 'General Biology', department: 'Biological Sciences', school: 'School of Physical and Biological Sciences' },
          { id: 'course-bio-201', code: 'BIO 201', name: 'Genetics', department: 'Biological Sciences', school: 'School of Physical and Biological Sciences' },
          { id: 'course-bio-301', code: 'BIO 301', name: 'Ecology', department: 'Biological Sciences', school: 'School of Physical and Biological Sciences' },
          { id: 'course-bio-401', code: 'BIO 401', name: 'Molecular Biology', department: 'Biological Sciences', school: 'School of Physical and Biological Sciences' }
        ]
      },
      {
        id: 'dept-chemistry',
        name: 'Department of Chemistry',
        schoolId: 'school-science',
        courses: [
          { id: 'course-chem-101', code: 'CHEM 101', name: 'General Chemistry', department: 'Chemistry', school: 'School of Physical and Biological Sciences' },
          { id: 'course-chem-201', code: 'CHEM 201', name: 'Organic Chemistry', department: 'Chemistry', school: 'School of Physical and Biological Sciences' },
          { id: 'course-chem-301', code: 'CHEM 301', name: 'Physical Chemistry', department: 'Chemistry', school: 'School of Physical and Biological Sciences' },
          { id: 'course-chem-401', code: 'CHEM 401', name: 'Analytical Chemistry', department: 'Chemistry', school: 'School of Physical and Biological Sciences' }
        ]
      },
      {
        id: 'dept-mathematics',
        name: 'Department of Mathematics and Computer Science',
        schoolId: 'school-science',
        courses: [
          { id: 'course-math-101', code: 'MATH 101', name: 'Calculus I', department: 'Mathematics and Computer Science', school: 'School of Physical and Biological Sciences' },
          { id: 'course-math-201', code: 'MATH 201', name: 'Linear Algebra', department: 'Mathematics and Computer Science', school: 'School of Physical and Biological Sciences' },
          { id: 'course-cs-101', code: 'CS 101', name: 'Introduction to Programming', department: 'Mathematics and Computer Science', school: 'School of Physical and Biological Sciences' },
          { id: 'course-cs-201', code: 'CS 201', name: 'Data Structures', department: 'Mathematics and Computer Science', school: 'School of Physical and Biological Sciences' },
          { id: 'course-cs-301', code: 'CS 301', name: 'Database Systems', department: 'Mathematics and Computer Science', school: 'School of Physical and Biological Sciences' }
        ]
      },
      {
        id: 'dept-physics',
        name: 'Department of Physics',
        schoolId: 'school-science',
        courses: [
          { id: 'course-phys-101', code: 'PHYS 101', name: 'General Physics', department: 'Physics', school: 'School of Physical and Biological Sciences' },
          { id: 'course-phys-201', code: 'PHYS 201', name: 'Classical Mechanics', department: 'Physics', school: 'School of Physical and Biological Sciences' },
          { id: 'course-phys-301', code: 'PHYS 301', name: 'Electromagnetism', department: 'Physics', school: 'School of Physical and Biological Sciences' },
          { id: 'course-phys-401', code: 'PHYS 401', name: 'Quantum Physics', department: 'Physics', school: 'School of Physical and Biological Sciences' }
        ]
      }
    ]
  }
];

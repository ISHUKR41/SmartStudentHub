-- Student Activity Management System Database Seeding Script
-- This script creates tables and populates them with professional sample data
-- focusing on ISHU KUMAR as the primary student with comprehensive activities

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE user_role AS ENUM ('student', 'faculty', 'admin');
CREATE TYPE activity_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE activity_category AS ENUM ('academic', 'co-curricular', 'extra-curricular', 'volunteering', 'internship', 'leadership', 'mooc');

-- Create tables (if they don't exist)
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL UNIQUE,
    code VARCHAR NOT NULL UNIQUE,
    head_of_department VARCHAR,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    profile_image_url VARCHAR,
    role user_role DEFAULT 'student' NOT NULL,
    roll_number VARCHAR UNIQUE,
    department VARCHAR,
    current_semester INTEGER,
    cgpa DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activities (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    description TEXT,
    category activity_category NOT NULL,
    organization VARCHAR NOT NULL,
    activity_date TIMESTAMP NOT NULL,
    status activity_status DEFAULT 'pending' NOT NULL,
    verified_by VARCHAR REFERENCES users(id),
    verification_date TIMESTAMP,
    feedback TEXT,
    skill_credits INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS activity_files (
    id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id VARCHAR NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    file_name VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    file_type VARCHAR NOT NULL,
    file_size INTEGER NOT NULL,
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample departments
INSERT INTO departments (name, code) VALUES 
('Computer Science and Engineering', 'CSE'),
('Electronics and Communication Engineering', 'ECE'),
('Mechanical Engineering', 'ME'),
('Civil Engineering', 'CE'),
('Electrical Engineering', 'EE'),
('Information Technology', 'IT'),
('Chemical Engineering', 'CHE')
ON CONFLICT (code) DO NOTHING;

-- Insert sample users
INSERT INTO users (id, email, first_name, last_name, role, roll_number, department, current_semester, cgpa) VALUES 
-- Primary Student - ISHU KUMAR
('ishu-kumar-2021cse001', 'ishu.kumar@student.nitdelhi.ac.in', 'ISHU', 'KUMAR', 'student', '2021CSE001', 'CSE', 6, 8.75),

-- Additional Students
('priya-sharma-2021cse015', 'priya.sharma@student.nitdelhi.ac.in', 'Priya', 'Sharma', 'student', '2021CSE015', 'CSE', 6, 9.12),
('rahul-singh-2020ece032', 'rahul.singh@student.nitdelhi.ac.in', 'Rahul', 'Singh', 'student', '2020ECE032', 'ECE', 8, 8.45),

-- Faculty Members
('dr-amit-sharma-cse', 'amit.sharma@nitdelhi.ac.in', 'Dr. Amit', 'Sharma', 'faculty', NULL, 'CSE', NULL, NULL),
('prof-sunita-verma-cse', 'sunita.verma@nitdelhi.ac.in', 'Prof. Sunita', 'Verma', 'faculty', NULL, 'CSE', NULL, NULL),
('dr-rajesh-kumar-ece', 'rajesh.kumar@nitdelhi.ac.in', 'Dr. Rajesh', 'Kumar', 'faculty', NULL, 'ECE', NULL, NULL),
('prof-meera-agarwal-me', 'meera.agarwal@nitdelhi.ac.in', 'Prof. Meera', 'Agarwal', 'faculty', NULL, 'ME', NULL, NULL),

-- Admin Users
('admin-registrar', 'registrar@nitdelhi.ac.in', 'Registrar', 'Office', 'admin', NULL, NULL, NULL, NULL),
('admin-student-affairs', 'dean.students@nitdelhi.ac.in', 'Dean', 'Student Affairs', 'admin', NULL, NULL, NULL, NULL)
ON CONFLICT (id) DO NOTHING;

-- Update department heads
UPDATE departments SET head_of_department = 'dr-amit-sharma-cse' WHERE code = 'CSE';
UPDATE departments SET head_of_department = 'dr-rajesh-kumar-ece' WHERE code = 'ECE';
UPDATE departments SET head_of_department = 'prof-meera-agarwal-me' WHERE code = 'ME';

-- Insert sample activities for ISHU KUMAR
INSERT INTO activities (student_id, title, description, category, organization, activity_date, skill_credits) VALUES 
-- Academic Activities
('ishu-kumar-2021cse001', 'Research Paper on Machine Learning in Healthcare', 'Published research paper titled "Deep Learning Approaches for Medical Image Analysis" in IEEE Conference on Biomedical Engineering. Conducted comprehensive literature review and implemented CNN models for X-ray image classification achieving 94% accuracy.', 'academic', 'IEEE Conference on Biomedical Engineering 2024', '2024-03-15', 25),

('ishu-kumar-2021cse001', 'Best Paper Award - National Technical Symposium', 'Awarded Best Paper in Computer Science category at Technex 2024, IIT BHU for presentation on "Blockchain Applications in Supply Chain Management". Competed against 150+ participants from premier institutions across India.', 'academic', 'Technex 2024, IIT BHU', '2024-02-20', 30),

('ishu-kumar-2021cse001', 'Google Summer of Code 2023', 'Selected as GSoC contributor for Apache Software Foundation. Worked on enhancing the Apache Kafka streaming platform by implementing new consumer group protocols. Mentored by senior developers and contributed over 2000 lines of code.', 'academic', 'Google Summer of Code - Apache Software Foundation', '2023-08-25', 40),

-- Co-curricular Activities
('ishu-kumar-2021cse001', 'Technical Secretary - Computer Science Society', 'Served as Technical Secretary for the department''s Computer Science Society. Organized 8 technical workshops, 3 coding competitions, and managed the annual tech fest "CodeFest 2024" with 500+ participants from 25+ colleges.', 'co-curricular', 'Computer Science Society, NIT Delhi', '2024-01-10', 20),

('ishu-kumar-2021cse001', 'Winner - Smart India Hackathon 2023', 'Led a team of 6 members to victory in Smart India Hackathon 2023, Software Edition. Developed an AI-powered student mentor system for the Ministry of Education. Solution was selected for implementation across 100+ engineering colleges.', 'co-curricular', 'Smart India Hackathon 2023 - Ministry of Education', '2023-12-15', 35),

('ishu-kumar-2021cse001', 'Captain - NIT Delhi Programming Team', 'Led the college programming team to regional finals in ACM ICPC 2023. Achieved All India Rank 45 and secured qualification for World Finals. Conducted weekly training sessions for junior team members.', 'co-curricular', 'ACM ICPC 2023', '2023-11-08', 25),

-- Extra-curricular Activities
('ishu-kumar-2021cse001', 'Volunteer Coordinator - Delhi Marathon 2024', 'Coordinated a team of 50 volunteers for Delhi Half Marathon 2024. Managed logistics for 15,000+ participants and ensured smooth execution of hydration stations. Contributed 40+ hours of community service.', 'extra-curricular', 'Delhi Half Marathon 2024', '2024-01-21', 15),

('ishu-kumar-2021cse001', 'Cultural Secretary - Hostel Committee', 'Organized cultural events for 300+ hostel residents including Diwali celebrations, fresher''s welcome, and annual cultural fest. Managed budget of ₹50,000 and coordinated with external vendors for event management.', 'extra-curricular', 'Hostel Cultural Committee, NIT Delhi', '2023-10-25', 18),

-- Internship Experiences
('ishu-kumar-2021cse001', 'Software Development Intern - Microsoft India', '10-week summer internship at Microsoft India Development Center, Hyderabad. Worked on Azure cloud services team developing microservices for data analytics platform. Implemented REST APIs using .NET Core and Azure Functions.', 'internship', 'Microsoft India Development Center', '2023-07-15', 30),

('ishu-kumar-2021cse001', 'Machine Learning Intern - Flipkart Labs', '6-month part-time internship with Flipkart''s ML team working on recommendation systems. Improved product recommendation accuracy by 12% using collaborative filtering and deep neural networks. Presented findings to senior leadership.', 'internship', 'Flipkart Labs, Bangalore', '2024-04-30', 28),

-- Leadership Roles
('ishu-kumar-2021cse001', 'Student Coordinator - NSS Unit', 'Led National Service Scheme activities for the college unit with 200+ student volunteers. Organized blood donation camps, cleanliness drives, and digital literacy programs in nearby villages. Impacted 5000+ community members.', 'leadership', 'National Service Scheme, NIT Delhi', '2023-09-12', 22),

('ishu-kumar-2021cse001', 'Mentor - Student Mentorship Program', 'Mentored 15 first-year students in academic and personal development. Conducted weekly guidance sessions, helped with course selection, and provided career counseling. Achieved 95% mentee satisfaction rating.', 'leadership', 'Student Mentorship Program, NIT Delhi', '2023-08-01', 20),

-- MOOC and Certifications
('ishu-kumar-2021cse001', 'Deep Learning Specialization - Coursera', 'Completed 5-course specialization in Deep Learning by Andrew Ng on Coursera. Covered neural networks, CNN, RNN, and sequence models. Implemented projects in TensorFlow and achieved course completion certificate with 98% grade.', 'mooc', 'Coursera - Stanford University', '2023-06-20', 25),

('ishu-kumar-2021cse001', 'AWS Solutions Architect Associate Certification', 'Achieved AWS Solutions Architect Associate certification with a score of 890/1000. Demonstrated expertise in designing distributed systems on AWS cloud platform including EC2, S3, RDS, and Lambda services.', 'mooc', 'Amazon Web Services (AWS)', '2024-02-28', 20),

('ishu-kumar-2021cse001', 'Google Cloud Professional Data Engineer', 'Earned Google Cloud Professional Data Engineer certification. Demonstrated skills in designing data processing systems, building and operationalizing machine learning models, and ensuring solution quality.', 'mooc', 'Google Cloud Platform', '2023-12-10', 22),

-- Volunteering Activities
('ishu-kumar-2021cse001', 'Coding Instructor - Teach for India', 'Volunteered as coding instructor for underprivileged children through Teach for India initiative. Taught basic programming concepts to 30+ students aged 12-16 years. Developed curriculum for Python programming and conducted weekend classes.', 'volunteering', 'Teach for India Foundation', '2023-11-30', 18),

('ishu-kumar-2021cse001', 'Tech Support Volunteer - COVID-19 Relief', 'Provided technical support for online education platforms during COVID-19 pandemic. Helped 100+ students and teachers set up virtual classrooms and troubleshoot connectivity issues. Contributed 80+ hours of volunteer service.', 'volunteering', 'COVID-19 Digital Education Initiative', '2023-05-15', 15)
ON CONFLICT (student_id, title) DO NOTHING;

-- Update activity statuses with faculty verification (70% approved, 20% pending, 10% rejected)
-- Get the activities and assign faculty reviewers
WITH activity_review AS (
  SELECT 
    a.id,
    CASE 
      WHEN ROW_NUMBER() OVER (ORDER BY a.activity_date DESC) % 10 < 7 THEN 'approved'::activity_status
      WHEN ROW_NUMBER() OVER (ORDER BY a.activity_date DESC) % 10 < 9 THEN 'pending'::activity_status
      ELSE 'rejected'::activity_status
    END as new_status,
    CASE 
      WHEN ROW_NUMBER() OVER (ORDER BY a.activity_date DESC) % 2 = 0 THEN 'dr-amit-sharma-cse'
      ELSE 'prof-sunita-verma-cse'
    END as verifier
  FROM activities a
  WHERE a.student_id = 'ishu-kumar-2021cse001'
)
UPDATE activities 
SET 
  status = activity_review.new_status,
  verified_by = activity_review.verifier,
  verification_date = CASE 
    WHEN activity_review.new_status != 'pending' THEN NOW() - INTERVAL '7 days'
    ELSE NULL
  END,
  feedback = CASE 
    WHEN activity_review.new_status = 'approved' THEN 'Excellent work! This activity demonstrates significant learning and contribution to your field.'
    WHEN activity_review.new_status = 'pending' THEN 'Under review. Please provide additional documentation if available.'
    ELSE 'Please provide more detailed documentation and evidence of your participation.'
  END,
  skill_credits = CASE 
    WHEN activity_review.new_status = 'approved' THEN activities.skill_credits
    ELSE 0
  END
FROM activity_review
WHERE activities.id = activity_review.id;

-- Insert sample activity files metadata
WITH activity_files_data AS (
  SELECT 
    a.id as activity_id,
    a.title,
    unnest(ARRAY[
      CASE 
        WHEN a.title LIKE '%Research Paper%' THEN ARRAY[
          ('IEEE_Conference_Certificate.pdf', 'application/pdf', 1024000),
          ('Research_Paper_Published.pdf', 'application/pdf', 2048000)
        ]
        WHEN a.title LIKE '%Best Paper Award%' THEN ARRAY[
          ('Best_Paper_Award_Certificate.pdf', 'application/pdf', 856000),
          ('Technex_2024_Participation.pdf', 'application/pdf', 512000)
        ]
        WHEN a.title LIKE '%Google Summer%' THEN ARRAY[
          ('GSoC_2023_Certificate.pdf', 'application/pdf', 1536000),
          ('Apache_Contribution_Letter.pdf', 'application/pdf', 768000)
        ]
        WHEN a.title LIKE '%Smart India Hackathon%' THEN ARRAY[
          ('SIH_2023_Winner_Certificate.pdf', 'application/pdf', 1200000),
          ('Ministry_Education_Letter.pdf', 'application/pdf', 945000)
        ]
        WHEN a.title LIKE '%Microsoft%' THEN ARRAY[
          ('Microsoft_Internship_Certificate.pdf', 'application/pdf', 1875000),
          ('Internship_Completion_Letter.pdf', 'application/pdf', 634000)
        ]
        WHEN a.title LIKE '%Deep Learning%Coursera%' THEN ARRAY[
          ('Coursera_Deep_Learning_Certificate.pdf', 'application/pdf', 729000)
        ]
        WHEN a.title LIKE '%AWS%' THEN ARRAY[
          ('AWS_SAA_Certificate.pdf', 'application/pdf', 892000)
        ]
        ELSE ARRAY[('Activity_Certificate.pdf', 'application/pdf', 500000)]
      END
    ]) as file_info
  FROM activities a
  WHERE a.student_id = 'ishu-kumar-2021cse001'
    AND a.status = 'approved'
)
INSERT INTO activity_files (activity_id, file_name, file_path, file_type, file_size)
SELECT 
  activity_id,
  (file_info).f1 as file_name,
  'uploads/activity-' || activity_id || '-' || EXTRACT(EPOCH FROM NOW())::bigint || '-' || (file_info).f1 as file_path,
  (file_info).f2 as file_type,
  (file_info).f3 as file_size
FROM activity_files_data
ON CONFLICT DO NOTHING;

-- Create sessions table for Replit Auth (if it doesn't exist)
CREATE TABLE IF NOT EXISTS sessions (
    sid VARCHAR PRIMARY KEY,
    sess JSONB NOT NULL,
    expire TIMESTAMP NOT NULL
);

CREATE INDEX IF NOT EXISTS IDX_session_expire ON sessions(expire);

-- Summary of inserted data
DO $$
DECLARE
    dept_count INTEGER;
    user_count INTEGER;
    activity_count INTEGER;
    file_count INTEGER;
    ishu_stats RECORD;
BEGIN
    SELECT COUNT(*) INTO dept_count FROM departments;
    SELECT COUNT(*) INTO user_count FROM users;
    SELECT COUNT(*) INTO activity_count FROM activities WHERE student_id = 'ishu-kumar-2021cse001';
    SELECT COUNT(*) INTO file_count FROM activity_files af 
    JOIN activities a ON af.activity_id = a.id 
    WHERE a.student_id = 'ishu-kumar-2021cse001';
    
    SELECT 
        COUNT(*) as total_activities,
        COALESCE(SUM(skill_credits), 0) as total_credits,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
    INTO ishu_stats
    FROM activities 
    WHERE student_id = 'ishu-kumar-2021cse001';
    
    RAISE NOTICE '=== DATABASE SEEDING COMPLETED ===';
    RAISE NOTICE 'Departments created: %', dept_count;
    RAISE NOTICE 'Users created: %', user_count;
    RAISE NOTICE 'ISHU KUMAR Activities: %', activity_count;
    RAISE NOTICE '  - Approved: %', ishu_stats.approved;
    RAISE NOTICE '  - Pending: %', ishu_stats.pending;
    RAISE NOTICE '  - Rejected: %', ishu_stats.rejected;
    RAISE NOTICE '  - Total Skill Credits: %', ishu_stats.total_credits;
    RAISE NOTICE 'Activity Files: %', file_count;
    RAISE NOTICE 'Database is ready for testing and demonstration!';
END $$;
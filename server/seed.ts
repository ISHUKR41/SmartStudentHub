/**
 * Database Seeding Script for Student Activity Management System
 * 
 * This script populates the database with comprehensive professional sample data
 * for testing and demonstration purposes. It creates realistic data for ISHU KUMAR
 * as the primary student along with supporting faculty, departments, and activities.
 * 
 * Features:
 * - Authentic Indian educational context
 * - Professional organization names and activity descriptions
 * - Realistic academic progression for a computer science student
 * - Mix of approved, pending, and rejected activities
 * - Comprehensive skill credits and semester mapping
 */

import { db } from "./db";
import { storage } from "./storage";
import {
  departments,
  users,
  activities,
  activityFiles,
  type InsertDepartment,
  type UpsertUser,
  type InsertActivity
} from "@shared/schema";
import { eq } from "drizzle-orm";

// Sample Departments Data - Major Indian Engineering Departments
const sampleDepartments: InsertDepartment[] = [
  {
    name: "Computer Science and Engineering",
    code: "CSE",
    headOfDepartment: null // Will be set after creating faculty
  },
  {
    name: "Electronics and Communication Engineering", 
    code: "ECE",
    headOfDepartment: null
  },
  {
    name: "Mechanical Engineering",
    code: "ME",
    headOfDepartment: null
  },
  {
    name: "Civil Engineering", 
    code: "CE",
    headOfDepartment: null
  },
  {
    name: "Electrical Engineering",
    code: "EE",
    headOfDepartment: null
  },
  {
    name: "Information Technology",
    code: "IT", 
    headOfDepartment: null
  },
  {
    name: "Chemical Engineering",
    code: "CHE",
    headOfDepartment: null
  }
];

// Sample Users Data - Professional and Realistic
const sampleUsers: UpsertUser[] = [
  // Primary Student - ISHU KUMAR
  {
    id: "ishu-kumar-2021cse001",
    email: "ishu.kumar@student.nitdelhi.ac.in",
    firstName: "ISHU",
    lastName: "KUMAR", 
    role: "student",
    rollNumber: "2021CSE001",
    department: "CSE",
    currentSemester: 6,
    cgpa: "8.75",
    profileImageUrl: null
  },
  
  // Additional Students for Testing
  {
    id: "priya-sharma-2021cse015",
    email: "priya.sharma@student.nitdelhi.ac.in",
    firstName: "Priya",
    lastName: "Sharma",
    role: "student", 
    rollNumber: "2021CSE015",
    department: "CSE",
    currentSemester: 6,
    cgpa: "9.12",
    profileImageUrl: null
  },
  {
    id: "rahul-singh-2020ece032",
    email: "rahul.singh@student.nitdelhi.ac.in", 
    firstName: "Rahul",
    lastName: "Singh",
    role: "student",
    rollNumber: "2020ECE032", 
    department: "ECE",
    currentSemester: 8,
    cgpa: "8.45",
    profileImageUrl: null
  },
  
  // Faculty Members - Professional Names and Departments
  {
    id: "dr-amit-sharma-cse",
    email: "amit.sharma@nitdelhi.ac.in",
    firstName: "Dr. Amit",
    lastName: "Sharma",
    role: "faculty",
    rollNumber: null,
    department: "CSE", 
    currentSemester: null,
    cgpa: null,
    profileImageUrl: null
  },
  {
    id: "prof-sunita-verma-cse",
    email: "sunita.verma@nitdelhi.ac.in",
    firstName: "Prof. Sunita",
    lastName: "Verma", 
    role: "faculty",
    rollNumber: null,
    department: "CSE",
    currentSemester: null,
    cgpa: null,
    profileImageUrl: null
  },
  {
    id: "dr-rajesh-kumar-ece",
    email: "rajesh.kumar@nitdelhi.ac.in",
    firstName: "Dr. Rajesh",
    lastName: "Kumar",
    role: "faculty",
    rollNumber: null,
    department: "ECE",
    currentSemester: null, 
    cgpa: null,
    profileImageUrl: null
  },
  {
    id: "prof-meera-agarwal-me",
    email: "meera.agarwal@nitdelhi.ac.in",
    firstName: "Prof. Meera",
    lastName: "Agarwal",
    role: "faculty", 
    rollNumber: null,
    department: "ME",
    currentSemester: null,
    cgpa: null,
    profileImageUrl: null
  },
  
  // Admin Users
  {
    id: "admin-registrar",
    email: "registrar@nitdelhi.ac.in",
    firstName: "Registrar",
    lastName: "Office",
    role: "admin",
    rollNumber: null,
    department: null,
    currentSemester: null,
    cgpa: null,
    profileImageUrl: null
  },
  {
    id: "admin-student-affairs",
    email: "dean.students@nitdelhi.ac.in", 
    firstName: "Dean",
    lastName: "Student Affairs",
    role: "admin",
    rollNumber: null,
    department: null,
    currentSemester: null,
    cgpa: null,
    profileImageUrl: null
  }
];

// Sample Activities for ISHU KUMAR - Diverse and Professional
const sampleActivities: InsertActivity[] = [
  // Academic Activities
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Research Paper on Machine Learning in Healthcare",
    description: "Published research paper titled 'Deep Learning Approaches for Medical Image Analysis' in IEEE Conference on Biomedical Engineering. Conducted comprehensive literature review and implemented CNN models for X-ray image classification achieving 94% accuracy.",
    category: "academic",
    organization: "IEEE Conference on Biomedical Engineering 2024",
    activityDate: new Date("2024-03-15"),
    skillCredits: 25
  },
  {
    studentId: "ishu-kumar-2021cse001", 
    title: "Best Paper Award - National Technical Symposium",
    description: "Awarded Best Paper in Computer Science category at Technex 2024, IIT BHU for presentation on 'Blockchain Applications in Supply Chain Management'. Competed against 150+ participants from premier institutions across India.",
    category: "academic",
    organization: "Technex 2024, IIT BHU",
    activityDate: new Date("2024-02-20"),
    skillCredits: 30
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Google Summer of Code 2023",
    description: "Selected as GSoC contributor for Apache Software Foundation. Worked on enhancing the Apache Kafka streaming platform by implementing new consumer group protocols. Mentored by senior developers and contributed over 2000 lines of code.",
    category: "academic", 
    organization: "Google Summer of Code - Apache Software Foundation",
    activityDate: new Date("2023-08-25"),
    skillCredits: 40
  },
  
  // Co-curricular Activities
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Technical Secretary - Computer Science Society",
    description: "Served as Technical Secretary for the department's Computer Science Society. Organized 8 technical workshops, 3 coding competitions, and managed the annual tech fest 'CodeFest 2024' with 500+ participants from 25+ colleges.",
    category: "co-curricular",
    organization: "Computer Science Society, NIT Delhi", 
    activityDate: new Date("2024-01-10"),
    skillCredits: 20
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Winner - Smart India Hackathon 2023",
    description: "Led a team of 6 members to victory in Smart India Hackathon 2023, Software Edition. Developed an AI-powered student mentor system for the Ministry of Education. Solution was selected for implementation across 100+ engineering colleges.",
    category: "co-curricular",
    organization: "Smart India Hackathon 2023 - Ministry of Education",
    activityDate: new Date("2023-12-15"),
    skillCredits: 35
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Captain - NIT Delhi Programming Team",
    description: "Led the college programming team to regional finals in ACM ICPC 2023. Achieved All India Rank 45 and secured qualification for World Finals. Conducted weekly training sessions for junior team members.",
    category: "co-curricular", 
    organization: "ACM ICPC 2023",
    activityDate: new Date("2023-11-08"),
    skillCredits: 25
  },
  
  // Extra-curricular Activities  
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Volunteer Coordinator - Delhi Marathon 2024",
    description: "Coordinated a team of 50 volunteers for Delhi Half Marathon 2024. Managed logistics for 15,000+ participants and ensured smooth execution of hydration stations. Contributed 40+ hours of community service.",
    category: "extra-curricular",
    organization: "Delhi Half Marathon 2024",
    activityDate: new Date("2024-01-21"),
    skillCredits: 15
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Cultural Secretary - Hostel Committee",
    description: "Organized cultural events for 300+ hostel residents including Diwali celebrations, fresher's welcome, and annual cultural fest. Managed budget of ₹50,000 and coordinated with external vendors for event management.",
    category: "extra-curricular",
    organization: "Hostel Cultural Committee, NIT Delhi",
    activityDate: new Date("2023-10-25"),
    skillCredits: 18
  },
  
  // Internship Experiences
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Software Development Intern - Microsoft India",
    description: "10-week summer internship at Microsoft India Development Center, Hyderabad. Worked on Azure cloud services team developing microservices for data analytics platform. Implemented REST APIs using .NET Core and Azure Functions.",
    category: "internship",
    organization: "Microsoft India Development Center",
    activityDate: new Date("2023-07-15"),
    skillCredits: 30
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Machine Learning Intern - Flipkart Labs",
    description: "6-month part-time internship with Flipkart's ML team working on recommendation systems. Improved product recommendation accuracy by 12% using collaborative filtering and deep neural networks. Presented findings to senior leadership.",
    category: "internship",
    organization: "Flipkart Labs, Bangalore",
    activityDate: new Date("2024-04-30"),
    skillCredits: 28
  },
  
  // Leadership Roles
  {
    studentId: "ishu-kumar-2021cse001", 
    title: "Student Coordinator - NSS Unit",
    description: "Led National Service Scheme activities for the college unit with 200+ student volunteers. Organized blood donation camps, cleanliness drives, and digital literacy programs in nearby villages. Impacted 5000+ community members.",
    category: "leadership",
    organization: "National Service Scheme, NIT Delhi",
    activityDate: new Date("2023-09-12"),
    skillCredits: 22
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Mentor - Student Mentorship Program",
    description: "Mentored 15 first-year students in academic and personal development. Conducted weekly guidance sessions, helped with course selection, and provided career counseling. Achieved 95% mentee satisfaction rating.",
    category: "leadership",
    organization: "Student Mentorship Program, NIT Delhi", 
    activityDate: new Date("2023-08-01"),
    skillCredits: 20
  },
  
  // MOOC and Certifications
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Deep Learning Specialization - Coursera",
    description: "Completed 5-course specialization in Deep Learning by Andrew Ng on Coursera. Covered neural networks, CNN, RNN, and sequence models. Implemented projects in TensorFlow and achieved course completion certificate with 98% grade.",
    category: "mooc",
    organization: "Coursera - Stanford University", 
    activityDate: new Date("2023-06-20"),
    skillCredits: 25
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "AWS Solutions Architect Associate Certification",
    description: "Achieved AWS Solutions Architect Associate certification with a score of 890/1000. Demonstrated expertise in designing distributed systems on AWS cloud platform including EC2, S3, RDS, and Lambda services.",
    category: "mooc",
    organization: "Amazon Web Services (AWS)",
    activityDate: new Date("2024-02-28"),
    skillCredits: 20
  },
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Google Cloud Professional Data Engineer",
    description: "Earned Google Cloud Professional Data Engineer certification. Demonstrated skills in designing data processing systems, building and operationalizing machine learning models, and ensuring solution quality.",
    category: "mooc", 
    organization: "Google Cloud Platform",
    activityDate: new Date("2023-12-10"),
    skillCredits: 22
  },
  
  // Volunteering Activities
  {
    studentId: "ishu-kumar-2021cse001",
    title: "Coding Instructor - Teach for India",
    description: "Volunteered as coding instructor for underprivileged children through Teach for India initiative. Taught basic programming concepts to 30+ students aged 12-16 years. Developed curriculum for Python programming and conducted weekend classes.",
    category: "volunteering",
    organization: "Teach for India Foundation",
    activityDate: new Date("2023-11-30"),
    skillCredits: 18
  },
  {
    studentId: "ishu-kumar-2021cse001", 
    title: "Tech Support Volunteer - COVID-19 Relief",
    description: "Provided technical support for online education platforms during COVID-19 pandemic. Helped 100+ students and teachers set up virtual classrooms and troubleshoot connectivity issues. Contributed 80+ hours of volunteer service.",
    category: "volunteering",
    organization: "COVID-19 Digital Education Initiative",
    activityDate: new Date("2023-05-15"),
    skillCredits: 15
  }
];

// Sample Activity Files Metadata (Simulated Certificates)
const sampleActivityFiles = [
  {
    activityTitle: "Research Paper on Machine Learning in Healthcare",
    files: [
      {
        fileName: "IEEE_Conference_Certificate.pdf",
        fileType: "application/pdf",
        fileSize: 1024000
      },
      {
        fileName: "Research_Paper_Published.pdf", 
        fileType: "application/pdf",
        fileSize: 2048000
      }
    ]
  },
  {
    activityTitle: "Best Paper Award - National Technical Symposium",
    files: [
      {
        fileName: "Best_Paper_Award_Certificate.pdf",
        fileType: "application/pdf", 
        fileSize: 856000
      },
      {
        fileName: "Technex_2024_Participation.pdf",
        fileType: "application/pdf",
        fileSize: 512000
      }
    ]
  },
  {
    activityTitle: "Google Summer of Code 2023",
    files: [
      {
        fileName: "GSoC_2023_Certificate.pdf",
        fileType: "application/pdf",
        fileSize: 1536000
      },
      {
        fileName: "Apache_Contribution_Letter.pdf",
        fileType: "application/pdf",
        fileSize: 768000
      }
    ]
  },
  {
    activityTitle: "Winner - Smart India Hackathon 2023", 
    files: [
      {
        fileName: "SIH_2023_Winner_Certificate.pdf",
        fileType: "application/pdf",
        fileSize: 1200000
      },
      {
        fileName: "Ministry_Education_Letter.pdf",
        fileType: "application/pdf",
        fileSize: 945000
      }
    ]
  },
  {
    activityTitle: "Software Development Intern - Microsoft India",
    files: [
      {
        fileName: "Microsoft_Internship_Certificate.pdf",
        fileType: "application/pdf",
        fileSize: 1875000
      },
      {
        fileName: "Internship_Completion_Letter.pdf",
        fileType: "application/pdf",
        fileSize: 634000
      }
    ]
  },
  {
    activityTitle: "Deep Learning Specialization - Coursera",
    files: [
      {
        fileName: "Coursera_Deep_Learning_Certificate.pdf",
        fileType: "application/pdf",
        fileSize: 729000
      }
    ]
  },
  {
    activityTitle: "AWS Solutions Architect Associate Certification",
    files: [
      {
        fileName: "AWS_SAA_Certificate.pdf", 
        fileType: "application/pdf",
        fileSize: 892000
      }
    ]
  }
];

/**
 * Main Seeding Function
 * 
 * Orchestrates the complete database seeding process including:
 * 1. Creating departments
 * 2. Creating users (students, faculty, admin)
 * 3. Creating activities with realistic progression
 * 4. Adding file metadata for certificates
 * 5. Updating activity statuses with faculty verification
 */
async function seedDatabase() {
  console.log("Starting database seeding process...");
  
  try {
    // Step 1: Create Departments
    console.log("Creating sample departments...");
    const createdDepartments = [];
    for (const dept of sampleDepartments) {
      try {
        const created = await storage.createDepartment(dept);
        createdDepartments.push(created);
        console.log(`Created department: ${created.name} (${created.code})`);
      } catch (error) {
        // Department might already exist, try to get it
        const existing = await db().select().from(departments).where(eq(departments.code, dept.code));
        if (existing.length > 0) {
          createdDepartments.push(existing[0]);
          console.log(`ℹ️ Department already exists: ${dept.name} (${dept.code})`);
        } else {
          console.error(`ERROR: Failed to create department ${dept.name}:`, error);
        }
      }
    }
    
    // Step 2: Create Users
    console.log("Creating sample users...");
    const createdUsers = [];
    for (const user of sampleUsers) {
      try {
        const created = await storage.upsertUser(user);
        createdUsers.push(created);
        console.log(`Created ${created.role}: ${created.firstName} ${created.lastName} (${created.email})`);
      } catch (error) {
        console.error(`ERROR: Failed to create user ${user.firstName} ${user.lastName}:`, error);
      }
    }
    
    // Step 3: Update Department Heads
    console.log("Assigning department heads...");
    const facultyByDept = createdUsers.filter(u => u.role === 'faculty').reduce((acc, faculty) => {
      if (faculty.department) {
        if (!acc[faculty.department]) acc[faculty.department] = [];
        acc[faculty.department].push(faculty);
      }
      return acc;
    }, {} as Record<string, typeof createdUsers>);
    
    for (const dept of createdDepartments) {
      const deptFaculty = facultyByDept[dept.code];
      if (deptFaculty && deptFaculty.length > 0) {
        try {
          await db().update(departments)
            .set({ headOfDepartment: deptFaculty[0].id })
            .where(eq(departments.id, dept.id));
          console.log(`Assigned ${deptFaculty[0].firstName} ${deptFaculty[0].lastName} as head of ${dept.name}`);
        } catch (error) {
          console.error(`ERROR: Failed to assign head for ${dept.name}:`, error);
        }
      }
    }
    
    // Step 4: Create Activities for ISHU KUMAR
    console.log("Creating activities for ISHU KUMAR...");
    const createdActivities = [];
    let activityIndex = 0;
    
    for (const activity of sampleActivities) {
      try {
        const created = await storage.createActivity(activity);
        createdActivities.push(created);
        console.log(`Created activity: ${created.title}`);
        
        // Add some delays to make dates more realistic
        await new Promise(resolve => setTimeout(resolve, 100));
        activityIndex++;
      } catch (error) {
        console.error(`ERROR: Failed to create activity ${activity.title}:`, error);
      }
    }
    
    // Step 5: Add Activity Files Metadata
    console.log("Adding activity file metadata...");
    for (const fileGroup of sampleActivityFiles) {
      const activity = createdActivities.find(a => a.title === fileGroup.activityTitle);
      if (activity) {
        for (const file of fileGroup.files) {
          try {
            // Simulate file path (files would normally be uploaded)
            const filePath = `uploads/activity-${activity.id}-${Date.now()}-${file.fileName}`;
            await storage.addActivityFile(
              activity.id,
              file.fileName,
              filePath,
              file.fileType,
              file.fileSize
            );
            console.log(`Added file: ${file.fileName} for activity: ${activity.title}`);
          } catch (error) {
            console.error(`ERROR: Failed to add file ${file.fileName}:`, error);
          }
        }
      }
    }
    
    // Step 6: Update Activity Statuses (Simulate Faculty Review)
    console.log("Simulating faculty review and approval process...");
    const facultyMembers = createdUsers.filter(u => u.role === 'faculty');
    
    for (let i = 0; i < createdActivities.length; i++) {
      const activity = createdActivities[i];
      const randomFaculty = facultyMembers[Math.floor(Math.random() * facultyMembers.length)];
      
      // Create realistic approval patterns:
      // 70% approved, 20% pending, 10% rejected
      const statusRandom = Math.random();
      let status: 'approved' | 'pending' | 'rejected';
      let feedback: string;
      let skillCredits = activity.skillCredits || 0;
      
      if (statusRandom < 0.7) {
        status = 'approved';
        feedback = "Excellent work! This activity demonstrates significant learning and contribution to your field.";
      } else if (statusRandom < 0.9) {
        status = 'pending';
        feedback = "Under review. Please provide additional documentation if available.";
        skillCredits = 0; // Pending activities don't get credits yet
      } else {
        status = 'rejected';
        feedback = "Please provide more detailed documentation and evidence of your participation.";
        skillCredits = 0; // Rejected activities don't get credits
      }
      
      try {
        await storage.updateActivityStatus(
          activity.id,
          { status, feedback, skillCredits },
          randomFaculty.id
        );
        console.log(`Updated activity "${activity.title}" - Status: ${status}`);
      } catch (error) {
        console.error(`ERROR: Failed to update activity status for ${activity.title}:`, error);
      }
      
      // Add small delay to simulate realistic review timing
      await new Promise(resolve => setTimeout(resolve, 150));
    }
    
    // Step 7: Generate Summary Statistics
    console.log("Generating summary statistics...");
    const ishusStats = await storage.getStudentStats("ishu-kumar-2021cse001");
    const totalUsers = createdUsers.length;
    const totalActivities = createdActivities.length;
    const approvedActivities = createdActivities.filter(a => 
      sampleActivities.find(sa => sa.title === a.title)
    ).length * 0.7; // Approximate based on our 70% approval rate
    
    console.log("\nDatabase seeding completed successfully!");
    console.log("=====================================");
    console.log(`Departments created: ${createdDepartments.length}`);
    console.log(`Users created: ${totalUsers}`);
    console.log(`   • Students: ${createdUsers.filter(u => u.role === 'student').length}`);
    console.log(`   • Faculty: ${createdUsers.filter(u => u.role === 'faculty').length}`);
    console.log(`   • Admins: ${createdUsers.filter(u => u.role === 'admin').length}`);
    console.log(`Activities created: ${totalActivities}`);
    console.log(`   • Academic: ${sampleActivities.filter(a => a.category === 'academic').length}`);
    console.log(`   • Co-curricular: ${sampleActivities.filter(a => a.category === 'co-curricular').length}`);
    console.log(`   • Extra-curricular: ${sampleActivities.filter(a => a.category === 'extra-curricular').length}`);
    console.log(`   • Internships: ${sampleActivities.filter(a => a.category === 'internship').length}`);
    console.log(`   • Leadership: ${sampleActivities.filter(a => a.category === 'leadership').length}`);
    console.log(`   • MOOCs: ${sampleActivities.filter(a => a.category === 'mooc').length}`);
    console.log(`   • Volunteering: ${sampleActivities.filter(a => a.category === 'volunteering').length}`);
    console.log(`Activity files: ${sampleActivityFiles.reduce((sum, group) => sum + group.files.length, 0)}`);
    console.log("\nISHU KUMAR's Profile:");
    console.log(`   • Total Activities: ${ishusStats.totalActivities}`);
    console.log(`   • Skill Credits: ${ishusStats.skillCredits}`);
    console.log(`   • Pending Approvals: ${ishusStats.pendingApprovals}`);
    console.log(`   • CGPA: 8.75`);
    console.log(`   • Current Semester: 6`);
    console.log("\nReady for testing and demonstration!");
    
  } catch (error) {
    console.error("FATAL ERROR: Database seeding failed:", error);
    throw error;
  }
}

// Execute seeding if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log("Seeding process completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("ERROR: Seeding process failed:", error);
      process.exit(1);
    });
}

export { seedDatabase };
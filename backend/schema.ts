/**
 * COMPLETE BACKEND SCHEMA FOR SMART STUDENT HUB
 *
 * This schema supports ALL features of the Student Activity Management Platform:
 * - Academic Management (Courses, Timetable, Grades, Study Materials)
 * - Financial Management (Fees, Payments, Scholarships)
 * - Campus Life (Library, Hostel, Transportation, Cafeteria, Clubs)
 * - Career & Placement (Jobs, Internships, Career Counseling)
 * - Communication (Forum, Chat, Video Lectures)
 * - Support (Grievances, Medical, Help Desk)
 * - Administration (Reports, Analytics, Department Management)
 * - Student Development (Mentorship, Research, Certifications, Skills)
 */

import { sql } from "drizzle-orm";
export { sql };
import { relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  serial, // Added for user ID as auto-incrementing integer
  decimal,
  boolean,
  pgEnum,
  date,
  time,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ==================== ENUMS ====================

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "faculty",
  "admin",
  "staff",
]);
export const activityStatusEnum = pgEnum("activity_status", [
  "pending",
  "approved",
  "rejected",
]);
export const activityCategoryEnum = pgEnum("activity_category", [
  "academic",
  "co-curricular",
  "extra-curricular",
  "volunteering",
  "internship",
  "leadership",
  "mooc",
  "research",
  "certification",
]);
export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
  "excused",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "info",
  "success",
  "warning",
  "error",
]);
export const goalPriorityEnum = pgEnum("goal_priority", [
  "low",
  "medium",
  "high",
]);
export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "completed",
  "overdue",
]);
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "paid",
  "failed",
  "refunded",
]);
export const scholarshipStatusEnum = pgEnum("scholarship_status", [
  "applied",
  "under_review",
  "approved",
  "rejected",
  "active",
]);
export const assignmentStatusEnum = pgEnum("assignment_status", [
  "assigned",
  "submitted",
  "graded",
  "late",
]);
export const examTypeEnum = pgEnum("exam_type", [
  "mid_term",
  "end_term",
  "quiz",
  "practical",
  "viva",
]);
export const eventStatusEnum = pgEnum("event_status", [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
]);
export const rsvpStatusEnum = pgEnum("rsvp_status", [
  "pending",
  "accepted",
  "declined",
  "maybe",
]);
export const noticeStatusEnum = pgEnum("notice_status", [
  "draft",
  "published",
  "archived",
]);
export const noticePriorityEnum = pgEnum("notice_priority", [
  "low",
  "medium",
  "high",
  "urgent",
]);
export const lostFoundStatusEnum = pgEnum("lost_found_status", [
  "lost",
  "found",
  "returned",
]);
export const grievanceStatusEnum = pgEnum("grievance_status", [
  "submitted",
  "in_progress",
  "resolved",
  "closed",
]);
export const grievancePriorityEnum = pgEnum("grievance_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);
export const bookStatusEnum = pgEnum("book_status", [
  "available",
  "issued",
  "reserved",
  "lost",
]);
export const hostelRoomStatusEnum = pgEnum("hostel_room_status", [
  "vacant",
  "occupied",
  "maintenance",
]);
export const placementStatusEnum = pgEnum("placement_status", [
  "open",
  "closed",
  "filled",
]);
export const applicationStatusEnum = pgEnum("application_status", [
  "applied",
  "shortlisted",
  "selected",
  "rejected",
]);

// ==================== SESSION TABLE ====================

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// ==================== USERS & AUTHENTICATION ====================

export const users = pgTable("users", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`), // Using UUID for compatibility with existing foreign keys
  email: varchar("email").unique().notNull(),
  firstName: varchar("first_name").notNull(),
  lastName: varchar("last_name").notNull(),
  profileImageUrl: varchar("profile_image_url"),
  role: userRoleEnum("role").default("student").notNull(),
  rollNumber: varchar("roll_number").unique(),
  department: varchar("department"),
  currentSemester: integer("current_semester"),
  yearOfAdmission: integer("year_of_admission"),
  cgpa: decimal("cgpa", { precision: 3, scale: 2 }),
  phoneNumber: varchar("phone_number"),
  address: text("address"),
  bloodGroup: varchar("blood_group"),
  emergencyContact: varchar("emergency_contact"),
  parentName: varchar("parent_name"),
  parentContact: varchar("parent_contact"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ==================== ACADEMIC MANAGEMENT ====================

// Courses Table
export const courses = pgTable("courses", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseCode: varchar("course_code").unique().notNull(),
  courseName: varchar("course_name").notNull(),
  description: text("description"),
  credits: integer("credits").notNull(),
  semester: integer("semester").notNull(),
  department: varchar("department").notNull(),
  instructorId: varchar("instructor_id").references(() => users.id),
  maxCapacity: integer("max_capacity").default(100),
  currentEnrollment: integer("current_enrollment").default(0),
  syllabus: text("syllabus"),
  prerequisites: text("prerequisites"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Course Enrollments
export const courseEnrollments = pgTable("course_enrollments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  enrollmentDate: timestamp("enrollment_date").defaultNow(),
  status: varchar("status").default("active"), // active, dropped, completed
  midTermGrade: varchar("mid_term_grade"),
  finalGrade: varchar("final_grade"),
  totalMarks: integer("total_marks"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Timetable/Schedule
export const timetable = pgTable("timetable", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  dayOfWeek: varchar("day_of_week").notNull(), // Monday, Tuesday, etc.
  startTime: time("start_time").notNull(),
  endTime: time("end_time").notNull(),
  roomNumber: varchar("room_number").notNull(),
  classType: varchar("class_type").default("lecture"), // lecture, lab, tutorial
  semester: integer("semester").notNull(),
  academicYear: varchar("academic_year").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Grades/Marks
export const grades = pgTable("grades", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  examType: varchar("exam_type").notNull(), // mid_term, end_term, quiz, assignment
  marksObtained: integer("marks_obtained").notNull(),
  totalMarks: integer("total_marks").notNull(),
  grade: varchar("grade"), // A+, A, B+, etc.
  remarks: text("remarks"),
  examDate: date("exam_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Study Materials
export const studyMaterials = pgTable("study_materials", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  fileUrl: varchar("file_url").notNull(),
  fileName: varchar("file_name").notNull(),
  fileSize: integer("file_size"),
  fileType: varchar("file_type"),
  uploadedBy: varchar("uploaded_by").references(() => users.id),
  category: varchar("category"), // lecture_notes, assignment, lab_manual, book, reference
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== ASSIGNMENTS & EXAMS ====================

export const assignments = pgTable("assignments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date").notNull(),
  totalMarks: integer("total_marks").notNull(),
  attachmentUrl: varchar("attachment_url"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assignmentSubmissions = pgTable("assignment_submissions", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  assignmentId: varchar("assignment_id")
    .references(() => assignments.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  submissionUrl: varchar("submission_url").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow(),
  marksObtained: integer("marks_obtained"),
  feedback: text("feedback"),
  status: assignmentStatusEnum("status").default("submitted"),
  gradedAt: timestamp("graded_at"),
  gradedBy: varchar("graded_by").references(() => users.id),
});

export const exams = pgTable("exams", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  examName: varchar("exam_name").notNull(),
  examType: examTypeEnum("exam_type").notNull(),
  examDate: date("exam_date").notNull(),
  startTime: time("start_time").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalMarks: integer("total_marks").notNull(),
  roomNumber: varchar("room_number"),
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const examResults = pgTable("exam_results", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  examId: varchar("exam_id")
    .references(() => exams.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  marksObtained: integer("marks_obtained").notNull(),
  grade: varchar("grade"),
  remarks: text("remarks"),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== ATTENDANCE ====================

export const attendance = pgTable("attendance", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  courseId: varchar("course_id")
    .references(() => courses.id, { onDelete: "cascade" })
    .notNull(),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  markedBy: varchar("marked_by").references(() => users.id),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== FINANCIAL MANAGEMENT ====================

// Fee Structure
export const feeStructure = pgTable("fee_structure", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  semester: integer("semester").notNull(),
  academicYear: varchar("academic_year").notNull(),
  department: varchar("department").notNull(),
  tuitionFee: integer("tuition_fee").notNull(),
  labFee: integer("lab_fee").default(0),
  libraryFee: integer("library_fee").default(0),
  sportsFee: integer("sports_fee").default(0),
  otherFees: integer("other_fees").default(0),
  totalFee: integer("total_fee").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Student Fee Payments
export const feePayments = pgTable("fee_payments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  feeStructureId: varchar("fee_structure_id").references(() => feeStructure.id),
  amount: integer("amount").notNull(),
  paymentType: varchar("payment_type").notNull(), // tuition, lab, library, sports, other
  paymentMethod: varchar("payment_method"), // cash, card, upi, netbanking
  transactionId: varchar("transaction_id"),
  status: paymentStatusEnum("status").default("pending"),
  dueDate: date("due_date"),
  paidDate: timestamp("paid_date"),
  receiptNumber: varchar("receipt_number"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Scholarships
export const scholarships = pgTable("scholarships", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  amount: integer("amount").notNull(),
  eligibilityCriteria: text("eligibility_criteria"),
  category: varchar("category"), // merit, need_based, sports, minority
  deadline: date("deadline"),
  provider: varchar("provider"), // government, college, private
  totalSlots: integer("total_slots"),
  availableSlots: integer("available_slots"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const scholarshipApplications = pgTable("scholarship_applications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  scholarshipId: varchar("scholarship_id")
    .references(() => scholarships.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  applicationDate: timestamp("application_date").defaultNow(),
  status: scholarshipStatusEnum("status").default("applied"),
  documentsUrl: varchar("documents_url"),
  remarks: text("remarks"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  approvedAmount: integer("approved_amount"),
});

// ==================== CAMPUS LIFE ====================

// Library Books
export const libraryBooks = pgTable("library_books", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  isbn: varchar("isbn").unique(),
  title: varchar("title").notNull(),
  author: varchar("author").notNull(),
  publisher: varchar("publisher"),
  edition: varchar("edition"),
  category: varchar("category"),
  totalCopies: integer("total_copies").default(1),
  availableCopies: integer("available_copies").default(1),
  shelfLocation: varchar("shelf_location"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const libraryIssues = pgTable("library_issues", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  bookId: varchar("book_id")
    .references(() => libraryBooks.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  issueDate: timestamp("issue_date").defaultNow(),
  dueDate: timestamp("due_date").notNull(),
  returnDate: timestamp("return_date"),
  fine: integer("fine").default(0),
  status: bookStatusEnum("status").default("issued"),
  issuedBy: varchar("issued_by").references(() => users.id),
});

// Hostel Management
export const hostelRooms = pgTable("hostel_rooms", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  hostelName: varchar("hostel_name").notNull(),
  roomNumber: varchar("room_number").notNull(),
  floor: integer("floor"),
  capacity: integer("capacity").notNull(),
  currentOccupancy: integer("current_occupancy").default(0),
  status: hostelRoomStatusEnum("status").default("vacant"),
  monthlyRent: integer("monthly_rent"),
  amenities: text("amenities"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const hostelAllotments = pgTable("hostel_allotments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  roomId: varchar("room_id")
    .references(() => hostelRooms.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  allotmentDate: timestamp("allotment_date").defaultNow(),
  vacateDate: timestamp("vacate_date"),
  status: varchar("status").default("active"), // active, vacated
  createdAt: timestamp("created_at").defaultNow(),
});

// Transportation
export const busRoutes = pgTable("bus_routes", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  routeNumber: varchar("route_number").unique().notNull(),
  routeName: varchar("route_name").notNull(),
  stops: text("stops"), // JSON array of stops
  departureTime: time("departure_time").notNull(),
  arrivalTime: time("arrival_time"),
  busNumber: varchar("bus_number"),
  capacity: integer("capacity"),
  fare: integer("fare"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cafeteria Menu
export const cafeteriaMenu = pgTable("cafeteria_menu", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  itemName: varchar("item_name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  category: varchar("category"), // breakfast, lunch, dinner, snacks, beverages
  isAvailable: boolean("is_available").default(true),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Clubs & Societies
export const clubs = pgTable("clubs", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clubName: varchar("club_name").notNull(),
  description: text("description"),
  category: varchar("category"), // technical, cultural, sports, social
  facultyCoordinator: varchar("faculty_coordinator").references(() => users.id),
  presidentId: varchar("president_id").references(() => users.id),
  totalMembers: integer("total_members").default(0),
  establishedDate: date("established_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clubMemberships = pgTable("club_memberships", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  clubId: varchar("club_id")
    .references(() => clubs.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role").default("member"), // president, vice_president, secretary, member
  joinedDate: timestamp("joined_date").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// ==================== CAREER & PLACEMENT ====================

export const placements = pgTable("placements", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  companyName: varchar("company_name").notNull(),
  jobTitle: varchar("job_title").notNull(),
  description: text("description"),
  eligibilityCriteria: text("eligibility_criteria"),
  salary: integer("salary"),
  location: varchar("location"),
  jobType: varchar("job_type"), // full_time, internship, part_time
  status: placementStatusEnum("status").default("open"),
  applicationDeadline: date("application_deadline"),
  visitDate: date("visit_date"),
  totalPositions: integer("total_positions"),
  filledPositions: integer("filled_positions").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const placementApplications = pgTable("placement_applications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  placementId: varchar("placement_id")
    .references(() => placements.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resumeUrl: varchar("resume_url"),
  coverLetter: text("cover_letter"),
  status: applicationStatusEnum("status").default("applied"),
  appliedDate: timestamp("applied_date").defaultNow(),
  interviewDate: timestamp("interview_date"),
  offerLetter: varchar("offer_letter"),
  remarks: text("remarks"),
});

// Internships
export const internships = pgTable("internships", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  companyName: varchar("company_name").notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  duration: varchar("duration"), // 2 months, 6 months, etc.
  stipend: integer("stipend"),
  location: varchar("location"),
  eligibility: text("eligibility"),
  status: varchar("status").default("open"),
  deadline: date("deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const internshipApplications = pgTable("internship_applications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  internshipId: varchar("internship_id")
    .references(() => internships.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  resumeUrl: varchar("resume_url"),
  status: applicationStatusEnum("status").default("applied"),
  appliedDate: timestamp("applied_date").defaultNow(),
});

// ==================== EVENTS & NOTICES ====================

export const events = pgTable("events", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  eventDate: timestamp("event_date").notNull(),
  endDate: timestamp("end_date"),
  location: varchar("location"),
  organizer: varchar("organizer").references(() => users.id),
  category: varchar("category"), // academic, cultural, sports, technical
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  status: eventStatusEnum("status").default("upcoming"),
  imageUrl: varchar("image_url"),
  registrationDeadline: timestamp("registration_deadline"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const eventRSVP = pgTable("event_rsvp", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  eventId: varchar("event_id")
    .references(() => events.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  status: rsvpStatusEnum("status").default("pending"),
  rsvpDate: timestamp("rsvp_date").defaultNow(),
});

export const notices = pgTable("notices", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  content: text("content").notNull(),
  category: varchar("category"), // academic, administrative, event, urgent
  priority: noticePriorityEnum("priority").default("medium"),
  status: noticeStatusEnum("status").default("published"),
  publishedBy: varchar("published_by").references(() => users.id),
  targetAudience: varchar("target_audience"), // all, students, faculty, department
  attachmentUrl: varchar("attachment_url"),
  publishedAt: timestamp("published_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const noticeReads = pgTable("notice_reads", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  noticeId: varchar("notice_id")
    .references(() => notices.id, { onDelete: "cascade" })
    .notNull(),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  readAt: timestamp("read_at").defaultNow(),
});

// ==================== LOST & FOUND ====================

export const lostFound = pgTable("lost_found", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  type: lostFoundStatusEnum("type").notNull(), // lost, found
  itemName: varchar("item_name").notNull(),
  description: text("description"),
  category: varchar("category"), // electronics, books, accessories, documents
  location: varchar("location"),
  dateReported: timestamp("date_reported").defaultNow(),
  imageUrl: varchar("image_url"),
  reportedBy: varchar("reported_by")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  claimedBy: varchar("claimed_by").references(() => users.id),
  status: lostFoundStatusEnum("status"),
  contactInfo: varchar("contact_info"),
});

// ==================== SUPPORT & GRIEVANCES ====================

export const grievances = pgTable("grievances", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  category: varchar("category").notNull(), // academic, administrative, hostel, harassment, other
  subject: varchar("subject").notNull(),
  description: text("description").notNull(),
  priority: grievancePriorityEnum("priority").default("medium"),
  status: grievanceStatusEnum("status").default("submitted"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  resolution: text("resolution"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  attachmentUrl: varchar("attachment_url"),
});

// Medical Records
export const medicalRecords = pgTable("medical_records", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  visitDate: timestamp("visit_date").defaultNow(),
  symptoms: text("symptoms"),
  diagnosis: text("diagnosis"),
  prescription: text("prescription"),
  doctorName: varchar("doctor_name"),
  followUpDate: date("follow_up_date"),
  remarks: text("remarks"),
});

// ==================== STUDENT DEVELOPMENT ====================

// Mentorship
export const mentorships = pgTable("mentorships", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  mentorId: varchar("mentor_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  menteeId: varchar("mentee_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  status: varchar("status").default("active"), // active, completed
  meetingSchedule: text("meeting_schedule"),
  goals: text("goals"),
});

// Research Projects
export const researchProjects = pgTable("research_projects", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  domain: varchar("domain"),
  supervisorId: varchar("supervisor_id").references(() => users.id),
  status: varchar("status").default("ongoing"), // ongoing, completed, published
  startDate: date("start_date"),
  completionDate: date("completion_date"),
  publicationUrl: varchar("publication_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const researchParticipants = pgTable("research_participants", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  projectId: varchar("project_id")
    .references(() => researchProjects.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role"), // lead, contributor
  joinedDate: timestamp("joined_date").defaultNow(),
});

// Certifications
export const certifications = pgTable("certifications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  certificationName: varchar("certification_name").notNull(),
  issuingOrganization: varchar("issuing_organization").notNull(),
  issueDate: date("issue_date"),
  expiryDate: date("expiry_date"),
  credentialId: varchar("credential_id"),
  credentialUrl: varchar("credential_url"),
  certificateUrl: varchar("certificate_url"),
  skills: text("skills"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Skill Assessments
export const skillAssessments = pgTable("skill_assessments", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  assessmentName: varchar("assessment_name").notNull(),
  description: text("description"),
  category: varchar("category"), // technical, soft_skills, language, aptitude
  totalQuestions: integer("total_questions"),
  duration: integer("duration"), // in minutes
  passingScore: integer("passing_score"),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const assessmentAttempts = pgTable("assessment_attempts", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  assessmentId: varchar("assessment_id")
    .references(() => skillAssessments.id, { onDelete: "cascade" })
    .notNull(),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  score: integer("score"),
  totalQuestions: integer("total_questions"),
  correctAnswers: integer("correct_answers"),
  passed: boolean("passed"),
  attemptDate: timestamp("attempt_date").defaultNow(),
  timeTaken: integer("time_taken"), // in minutes
});

// ==================== ACTIVITIES & PORTFOLIO ====================

export const activities = pgTable("activities", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  category: activityCategoryEnum("category").notNull(),
  organization: varchar("organization").notNull(),
  activityDate: timestamp("activity_date").notNull(),
  status: activityStatusEnum("status").default("pending").notNull(),
  verifiedBy: varchar("verified_by").references(() => users.id),
  verificationDate: timestamp("verification_date"),
  feedback: text("feedback"),
  skillCredits: integer("skill_credits").default(0),
  certificateUrl: varchar("certificate_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Goals & Achievements
export const goals = pgTable("goals", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  targetDate: date("target_date"),
  priority: goalPriorityEnum("priority").default("medium"),
  status: goalStatusEnum("status").default("active"),
  progress: integer("progress").default(0),
  category: varchar("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  studentId: varchar("student_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title").notNull(),
  description: text("description"),
  achievedDate: date("achieved_date"),
  category: varchar("category"),
  certificateUrl: varchar("certificate_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== NOTIFICATIONS ====================

export const notifications = pgTable("notifications", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: notificationTypeEnum("type").default("info"),
  link: varchar("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== ALUMNI ====================

export const alumni = pgTable("alumni", {
  id: varchar("id")
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  userId: varchar("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  graduationYear: integer("graduation_year").notNull(),
  currentCompany: varchar("current_company"),
  currentPosition: varchar("current_position"),
  location: varchar("location"),
  linkedinUrl: varchar("linkedin_url"),
  achievements: text("achievements"),
  willingToMentor: boolean("willing_to_mentor").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ==================== VALIDATION SCHEMAS ====================

// Export Zod schemas for validation
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);
export const insertEnrollmentSchema = createInsertSchema(courseEnrollments);
export const insertTimetableSchema = createInsertSchema(timetable);
export const insertGradeSchema = createInsertSchema(grades);
export const insertStudyMaterialSchema = createInsertSchema(studyMaterials);
export const insertAssignmentSchema = createInsertSchema(assignments);
export const insertAssignmentSubmissionSchema = createInsertSchema(
  assignmentSubmissions
);
export const insertExamSchema = createInsertSchema(exams);
export const insertExamResultSchema = createInsertSchema(examResults);
export const insertAttendanceSchema = createInsertSchema(attendance);
export const insertFeePaymentSchema = createInsertSchema(feePayments);
export const insertScholarshipSchema = createInsertSchema(scholarships);
export const insertScholarshipApplicationSchema = createInsertSchema(
  scholarshipApplications
);
export const insertLibraryBookSchema = createInsertSchema(libraryBooks);
export const insertLibraryIssueSchema = createInsertSchema(libraryIssues);
export const insertHostelRoomSchema = createInsertSchema(hostelRooms);
export const insertHostelAllotmentSchema = createInsertSchema(hostelAllotments);
export const insertBusRouteSchema = createInsertSchema(busRoutes);
export const insertCafeteriaMenuSchema = createInsertSchema(cafeteriaMenu);
export const insertClubSchema = createInsertSchema(clubs);
export const insertClubMembershipSchema = createInsertSchema(clubMemberships);
export const insertPlacementSchema = createInsertSchema(placements);
export const insertPlacementApplicationSchema = createInsertSchema(
  placementApplications
);
export const insertInternshipSchema = createInsertSchema(internships);
export const insertInternshipApplicationSchema = createInsertSchema(
  internshipApplications
);
export const insertEventSchema = createInsertSchema(events);
export const insertEventRSVPSchema = createInsertSchema(eventRSVP);
export const insertNoticeSchema = createInsertSchema(notices);
export const insertLostFoundSchema = createInsertSchema(lostFound);
export const insertGrievanceSchema = createInsertSchema(grievances);
export const insertMedicalRecordSchema = createInsertSchema(medicalRecords);
export const insertMentorshipSchema = createInsertSchema(mentorships);
export const insertResearchProjectSchema = createInsertSchema(researchProjects);
export const insertCertificationSchema = createInsertSchema(certifications);
export const insertSkillAssessmentSchema = createInsertSchema(skillAssessments);
export const insertAssessmentAttemptSchema =
  createInsertSchema(assessmentAttempts);
export const insertActivitySchema = createInsertSchema(activities);
export const insertGoalSchema = createInsertSchema(goals);
export const insertAchievementSchema = createInsertSchema(achievements);
export const insertNotificationSchema = createInsertSchema(notifications);
export const insertAlumniSchema = createInsertSchema(alumni);

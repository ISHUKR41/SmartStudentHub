/**
 * PDF Portfolio Generation Service
 * 
 * This service generates professional PDF portfolios for students using PDFKit.
 * The generated PDFs are suitable for job applications, higher education admissions,
 * and scholarship applications.
 * 
 * Features:
 * - Professional layout with institution branding
 * - Categorized activity sections
 * - Summary statistics and analytics
 * - Digital verification information
 * - NAAC/NIRF compliance formatting
 */

import PDFDocument from 'pdfkit';
import { PortfolioData, PortfolioSection, Activity } from '@shared/schema';

/**
 * PDF Generation Service Class
 * 
 * Handles the complete process of generating a student's portfolio PDF.
 * Uses PDFKit to create a professionally formatted document with
 * institution branding and comprehensive activity records.
 */
export class PDFPortfolioService {
  private doc: PDFKit.PDFDocument;
  private margin = 50;
  private pageWidth = 595.28; // A4 width in points
  private pageHeight = 841.89; // A4 height in points
  private contentWidth = this.pageWidth - (this.margin * 2);

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margins: {
        top: this.margin,
        bottom: this.margin,
        left: this.margin,
        right: this.margin
      }
    });
  }

  /**
   * Generate Portfolio PDF
   * 
   * Main method that orchestrates the PDF generation process.
   * Creates a complete portfolio document with all sections.
   * 
   * @param portfolioData - Complete portfolio data including student info and activities
   * @returns Buffer containing the generated PDF
   */
  async generatePortfolio(portfolioData: PortfolioData): Promise<Buffer> {
    // Add header and student information
    this.addHeader();
    this.addStudentInfo(portfolioData.student);
    
    // Add summary statistics
    this.addSummaryStats(portfolioData.stats);
    
    // Group activities by category for organized presentation
    const sections = this.groupActivitiesByCategory(portfolioData.activities);
    
    // Add each activity section
    for (const section of sections) {
      this.addActivitySection(section);
    }
    
    // Add footer with verification information
    this.addFooter(portfolioData.generatedAt);
    
    // Finalize and return PDF buffer
    this.doc.end();
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', (chunk) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
    });
  }

  /**
   * Add PDF Header
   * 
   * Creates the document header with institution branding and title.
   * Includes institution name, logo space, and document title.
   */
  private addHeader(): void {
    // Institution Header
    this.doc
      .fontSize(20)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text('HIGHER EDUCATION INSTITUTION', this.margin, this.margin, {
        align: 'center'
      });

    // Document Title
    this.doc
      .moveDown(0.5)
      .fontSize(16)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text('STUDENT DIGITAL PORTFOLIO', {
        align: 'center'
      });

    // Subtitle
    this.doc
      .moveDown(0.3)
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#718096')
      .text('Comprehensive Activity Record for Academic & Professional Development', {
        align: 'center'
      });

    // Add decorative line
    this.doc
      .strokeColor('#e2e8f0')
      .lineWidth(2)
      .moveTo(this.margin, this.doc.y + 20)
      .lineTo(this.pageWidth - this.margin, this.doc.y + 20)
      .stroke();

    this.doc.moveDown(1.5);
  }

  /**
   * Add Student Information Section
   * 
   * Displays student personal and academic details in a professional format.
   * Includes name, roll number, department, CGPA, and current semester.
   * 
   * @param student - Student information from database
   */
  private addStudentInfo(student: any): void {
    const startY = this.doc.y;

    // Section Title
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('STUDENT INFORMATION', this.margin, startY);

    this.doc.moveDown(0.5);

    // Student Details in two columns
    const leftColumn = this.margin;
    const rightColumn = this.margin + (this.contentWidth / 2);
    const currentY = this.doc.y;

    // Left Column
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text('Full Name:', leftColumn, currentY)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(`${student.firstName || ''} ${student.lastName || ''}`, leftColumn + 80, currentY);

    this.doc
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text('Roll Number:', leftColumn, currentY + 20)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(student.rollNumber || 'Not Provided', leftColumn + 80, currentY + 20);

    this.doc
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text('Department:', leftColumn, currentY + 40)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(student.department || 'Not Specified', leftColumn + 80, currentY + 40);

    // Right Column
    this.doc
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text('Current CGPA:', rightColumn, currentY)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(student.cgpa ? `${student.cgpa}/10.0` : 'Not Available', rightColumn + 80, currentY);

    this.doc
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text('Current Semester:', rightColumn, currentY + 20)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(student.currentSemester ? `Semester ${student.currentSemester}` : 'Not Specified', rightColumn + 80, currentY + 20);

    this.doc
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text('Email ID:', rightColumn, currentY + 40)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(student.email || 'Not Provided', rightColumn + 80, currentY + 40);

    this.doc.y = currentY + 70;
    this.addSectionDivider();
  }

  /**
   * Add Summary Statistics Section
   * 
   * Displays key portfolio metrics and achievements overview.
   * Provides a quick snapshot of the student's overall performance.
   * 
   * @param stats - Portfolio statistics and metrics
   */
  private addSummaryStats(stats: any): void {
    const startY = this.doc.y;

    // Section Title
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('PORTFOLIO SUMMARY', this.margin, startY);

    this.doc.moveDown(0.5);

    // Stats Grid - 3 columns
    const columnWidth = this.contentWidth / 3;
    const currentY = this.doc.y;

    // Total Activities
    this.addStatCard(
      'Total Activities',
      stats.totalActivities.toString(),
      'Verified achievements',
      this.margin,
      currentY,
      columnWidth
    );

    // Skill Credits
    this.addStatCard(
      'Skill Credits Earned',
      stats.skillCredits.toString(),
      'Academic credit points',
      this.margin + columnWidth,
      currentY,
      columnWidth
    );

    // Activity Categories
    const categoryCount = Object.keys(stats.categoryCounts).length;
    this.addStatCard(
      'Activity Categories',
      categoryCount.toString(),
      'Diverse skill areas',
      this.margin + (columnWidth * 2),
      currentY,
      columnWidth
    );

    this.doc.y = currentY + 80;
    this.addSectionDivider();
  }

  /**
   * Add Statistics Card
   * 
   * Creates a visually appealing statistics display card.
   * Used in the summary section to highlight key metrics.
   * 
   * @param title - Card title
   * @param value - Main statistic value
   * @param subtitle - Additional context
   * @param x - X position
   * @param y - Y position
   * @param width - Card width
   */
  private addStatCard(title: string, value: string, subtitle: string, x: number, y: number, width: number): void {
    // Card background
    this.doc
      .rect(x + 5, y, width - 10, 70)
      .fillAndStroke('#f7fafc', '#e2e8f0');

    // Title
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text(title, x + 15, y + 10, { width: width - 30, align: 'center' });

    // Value
    this.doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#2b6cb0')
      .text(value, x + 15, y + 25, { width: width - 30, align: 'center' });

    // Subtitle
    this.doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#718096')
      .text(subtitle, x + 15, y + 50, { width: width - 30, align: 'center' });
  }

  /**
   * Group Activities by Category
   * 
   * Organizes activities into sections by category for structured presentation.
   * Calculates totals and statistics for each category.
   * 
   * @param activities - Array of student activities
   * @returns Array of organized portfolio sections
   */
  private groupActivitiesByCategory(activities: Activity[]): PortfolioSection[] {
    const categoryMap: Record<string, Activity[]> = {};
    
    // Filter only approved activities
    const approvedActivities = activities.filter(activity => activity.status === 'approved');
    
    // Group by category
    approvedActivities.forEach(activity => {
      if (!categoryMap[activity.category]) {
        categoryMap[activity.category] = [];
      }
      categoryMap[activity.category].push(activity);
    });

    // Convert to sections with proper titles
    const categoryTitles: Record<string, string> = {
      'academic': 'Academic Achievements',
      'co-curricular': 'Co-Curricular Activities',
      'extra-curricular': 'Extra-Curricular Activities',
      'volunteering': 'Volunteering & Community Service',
      'internship': 'Internships & Industrial Training',
      'leadership': 'Leadership & Management',
      'mooc': 'Online Courses & Certifications'
    };

    return Object.entries(categoryMap).map(([category, activities]) => ({
      title: categoryTitles[category] || category.toUpperCase(),
      activities,
      totalCredits: activities.reduce((sum, activity) => sum + (activity.skillCredits || 0), 0),
      count: activities.length
    }));
  }

  /**
   * Add Activity Section
   * 
   * Creates a comprehensive section for each activity category.
   * Displays activities in a table format with all relevant details.
   * 
   * @param section - Portfolio section with categorized activities
   */
  private addActivitySection(section: PortfolioSection): void {
    if (section.activities.length === 0) return;

    // Check if we need a new page
    if (this.doc.y > this.pageHeight - 150) {
      this.doc.addPage();
    }

    const startY = this.doc.y;

    // Section Header
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text(section.title.toUpperCase(), this.margin, startY);

    // Section Statistics
    this.doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#718096')
      .text(`${section.count} activities • ${section.totalCredits} skill credits`, this.margin, startY + 18);

    this.doc.moveDown(1);

    // Table Header
    const tableY = this.doc.y;
    this.addTableHeader(tableY);
    
    let currentY = tableY + 25;

    // Add each activity
    section.activities.forEach((activity, index) => {
      // Check if we need a new page
      if (currentY > this.pageHeight - 100) {
        this.doc.addPage();
        this.addTableHeader(this.doc.y);
        currentY = this.doc.y + 25;
      }

      this.addActivityRow(activity, currentY, index % 2 === 0);
      currentY += 40;
    });

    this.doc.y = currentY + 10;
    this.addSectionDivider();
  }

  /**
   * Add Table Header
   * 
   * Creates the header row for activity tables.
   * Defines columns for activity details.
   * 
   * @param y - Y position for the header
   */
  private addTableHeader(y: number): void {
    // Header background
    this.doc
      .rect(this.margin, y, this.contentWidth, 20)
      .fillAndStroke('#4a5568', '#2d3748');

    // Header text
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('white')
      .text('Activity Title', this.margin + 5, y + 6)
      .text('Organization', this.margin + 180, y + 6)
      .text('Date', this.margin + 320, y + 6)
      .text('Credits', this.margin + 420, y + 6);
  }

  /**
   * Add Activity Row
   * 
   * Displays a single activity in table format.
   * Includes title, organization, date, and skill credits.
   * 
   * @param activity - Activity data
   * @param y - Y position
   * @param isEven - Whether this is an even row (for alternating colors)
   */
  private addActivityRow(activity: Activity, y: number, isEven: boolean): void {
    // Row background
    const bgColor = isEven ? '#f7fafc' : 'white';
    this.doc
      .rect(this.margin, y, this.contentWidth, 35)
      .fillAndStroke(bgColor, '#e2e8f0');

    // Activity details
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text(activity.title, this.margin + 5, y + 5, { width: 170, height: 15 });

    this.doc
      .font('Helvetica')
      .fillColor('#4a5568')
      .text(activity.organization, this.margin + 180, y + 5, { width: 135, height: 15 });

    const formattedDate = activity.activityDate ? 
      new Date(activity.activityDate).toLocaleDateString('en-IN') : 'Not specified';
    this.doc
      .text(formattedDate, this.margin + 320, y + 5, { width: 95, height: 15 });

    this.doc
      .font('Helvetica-Bold')
      .fillColor('#2b6cb0')
      .text((activity.skillCredits || 0).toString(), this.margin + 420, y + 5);

    // Description (if available)
    if (activity.description) {
      this.doc
        .fontSize(8)
        .font('Helvetica')
        .fillColor('#718096')
        .text(activity.description, this.margin + 5, y + 20, { 
          width: this.contentWidth - 10, 
          height: 12,
          ellipsis: true 
        });
    }
  }

  /**
   * Add Section Divider
   * 
   * Creates a visual separator between sections.
   */
  private addSectionDivider(): void {
    this.doc
      .strokeColor('#e2e8f0')
      .lineWidth(1)
      .moveTo(this.margin, this.doc.y + 10)
      .lineTo(this.pageWidth - this.margin, this.doc.y + 10)
      .stroke();
    
    this.doc.moveDown(1);
  }

  /**
   * Add Footer
   * 
   * Creates the document footer with verification information
   * and generation timestamp.
   * 
   * @param generatedAt - Timestamp when the PDF was generated
   */
  private addFooter(generatedAt: Date): void {
    // Move to footer area
    this.doc.y = this.pageHeight - 80;

    // Digital signature section
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('DIGITAL VERIFICATION', this.margin, this.doc.y);

    this.doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#718096')
      .text('This portfolio has been digitally generated and verified through the institutional student activity management system.', 
        this.margin, this.doc.y + 15, { width: this.contentWidth });

    // Generation timestamp
    const timestamp = generatedAt.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    this.doc
      .text(`Generated on: ${timestamp}`, this.margin, this.doc.y + 30);

    // Verification code (simple hash for demonstration)
    const verificationCode = `VER-${Date.now().toString(36).toUpperCase()}`;
    this.doc
      .text(`Verification Code: ${verificationCode}`, this.margin, this.doc.y + 15);
  }
}
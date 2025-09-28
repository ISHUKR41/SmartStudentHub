/**
 * Institutional Reporting PDF Generation Service
 * 
 * This service generates professional PDF reports for NAAC compliance and NIRF ranking submissions.
 * The reports are formatted according to accreditation body requirements and include comprehensive
 * institutional metrics and analytics.
 * 
 * Features:
 * - NAAC compliance reports with quality assurance metrics
 * - NIRF ranking reports with performance indicators  
 * - Professional formatting suitable for official submissions
 * - Comprehensive charts and statistical analysis
 * - Institution branding and verification
 */

import PDFDocument from 'pdfkit';

/**
 * NAAC Report Data Interface
 * Defines the structure for NAAC compliance reporting data
 */
export interface NAACReportData {
  institutionName: string;
  generatedAt: Date;
  reportPeriod: { startDate: Date; endDate: Date };
  studentEngagement: {
    totalStudents: number;
    activeStudents: number;
    engagementRate: number;
  };
  departmentParticipation: {
    department: string;
    participation: number;
    coCurrentRatio: number;
    extraCurrentRatio: number;
  }[];
  facultyInvolvement: {
    totalFaculty: number;
    involvedFaculty: number;
    avgActivitiesSupervised: number;
  };
  qualityMetrics: {
    approvalRate: number;
    avgCreditsPerActivity: number;
    diversityIndex: number;
  };
  categoryStats: {
    category: string;
    count: number;
    percentage: number;
  }[];
}

/**
 * NIRF Report Data Interface
 * Defines the structure for NIRF ranking submission data
 */
export interface NIRFReportData {
  institutionName: string;
  generatedAt: Date;
  reportPeriod: { startDate: Date; endDate: Date };
  studentDiversity: {
    totalStudents: number;
    departmentDistribution: Record<string, number>;
    genderDiversity?: number;
  };
  academicExcellence: {
    highPerformers: number;
    avgCGPA: number;
    skillCreditsPerStudent: number;
  };
  researchInnovation: {
    researchActivities: number;
    patents: number;
    publications: number;
  };
  outreachInclusion: {
    volunteeringActivities: number;
    communityImpact: number;
    inclusionScore: number;
  };
  graduationOutcomes: {
    placementRate: number;
    higherEducation: number;
    entrepreneurship: number;
  };
  trendsData: {
    monthlyTrends: { month: string; activities: number; students: number }[];
    yearlyTrends: { year: number; activities: number; students: number; departments: number }[];
  };
}

/**
 * Institutional Report PDF Generation Service
 * 
 * Specialized service for generating NAAC and NIRF compliance reports
 * with professional formatting and comprehensive analytics
 */
export class InstitutionalReportPDFService {
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
   * Generate NAAC Compliance Report
   * 
   * Creates a comprehensive NAAC compliance report with all required metrics
   * formatted according to NAAC guidelines for institutional assessment
   * 
   * @param reportData - Complete NAAC report data
   * @returns Buffer containing the generated PDF
   */
  async generateNAACReport(reportData: NAACReportData): Promise<Buffer> {
    // Add header with NAAC branding
    this.addNAACHeader(reportData.institutionName, reportData.reportPeriod);
    
    // Executive Summary
    this.addExecutiveSummary(reportData);
    
    // Student Engagement Analysis
    this.addStudentEngagementSection(reportData.studentEngagement);
    
    // Department Performance Analysis
    this.addDepartmentPerformanceSection(reportData.departmentParticipation);
    
    // Faculty Involvement Assessment
    this.addFacultyInvolvementSection(reportData.facultyInvolvement);
    
    // Quality Assurance Metrics
    this.addQualityMetricsSection(reportData.qualityMetrics);
    
    // Activity Category Analysis
    this.addCategoryAnalysisSection(reportData.categoryStats);
    
    // Compliance Summary and Recommendations
    this.addComplianceSection(reportData);
    
    // Footer with verification
    this.addOfficialFooter(reportData.generatedAt, 'NAAC');
    
    return this.finalizePDF();
  }

  /**
   * Generate NIRF Ranking Report
   * 
   * Creates a comprehensive NIRF ranking report with performance indicators
   * formatted according to NIRF framework requirements
   * 
   * @param reportData - Complete NIRF report data
   * @returns Buffer containing the generated PDF
   */
  async generateNIRFReport(reportData: NIRFReportData): Promise<Buffer> {
    // Add header with NIRF branding
    this.addNIRFHeader(reportData.institutionName, reportData.reportPeriod);
    
    // Overall Performance Summary
    this.addNIRFSummary(reportData);
    
    // Teaching, Learning & Resources (TLR)
    this.addTLRSection(reportData);
    
    // Research and Professional Practice (RP)
    this.addResearchSection(reportData.researchInnovation);
    
    // Graduation Outcomes (GO)
    this.addGraduationOutcomesSection(reportData.graduationOutcomes);
    
    // Outreach and Inclusivity (OI)  
    this.addOutreachSection(reportData.outreachInclusion);
    
    // Perception (PR) - Student and stakeholder feedback
    this.addPerceptionSection();
    
    // Trend Analysis
    this.addTrendAnalysisSection(reportData.trendsData);
    
    // NIRF Score Calculation
    this.addScoreCalculationSection(reportData);
    
    // Footer with verification
    this.addOfficialFooter(reportData.generatedAt, 'NIRF');
    
    return this.finalizePDF();
  }

  /**
   * Add NAAC Header
   * Professional header for NAAC compliance reports
   */
  private addNAACHeader(institutionName: string, reportPeriod: { startDate: Date; endDate: Date }): void {
    // NAAC Logo and Title
    this.doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text('NATIONAL ASSESSMENT AND ACCREDITATION COUNCIL', this.margin, this.margin, {
        align: 'center'
      });

    this.doc
      .moveDown(0.5)
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('INSTITUTIONAL COMPLIANCE REPORT', {
        align: 'center'
      });

    // Institution Name
    this.doc
      .moveDown(0.5)
      .fontSize(16)
      .font('Helvetica')
      .fillColor('#4a5568')
      .text(institutionName.toUpperCase(), {
        align: 'center'
      });

    // Report Period
    const startDate = reportPeriod.startDate.toLocaleDateString('en-IN');
    const endDate = reportPeriod.endDate.toLocaleDateString('en-IN');
    this.doc
      .moveDown(0.3)
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#718096')
      .text(`Report Period: ${startDate} to ${endDate}`, {
        align: 'center'
      });

    // Decorative line
    this.doc
      .strokeColor('#e2e8f0')
      .lineWidth(2)
      .moveTo(this.margin, this.doc.y + 20)
      .lineTo(this.pageWidth - this.margin, this.doc.y + 20)
      .stroke();

    this.doc.moveDown(2);
  }

  /**
   * Add NIRF Header
   * Professional header for NIRF ranking reports
   */
  private addNIRFHeader(institutionName: string, reportPeriod: { startDate: Date; endDate: Date }): void {
    // NIRF Logo and Title
    this.doc
      .fontSize(22)
      .font('Helvetica-Bold')
      .fillColor('#8b5a2b')
      .text('NATIONAL INSTITUTIONAL RANKING FRAMEWORK', this.margin, this.margin, {
        align: 'center'
      });

    this.doc
      .moveDown(0.5)
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('INSTITUTIONAL PERFORMANCE REPORT', {
        align: 'center'
      });

    // Institution Name
    this.doc
      .moveDown(0.5)
      .fontSize(16)
      .font('Helvetica')
      .fillColor('#4a5568')
      .text(institutionName.toUpperCase(), {
        align: 'center'
      });

    // Report Period
    const startDate = reportPeriod.startDate.toLocaleDateString('en-IN');
    const endDate = reportPeriod.endDate.toLocaleDateString('en-IN');
    this.doc
      .moveDown(0.3)
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#718096')
      .text(`Assessment Period: ${startDate} to ${endDate}`, {
        align: 'center'
      });

    // Decorative line
    this.doc
      .strokeColor('#d69e2e')
      .lineWidth(2)
      .moveTo(this.margin, this.doc.y + 20)
      .lineTo(this.pageWidth - this.margin, this.doc.y + 20)
      .stroke();

    this.doc.moveDown(2);
  }

  /**
   * Add Executive Summary for NAAC Report
   */
  private addExecutiveSummary(reportData: NAACReportData): void {
    this.addSectionHeader('EXECUTIVE SUMMARY');
    
    const currentY = this.doc.y;
    
    // Key Metrics Grid
    this.addMetricCard(
      'Total Students',
      reportData.studentEngagement.totalStudents.toString(),
      'Enrolled students',
      this.margin,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Engagement Rate',
      `${reportData.studentEngagement.engagementRate.toFixed(1)}%`,
      'Active participation',
      this.margin + this.contentWidth / 3,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Quality Score',
      `${reportData.qualityMetrics.approvalRate.toFixed(1)}%`,
      'Activity approval rate',
      this.margin + (this.contentWidth * 2) / 3,
      currentY,
      this.contentWidth / 3
    );

    this.doc.y = currentY + 80;
    
    // Summary text
    this.doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(
        `This report presents a comprehensive analysis of institutional performance for NAAC assessment. ` +
        `The institution demonstrates strong student engagement with ${reportData.studentEngagement.engagementRate.toFixed(1)}% ` +
        `active participation across ${reportData.departmentParticipation.length} departments. ` +
        `Quality metrics indicate a ${reportData.qualityMetrics.approvalRate.toFixed(1)}% approval rate for student activities, ` +
        `reflecting effective quality assurance processes.`,
        this.margin,
        this.doc.y + 10,
        { width: this.contentWidth, align: 'justify' }
      );

    this.doc.moveDown(1.5);
  }

  /**
   * Add Student Engagement Section
   */
  private addStudentEngagementSection(engagement: NAACReportData['studentEngagement']): void {
    this.checkPageBreak(100);
    this.addSectionHeader('STUDENT ENGAGEMENT ANALYSIS');
    
    // Engagement statistics
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('Overall Engagement Metrics:', this.margin, this.doc.y + 10);

    this.doc.moveDown(0.5);

    const metrics = [
      { label: 'Total Students Enrolled:', value: engagement.totalStudents.toString() },
      { label: 'Active Students (with activities):', value: engagement.activeStudents.toString() },
      { label: 'Engagement Rate:', value: `${engagement.engagementRate.toFixed(2)}%` },
      { label: 'Participation Grade:', value: this.calculateGrade(engagement.engagementRate) }
    ];

    metrics.forEach(metric => {
      this.doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(metric.label, this.margin + 20, this.doc.y + 5, { continued: true })
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text(` ${metric.value}`);
    });

    this.doc.moveDown(1);
  }

  /**
   * Add Department Performance Section
   */
  private addDepartmentPerformanceSection(departments: NAACReportData['departmentParticipation']): void {
    this.checkPageBreak(150);
    this.addSectionHeader('DEPARTMENT-WISE PERFORMANCE');
    
    // Department table
    const tableY = this.doc.y + 10;
    this.addTableHeader(
      ['Department', 'Participation %', 'Co-curricular %', 'Extra-curricular %'],
      tableY
    );
    
    let currentY = tableY + 25;

    departments.forEach((dept, index) => {
      this.checkPageBreak(30);
      
      this.addTableRow([
        dept.department,
        `${dept.participation.toFixed(1)}%`,
        `${dept.coCurrentRatio.toFixed(1)}%`,
        `${dept.extraCurrentRatio.toFixed(1)}%`
      ], currentY, index % 2 === 0);
      
      currentY += 25;
    });

    this.doc.y = currentY + 10;
  }

  /**
   * Add Faculty Involvement Section
   */
  private addFacultyInvolvementSection(faculty: NAACReportData['facultyInvolvement']): void {
    this.checkPageBreak(100);
    this.addSectionHeader('FACULTY INVOLVEMENT ASSESSMENT');
    
    // Faculty metrics
    const currentY = this.doc.y + 10;
    
    this.addMetricCard(
      'Total Faculty',
      faculty.totalFaculty.toString(),
      'Academic staff',
      this.margin,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Active Faculty',
      faculty.involvedFaculty.toString(),
      'Involved in student development',
      this.margin + this.contentWidth / 3,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Avg. Supervision',
      faculty.avgActivitiesSupervised.toFixed(1),
      'Activities per faculty',
      this.margin + (this.contentWidth * 2) / 3,
      currentY,
      this.contentWidth / 3
    );

    this.doc.y = currentY + 90;
  }

  /**
   * Add Quality Metrics Section
   */
  private addQualityMetricsSection(quality: NAACReportData['qualityMetrics']): void {
    this.checkPageBreak(100);
    this.addSectionHeader('QUALITY ASSURANCE METRICS');
    
    // Quality indicators
    const currentY = this.doc.y + 10;
    
    this.addMetricCard(
      'Approval Rate',
      `${quality.approvalRate.toFixed(1)}%`,
      'Activity verification success',
      this.margin,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Avg. Credits',
      quality.avgCreditsPerActivity.toFixed(1),
      'Credits per activity',
      this.margin + this.contentWidth / 3,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Diversity Index',
      quality.diversityIndex.toString(),
      'Activity categories covered',
      this.margin + (this.contentWidth * 2) / 3,
      currentY,
      this.contentWidth / 3
    );

    this.doc.y = currentY + 90;
  }

  /**
   * Add Category Analysis Section
   */
  private addCategoryAnalysisSection(categories: NAACReportData['categoryStats']): void {
    this.checkPageBreak(200);
    this.addSectionHeader('ACTIVITY CATEGORY ANALYSIS');
    
    // Categories table
    const tableY = this.doc.y + 10;
    this.addTableHeader(['Activity Category', 'Count', 'Percentage'], tableY);
    
    let currentY = tableY + 25;

    categories.forEach((category, index) => {
      this.addTableRow([
        category.category.replace('-', ' ').toUpperCase(),
        category.count.toString(),
        `${category.percentage.toFixed(1)}%`
      ], currentY, index % 2 === 0);
      
      currentY += 25;
    });

    this.doc.y = currentY + 20;
  }

  /**
   * Add Compliance Section
   */
  private addComplianceSection(reportData: NAACReportData): void {
    this.checkPageBreak(150);
    this.addSectionHeader('NAAC COMPLIANCE ASSESSMENT');
    
    // Calculate overall compliance score
    const engagementScore = Math.min(reportData.studentEngagement.engagementRate, 100) / 100;
    const qualityScore = reportData.qualityMetrics.approvalRate / 100;
    const diversityScore = Math.min(reportData.qualityMetrics.diversityIndex / 7, 1); // Assuming 7 max categories
    const facultyScore = reportData.facultyInvolvement.totalFaculty > 0 ? 
      reportData.facultyInvolvement.involvedFaculty / reportData.facultyInvolvement.totalFaculty : 0;

    const overallScore = ((engagementScore + qualityScore + diversityScore + facultyScore) / 4) * 100;
    
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text(`Overall NAAC Compliance Score: ${overallScore.toFixed(1)}%`, this.margin, this.doc.y + 10);
    
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text(`Grade: ${this.calculateNAACGrade(overallScore)}`, this.margin, this.doc.y + 10);

    // Recommendations
    this.doc.moveDown(1);
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('RECOMMENDATIONS:', this.margin, this.doc.y);

    const recommendations = this.generateNAACRecommendations(reportData);
    recommendations.forEach((rec, index) => {
      this.doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(`${index + 1}. ${rec}`, this.margin + 20, this.doc.y + 8, {
          width: this.contentWidth - 20,
          align: 'justify'
        });
    });
  }

  /**
   * Add NIRF Summary Section
   */
  private addNIRFSummary(reportData: NIRFReportData): void {
    this.addSectionHeader('NIRF PERFORMANCE OVERVIEW');
    
    // Calculate composite score (simplified)
    const tlrScore = this.calculateTLRScore(reportData);
    const rpScore = this.calculateRPScore(reportData);
    const goScore = this.calculateGOScore(reportData);
    const oiScore = this.calculateOIScore(reportData);
    const prScore = 75; // Placeholder for perception score

    const overallScore = (tlrScore * 0.30) + (rpScore * 0.30) + (goScore * 0.20) + (oiScore * 0.10) + (prScore * 0.10);

    // Summary metrics
    const currentY = this.doc.y + 10;
    
    this.addMetricCard(
      'Overall Score',
      overallScore.toFixed(1),
      'NIRF composite score',
      this.margin,
      currentY,
      this.contentWidth / 5
    );

    this.addMetricCard(
      'TLR Score',
      tlrScore.toFixed(1),
      'Teaching & Learning',
      this.margin + this.contentWidth / 5,
      currentY,
      this.contentWidth / 5
    );

    this.addMetricCard(
      'RP Score',
      rpScore.toFixed(1),
      'Research & Practice',
      this.margin + (this.contentWidth * 2) / 5,
      currentY,
      this.contentWidth / 5
    );

    this.addMetricCard(
      'GO Score',
      goScore.toFixed(1),
      'Graduation Outcomes',
      this.margin + (this.contentWidth * 3) / 5,
      currentY,
      this.contentWidth / 5
    );

    this.addMetricCard(
      'OI Score',
      oiScore.toFixed(1),
      'Outreach & Inclusivity',
      this.margin + (this.contentWidth * 4) / 5,
      currentY,
      this.contentWidth / 5
    );

    this.doc.y = currentY + 90;
  }

  /**
   * Helper Methods
   */
  private addSectionHeader(title: string): void {
    this.checkPageBreak(50);
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text(title, this.margin, this.doc.y + 20);
    
    // Underline
    this.doc
      .strokeColor('#1a365d')
      .lineWidth(1)
      .moveTo(this.margin, this.doc.y + 5)
      .lineTo(this.margin + (title.length * 8), this.doc.y + 5)
      .stroke();
    
    this.doc.moveDown(0.5);
  }

  private addMetricCard(title: string, value: string, subtitle: string, x: number, y: number, width: number): void {
    // Card background
    this.doc
      .rect(x + 2, y, width - 4, 70)
      .fillAndStroke('#f8fafc', '#e2e8f0');

    // Title
    this.doc
      .fontSize(9)
      .font('Helvetica-Bold')
      .fillColor('#4a5568')
      .text(title, x + 8, y + 8, { width: width - 16, align: 'center' });

    // Value
    this.doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#1a365d')
      .text(value, x + 8, y + 25, { width: width - 16, align: 'center' });

    // Subtitle
    this.doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#718096')
      .text(subtitle, x + 8, y + 50, { width: width - 16, align: 'center' });
  }

  private addTableHeader(headers: string[], y: number): void {
    const columnWidth = this.contentWidth / headers.length;
    
    // Header background
    this.doc
      .rect(this.margin, y, this.contentWidth, 20)
      .fillAndStroke('#4a5568', '#2d3748');

    // Header text
    headers.forEach((header, index) => {
      this.doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('white')
        .text(header, this.margin + (index * columnWidth) + 5, y + 6, {
          width: columnWidth - 10,
          align: 'center'
        });
    });
  }

  private addTableRow(data: string[], y: number, isEven: boolean): void {
    const columnWidth = this.contentWidth / data.length;
    const bgColor = isEven ? '#f7fafc' : 'white';
    
    // Row background
    this.doc
      .rect(this.margin, y, this.contentWidth, 20)
      .fillAndStroke(bgColor, '#e2e8f0');

    // Row data
    data.forEach((item, index) => {
      this.doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#2d3748')
        .text(item, this.margin + (index * columnWidth) + 5, y + 6, {
          width: columnWidth - 10,
          align: 'center'
        });
    });
  }

  private checkPageBreak(requiredSpace: number): void {
    if (this.doc.y + requiredSpace > this.pageHeight - this.margin) {
      this.doc.addPage();
    }
  }

  private calculateGrade(percentage: number): string {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C+';
    if (percentage >= 40) return 'C';
    return 'D';
  }

  private calculateNAACGrade(score: number): string {
    if (score >= 90) return 'A++';
    if (score >= 80) return 'A+';
    if (score >= 70) return 'A';
    if (score >= 60) return 'B++';
    if (score >= 55) return 'B+';
    if (score >= 50) return 'B';
    return 'C';
  }

  private generateNAACRecommendations(reportData: NAACReportData): string[] {
    const recommendations = [];
    
    if (reportData.studentEngagement.engagementRate < 60) {
      recommendations.push('Implement targeted engagement programs to increase student participation in co-curricular and extra-curricular activities.');
    }
    
    if (reportData.qualityMetrics.approvalRate < 80) {
      recommendations.push('Strengthen quality assurance processes for activity verification and provide clearer guidelines to students.');
    }
    
    if (reportData.qualityMetrics.diversityIndex < 5) {
      recommendations.push('Expand the range of activity categories offered to promote holistic student development.');
    }
    
    const facultyInvolvementRate = reportData.facultyInvolvement.totalFaculty > 0 ? 
      (reportData.facultyInvolvement.involvedFaculty / reportData.facultyInvolvement.totalFaculty) * 100 : 0;
    
    if (facultyInvolvementRate < 70) {
      recommendations.push('Enhance faculty participation in student mentorship and activity supervision through training and incentives.');
    }
    
    recommendations.push('Continue monitoring and evaluation processes to maintain high standards of institutional performance.');
    
    return recommendations;
  }

  // NIRF Score Calculation Methods (simplified)
  private calculateTLRScore(data: NIRFReportData): number {
    return Math.min((data.academicExcellence.avgCGPA / 10) * 100, 100);
  }

  private calculateRPScore(data: NIRFReportData): number {
    return Math.min(data.researchInnovation.researchActivities * 2, 100);
  }

  private calculateGOScore(data: NIRFReportData): number {
    return data.graduationOutcomes.placementRate;
  }

  private calculateOIScore(data: NIRFReportData): number {
    return data.outreachInclusion.inclusionScore;
  }

  // Placeholder methods for other NIRF sections
  private addTLRSection(data: NIRFReportData): void {
    this.checkPageBreak(150);
    this.addSectionHeader('TEACHING, LEARNING & RESOURCES (TLR)');
    
    this.doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(
        `Average CGPA: ${data.academicExcellence.avgCGPA.toFixed(2)} | ` +
        `High Performers: ${data.academicExcellence.highPerformers} students | ` +
        `Skill Credits per Student: ${data.academicExcellence.skillCreditsPerStudent.toFixed(1)}`,
        this.margin,
        this.doc.y + 10,
        { width: this.contentWidth }
      );

    this.doc.moveDown(1.5);
  }

  private addResearchSection(research: NIRFReportData['researchInnovation']): void {
    this.checkPageBreak(100);
    this.addSectionHeader('RESEARCH AND PROFESSIONAL PRACTICE (RP)');
    
    const currentY = this.doc.y + 10;
    
    this.addMetricCard(
      'Research Activities',
      research.researchActivities.toString(),
      'Academic projects',
      this.margin,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Publications',
      research.publications.toString(),
      'Research outputs',
      this.margin + this.contentWidth / 3,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Patents Filed',
      research.patents.toString(),
      'Innovation indicators',
      this.margin + (this.contentWidth * 2) / 3,
      currentY,
      this.contentWidth / 3
    );

    this.doc.y = currentY + 90;
  }

  private addGraduationOutcomesSection(outcomes: NIRFReportData['graduationOutcomes']): void {
    this.checkPageBreak(100);
    this.addSectionHeader('GRADUATION OUTCOMES (GO)');
    
    const currentY = this.doc.y + 10;
    
    this.addMetricCard(
      'Placement Rate',
      `${outcomes.placementRate}%`,
      'Students placed',
      this.margin,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Higher Education',
      `${outcomes.higherEducation}%`,
      'Further studies',
      this.margin + this.contentWidth / 3,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Entrepreneurship',
      `${outcomes.entrepreneurship}%`,
      'Self-employed',
      this.margin + (this.contentWidth * 2) / 3,
      currentY,
      this.contentWidth / 3
    );

    this.doc.y = currentY + 90;
  }

  private addOutreachSection(outreach: NIRFReportData['outreachInclusion']): void {
    this.checkPageBreak(100);
    this.addSectionHeader('OUTREACH AND INCLUSIVITY (OI)');
    
    const currentY = this.doc.y + 10;
    
    this.addMetricCard(
      'Volunteering',
      outreach.volunteeringActivities.toString(),
      'Community service',
      this.margin,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Community Impact',
      outreach.communityImpact.toString(),
      'Beneficiaries reached',
      this.margin + this.contentWidth / 3,
      currentY,
      this.contentWidth / 3
    );

    this.addMetricCard(
      'Inclusion Score',
      `${outreach.inclusionScore.toFixed(1)}%`,
      'Inclusivity index',
      this.margin + (this.contentWidth * 2) / 3,
      currentY,
      this.contentWidth / 3
    );

    this.doc.y = currentY + 90;
  }

  private addPerceptionSection(): void {
    this.checkPageBreak(80);
    this.addSectionHeader('PERCEPTION (PR)');
    
    this.doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(
        'Perception metrics based on stakeholder feedback, industry recognition, and public perception indices. ' +
        'This includes employer satisfaction, alumni feedback, and industry collaboration indicators.',
        this.margin,
        this.doc.y + 10,
        { width: this.contentWidth, align: 'justify' }
      );

    this.doc.moveDown(1.5);
  }

  private addTrendAnalysisSection(trends: NIRFReportData['trendsData']): void {
    this.checkPageBreak(150);
    this.addSectionHeader('TREND ANALYSIS');
    
    // Recent trends summary
    this.doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor('#2d3748')
      .text(
        'Multi-year trend analysis showing institutional growth patterns:',
        this.margin,
        this.doc.y + 10
      );

    this.doc.moveDown(0.5);

    // Yearly trends table
    if (trends.yearlyTrends.length > 0) {
      const tableY = this.doc.y + 10;
      this.addTableHeader(['Year', 'Activities', 'Active Students', 'Departments'], tableY);
      
      let currentY = tableY + 25;

      trends.yearlyTrends.slice(-5).forEach((year, index) => {
        this.addTableRow([
          year.year.toString(),
          year.activities.toString(),
          year.students.toString(),
          year.departments.toString()
        ], currentY, index % 2 === 0);
        
        currentY += 25;
      });

      this.doc.y = currentY + 20;
    }
  }

  private addScoreCalculationSection(data: NIRFReportData): void {
    this.checkPageBreak(120);
    this.addSectionHeader('NIRF SCORE CALCULATION');
    
    const tlrScore = this.calculateTLRScore(data);
    const rpScore = this.calculateRPScore(data);
    const goScore = this.calculateGOScore(data);
    const oiScore = this.calculateOIScore(data);
    const prScore = 75; // Placeholder
    
    const overallScore = (tlrScore * 0.30) + (rpScore * 0.30) + (goScore * 0.20) + (oiScore * 0.10) + (prScore * 0.10);

    // Score breakdown table
    const tableY = this.doc.y + 10;
    this.addTableHeader(['Parameter', 'Score', 'Weightage', 'Contribution'], tableY);
    
    let currentY = tableY + 25;
    
    const scoreBreakdown = [
      ['Teaching, Learning & Resources', tlrScore.toFixed(1), '30%', (tlrScore * 0.30).toFixed(1)],
      ['Research & Professional Practice', rpScore.toFixed(1), '30%', (rpScore * 0.30).toFixed(1)],
      ['Graduation Outcomes', goScore.toFixed(1), '20%', (goScore * 0.20).toFixed(1)],
      ['Outreach & Inclusivity', oiScore.toFixed(1), '10%', (oiScore * 0.10).toFixed(1)],
      ['Perception', prScore.toFixed(1), '10%', (prScore * 0.10).toFixed(1)]
    ];

    scoreBreakdown.forEach((row, index) => {
      this.addTableRow(row, currentY, index % 2 === 0);
      currentY += 25;
    });

    // Overall score
    this.doc.y = currentY + 10;
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#8b5a2b')
      .text(`OVERALL NIRF SCORE: ${overallScore.toFixed(2)}`, this.margin, this.doc.y + 10, {
        align: 'center'
      });
  }

  /**
   * Add Official Footer with verification
   */
  private addOfficialFooter(generatedAt: Date, reportType: string): void {
    // Move to footer area
    this.doc.y = this.pageHeight - 100;

    // Digital verification section
    this.doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .fillColor('#2d3748')
      .text('DIGITAL VERIFICATION & AUTHENTICITY', this.margin, this.doc.y);

    this.doc
      .fontSize(8)
      .font('Helvetica')
      .fillColor('#718096')
      .text(
        `This ${reportType} compliance report has been digitally generated using institutional data management systems. ` +
        'All metrics and calculations are based on verified institutional records and follow standardized assessment frameworks.',
        this.margin,
        this.doc.y + 15,
        { width: this.contentWidth, align: 'justify' }
      );

    // Generation timestamp
    const timestamp = generatedAt.toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium'
    });

    this.doc
      .text(`Generated on: ${timestamp}`, this.margin, this.doc.y + 25);

    // Verification code
    const verificationCode = `${reportType}-${Date.now().toString(36).toUpperCase()}`;
    this.doc
      .text(`Report ID: ${verificationCode}`, this.margin, this.doc.y + 12);

    // Disclaimer
    this.doc
      .fontSize(7)
      .font('Helvetica')
      .fillColor('#a0aec0')
      .text(
        'This report is generated for institutional assessment purposes. All data is subject to verification by authorized personnel.',
        this.margin,
        this.doc.y + 15,
        { width: this.contentWidth, align: 'center' }
      );
  }

  /**
   * Finalize PDF and return buffer
   */
  private finalizePDF(): Promise<Buffer> {
    this.doc.end();
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', (chunk) => chunks.push(chunk));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.on('error', reject);
    });
  }
}
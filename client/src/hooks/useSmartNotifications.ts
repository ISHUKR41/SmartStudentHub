/**
 * Smart Notifications Hook for Student Activity Management
 * 
 * This hook provides intelligent notification management for the Smart Student Hub
 * platform, offering contextual notifications for academic milestones, deadlines,
 * faculty approvals, and system updates.
 * 
 * Features:
 * - Institutional-grade notification styling and positioning
 * - Context-aware notifications for academic activities
 * - Faculty approval status updates with professional messaging
 * - Deadline reminders with urgency-based styling
 * - Achievement celebrations with institutional branding
 * - Progress milestone notifications for student motivation
 * - NAAC compliance notifications for institutional requirements
 * 
 * Notification Types:
 * - Success: Activity approvals, achievements, milestones
 * - Warning: Approaching deadlines, pending submissions
 * - Error: Rejections, system issues, validation errors
 * - Info: General updates, reminders, system announcements
 * - Custom: Institutional-specific notifications with branding
 * 
 * Professional Implementation:
 * - Consistent with Higher Education Institution communication standards
 * - Accessible notification design following WCAG guidelines
 * - Professional language appropriate for academic environments
 * - Integration with institutional branding and color schemes
 */

import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { CheckCircle, AlertTriangle, XCircle, Info, Trophy, Clock, Target, GraduationCap, Award } from 'lucide-react';
import { createElement } from 'react';

/**
 * Smart Notifications Hook
 * 
 * Provides professional notification management for institutional student activity tracking.
 * Includes contextual notifications for academic progress, faculty interactions, and system updates.
 */
export function useSmartNotifications() {
  
  /**
   * Activity Approval Notification
   * 
   * Professional notification for faculty-approved student activities.
   * Includes activity details and skill credit information.
   */
  const notifyActivityApproved = (activityTitle: string, skillCredits: number = 0) => {
    toast.success(
      `Activity Approved: ${activityTitle}`,
      {
        icon: createElement(CheckCircle, { className: "w-5 h-5" }),
        duration: 6000,
        style: {
          background: 'hsl(var(--success-50))',
          color: 'hsl(var(--success-foreground))',
          border: '1px solid hsl(var(--success-200))',
          fontWeight: '500'
        }
      }
    );
    
    // Follow-up notification for skill credits if awarded
    if (skillCredits > 0) {
      setTimeout(() => {
        toast(
          `+${skillCredits} skill credits earned`,
          {
            icon: createElement(Trophy, { className: "w-4 h-4 text-amber-500" }),
            duration: 4000,
            style: {
              background: 'hsl(var(--warning-50))',
              color: 'hsl(var(--warning-foreground))',
              border: '1px solid hsl(var(--warning-200))',
              fontSize: '0.8125rem'
            }
          }
        );
      }, 1500);
    }
  };

  /**
   * Activity Rejection Notification
   * 
   * Professional notification for rejected activities with guidance for resubmission.
   */
  const notifyActivityRejected = (activityTitle: string, feedback?: string) => {
    toast.error(
      `Activity Requires Revision: ${activityTitle}`,
      {
        icon: createElement(XCircle, { className: "w-5 h-5" }),
        duration: 8000,
        style: {
          background: 'hsl(var(--destructive) / 0.05)',
          color: 'hsl(var(--destructive))',
          border: '1px solid hsl(var(--destructive) / 0.2)',
          fontWeight: '500'
        }
      }
    );
    
    // Show feedback if available
    if (feedback) {
      setTimeout(() => {
        toast(
          `Faculty Feedback: ${feedback}`,
          {
            icon: createElement(Info, { className: "w-4 h-4" }),
            duration: 10000,
            style: {
              background: 'hsl(var(--info-50))',
              color: 'hsl(var(--info-foreground))',
              border: '1px solid hsl(var(--info-200))',
              fontSize: '0.8125rem'
            }
          }
        );
      }, 2000);
    }
  };

  /**
   * Deadline Reminder Notification
   * 
   * Context-aware deadline reminders with urgency-based styling.
   */
  const notifyDeadlineReminder = (taskTitle: string, deadline: Date, isUrgent: boolean = false) => {
    const formattedDate = format(deadline, 'MMM dd, yyyy');
    const daysUntil = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    toast(
      `${isUrgent ? 'Urgent: ' : ''}${taskTitle} due ${formattedDate}`,
      {
        icon: isUrgent ? createElement(AlertTriangle, { className: "w-5 h-5" }) : createElement(Clock, { className: "w-5 h-5" }),
        duration: isUrgent ? 10000 : 6000,
        style: {
          background: isUrgent ? 'hsl(var(--destructive) / 0.05)' : 'hsl(var(--warning-50))',
          color: isUrgent ? 'hsl(var(--destructive))' : 'hsl(var(--warning-foreground))',
          border: isUrgent ? '1px solid hsl(var(--destructive) / 0.2)' : '1px solid hsl(var(--warning-200))',
          fontWeight: '500'
        }
      }
    );
    
    // Additional context for very urgent deadlines
    if (isUrgent && daysUntil <= 1) {
      setTimeout(() => {
        toast(
          daysUntil === 0 ? 'Due today!' : `Only ${daysUntil} day remaining`,
          {
            icon: createElement(Target, { className: "w-4 h-4" }),
            duration: 8000,
            style: {
              background: 'hsl(var(--destructive))',
              color: 'hsl(var(--destructive-foreground))',
              fontWeight: '600',
              fontSize: '0.8125rem'
            }
          }
        );
      }, 1500);
    }
  };

  /**
   * Achievement Unlocked Notification
   * 
   * Celebratory notification for academic achievements and milestones.
   */
  const notifyAchievementUnlocked = (achievementTitle: string, points: number = 0) => {
    toast.success(
      `Achievement Unlocked: ${achievementTitle}`,
      {
        icon: createElement(Trophy, { className: "w-5 h-5" }),
        duration: 8000,
        style: {
          background: 'linear-gradient(135deg, hsl(var(--success-50)), hsl(var(--warning-50)))',
          color: 'hsl(var(--success-foreground))',
          border: '1px solid hsl(var(--success-200))',
          fontWeight: '600',
          fontSize: '0.9375rem'
        }
      }
    );
    
    // Show points if awarded
    if (points > 0) {
      setTimeout(() => {
        toast(
          `+${points} achievement points earned`,
          {
            icon: createElement(Award, { className: "w-4 h-4 text-purple-500" }),
            duration: 5000,
            style: {
              background: 'hsl(var(--primary) / 0.05)',
              color: 'hsl(var(--primary))',
              border: '1px solid hsl(var(--primary) / 0.2)',
              fontSize: '0.8125rem'
            }
          }
        );
      }, 2000);
    }
  };

  /**
   * Portfolio Milestone Notification
   * 
   * Progress tracking notification for portfolio completion milestones.
   */
  const notifyPortfolioMilestone = (completionPercentage: number) => {
    const milestones = [25, 50, 75, 100];
    const reachedMilestone = milestones.find(m => m === completionPercentage);
    
    if (reachedMilestone) {
      toast(
        `Portfolio ${completionPercentage}% Complete!`,
        {
          icon: reachedMilestone === 100 ? <GraduationCap className="w-5 h-5" /> : <Target className="w-5 h-5" />,
          duration: 7000,
          style: {
            background: reachedMilestone === 100 
              ? 'linear-gradient(135deg, hsl(var(--success-50)), hsl(var(--primary-50)))' 
              : 'hsl(var(--info-50))',
            color: reachedMilestone === 100 ? 'hsl(var(--success-foreground))' : 'hsl(var(--info-foreground))',
            border: reachedMilestone === 100 
              ? '1px solid hsl(var(--success-200))' 
              : '1px solid hsl(var(--info-200))',
            fontWeight: '600'
          }
        }
      );
      
      // Celebration message for completion
      if (reachedMilestone === 100) {
        setTimeout(() => {
          toast(
            'Ready for faculty review and academic portfolio generation',
            {
              icon: <CheckCircle className="w-4 h-4" />,
              duration: 6000,
              style: {
                background: 'hsl(var(--success))',
                color: 'hsl(var(--success-foreground))',
                fontWeight: '500',
                fontSize: '0.8125rem'
              }
            }
          );
        }, 2500);
      }
    }
  };

  /**
   * Faculty Review Status Notification
   * 
   * Real-time notification for faculty review status updates.
   */
  const notifyFacultyReviewStatus = (status: 'submitted' | 'under_review' | 'approved' | 'rejected', activityTitle: string) => {
    const statusMessages = {
      submitted: 'Submitted for faculty review',
      under_review: 'Currently under faculty review',
      approved: 'Approved by faculty',
      rejected: 'Returned for revision'
    };
    
    const statusStyles = {
      submitted: { bg: 'hsl(var(--info-50))', color: 'hsl(var(--info-foreground))', border: 'hsl(var(--info-200))' },
      under_review: { bg: 'hsl(var(--warning-50))', color: 'hsl(var(--warning-foreground))', border: 'hsl(var(--warning-200))' },
      approved: { bg: 'hsl(var(--success-50))', color: 'hsl(var(--success-foreground))', border: 'hsl(var(--success-200))' },
      rejected: { bg: 'hsl(var(--destructive) / 0.05)', color: 'hsl(var(--destructive))', border: 'hsl(var(--destructive) / 0.2)' }
    };
    
    const currentStyle = statusStyles[status];
    
    toast(
      `${activityTitle}: ${statusMessages[status]}`,
      {
        icon: status === 'approved' ? <CheckCircle className="w-5 h-5" /> : 
              status === 'rejected' ? <XCircle className="w-5 h-5" /> :
              status === 'under_review' ? <Clock className="w-5 h-5" /> :
              <Info className="w-5 h-5" />,
        duration: status === 'approved' || status === 'rejected' ? 8000 : 5000,
        style: {
          background: currentStyle.bg,
          color: currentStyle.color,
          border: `1px solid ${currentStyle.border}`,
          fontWeight: '500'
        }
      }
    );
  };

  /**
   * System Maintenance Notification
   * 
   * Institutional notification for planned maintenance or system updates.
   */
  const notifySystemMaintenance = (message: string, scheduledTime?: Date) => {
    const timeInfo = scheduledTime ? ` scheduled for ${format(scheduledTime, 'MMM dd, yyyy h:mm a')}` : '';
    
    toast(
      `System Notice: ${message}${timeInfo}`,
      {
        icon: <Info className="w-5 h-5" />,
        duration: 10000,
        style: {
          background: 'hsl(var(--muted))',
          color: 'hsl(var(--muted-foreground))',
          border: '1px solid hsl(var(--border))',
          fontWeight: '500'
        }
      }
    );
  };

  /**
   * NAAC Compliance Notification
   * 
   * Institutional notification for NAAC compliance requirements and deadlines.
   */
  const notifyNAACCompliance = (requirement: string, dueDate: Date) => {
    toast(
      `NAAC Requirement: ${requirement}`,
      {
        icon: <GraduationCap className="w-5 h-5" />,
        duration: 12000,
        style: {
          background: 'hsl(var(--primary) / 0.05)',
          color: 'hsl(var(--primary))',
          border: '1px solid hsl(var(--primary) / 0.2)',
          fontWeight: '600'
        }
      }
    );
  };

  return {
    notifyActivityApproved,
    notifyActivityRejected,
    notifyDeadlineReminder,
    notifyAchievementUnlocked,
    notifyPortfolioMilestone,
    notifyFacultyReviewStatus,
    notifySystemMaintenance,
    notifyNAACCompliance
  };
}
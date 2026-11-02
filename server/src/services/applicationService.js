import mongoose from "mongoose";
import { Application } from "../models/Application.js";
import { Job } from "../models/Job.js";
import { StudentProfile } from "../models/StudentProfile.js";
import {
  APPLICATION_STATUS,
  ALLOWED_STATUS_TRANSITIONS,
  normalizeStatus,
} from "../constants/applicationStatuses.js";
import { evaluateEligibility } from "./jobService.js";

function formatDate(value) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
}

/**
 * Maps database enum status to frontend UI stage tab
 */
function mapStatusToStage(status) {
  switch (status) {
    case APPLICATION_STATUS.APPLIED:
      return "Applied";
    case APPLICATION_STATUS.SCREENING:
      return "Screening";
    case APPLICATION_STATUS.SHORTLISTED:
      return "Shortlisted";
    case APPLICATION_STATUS.INTERVIEW:
      return "Interview";
    case APPLICATION_STATUS.OFFERED:
      return "Offer";
    case APPLICATION_STATUS.REJECTED:
    case APPLICATION_STATUS.WITHDRAWN:
      return "Closed";
    default:
      return "Applied";
  }
}

/**
 * Maps database enum status to Recruiter Candidate pipeline stage
 */
function mapStatusToRecruiterStage(status) {
  if (status === APPLICATION_STATUS.REJECTED || status === APPLICATION_STATUS.WITHDRAWN) {
    return "Declined";
  }
  return mapStatusToStage(status);
}

export const applicationService = {
  /**
   * Submit an application for an open job
   */
  async createApplication(studentUserId, { jobId, notes = "" }) {
    if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
      const error = new Error("Valid job ID is required");
      error.statusCode = 400;
      throw error;
    }

    // 1. Fetch Job
    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    if (job.status !== "OPEN") {
      const error = new Error("This recruitment drive is not currently accepting applications");
      error.statusCode = 400;
      throw error;
    }

    if (new Date(job.deadline).getTime() < Date.now()) {
      const error = new Error("The application deadline for this position has passed");
      error.statusCode = 400;
      throw error;
    }

    // 2. Fetch Student Profile
    const profile = await StudentProfile.findOne({ userId: studentUserId });
    if (!profile) {
      const error = new Error(
        "Student academic profile is required before submitting applications. Please complete your profile."
      );
      error.statusCode = 400;
      throw error;
    }

    // 3. Deterministic Eligibility Check (Server-Side)
    const eligibility = evaluateEligibility(job, profile);
    if (!eligibility.isEligible) {
      const error = new Error(
        `Ineligible for this drive: ${eligibility.reasons.join(". ")}`
      );
      error.statusCode = 422;
      error.details = eligibility.reasons;
      throw error;
    }

    // 4. Duplicate Check
    const existing = await Application.findOne({
      jobId: job._id,
      studentId: studentUserId,
    });
    if (existing) {
      const error = new Error("You have already applied for this opportunity.");
      error.statusCode = 409;
      error.code = "DUPLICATE_APPLICATION";
      throw error;
    }

    // 5. Create Application
    const now = new Date();
    const application = await Application.create({
      jobId: job._id,
      studentId: studentUserId,
      studentProfileId: profile._id,
      status: APPLICATION_STATUS.APPLIED,
      statusHistory: [
        {
          status: APPLICATION_STATUS.APPLIED,
          changedAt: now,
          changedBy: studentUserId,
          note: notes || "Application submitted with active profile.",
        },
      ],
      appliedAt: now,
      notes,
      eligibilitySnapshot: {
        branch: profile.branch,
        cgpa: profile.cgpa,
        backlogs: profile.backlogs,
        graduationYear: profile.graduationYear,
      },
    });

    return application;
  },

  /**
   * Get all applications for the authenticated student
   */
  async getStudentApplications(studentUserId) {
    const applications = await Application.find({ studentId: studentUserId })
      .populate({
        path: "jobId",
        populate: { path: "companyId", select: "name location industry" },
      })
      .sort({ createdAt: -1 });

    return applications.map((app) => {
      const job = app.jobId || {};
      const company = job.companyId || {};
      const stage = mapStatusToStage(app.status);

      let nextAction = "Await the next placement update.";
      if (stage === "Offer") nextAction = "Review and accept your formal campus offer.";
      else if (stage === "Interview") nextAction = "Review technical requirements and interview schedule.";
      else if (stage === "Closed") nextAction = "This application is closed.";

      const timeline = (app.statusHistory || []).map((h) => ({
        step: mapStatusToStage(h.status),
        date: formatDate(h.changedAt),
        state: h.status === app.status ? "current" : "completed",
        description: h.note || `Stage updated to ${h.status}.`,
      }));

      if (timeline.length === 0) {
        timeline.push({
          step: "Applied",
          date: formatDate(app.appliedAt || app.createdAt),
          state: "completed",
          description: "Application submitted.",
        });
      }

      return {
        id: app._id.toString(),
        _id: app._id.toString(),
        jobId: job._id ? job._id.toString() : "",
        role: job.title || "Position closed",
        company: company.name || "Company pending",
        location: job.location || "",
        stipend: job.stipend || "",
        ctc: job.ctc || "",
        stage,
        status: app.status,
        appliedOn: formatDate(app.appliedAt || app.createdAt),
        nextAction,
        timeline,
        resumeVersion: app.resumeVersion || null,
        eligibilitySnapshot: app.eligibilitySnapshot?.cgpa == null ? null : app.eligibilitySnapshot,
      };
    });
  },

  /**
   * Get candidate applications across all jobs for the authenticated recruiter
   */
  async getRecruiterApplications(recruiterUserId) {
    // 1. Find all jobs owned by recruiter
    const jobs = await Job.find({ recruiterId: recruiterUserId }).select(
      "_id title location domain status deadline"
    );
    const jobIds = jobs.map((j) => j._id);

    // 2. Find applications for these jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("studentId", "name email")
      .populate("studentProfileId", "branch cgpa backlogs skills rollNumber")
      .populate("jobId", "title location stipend")
      .sort({ createdAt: -1 });

    const candidates = applications.map((app) => {
      const student = app.studentId || {};
      const profile = app.studentProfileId || {};
      const job = app.jobId || {};
      const stage = mapStatusToRecruiterStage(app.status);

      const timeline = (app.statusHistory || []).map((h) => ({
        stage: mapStatusToRecruiterStage(h.status),
        date: formatDate(h.changedAt),
        note: h.note || `Status changed to ${h.status}`,
      }));

      return {
        id: app._id.toString(),
        applicationId: app._id.toString(),
        jobId: job._id ? job._id.toString() : "",
        name: student.name || "Student",
        email: student.email || "",
        role: job.title || "Job position",
        cgpa: profile.cgpa ?? "—",
        backlogs: app.eligibilitySnapshot?.backlogs ?? profile.backlogs,
        branch: profile.branch || "",
        skills: profile.skills || [],
        stage,
        status: app.status,
        appliedDate: formatDate(app.appliedAt || app.createdAt),
        eligibility: { status: "Eligible" },
        timeline: timeline.length > 0 ? timeline : [
          { stage: "Applied", date: formatDate(app.createdAt), note: "Application submitted" }
        ],
      };
    });

    const mappedJobs = jobs.map((j) => ({
      id: j._id.toString(),
      _id: j._id.toString(),
      title: j.title,
      name: j.title,
      domain: j.domain,
      location: j.location,
      status: j.status,
    }));

    return {
      jobs: mappedJobs,
      candidates,
    };
  },

  /**
   * Get applications for a single job with recruiter ownership verification
   */
  async getJobApplications(jobId, recruiterUserId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      const error = new Error("Invalid job ID format");
      error.statusCode = 400;
      throw error;
    }

    const job = await Job.findById(jobId);
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }

    if (job.recruiterId.toString() !== recruiterUserId.toString()) {
      const error = new Error("Forbidden: You cannot view applicants for another recruiter's job");
      error.statusCode = 403;
      throw error;
    }

    const applications = await Application.find({ jobId: job._id })
      .populate("studentId", "name email")
      .populate("studentProfileId", "branch cgpa backlogs skills rollNumber")
      .sort({ createdAt: -1 });

    return applications;
  },

  /**
   * Update application status with status transition validation and recruiter ownership check
   */
  async updateApplicationStatus(applicationId, recruiterUserId, newStatusRaw, note = "") {
    if (!mongoose.Types.ObjectId.isValid(applicationId)) {
      const error = new Error("Invalid application ID format");
      error.statusCode = 400;
      throw error;
    }

    const application = await Application.findById(applicationId).populate("jobId");
    if (!application) {
      const error = new Error("Application not found");
      error.statusCode = 404;
      throw error;
    }

    const job = application.jobId;
    if (!job) {
      const error = new Error("Associated job record not found");
      error.statusCode = 404;
      throw error;
    }

    // Ownership check: Recruiter must own the job
    if (job.recruiterId.toString() !== recruiterUserId.toString()) {
      const error = new Error("Forbidden: You cannot modify applications for another recruiter's job");
      error.statusCode = 403;
      throw error;
    }

    const newStatus = normalizeStatus(newStatusRaw);
    if (!newStatus) {
      const error = new Error(`Invalid status: "${newStatusRaw}". Must be one of: ${Object.values(APPLICATION_STATUS).join(", ")}`);
      error.statusCode = 400;
      throw error;
    }

    const currentStatus = application.status;

    // Check if status is already at the target
    if (currentStatus === newStatus) {
      return application;
    }

    // Validate Transition
    const allowed = ALLOWED_STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      const error = new Error(
        `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed transitions: ${allowed.join(", ") || "None (Terminal status)"}`
      );
      error.statusCode = 400;
      throw error;
    }

    // Apply update
    const now = new Date();
    application.status = newStatus;
    application.statusHistory.push({
      status: newStatus,
      changedAt: now,
      changedBy: recruiterUserId,
      note: note || `Candidate moved to ${newStatus}`,
    });

    await application.save();
    return application;
  },
};

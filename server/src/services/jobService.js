import mongoose from "mongoose";
import { Job } from "../models/Job.js";
import { Company } from "../models/Company.js";
import { StudentProfile } from "../models/StudentProfile.js";
import { Application } from "../models/Application.js";

/**
 * Deterministically checks student eligibility against job requirements
 * @param {Object} job
 * @param {Object} profile
 * @returns {{ isEligible: boolean, reasons: string[], status: "Eligible" | "Not Eligible" }}
 */
export function evaluateEligibility(job, profile) {
  if (!profile) {
    return {
      isEligible: false,
      reasons: ["Complete your student profile to verify eligibility."],
      status: "Not Eligible",
    };
  }

  const reasons = [];
  const criteria = job.eligibility || {};

  // 1. Min CGPA
  if (typeof criteria.minCgpa === "number" && criteria.minCgpa > 0) {
    if ((profile.cgpa ?? 0) < criteria.minCgpa) {
      reasons.push(
        `CGPA ${profile.cgpa} is below minimum requirement of ${criteria.minCgpa}`
      );
    }
  }

  // 2. Max Active Backlogs
  if (typeof criteria.maxBacklogs === "number") {
    if ((profile.backlogs ?? 0) > criteria.maxBacklogs) {
      reasons.push(
        `Active backlogs (${profile.backlogs}) exceeds maximum allowed of ${criteria.maxBacklogs}`
      );
    }
  }

  // 3. Allowed Branches
  if (Array.isArray(criteria.allowedBranches) && criteria.allowedBranches.length > 0) {
    const studentBranch = (profile.branch || "").trim().toLowerCase();
    const branchMatched = criteria.allowedBranches.some((b) =>
      studentBranch.includes(b.trim().toLowerCase()) ||
      b.trim().toLowerCase().includes(studentBranch)
    );
    if (!branchMatched) {
      reasons.push(
        `Branch "${profile.branch}" is not among eligible branches (${criteria.allowedBranches.join(", ")})`
      );
    }
  }

  // 4. Graduation Years
  if (Array.isArray(criteria.graduationYears) && criteria.graduationYears.length > 0) {
    if (!criteria.graduationYears.includes(profile.graduationYear)) {
      reasons.push(
        `Graduation year ${profile.graduationYear} is not eligible (${criteria.graduationYears.join(", ")})`
      );
    }
  }

  const isEligible = reasons.length === 0;
  return {
    isEligible,
    reasons,
    status: isEligible ? "Eligible" : "Not Eligible",
  };
}

/**
 * Helper to calculate days until deadline
 */
function daysUntil(deadline) {
  if (!deadline) return 999;
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return 999;
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

/**
 * Format date for display in UI
 */
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
 * Resolves or auto-provisions a company for a recruiter
 */
export async function resolveRecruiterCompany(recruiterId, explicitCompanyId = null) {
  if (explicitCompanyId && mongoose.Types.ObjectId.isValid(explicitCompanyId)) {
    const comp = await Company.findById(explicitCompanyId);
    if (comp) return comp;
  }

  // Look for any existing company created by or associated with this recruiter
  let comp = await Company.findOne({ createdBy: recruiterId });
  if (!comp) {
    // Look for default Acme Technologies or create one
    comp = await Company.findOne({ name: "Acme Technologies" });
    if (!comp) {
      comp = await Company.create({
        name: "Acme Technologies",
        industry: "Enterprise Software & Cloud Platforms",
        location: "Mumbai",
        website: "https://acme-technologies.demo",
        description: "Campus placement drive partner.",
        status: "APPROVED",
        createdBy: recruiterId,
      });
    }
  }
  return comp;
}

export const jobService = {
  /**
   * Get all open jobs for student view, enriched with eligibility & application state
   */
  async getJobsForStudent(studentUserId) {
    const studentProfile = await StudentProfile.findOne({ userId: studentUserId });
    const userApplications = await Application.find({ studentId: studentUserId }).select("jobId");
    const appliedJobIds = new Set(userApplications.map((a) => a.jobId.toString()));

    const jobs = await Job.find({ status: "OPEN" })
      .populate("companyId", "name location industry website")
      .sort({ createdAt: -1 });

    // Aggregate application counts for each job
    const jobIds = jobs.map((j) => j._id);
    const appCounts = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      { $group: { _id: "$jobId", count: { $sum: 1 } } },
    ]);
    const appCountMap = new Map(appCounts.map((c) => [c._id.toString(), c.count]));

    return jobs.map((job) => {
      const company = job.companyId || {};
      const companyName = company.name || "Company pending";
      const eligibilityResult = evaluateEligibility(job, studentProfile);
      const applied = appliedJobIds.has(job._id.toString());
      const daysLeft = daysUntil(job.deadline);

      // Simple match score based on skills alignment
      const studentSkills = (studentProfile?.skills || []).map((s) => s.toLowerCase());
      const jobSkills = (job.requiredSkills || []).map((s) => s.toLowerCase());
      const matchedSkills = jobSkills.filter((s) =>
        studentSkills.some((ss) => ss.includes(s) || s.includes(ss))
      );
      const profileMatch =
        jobSkills.length > 0
          ? Math.round((matchedSkills.length / jobSkills.length) * 100)
          : 85;

      return {
        id: job._id.toString(),
        _id: job._id.toString(),
        title: job.title,
        role: job.title,
        company: companyName,
        companyInitials: companyName
          .split(" ")
          .map((w) => w[0])
          .join("")
          .slice(0, 2),
        location: job.location,
        workMode: job.workMode,
        employmentType: job.employmentType,
        domain: job.domain,
        roleCategory: job.domain,
        ctc: job.ctc,
        stipend: job.stipend,
        duration: job.duration,
        deadline: formatDate(job.deadline),
        deadlineValue: job.deadline,
        daysLeft,
        description: job.description,
        responsibilities: job.responsibilities || [],
        requiredSkills: job.requiredSkills || [],
        preferredSkills: job.preferredSkills || [],
        selectionRounds: job.selectionRounds || [],
        eligibility: eligibilityResult.status,
        isEligible: eligibilityResult.isEligible,
        eligibilityReasons: eligibilityResult.reasons,
        eligibilityCriteria: {
          minCgpa: job.eligibility?.minCgpa ?? "Open",
          maxBacklogs: job.eligibility?.maxBacklogs ?? 0,
          eligibleBatches:
            job.eligibility?.graduationYears?.length > 0
              ? job.eligibility.graduationYears.map(String)
              : ["Current batch"],
          eligibleBranches:
            job.eligibility?.allowedBranches?.length > 0
              ? job.eligibility.allowedBranches
              : ["All Branches"],
        },
        profileMatch,
        isRecommended: profileMatch >= 75 && eligibilityResult.isEligible,
        applied,
        applicantsCount: appCountMap.get(job._id.toString()) || 0,
        status: job.status,
      };
    });
  },

  /**
   * Get jobs created by the authenticated recruiter
   */
  async getJobsForRecruiter(recruiterUserId) {
    const jobs = await Job.find({ recruiterId: recruiterUserId })
      .populate("companyId", "name location industry website")
      .sort({ createdAt: -1 });

    const jobIds = jobs.map((j) => j._id);
    const applications = await Application.find({ jobId: { $in: jobIds } }).select("jobId status");

    return jobs.map((job) => {
      const company = job.companyId || {};
      const companyName = company.name || "Company pending";
      const jobApps = applications.filter((a) => a.jobId.toString() === job._id.toString());
      const shortlistedCount = jobApps.filter((a) => a.status === "SHORTLISTED").length;
      const interviewsCount = jobApps.filter((a) => a.status === "INTERVIEW").length;
      const offersCount = jobApps.filter((a) => a.status === "OFFERED").length;

      return {
        id: job._id.toString(),
        _id: job._id.toString(),
        title: job.title,
        role: job.title,
        company: companyName,
        companyId: company._id ? company._id.toString() : "",
        recruiterId: job.recruiterId.toString(),
        location: job.location,
        workMode: job.workMode,
        employmentType: job.employmentType,
        domain: job.domain,
        ctc: job.ctc,
        stipend: job.stipend,
        duration: job.duration,
        deadline: formatDate(job.deadline),
        deadlineValue: job.deadline,
        requiredSkills: job.requiredSkills || [],
        preferredSkills: job.preferredSkills || [],
        selectionRounds: job.selectionRounds || [],
        eligibility: `CGPA >= ${job.eligibility?.minCgpa || 0}, max ${job.eligibility?.maxBacklogs || 0} backlogs`,
        eligibilityCriteria: job.eligibility,
        description: job.description,
        status: job.status,
        applicantsCount: jobApps.length,
        shortlistedCount,
        interviewsCount,
        offersCount,
      };
    });
  },

  /**
   * Get single job by ID
   */
  async getJobById(jobId) {
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      const error = new Error("Invalid job ID format");
      error.statusCode = 400;
      throw error;
    }
    const job = await Job.findById(jobId).populate("companyId", "name location industry website");
    if (!job) {
      const error = new Error("Job not found");
      error.statusCode = 404;
      throw error;
    }
    return job;
  },

  /**
   * Create a new job as a recruiter
   */
  async createJob(recruiterUserId, data) {
    const title = data.title || data.role;
    if (!title || !title.trim()) {
      const error = new Error("Job title/role is required");
      error.statusCode = 400;
      throw error;
    }

    const company = await resolveRecruiterCompany(recruiterUserId, data.companyId);

    // Parse skills if string
    let requiredSkills = data.requiredSkills || [];
    if (typeof requiredSkills === "string") {
      requiredSkills = requiredSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    let preferredSkills = data.preferredSkills || [];
    if (typeof preferredSkills === "string") {
      preferredSkills = preferredSkills.split(",").map((s) => s.trim()).filter(Boolean);
    }
    let selectionRounds = data.selectionRounds || [];
    if (typeof selectionRounds === "string") {
      selectionRounds = selectionRounds.split(",").map((s) => s.trim()).filter(Boolean);
    }

    // Parse eligibility criteria
    const eligibility = {
      minCgpa: Number(data.eligibility?.minCgpa ?? (data.minCgpa || 7.0)),
      allowedBranches: Array.isArray(data.eligibility?.allowedBranches)
        ? data.eligibility.allowedBranches
        : ["Computer Engineering", "Information Technology", "AI & Data Science"],
      maxBacklogs: Number(data.eligibility?.maxBacklogs ?? (data.maxBacklogs || 0)),
      graduationYears: Array.isArray(data.eligibility?.graduationYears)
        ? data.eligibility.graduationYears
        : [2026, 2027, 2028],
    };

    // Parse deadline
    let deadline = data.deadline ? new Date(data.deadline) : new Date(Date.now() + 30 * 86400000);
    if (Number.isNaN(deadline.getTime())) {
      deadline = new Date(Date.now() + 30 * 86400000);
    }

    // Normalize workMode
    let workMode = "HYBRID";
    if (data.workMode) {
      const raw = data.workMode.toUpperCase();
      if (raw.includes("REMOTE")) workMode = "REMOTE";
      else if (raw.includes("ONSITE") || raw.includes("CAMPUS")) workMode = "ONSITE";
      else workMode = "HYBRID";
    }

    const job = await Job.create({
      title: title.trim(),
      description: data.description || `Campus recruitment drive for ${title.trim()}.`,
      companyId: company._id,
      recruiterId: recruiterUserId,
      location: data.location || "Mumbai",
      workMode,
      employmentType: data.employmentType || "Full-time",
      domain: data.domain || "Software Engineering",
      ctc: data.ctc || "18.5 LPA CTC",
      stipend: data.stipend || "₹45,000 / month",
      duration: data.duration || "6 Months",
      deadline,
      eligibility,
      requiredSkills,
      preferredSkills,
      selectionRounds,
      status: data.status === "DRAFT" || data.status === "Draft" ? "DRAFT" : "OPEN",
    });

    return job;
  },

  /**
   * Update an existing job (recruiter ownership enforced)
   */
  async updateJob(jobId, recruiterUserId, data) {
    const job = await this.getJobById(jobId);
    if (job.recruiterId.toString() !== recruiterUserId.toString()) {
      const error = new Error("Forbidden: You cannot modify jobs belonging to another recruiter");
      error.statusCode = 403;
      throw error;
    }

    const title = data.title || data.role;
    if (title) job.title = title.trim();
    if (data.description) job.description = data.description;
    if (data.location) job.location = data.location;
    if (data.ctc) job.ctc = data.ctc;
    if (data.stipend) job.stipend = data.stipend;
    if (data.domain) job.domain = data.domain;
    if (data.duration) job.duration = data.duration;
    if (data.status) {
      const s = data.status.toUpperCase();
      if (["DRAFT", "OPEN", "CLOSED"].includes(s)) job.status = s;
    }
    if (data.deadline) {
      const d = new Date(data.deadline);
      if (!Number.isNaN(d.getTime())) job.deadline = d;
    }
    if (data.requiredSkills) {
      job.requiredSkills = typeof data.requiredSkills === "string"
        ? data.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean)
        : data.requiredSkills;
    }
    if (data.selectionRounds) {
      job.selectionRounds = typeof data.selectionRounds === "string"
        ? data.selectionRounds.split(",").map((s) => s.trim()).filter(Boolean)
        : data.selectionRounds;
    }

    await job.save();
    return job;
  },

  /**
   * Update job status (OPEN, CLOSED, DRAFT)
   */
  async updateJobStatus(jobId, recruiterUserId, status) {
    const job = await this.getJobById(jobId);
    if (job.recruiterId.toString() !== recruiterUserId.toString()) {
      const error = new Error("Forbidden: You cannot update status of another recruiter's job");
      error.statusCode = 403;
      throw error;
    }
    const clean = (status || "").toUpperCase();
    if (!["OPEN", "CLOSED", "DRAFT"].includes(clean)) {
      const error = new Error("Invalid status. Must be OPEN, CLOSED, or DRAFT");
      error.statusCode = 400;
      throw error;
    }
    job.status = clean;
    await job.save();
    return job;
  },
};

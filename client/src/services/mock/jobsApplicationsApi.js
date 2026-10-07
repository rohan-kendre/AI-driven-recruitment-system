import { recordsApi } from "./recordsApi.js";
import { usersApi } from "./usersApi.js";

// Temporary identity bridge until real authentication supplies a user id.
const TEMP_RECRUITER_NAME = "Vikram Malhotra";
const JOB_DETAILS_PREFIX = "NEXHIRE_JOB_DETAILS:";

const formatDate = (value) => {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const daysUntil = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 999;
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / 86400000));
};

const parseJobDetails = (description = "") => {
  if (!description.startsWith(JOB_DETAILS_PREFIX)) return { description };
  try {
    return JSON.parse(description.slice(JOB_DETAILS_PREFIX.length));
  } catch {
    return { description: "Campus recruitment opportunity." };
  }
};

const serializeJobDetails = (details) => `${JOB_DETAILS_PREFIX}${JSON.stringify(details)}`;

const stageForStatus = (status) => {
  if (status === "Rejected" || status === "Withdrawn") return "Closed";
  return status || "Applied";
};

async function getAll(type) {
  return recordsApi.getRecordsByType(type);
}

export async function resolveStudent(currentUser) {
  const users = await usersApi.getUsers({ page: 1, limit: 100 });
  const user = users.find((candidate) => candidate.role === "STUDENT" && candidate.name === currentUser?.name);
  if (!user) throw new Error("The current student demo account could not be found in MockAPI.");

  const students = await getAll("student");
  const student = students.find((candidate) => candidate.userId === user.id);
  if (!student) throw new Error("The current student profile could not be found in MockAPI.");
  return student;
}

export async function resolveRecruiter() {
  const users = await usersApi.getUsers({ page: 1, limit: 100 });
  const user = users.find((candidate) => candidate.role === "RECRUITER" && candidate.name === TEMP_RECRUITER_NAME);
  if (!user) throw new Error("The temporary recruiter account could not be found in MockAPI.");

  const [recruiters, companies] = await Promise.all([getAll("recruiter"), getAll("company")]);
  const recruiter = recruiters.find((candidate) => candidate.userId === user.id);
  const company = companies.find((candidate) => candidate.recruiterId === recruiter?.id);
  if (!recruiter || !company) throw new Error("The temporary recruiter company context is incomplete in MockAPI.");
  return { recruiter, company };
}

function mapJob(record, companies, applications, studentId) {
  const details = parseJobDetails(record.description);
  const company = companies.find((candidate) => candidate.id === record.companyId);
  const role = record.title || record.name || "Untitled opportunity";
  const applied = Boolean(studentId && applications.some((application) => application.studentId === studentId && application.jobId === record.id));
  const deadlineDays = daysUntil(record.deadline);
  const requiredSkills = details.requiredSkills?.length ? details.requiredSkills : [];

  return {
    ...record,
    role,
    company: company?.name || "Company pending",
    companyInitials: (company?.name || "CP").split(" ").map((word) => word[0]).join("").slice(0, 2),
    domain: details.domain || "Campus recruitment",
    roleCategory: details.domain || "Software Engineering",
    requiredSkills,
    preferredSkills: details.preferredSkills || [],
    eligibility: "Needs Review",
    eligibilityCriteria: details.eligibilityCriteria || { minCgpa: "To be confirmed", maxBacklogs: "To be confirmed", eligibleBatches: ["Current batch"], eligibleBranches: ["As per placement cell" ] },
    selectionRounds: details.selectionRounds || ["Details to be announced"],
    responsibilities: details.responsibilities || ["Review the role description and placement-drive details."],
    description: details.description || record.description || "Campus recruitment opportunity.",
    duration: details.duration || "As per company policy",
    deadline: formatDate(record.deadline),
    deadlineValue: record.deadline,
    daysLeft: deadlineDays,
    profileMatch: 0,
    isRecommended: false,
    applied,
    applicantsCount: applications.filter((application) => application.jobId === record.id).length,
    shortlistedCount: applications.filter((application) => application.jobId === record.id && application.status === "Shortlisted").length,
    interviewsCount: applications.filter((application) => application.jobId === record.id && application.status === "Interview").length,
    offersCount: applications.filter((application) => application.jobId === record.id && application.status === "Offer").length,
  };
}

function mapStudentApplication(application, jobs, companies, student) {
  const job = jobs.find((candidate) => candidate.id === application.jobId);
  const company = companies.find((candidate) => candidate.id === (job?.companyId || application.companyId));
  const stage = stageForStatus(application.status);
  return {
    ...application,
    role: job?.title || job?.name || application.title || "Job no longer available",
    company: company?.name || "Company pending",
    location: job?.location || "Location to be confirmed",
    stipend: job?.stipend || "Compensation to be confirmed",
    stage,
    appliedOn: formatDate(application.createdAt),
    nextAction: stage === "Closed" ? "This application is closed." : stage === "Offer" ? "Review your offer details." : "Await the next placement update.",
    timeline: [{ step: "Application submitted", date: formatDate(application.createdAt), state: "completed", description: "Your application was recorded." }, { step: stage, date: formatDate(application.updatedAt || application.createdAt), state: "current", description: "Current application status." }],
    resumeVersion: "Active resume",
    eligibilitySnapshot: { cgpa: student.cgpa ?? "Not available", backlogs: "Not available" },
  };
}

function mapRecruiterCandidate(application, jobs, students) {
  const job = jobs.find((candidate) => candidate.id === application.jobId);
  const student = students.find((candidate) => candidate.id === application.studentId);
  const stage = application.status === "Rejected" || application.status === "Withdrawn" ? "Declined" : stageForStatus(application.status);
  return {
    id: application.id,
    applicationId: application.id,
    jobId: application.jobId,
    name: student?.name || "Student profile unavailable",
    role: job?.title || job?.name || application.title || "Job no longer available",
    cgpa: student?.cgpa ?? "—",
    branch: student?.branch || "Not available",
    skills: [],
    stage,
    appliedDate: formatDate(application.createdAt),
    profileAlignment: 0,
    eligibility: { status: "Needs Review" },
    resume: "Resume available in the full backend workflow",
    timeline: [{ stage: "Applied", date: formatDate(application.createdAt), note: "Student application submitted." }, ...(stage !== "Applied" ? [{ stage, date: formatDate(application.updatedAt || application.createdAt), note: "Current application status." }] : [])],
  };
}

export const jobsApplicationsApi = {
  async getStudentJobs(currentUser) {
    const [student, jobs, companies, applications] = await Promise.all([resolveStudent(currentUser), getAll("job"), getAll("company"), getAll("application")]);
    return jobs.filter((job) => job.status !== "Draft" && job.status !== "Closed").map((job) => mapJob(job, companies, applications, student.id));
  },

  async createStudentApplication(currentUser, jobId) {
    const student = await resolveStudent(currentUser);
    const applications = await getAll("application");
    if (applications.some((application) => application.studentId === student.id && application.jobId === jobId)) {
      const error = new Error("You have already applied for this opportunity.");
      error.code = "DUPLICATE_APPLICATION";
      throw error;
    }
    const now = new Date().toISOString();
    return recordsApi.createRecord({ type: "application", studentId: student.id, jobId, status: "Applied", createdAt: now, updatedAt: now });
  },

  async getStudentApplications(currentUser) {
    const [student, applications, jobs, companies] = await Promise.all([resolveStudent(currentUser), getAll("application"), getAll("job"), getAll("company")]);
    return applications.filter((application) => application.studentId === student.id).map((application) => mapStudentApplication(application, jobs, companies, student));
  },

  async getRecruiterJobs() {
    const [{ recruiter }, jobs, companies, applications] = await Promise.all([resolveRecruiter(), getAll("job"), getAll("company"), getAll("application")]);
    return jobs.filter((job) => job.recruiterId === recruiter.id).map((job) => mapJob(job, companies, applications));
  },

  async createRecruiterJob(formData) {
    const { recruiter, company } = await resolveRecruiter();
    const now = new Date().toISOString();
    const requiredSkills = formData.requiredSkills.split(",").map((item) => item.trim()).filter(Boolean);
    const selectionRounds = formData.selectionRounds.split(",").map((item) => item.trim()).filter(Boolean);
    return recordsApi.createRecord({
      type: "job", name: formData.role, title: formData.role, companyId: company.id, recruiterId: recruiter.id,
      location: formData.location, workMode: formData.workMode, ctc: formData.ctc, stipend: formData.stipend,
      deadline: new Date(formData.deadline).toISOString(), status: formData.status, createdAt: now, updatedAt: now,
      description: serializeJobDetails({ description: `Campus recruitment intake for ${formData.role} within ${formData.domain}.`, domain: formData.domain, requiredSkills, selectionRounds, eligibility: formData.eligibility, eligibilityCriteria: { minCgpa: formData.eligibility, maxBacklogs: "As stated above", eligibleBatches: ["Current batch"], eligibleBranches: ["As stated above"] } }),
    });
  },

  async updateRecruiterJob(job, formData) {
    const current = await recordsApi.getRecordById(job.id);
    const requiredSkills = formData.requiredSkills.split(",").map((item) => item.trim()).filter(Boolean);
    const selectionRounds = formData.selectionRounds.split(",").map((item) => item.trim()).filter(Boolean);
    return recordsApi.updateRecord(job.id, {
      ...current, name: formData.role, title: formData.role, location: formData.location, workMode: formData.workMode,
      ctc: formData.ctc, stipend: formData.stipend, deadline: new Date(formData.deadline).toISOString(), status: formData.status,
      updatedAt: new Date().toISOString(),
      description: serializeJobDetails({ description: `Campus recruitment intake for ${formData.role} within ${formData.domain}.`, domain: formData.domain, requiredSkills, selectionRounds, eligibility: formData.eligibility, eligibilityCriteria: { minCgpa: formData.eligibility, maxBacklogs: "As stated above", eligibleBatches: ["Current batch"], eligibleBranches: ["As stated above"] } }),
    });
  },

  async getRecruiterCandidates() {
    const [{ recruiter }, jobs, applications, students] = await Promise.all([resolveRecruiter(), getAll("job"), getAll("application"), getAll("student")]);
    const recruiterJobs = jobs.filter((job) => job.recruiterId === recruiter.id);
    const jobIds = new Set(recruiterJobs.map((job) => job.id));
    return { jobs: recruiterJobs, candidates: applications.filter((application) => jobIds.has(application.jobId)).map((application) => mapRecruiterCandidate(application, recruiterJobs, students)) };
  },

  async updateRecruiterApplicationStatus(applicationId, status) {
    const current = await recordsApi.getRecordById(applicationId);
    return recordsApi.updateRecord(applicationId, { ...current, status, updatedAt: new Date().toISOString() });
  },

  async createDashboardJob(title, domain) {
    return this.createRecruiterJob({ role: title, domain, location: "To be confirmed", workMode: "To be confirmed", stipend: "To be confirmed", ctc: "To be confirmed", deadline: new Date().toISOString().slice(0, 10), requiredSkills: "", eligibility: "To be confirmed", selectionRounds: "To be confirmed", status: "Draft" });
  },
};


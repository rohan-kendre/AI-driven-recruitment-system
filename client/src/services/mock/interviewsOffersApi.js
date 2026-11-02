import { recordsApi } from "./recordsApi.js";
import { resolveRecruiter, resolveStudent } from "./jobsApplicationsApi.js";

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date to be confirmed" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
};

const formatTime = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Time to be confirmed" : new Intl.DateTimeFormat("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).format(date);
};

const dateParts = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return { day: "—", month: "TBD" };
  return {
    day: new Intl.DateTimeFormat("en-IN", { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat("en-IN", { month: "short" }).format(date).toUpperCase(),
  };
};

const statusForInterviewUi = (status) => status === "Completed" ? "Completed" : "Upcoming";
const statusForStudentOfferUi = (status) => status === "Pending" || status === "Awaiting response" || status === "Sent" ? "Pending review" : status;
const statusForRecruiterOfferUi = (status) => status === "Pending" ? "Awaiting response" : status;

const parseDateTime = (date, time) => {
  const parsed = new Date(`${date} ${time || "10:00 AM"}`);
  if (Number.isNaN(parsed.getTime())) throw new Error("Enter a valid interview date and time.");
  return parsed.toISOString();
};

async function getAll(type) {
  return recordsApi.getRecordsByType(type);
}

async function getRelatedRecords() {
  const [applications, jobs, companies, students] = await Promise.all([getAll("application"), getAll("job"), getAll("company"), getAll("student")]);
  return { applications, jobs, companies, students };
}

function mapInterview(interview, related) {
  const application = related.applications.find((item) => item.id === interview.applicationId);
  const job = related.jobs.find((item) => item.id === interview.jobId) || related.jobs.find((item) => item.id === application?.jobId);
  const company = related.companies.find((item) => item.id === interview.companyId) || related.companies.find((item) => item.id === job?.companyId);
  const student = related.students.find((item) => item.id === interview.studentId) || related.students.find((item) => item.id === application?.studentId);
  const parts = dateParts(interview.date);
  const uiStatus = statusForInterviewUi(interview.status);
  const date = formatDate(interview.date);
  const time = formatTime(interview.date);

  return {
    ...interview,
    applicationId: interview.applicationId,
    candidateName: student?.name || "Student profile unavailable",
    company: company?.name || "Company pending",
    role: job?.title || job?.name || interview.title || "Role pending",
    round: interview.title || "Interview round",
    date,
    time,
    ...parts,
    mode: interview.workMode || "To be confirmed",
    status: uiStatus,
    rawStatus: interview.status,
    duration: "To be confirmed",
    platform: interview.workMode === "Virtual" ? "Meeting link" : "Placement interview",
    locationDetails: interview.location || "Location to be confirmed",
    panel: "Recruiter panel",
    notes: interview.description || "Interview details will be shared by the recruiter.",
    isNext: uiStatus === "Upcoming",
    timeline: [
      { step: "Application submitted", stage: "Applied", date: formatDate(application?.createdAt), state: "completed", note: "Application recorded." },
      { step: interview.title || "Interview", stage: "Interview", date, state: uiStatus === "Completed" ? "completed" : "current", note: uiStatus === "Completed" ? "Interview completed." : "Interview scheduled." },
    ],
  };
}

function mapOffer(offer, related, recruiterView = false) {
  const application = related.applications.find((item) => item.id === offer.applicationId);
  const job = related.jobs.find((item) => item.id === offer.jobId) || related.jobs.find((item) => item.id === application?.jobId);
  const company = related.companies.find((item) => item.id === offer.companyId) || related.companies.find((item) => item.id === job?.companyId);
  const student = related.students.find((item) => item.id === offer.studentId) || related.students.find((item) => item.id === application?.studentId);
  const role = job?.title || job?.name || offer.title || "Role pending";
  const rawStatus = offer.status || "Pending";
  const status = recruiterView ? statusForRecruiterOfferUi(rawStatus) : statusForStudentOfferUi(rawStatus);
  const joiningDate = offer.date ? formatDate(offer.date) : "To be confirmed";
  const decisionDeadline = offer.deadline ? formatDate(offer.deadline) : "To be confirmed";
  const companyName = company?.name || "Company pending";

  const common = {
    ...offer,
    candidateName: student?.name || "Student profile unavailable",
    company: companyName,
    role,
    status,
    rawStatus,
    stipend: offer.stipend || "To be confirmed",
    ctc: offer.ctc || "To be confirmed",
    joiningDate,
    decisionDeadline,
    issuedDate: formatDate(offer.createdAt),
    location: job?.location || company?.location || "To be confirmed",
    workMode: job?.workMode || "To be confirmed",
    department: "Campus recruitment",
    notes: offer.description || "Formal placement offer issued through NexHire.",
    compensationBreakdown: [
      { label: "Internship Stipend", value: offer.stipend || "To be confirmed", note: "As recorded in the placement offer" },
      { label: "Full-Time CTC", value: offer.ctc || "To be confirmed", note: "Subject to the offer terms" },
    ],
  };

  if (recruiterView) return common;
  return {
    ...common,
    monthlyCompensation: common.stipend,
    offerDate: common.issuedDate,
    duration: "As per offer terms",
    isPrimary: rawStatus === "Pending" || rawStatus === "Awaiting response" || rawStatus === "Sent",
    benefits: ["Refer to the formal offer terms for benefits and provisions."],
    interviewConnection: { summary: "Placement interview process", completedDate: "As recorded", roundNotes: "Interview information is available in your interview workspace." },
    documentPreview: {
      refNumber: `NEX-${offer.id}`,
      issueDate: common.issuedDate,
      candidateName: common.candidateName,
      candidateRoll: "Available in student profile",
      degree: "Campus placement candidate",
      institution: "NexHire placement platform",
      signatory: companyName,
      signatoryRole: "Campus recruitment team",
      paragraphs: [`${companyName} has issued this placement offer for the ${role} role.`, `Please record your decision on or before ${decisionDeadline}.`],
    },
  };
}

export const interviewsOffersApi = {
  async getStudentInterviews(currentUser) {
    const [student, interviews, related] = await Promise.all([resolveStudent(currentUser), getAll("interview"), getRelatedRecords()]);
    const mapped = interviews.filter((item) => item.studentId === student.id).map((item) => mapInterview(item, related)).sort((a, b) => new Date(a.date) - new Date(b.date));
    const firstUpcoming = mapped.find((item) => item.status === "Upcoming");
    return mapped.map((item) => ({ ...item, isNext: item.id === firstUpcoming?.id }));
  },

  async getRecruiterInterviews() {
    const [{ recruiter }, interviews, related] = await Promise.all([resolveRecruiter(), getAll("interview"), getRelatedRecords()]);
    const jobIds = new Set(related.jobs.filter((job) => job.recruiterId === recruiter.id).map((job) => job.id));
    return interviews.filter((item) => jobIds.has(item.jobId)).map((item) => mapInterview(item, related)).sort((a, b) => new Date(a.date) - new Date(b.date));
  },

  async getRecruiterOfferApplications() {
    const [{ recruiter }, related] = await Promise.all([resolveRecruiter(), getRelatedRecords()]);
    const jobIds = new Set(related.jobs.filter((job) => job.recruiterId === recruiter.id).map((job) => job.id));
    return related.applications.filter((application) => jobIds.has(application.jobId)).map((application) => {
      const job = related.jobs.find((item) => item.id === application.jobId);
      const student = related.students.find((item) => item.id === application.studentId);
      return { id: application.id, applicationId: application.id, studentId: application.studentId, jobId: application.jobId, companyId: job?.companyId || application.companyId, candidateName: student?.name || "Student profile unavailable", role: job?.title || job?.name || application.title || "Role pending" };
    });
  },

  async createInterview({ applicationId, title, date, time, location, workMode }) {
    const [{ recruiter }, related, interviews] = await Promise.all([resolveRecruiter(), getRelatedRecords(), getAll("interview")]);
    const application = related.applications.find((item) => item.id === applicationId);
    const job = related.jobs.find((item) => item.id === application?.jobId);
    const student = related.students.find((item) => item.id === application?.studentId);
    if (!application || !job || !student || job.recruiterId !== recruiter.id) throw new Error("Choose a valid application from your recruitment drives.");
    if (interviews.some((item) => item.applicationId === applicationId && item.title === title && item.status !== "Completed" && item.status !== "Cancelled")) throw new Error("An active interview for this application and round already exists.");
    const now = new Date().toISOString();
    return recordsApi.createRecord({ type: "interview", applicationId, studentId: student.id, jobId: job.id, companyId: job.companyId, title, date: parseDateTime(date, time), location, workMode, status: "Scheduled", createdAt: now, updatedAt: now });
  },

  async rescheduleInterview(interviewId, { date, time, location, workMode }) {
    const current = await recordsApi.getRecordById(interviewId);
    return recordsApi.updateRecord(interviewId, { ...current, date: parseDateTime(date, time), location: location || current.location, workMode: workMode || current.workMode, status: "Rescheduled", updatedAt: new Date().toISOString() });
  },

  async completeInterview(interviewId) {
    const current = await recordsApi.getRecordById(interviewId);
    return recordsApi.updateRecord(interviewId, { ...current, status: "Completed", updatedAt: new Date().toISOString() });
  },

  async getStudentOffers(currentUser) {
    const [student, offers, related] = await Promise.all([resolveStudent(currentUser), getAll("offer"), getRelatedRecords()]);
    return offers.filter((item) => item.studentId === student.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map((item) => mapOffer(item, related));
  },

  async getRecruiterOffers() {
    const [{ recruiter }, offers, related] = await Promise.all([resolveRecruiter(), getAll("offer"), getRelatedRecords()]);
    const jobIds = new Set(related.jobs.filter((job) => job.recruiterId === recruiter.id).map((job) => job.id));
    return offers.filter((item) => jobIds.has(item.jobId)).map((item) => mapOffer(item, related, true));
  },

  async createOffer({ applicationId, ctc, stipend, joiningDate, deadline }) {
    const [{ recruiter }, related, offers] = await Promise.all([resolveRecruiter(), getRelatedRecords(), getAll("offer")]);
    const application = related.applications.find((item) => item.id === applicationId);
    const job = related.jobs.find((item) => item.id === application?.jobId);
    const student = related.students.find((item) => item.id === application?.studentId);
    if (!application || !job || !student || job.recruiterId !== recruiter.id) throw new Error("Choose a valid application from your recruitment drives.");
    if (offers.some((item) => item.applicationId === applicationId)) throw new Error("An offer already exists for this application.");
    const now = new Date().toISOString();
    const parseDate = (value, label) => { const date = new Date(value); if (Number.isNaN(date.getTime())) throw new Error(`Enter a valid ${label}.`); return date.toISOString(); };
    return recordsApi.createRecord({ type: "offer", applicationId, studentId: student.id, jobId: job.id, companyId: job.companyId, title: job.title || job.name, ctc, stipend, date: parseDate(joiningDate, "joining date"), deadline: parseDate(deadline, "decision deadline"), status: "Pending", createdAt: now, updatedAt: now });
  },

  async updateOfferStatus(offerId, status) {
    const current = await recordsApi.getRecordById(offerId);
    return recordsApi.updateRecord(offerId, { ...current, status, updatedAt: new Date().toISOString() });
  },
};

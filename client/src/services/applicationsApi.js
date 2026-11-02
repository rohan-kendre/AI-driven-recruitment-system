import api from "./api.js";

export const applicationsApi = {
  /**
   * Submit an application for an open job (Student only)
   */
  async createApplication({ jobId, notes = "" }) {
    const res = await api.post("/applications", { jobId, notes });
    return res.data?.data;
  },

  /**
   * Get all applications submitted by the current authenticated student
   */
  async getMyApplications() {
    const res = await api.get("/applications/my");
    return res.data?.data || [];
  },

  /**
   * Get all applicants across all drives for the current authenticated recruiter
   */
  async getRecruiterCandidates() {
    const res = await api.get("/applications/candidates");
    return res.data?.data || { jobs: [], candidates: [] };
  },

  /**
   * Get applicants for a specific job drive
   */
  async getJobApplications(jobId) {
    const res = await api.get(`/applications/jobs/${jobId}`);
    return res.data?.data || [];
  },

  /**
   * Update applicant stage (Screening, Shortlisted, Interview, Offer, Rejected)
   */
  async updateApplicationStatus(id, status, note = "") {
    const res = await api.patch(`/applications/${id}/status`, { status, note });
    return res.data?.data;
  },
};

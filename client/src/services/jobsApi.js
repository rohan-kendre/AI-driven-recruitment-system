import api from "./api.js";

export const jobsApi = {
  /**
   * Get jobs for browsing (student sees open drives with eligibility & applied status; recruiter sees own drives)
   */
  async getJobs() {
    const res = await api.get("/jobs");
    return res.data?.data || [];
  },

  /**
   * Get drives created by the currently authenticated recruiter
   */
  async getMyJobs() {
    const res = await api.get("/jobs/mine");
    return res.data?.data || [];
  },

  /**
   * Get single job by ID
   */
  async getJobById(id) {
    const res = await api.get(`/jobs/${id}`);
    return res.data?.data;
  },

  /**
   * Create a new campus recruitment drive
   */
  async createJob(jobData) {
    const res = await api.post("/jobs", jobData);
    return res.data?.data;
  },

  /**
   * Update an existing drive
   */
  async updateJob(id, jobData) {
    const res = await api.put(`/jobs/${id}`, jobData);
    return res.data?.data;
  },

  /**
   * Update job status (OPEN, CLOSED, DRAFT)
   */
  async updateJobStatus(id, status) {
    const res = await api.patch(`/jobs/${id}/status`, { status });
    return res.data?.data;
  },
};

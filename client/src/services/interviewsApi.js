import api from "./api.js";

export const interviewsApi = {
  async getInterviews() {
    const res = await api.get("/interviews");
    return res.data?.data || [];
  },

  async createInterview(interviewData) {
    const res = await api.post("/interviews", interviewData);
    return res.data?.data;
  },

  async updateInterview(id, updateData) {
    const res = await api.patch(`/interviews/${id}`, updateData);
    return res.data?.data;
  },
};

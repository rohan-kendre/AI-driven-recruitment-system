import api from "./api.js";

export const tpoApi = {
  async getStats() {
    const res = await api.get("/tpo/stats");
    return res.data?.data;
  },
};

import api from "./api.js";

export const companyApi = {
  async getMyCompany() {
    const res = await api.get("/companies/mine");
    return res.data?.data;
  },

  async updateMyCompany(companyData) {
    const res = await api.put("/companies/mine", companyData);
    return res.data?.data;
  },
};

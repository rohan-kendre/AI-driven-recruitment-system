import api from "./api.js";

export const adminApi = {
  async getUsers() {
    const res = await api.get("/admin/users");
    return res.data?.data || [];
  },

  async updateUserStatus(id, status) {
    const res = await api.patch(`/admin/users/${id}/status`, { status });
    return res.data?.data;
  },

  async updateUserApproval(id, approvalStatus) {
    const res = await api.patch(`/admin/users/${id}/approval`, { approvalStatus });
    return res.data?.data;
  },
};

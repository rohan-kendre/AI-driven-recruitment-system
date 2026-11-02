import api from "./api.js";

export const studentApi = {
  async getProfile() {
    const res = await api.get("/students/profile");
    return res.data?.data;
  },

  async updateProfile(profileData) {
    const res = await api.put("/students/profile", profileData);
    return res.data?.data;
  },
};

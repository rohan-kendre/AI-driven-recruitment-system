import mockApi from "../mockApi.js";

export const usersApi = {
  async getUsers(params) {
    const { data } = await mockApi.get("/users", { params });
    return data;
  },

  async getUserById(id) {
    const { data } = await mockApi.get(`/users/${id}`);
    return data;
  },

  async createUser(user) {
    const { data } = await mockApi.post("/users", user);
    return data;
  },

  async updateUser(id, user) {
    const { data } = await mockApi.put(`/users/${id}`, user);
    return data;
  },
};

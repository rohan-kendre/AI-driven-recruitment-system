import mockApi from "../mockApi.js";

export const recordsApi = {
  async getRecords(params) {
    const { data } = await mockApi.get("/records", { params });
    return data;
  },

  async getRecordById(id) {
    const { data } = await mockApi.get(`/records/${id}`);
    return data;
  },

  async getRecordsByType(type) {
    const { data } = await mockApi.get("/records", { params: { type } });
    return data;
  },

  async createRecord(record) {
    const { data } = await mockApi.post("/records", record);
    return data;
  },

  async updateRecord(id, record) {
    const { data } = await mockApi.put(`/records/${id}`, record);
    return data;
  },

  async deleteRecord(id) {
    const { data } = await mockApi.delete(`/records/${id}`);
    return data;
  },
};

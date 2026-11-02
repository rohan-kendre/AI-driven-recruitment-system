import api from "./api.js";

export const offersApi = {
  async getOffers() {
    const res = await api.get("/offers");
    return res.data?.data || [];
  },

  async createOffer(offerData) {
    const res = await api.post("/offers", offerData);
    return res.data?.data;
  },

  async updateOfferStatus(id, status) {
    const res = await api.patch(`/offers/${id}/status`, { status });
    return res.data?.data;
  },
};

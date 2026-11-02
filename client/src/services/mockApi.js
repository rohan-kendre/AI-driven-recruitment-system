import axios from "axios";

const mockApiBaseUrl = import.meta.env.VITE_MOCK_API_BASE_URL;

if (!mockApiBaseUrl) {
  throw new Error("VITE_MOCK_API_BASE_URL must be configured for temporary MockAPI access.");
}

const mockApi = axios.create({
  baseURL: mockApiBaseUrl,
  headers: { "Content-Type": "application/json" },
});

export default mockApi;

import axios from "axios";

// ✅ Load environment variables for API keys
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = import.meta.env.VITE_BASE_URL + "api/";

// ✅ Configure Axios client
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});
export  async function createOrder(data) {
  const response = await axiosClient.post(`/create-order`, data);
  return response.data;
}

export  async function verifyPayment(data) {
  const response = await axiosClient.post(`/verify-payment`, data);
  return response.data;
}


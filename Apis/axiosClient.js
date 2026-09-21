import axios from "axios";

// ✅ Load environment variables for API keys
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;
const BASE_URL = (import.meta.env.VITE_BASE_URL || "https://back.end.invoice.wbgav.in/").replace(/\/+$/, "") + "/api/";

const headers = {
  "Content-Type": "application/json",
};

// Only attach Authorization header if a valid non-empty API_KEY is provided
if (API_KEY && API_KEY.trim() && API_KEY !== "undefined") {
  headers.Authorization = `Bearer ${API_KEY.trim()}`;
}

// ✅ Configure Axios client
const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers,
});

export default axiosClient;

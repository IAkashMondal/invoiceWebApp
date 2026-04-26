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

/**
 * ✅ Sends feedback for validation to Strapi backend.
 * @param {string} feedback - User's feedback input.
 * @returns {Promise<Object>} - Response from Strapi.
 */
const validateFeedback = async (feedback) => {
  try {
    const response = await axiosClient.post("/api/validate-feedback", {
      feedback,
    });
    return response.data; // Return only the data
  } catch (error) {
    console.error(
      "❌ Error validating feedback:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ✅ Fetches data for a specific E-Challan ID.
 * @param {string} echallanId - E-Challan ID.
 * @returns {Promise} - Axios response.
 */
const GetEchallanData = async (echallanId) => {
  try {
    const response = await axiosClient.get(
      `/vehicle-numbers?filters[EchallanId][$eq]=${echallanId}`
    );

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error in GetEchallanData:",
      error.response?.data || error
    );
    throw error;
  }
};

/**
 * ✅ Validates a vehicle registration number by fetching matching records.
 * @param {string} EchallanId - Registration number for validation.
 * @returns {Promise} - Axios response.
 */
export const GetChallanValidationPreview = async (EchallanId) => {
  return axiosClient.get(
    `/vehicle-numbers?filters[Registration_No][$eq]=${EchallanId}`,
    { headers: { Accept: "application/json" } }
  );
};

/**
 * ✅ Fetches the last saved E-Challan ID.
 * @returns {Promise} - Axios response.
 */
const GetPrevChallanID = () =>
  axiosClient.get(`/echallanids?sort=id:desc&limit=1`);

/**
 * ✅ Updates the last saved E-Challan ID.
 * @param {string} documentID - ID of the document to update.
 * @param {Object} data - Updated E-Challan details.
 * @returns {Promise} - Axios response.
 */
const addPerChallaID = async (documentID, data) => {
  try {
    const response = await axiosClient.put(`/echallanids/${documentID}`, {
      data,
    });
    return response;
  } catch (error) {
    console.error(
      "❌ Error updating Prev Challan Id details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ✅ Export all API functions
export { addPerChallaID, GetPrevChallanID, GetEchallanData, validateFeedback };

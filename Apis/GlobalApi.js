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
 * ✅ Adds a new vehicle to the system.
 * @param {Object} data - Vehicle details.
 * @returns {Promise} - Axios response.
 */
const addNewVehicle = (data) => axiosClient.post("/vehicle-numbers", data);

/**
 * ✅ Fetches user royalties by email.
 * @param {string} userEmail - Email of the user.
 * @returns {Promise} - Axios response.
 */
const GetUserRoyalties = (userEmail) =>
  axiosClient.get(`/vehicle-numbers?filters[userEmail][$eq]=${userEmail}`);

/**
 * ✅ Fetches details of a specific vehicle by ID.
 * @param {string} royaltyID - ID of the vehicle.
 * @returns {Promise} - Axios response.
 */
const GetParticularVehicle = (royaltyID) =>
  axiosClient.get(`/vehicle-numbers/${royaltyID}`);

/**
 * ✅ Fetches all vehicle details with populated data.
 * @returns {Promise} - Axios response.
 */
const Getvehicles = () => axiosClient.get("/vehicle-numbers?populate=*");

/**
 * ✅ Fetches all owner details.
 * @returns {Promise} - Axios response.
 */
const GetOwnersDeatils = () => axiosClient.get(`/miner-deatils`);

/**
 * ✅ Updates purchaser details for a given vehicle.
 * @param {string} royaltyID - ID of the vehicle.
 * @param {Object} data - Updated purchaser details.
 * @returns {Promise} - Axios response.
 */
const updatePurchaserDetails = async (royaltyID, data) => {
  try {
    const response = await axiosClient.put(`/vehicle-numbers/${royaltyID}`, {
      data,
    });
    return response;
  } catch (error) {
    console.error(
      "❌ Error updating purchaser details:",
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
const GetPrevChallanID = () => axiosClient.get(`/echallanids?sort=id:asc`);

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
export {
  addNewVehicle,
  GetUserRoyalties,
  updatePurchaserDetails,
  GetParticularVehicle,
  addPerChallaID,
  GetPrevChallanID,
  GetOwnersDeatils,
  GetEchallanData,
  Getvehicles,
};

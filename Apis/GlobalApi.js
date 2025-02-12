import axios from "axios";

// Environment variables for API keys
const API_KEY = import.meta.env.VITE_STRAPI_API_KEY;

// Axios client configuration
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL + "api/",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
});

/**
 * API function to add a new vehicle
 * @param {Object} data - Vehicle data to be added
 * @returns {Promise} Axios response
 */
const addNewVehicle = (data) => axiosClient.post("/vehicle-numbers", data);

/**
 * API function to fetch user royalties by email
 * @param {string} userEmail - User's email
 * @returns {Promise} Axios response
 */
const GetUserRoyalties = (userEmail) =>
  axiosClient.get(`/vehicle-numbers?filters[userEmail][$eq]=${userEmail}`);

/**
 * API function to fetch the last saved E-Challan ID
 * @returns {Promise} Axios response
 */

/**
 * API function to update purchaser details
 * @param {Object} params - Parameters containing the royalty ID
 * @param {Object} data - Data to update
 * @returns {Promise} Axios response
 */
const updatePurchaserDetails = async (royaltyID, data) => {
  try {
    const response = await axiosClient.put(`/vehicle-numbers/${royaltyID}`, {
      data,
    });
    return response;
  } catch (error) {
    console.error(
      "Error updating purchaser details:",
      error.response?.data || error.message
    );
    throw error;
  }
};
/**
 * Validates a vehicle's registration number by fetching matching records.
 * @param {string} encodedRegistrationNoBase - The base of the registration number for lookup.
 * @returns {Promise} Axios response promise.
 */
export const GetChallanValidationPreview = async (EchallanId) => {
  console.log(`Requesting data for EChallanId: ${EchallanId}`);
  return axios.get(
    `/vehicle-numbers?filters[Registration_No][$eq]=${EchallanId}`,
    {
      headers: { Accept: "application/json" },
    }
  );
};

const GetParticularVehicle = async (royaltyID) =>
  await axiosClient.get(`/vehicle-numbers/${royaltyID}`);

const GetEchallanData = async (echallanId) => {
  try {
    const response = await axiosClient.get(
      `/vehicle-numbers?filters[EchallanId][$eq]=${echallanId}`
    ); // Adjust the query as needed

    if (response.status !== 200) {
      throw new Error(`HTTP error! status: ${response.status}`); // More descriptive error
    }

    return response.data; // Return the data
  } catch (error) {
    console.error("Error in GetEchallanData:", error.response?.data || error); // Log the full error
    throw error; // Re-throw the error to be handled by the caller
  }
};

///////////////
const GetPrevChallanID = async () =>
  axiosClient.get(`/echallanids?sort=id:asc`);
/**
 * API function to add a new vehicle
 * @param {Object} data - Vehicle data to be added
 * @returns {Promise} Axios response
 */
const addPerChallaID = async (documentID, data) => {
  try {
    console.log("Sending PUT request to:", `/api/echallanids/${documentID}`);
    console.log("Payload:", data);
    const response = await axiosClient.put(`/echallanids/${documentID}`, {
      data,
    });
    console.log("Request URL:", `/echallanids/${documentID}`);
    console.log("Request Body:", data);
    console.log("Request Method:", "PUT");
    return response;
  } catch (error) {
    console.error(
      "Error updating Prev Challan Id details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

const generateQrCodeUrl = (newEChallanId) => {
  return `/WBMD/Page/each/aspx/id${encodeURIComponent(
    newEChallanId
  )}/S/24-25/RPS`;
};
//////////////////////////////////
const Getvehicles = async () => axiosClient.get("/vehicle-numbers?populate=*");

const GetOwnersDeatils = () => axiosClient.get(`/miner-deatils`);
export {
  addNewVehicle,
  GetUserRoyalties,
  updatePurchaserDetails,
  GetParticularVehicle,
  addPerChallaID,
  GetPrevChallanID,
  generateQrCodeUrl,
  GetOwnersDeatils,
  GetEchallanData,
  Getvehicles,
};

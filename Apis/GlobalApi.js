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
 * ✅ Fetches user royalties by email with pagination.
 * @param {string} userEmail - Email of the user.
 * @param {number} page - Page number (1-based).
 * @param {number} limit - Number of items per page.
 * @returns {Promise} - Axios response with pagination metadata.
 */
const GetUserRoyalties = (userEmail, page = 1, limit = 10) =>
  axiosClient.get(
    `/vehicle-numbers?filters[userEmail][$eq]=${userEmail}&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=id:desc`
  );

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

/**
 * ✅ Searches vehicle numbers based on NameofPurchaser, Registration_No or EchallanId.
 * @param {string} query - Search input from user.
 * @param {string} userEmail - Email of the user to filter results.
 * @param {number} page - Page number (1-based).
 * @param {number} limit - Number of items per page.
 * @returns {Promise} - Axios response.
 */
const SearchUserRoyalties = (query, userEmail, page = 1, limit = 10) => {
  return axiosClient.get(
    `/vehicle-numbers?filters[$or][0][NameofPurchaser][$containsi]=${query}&filters[$or][1][Registration_No][$containsi]=${query}&filters[$or][2][EchallanId][$containsi]=${query}&filters[userEmail][$eq]=${userEmail}&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=id:desc`
  );
};

/**
 * ✅ Fetches ALL user royalties by email without any pagination limits.
 * @param {string} userEmail - Email of the user.
 * @returns {Promise} - Axios response with all user data.
 */
const GetAllUserRoyalties = (userEmail) =>
  axiosClient.get(
    `/vehicle-numbers?filters[userEmail][$eq]=${userEmail}&pagination[limit]=-1&sort=id:desc`
  );

/**
 * ✅ Fetches ALL vehicle data for a specific user without any pagination limits.
 * @param {string} userEmail - Email of the user.
 * @returns {Promise} - Axios response with all vehicle data.
 */
const GetAllVehiclesForUser = (userEmail) =>
  axiosClient.get(
    `/vehicle-numbers?filters[userEmail][$eq]=${userEmail}&sort=id:desc&populate=*`
  );

/**
 * ✅ Creates or updates user data in the backend when a user signs in with Clerk.
 * @param {Object} userData - User data from Clerk (id, email, name, etc).
 * @returns {Promise} - Axios response with the created/updated user.
 */
const syncClerkUser = async (userData) => {
  try {
    // Check if user already exists by email
    const checkResponse = await axiosClient.get(
      `/clerk-users?filters[email][$eq]=${userData.email}`
    );

    // If user exists, update it
    if (checkResponse.data.data && checkResponse.data.data.length > 0) {
      const existingUserId = checkResponse.data.data[0].id;
      const updateResponse = await axiosClient.put(
        `/clerk-users/${existingUserId}`,
        {
          data: {
            clerkId: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            imageUrl: userData.imageUrl,
            lastSignIn: new Date().toISOString(),
          },
        }
      );
      return updateResponse;
    }
    // If user doesn't exist, create new user
    else {
      const createResponse = await axiosClient.post("/clerk-users", {
        data: {
          clerkId: userData.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          imageUrl: userData.imageUrl,
          lastSignIn: new Date().toISOString(),
          dateJoined: new Date().toISOString(),
        },
      });
      return createResponse;
    }
  } catch (error) {
    console.error(
      "❌ Error syncing Clerk user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ✅ Creates an order for payment processing
 * @param {number} amount - Amount to be paid in lowest denomination (paise)
 * @returns {Promise} - Axios response with order details
 */
const createPaymentOrder = async (amount) => {
  try {
    const response = await axiosClient.post("/create-order", {
      amount: parseInt(amount),
    });
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error creating payment order:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * ✅ Verifies payment after successful Razorpay transaction
 * @param {Object} paymentData - Payment verification data
 * @param {string} paymentData.orderId - Order ID from Razorpay
 * @param {string} paymentData.paymentId - Payment ID from Razorpay
 * @param {string} paymentData.signature - Signature from Razorpay
 * @param {number} paymentData.amount - Amount paid
 * @param {string} paymentData.LastValidQnt - Previous valid quantity
 * @param {string} paymentData.CurrentValidQnt - Current valid quantity
 * @returns {Promise} - Axios response with verification result
 */
const verifyPayment = async (paymentData) => {
  try {
    const response = await axiosClient.post("/verify-payment", paymentData);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error verifying payment:",
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
  validateFeedback,
  SearchUserRoyalties,
  GetAllUserRoyalties,
  GetAllVehiclesForUser,
  syncClerkUser,
  createPaymentOrder,
  verifyPayment,
};

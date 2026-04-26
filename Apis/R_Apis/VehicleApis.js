import axios from "axios";
import { findMatchingClerkUser, updateUserLimits } from "../Clerk/ClerkApis";

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
 * ✅ Fetches ALL vehicle data for a specific user without any pagination limits.
 * @param {string} userEmail - Email of the user.
 * @returns {Promise} - Axios response with all vehicle data.
 */
const GetAllVehiclesForUser = async (userEmail) => {
  try {
    // Use containsi for more flexible matching, and optimize with populate=*
    const response = await axiosClient.get(
      `/vehicle-numbers?filters[userEmail][$containsi]=${encodeURIComponent(
        userEmail
      )}&sort=id:desc&populate=*&pagination[limit]=-1`
    );

    return response;
  } catch (error) {
    console.error("❌ Error fetching all vehicles for analytics:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }

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
const SearchUserRoyalties = async (query, userEmail, page = 1, limit = 10) => {
  try {
    // Enhanced search with containsi for all fields
    const response = await axiosClient.get(
      `/vehicle-numbers?filters[$or][0][NameofPurchaser][$containsi]=${encodeURIComponent(
        query
      )}&filters[$or][1][Registration_No][$containsi]=${encodeURIComponent(
        query
      )}&filters[$or][2][EchallanId][$containsi]=${encodeURIComponent(
        query
      )}&filters[userEmail][$containsi]=${encodeURIComponent(
        userEmail
      )}&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=id:desc`
    );

    return response;
  } catch (error) {
    console.error("❌ Error searching user royalties:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

/**
 * ✅ Fetches ALL user royalties by email without any pagination limits.
 * @param {string} userEmail - Email of the user.
 * @returns {Promise} - Axios response with all user data.
 */
const GetAllUserRoyalties = async (userEmail) => {
  try {
    const response = await axiosClient.get(
      `/vehicle-numbers?filters[userEmail][$containsi]=${encodeURIComponent(
        userEmail
      )}&pagination[limit]=-1&sort=id:desc`
    );

    return response;
  } catch (error) {
    console.error("❌ Error fetching all user royalties:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};
/**
 * ✅ Adds a new vehicle to the system.
 * @param {Object} data - Vehicle details.
 * @returns {Promise} - Axios response.
 */
const addNewVehicle = async (data) => {
  try {
    const response = await axiosClient.post("/vehicle-numbers", data);
    return response;
  } catch (error) {
    console.error("❌ Error adding new vehicle:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      if (error.response.data?.error?.details?.errors) {
        console.error(
          "Validation errors:",
          error.response.data.error.details.errors
        );
      }
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

/**
 * ✅ Fetches user royalties by email with pagination.
 * @param {string} userEmail - Email of the user.
 * @param {number} page - Page number (1-based).
 * @param {number} limit - Number of items per page.
 * @returns {Promise} - Axios response with pagination metadata.
 */
const GetUserRoyalties = async (userEmail, page = 1, limit = 10) => {
  try {
    // Use containsi instead of eq for more flexible email matching
    const response = await axiosClient.get(
      `/vehicle-numbers?filters[userEmail][$containsi]=${encodeURIComponent(
        userEmail
      )}&pagination[page]=${page}&pagination[pageSize]=${limit}&sort=id:desc`
    );

    return response;
  } catch (error) {
    console.error("❌ Error fetching user royalties:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

/**
 * ✅ Fetches details of a specific vehicle by ID.
 * @param {string} royaltyID - ID of the vehicle.
 * @returns {Promise} - Axios response.
 */
const GetParticularVehicle = async (royaltyID) => {
  try {
    const response = await axiosClient.get(
      `/vehicle-numbers/${royaltyID}?populate=*`
    );
    return response;
  } catch (error) {
    console.error(`❌ Error fetching vehicle with ID ${royaltyID}:`);

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

/**
 * ✅ Fetches all vehicle details with populated data.
 * @returns {Promise} - Axios response.
 */
const Getvehicles = () => axiosClient.get("/vehicle-numbers?populate=*");



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
 * ✅ Updates user quantities in clerk-webhooks based on vehicle number
 * @param {string} vehicleNumber - The vehicle number to check
 * @param {number} quantity - The quantity to add/update
 * @param {Object} user - Current Clerk user data
 * @returns {Promise} - Axios response
 */
const updateUserQuantitiesForVehicle = async (
  vehicleNumber,
  quantity,
  user
) => {
  try {
    // Special vehicle numbers that affect personal quantity
    const specialVehicles = ["WB73C5024", "WB73E9469", "WB73E2234"];

    // Find the matching user in clerk-webhooks
    const matchedUser = await findMatchingClerkUser(user);
    if (!matchedUser) {
      throw new Error("User not found in database");
    }

    const userId = matchedUser.id;
    const currentData = matchedUser.attributes || {};

    // Initialize update data
    const updateData = {
      userTotalQuantity:
        Number(currentData.userTotalQuantity || 0) + Number(quantity),
    };

    // If it's a special vehicle, also update personal quantity
    if (specialVehicles.includes(vehicleNumber)) {
      updateData.userPersonalQuantity =
        Number(currentData.userPersonalQuantity || 0) + Number(quantity);
    }

    // Update remaining capacity
    const currentLimit = Number(currentData.Userlimit || 0);
    updateData.RemaningCapacity = Math.max(
      0,
      currentLimit - updateData.userTotalQuantity
    );

    // Update the user data
    const response = await updateUserLimits(userId, updateData);
    console.log("Updated user quantities:", updateData);
    return response;
  } catch (error) {
    console.error("❌ Error updating user quantities:", error);
    throw error;
  }
};
export {
  GetAllVehiclesForUser,
  SearchUserRoyalties,
  GetAllUserRoyalties,
  GetParticularVehicle,
  updatePurchaserDetails,
  Getvehicles,
  GetUserRoyalties,
  addNewVehicle,
  updateUserQuantitiesForVehicle
};

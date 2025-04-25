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
 * ✅ Maps Clerk webhook data to match our backend schema
 * @param {Object} clerkData - Raw data from Clerk webhook
 * @returns {Object} - Formatted data matching our backend schema
 */
const formatClerkWebhookData = (clerkData) => {
  // Extract the relevant fields from clerk data
  const formattedData = {
    clerkID: clerkData.id,
    ClerkuserName: clerkData.username || "",
    Clerk_First_name: clerkData.first_name || "",
    Clerk_Last_Name: clerkData.last_name || "",
    Clerk_Full_Name: `${clerkData.first_name || ""} ${
      clerkData.last_name || ""
    }`.trim(),
    Clerk_Email:
      clerkData.email_addresses?.[0]?.email_address ||
      clerkData.primary_email_address?.email_address ||
      "",
    ClerkPhonenumber:
      clerkData.phone_numbers?.[0]?.phone_number ||
      clerkData.primary_phone_number?.phone_number ||
      "",
    ClerkLastSignIn: clerkData.last_sign_in_at
      ? new Date(clerkData.last_sign_in_at).toISOString()
      : new Date().toISOString(),
    Clerk_ImageUrl: clerkData.image_url || clerkData.profile_image_url || "",
  };

  return formattedData;
};

/**
 * ✅ Creates or updates a clerk user record in our database
 * @param {Object} clerkData - Raw data from Clerk
 * @returns {Promise} - Axios response with the created/updated user
 */
const createOrUpdateClerkUser = async (clerkData) => {
  try {
    const formattedData = formatClerkWebhookData(clerkData);

    // Check if user already exists by clerkID
    console.log(
      `Checking if user with clerkID ${formattedData.clerkID} exists...`
    );
    const checkResponse = await axiosClient.get(
      `/clerck-webhooks?filters[clerkID][$eq]=${encodeURIComponent(
        formattedData.clerkID
      )}`
    );

    // If user exists by clerkID, update it
    if (checkResponse.data.data && checkResponse.data.data.length > 0) {
      const existingUser = checkResponse.data.data[0];
      console.log(`User found with ID ${existingUser.id}, updating...`);

      const updateData = {
        data: formattedData,
      };

      const updateResponse = await axiosClient.put(
        `/clerck-webhooks/${existingUser.id}`,
        updateData
      );

      return updateResponse;
    }
    // If not found by clerkID, check by email
    else {
      const emailCheckResponse = await axiosClient.get(
        `/clerck-webhooks?filters[Clerk_Email][$eq]=${encodeURIComponent(
          formattedData.Clerk_Email
        )}`
      );

      // If found by email, update
      if (
        emailCheckResponse.data.data &&
        emailCheckResponse.data.data.length > 0
      ) {
        const existingUser = emailCheckResponse.data.data[0];
        console.log(
          `User found by email with ID ${existingUser.id}, updating...`
        );

        const updateData = {
          data: formattedData,
        };

        const updateResponse = await axiosClient.put(
          `/clerck-webhooks/${existingUser.id}`,
          updateData
        );

        return updateResponse;
      }
      // If not found at all, create new user
      else {
        console.log(`No user found, creating new user...`);
        const createData = {
          data: {
            ...formattedData,
            // Set default values for new users
            Userlimit: 0,
            UserCurrentBalance: 0,
            UserPreviousBalance: 0,
            userTotalQuantity: 0,
            userPersonalQuantity: 0,
            RemaningCapacity: 0,
          },
        };

        const createResponse = await axiosClient.post(
          "/clerck-webhooks",
          createData
        );

        return createResponse;
      }
    }
  } catch (error) {
    console.error("❌ Error creating/updating user:", error);
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
      error.response?.status,
      error.response?.data || error.message
    );
    console.error("Full error details:", error);
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
      error.response?.status,
      error.response?.data || error.message
    );
    console.error("Full error details:", error);
    throw error;
  }
};

/**
 * ✅ Fetches all users from clerk-webhooks for admin panel
 * @param {number} page - Page number (1-based)
 * @param {number} limit - Number of items per page
 * @returns {Promise} - Axios response with user data
 */
const getAllClerkUsers = async (page = 1, limit = 10) => {
  try {
    const response = await axiosClient.get(
      `/clerck-webhooks?pagination[page]=${page}&pagination[pageSize]=${limit}`
    );

    return response;
  } catch (error) {
    console.error("❌ Error fetching users for admin panel:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      // Return fallback empty data structure for 404 errors
      if (error.response.status === 404) {
        console.warn("Clerk webhooks endpoint not found, returning empty data");
        return {
          data: {
            data: [],
            meta: {
              pagination: {
                page: page,
                pageSize: limit,
                pageCount: 0,
                total: 0,
              },
            },
          },
        };
      }
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

/**
 * ✅ Updates user credit limits and balance in clerk-webhooks
 * @param {string} userId - ID of the user to update
 * @param {Object} userData - User data to update (Userlimit, UserCurrentBalance, etc.)
 * @returns {Promise} - Axios response
 */
const updateUserLimits = async (userId, userData) => {
  try {
    // First, verify the user exists
    console.log(`Checking if user with ID ${userId} exists before updating...`);
    try {
      await axiosClient.get(`/clerck-webhooks/${userId}`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.error(`User with ID ${userId} not found`);
        throw new Error("User database not available. Please contact support.");
      }
      throw error;
    }

    // Prepare update data
    const updateData = {
      data: userData,
    };

    console.log("Sending update with data:", updateData);

    // Use PUT method for the update
    const response = await axiosClient.put(
      `/clerck-webhooks/${userId}`,
      updateData
    );

    return response;
  } catch (error) {
    console.error("❌ Error updating user limits:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);

      // Handle 404 error gracefully
      if (error.response.status === 404) {
        console.warn("Clerk webhooks endpoint not found");
        throw new Error("User database not available. Please contact support.");
      }
    } else {
      console.error("Error message:", error.message);
    }

    throw error;
  }
};

/**
 * ✅ Creates or updates user data in the backend when a user signs in with Clerk.
 * @param {Object} userData - User data from Clerk (id, email, name, etc).
 * @returns {Promise} - Axios response with the created/updated user.
 */
const syncClerkUser = async (userData) => {
  try {
    if (!userData.email) {
      console.error("Missing email in user data:", userData);
      throw new Error("Email is required for user synchronization");
    }

    // Convert old format to new format
    const adaptedUserData = {
      id: userData.id,
      username: userData.username || "",
      first_name: userData.firstName || "",
      last_name: userData.lastName || "",
      email_addresses: [{ email_address: userData.email }],
      phone_numbers: userData.phoneNumber
        ? [{ phone_number: userData.phoneNumber }]
        : [],
      image_url: userData.imageUrl || "",
      last_sign_in_at: new Date().toISOString(),
    };

    // Use the new function with the adapted data
    return await createOrUpdateClerkUser(adaptedUserData);
  } catch (error) {
    console.error("❌ Error syncing Clerk user:", error);
    throw error;
  }
};

/**
 * ✅ Find matching user in clerck-webhooks based on multiple criteria
 * @param {Object} userData - Current Clerk user data
 * @returns {Promise<Object>} - Matching user data from clerck-webhooks or null if no match
 */
const findMatchingClerkUser = async (userData) => {
  try {
    if (!userData || !userData.primaryEmailAddress?.emailAddress) {
      console.error("Missing email in user data");
      return null;
    }

    const email = userData.primaryEmailAddress?.emailAddress;
    console.log(`Searching for matching user with email: ${email}`);

    // First try to find by clerkID (most precise match)
    try {
      const idResponse = await axiosClient.get(
        `/clerck-webhooks?filters[clerkID][$eq]=${encodeURIComponent(
          userData.id
        )}`
      );

      if (idResponse.data.data && idResponse.data.data.length > 0) {
        console.log("Found exact match by Clerk ID:", idResponse.data.data[0]);
        return idResponse.data.data[0];
      }
    } catch (error) {
      console.warn("Error searching by ID:", error.message);
    }

    // Then try to find by email
    try {
      const emailResponse = await axiosClient.get(
        `/clerck-webhooks?filters[Clerk_Email][$containsi]=${encodeURIComponent(
          email
        )}`
      );

      if (emailResponse.data.data && emailResponse.data.data.length > 0) {
        // Found users with matching email, now check for additional criteria
        const potentialMatches = emailResponse.data.data;
        console.log(
          `Found ${potentialMatches.length} potential matches by email`
        );

        // Count matching criteria for each potential match
        const scoredMatches = potentialMatches.map((match) => {
          let score = 0;
          const attrs = match.attributes || {};

          // Check email (exact match is stronger)
          if (attrs.Clerk_Email?.toLowerCase() === email.toLowerCase()) {
            score += 2;
          } else if (
            attrs.Clerk_Email?.toLowerCase()?.includes(email.toLowerCase())
          ) {
            score += 1;
          }

          // Check first name
          if (userData.firstName && attrs.Clerk_First_name) {
            if (
              attrs.Clerk_First_name.toLowerCase() ===
              userData.firstName.toLowerCase()
            ) {
              score += 1;
            }
          }

          // Check last name
          if (userData.lastName && attrs.Clerk_Last_Name) {
            if (
              attrs.Clerk_Last_Name.toLowerCase() ===
              userData.lastName.toLowerCase()
            ) {
              score += 1;
            }
          }

          // Check username
          if (userData.username && attrs.ClerkuserName) {
            if (
              attrs.ClerkuserName.toLowerCase() ===
              userData.username.toLowerCase()
            ) {
              score += 1;
            }
          }

          return { match, score };
        });

        // Sort by score descending
        scoredMatches.sort((a, b) => b.score - a.score);

        // Consider a match if score is at least 3
        if (scoredMatches.length > 0 && scoredMatches[0].score >= 3) {
          const bestMatch = scoredMatches[0].match;
          console.log(
            `Found strong match (score ${scoredMatches[0].score})`,
            bestMatch
          );
          return bestMatch;
        } else if (scoredMatches.length > 0) {
          console.log(
            `Found potential match but score too low (${scoredMatches[0].score})`,
            scoredMatches[0].match
          );
        }
      }
    } catch (error) {
      console.warn("Error searching by email:", error.message);
    }

    // Fallback - try to search by name + username
    if (userData.firstName || userData.lastName || userData.username) {
      try {
        const searchTerms = [];
        if (userData.firstName) searchTerms.push(userData.firstName);
        if (userData.lastName) searchTerms.push(userData.lastName);
        if (userData.username) searchTerms.push(userData.username);

        const searchTerm = searchTerms.join(" ");
        if (searchTerm) {
          const nameResponse = await axiosClient.get(
            `/clerck-webhooks?filters[$or][0][Clerk_First_name][$containsi]=${encodeURIComponent(
              searchTerm
            )}&filters[$or][1][Clerk_Last_Name][$containsi]=${encodeURIComponent(
              searchTerm
            )}&filters[$or][2][ClerkuserName][$containsi]=${encodeURIComponent(
              searchTerm
            )}`
          );

          if (nameResponse.data.data && nameResponse.data.data.length > 0) {
            console.log(
              "Found match by name/username:",
              nameResponse.data.data[0]
            );
            return nameResponse.data.data[0];
          }
        }
      } catch (error) {
        console.warn("Error searching by name/username:", error.message);
      }
    }

    console.log("No matching user found");
    return null;
  } catch (error) {
    console.error("❌ Error finding matching user:", error);
    return null;
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
  createOrUpdateClerkUser,
  formatClerkWebhookData,
  syncClerkUser,
  createPaymentOrder,
  verifyPayment,
  getAllClerkUsers,
  updateUserLimits,
  findMatchingClerkUser,
  updateUserQuantitiesForVehicle,
};

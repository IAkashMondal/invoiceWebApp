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
    if (!userData || !userData.id) {
      console.error("Missing id in user data");
      return null;
    }

    const { id } = userData;

    // Fetch user data by Clerk ID (the most precise match)
    try {
      const idResponse = await axiosClient.get(
        `/clerck-webhooks?filters[clerkID][$eq]=${encodeURIComponent(id)}`
      );

      if (idResponse.data.data && idResponse.data.data.length > 0) {
        return idResponse.data.data[0]; // Return the first match
      } else {
        console.log("No user found with the provided Clerk ID.");
        return null;
      }
    } catch (error) {
      console.error("Error searching by ID:", error.message);
      return null;
    }
  } catch (error) {
    console.error("❌ Error finding matching user:", error);
    return null;
  }
};
/**
 * ✅ Updates the last saved E-Challan ID.
 * @param {string} documentID - ID of the document to update.
 * @param {Object} data - Updated E-Challan details.
 * @returns {Promise} - Axios response.
 */
const addUserQuantity = async (documentId, data) => {
  try {
    const response = await axiosClient.put(
      `/clerck-webhooks/${documentId}`,
      { data } // ✅ Wrap payload inside { data: ... }
    );
    return response;
  } catch (error) {
    console.error(
      "❌ Error updating Prev Challan Id details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export {
  updateUserLimits,
  syncClerkUser,
  findMatchingClerkUser,
  getAllClerkUsers,
  addUserQuantity,
};

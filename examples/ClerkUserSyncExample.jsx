import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { createOrUpdateClerkUser } from "../Apis/GlobalApi";
import { toast } from "sonner";

/**
 * Example component that syncs Clerk user data with our backend
 * Place this component in your layout or where you need to sync user data
 */
const ClerkUserSync = () => {
    const { user, isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        // Only sync when user is signed in and data is loaded
        if (isLoaded && isSignedIn && user) {
            const syncUserData = async () => {
                try {
                    console.log("Syncing user data with backend...");
                    await createOrUpdateClerkUser(user);
                    console.log("User data synced successfully");
                } catch (error) {
                    console.error("Failed to sync user data:", error);
                    toast.error("Failed to sync user data with our system");
                }
            };

            syncUserData();
        }
    }, [user, isSignedIn, isLoaded]);

    // This component doesn't render anything visible
    return null;
};

export default ClerkUserSync;

/**
 * HOW TO USE:
 * 
 * 1. Import this component in your layout or main app component:
 *    import ClerkUserSync from './path/to/ClerkUserSync';
 * 
 * 2. Add it to your component tree:
 *    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
 *      <ClerkUserSync />
 *      <YourApp />
 *    </ClerkProvider>
 * 
 * This will ensure user data is synced on sign-in and whenever user data changes.
 */ 
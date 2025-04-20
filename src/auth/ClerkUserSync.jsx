import { useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { syncClerkUser } from '../../Apis/GlobalApi';
import { useToast } from '@/components/ui/use-toast';

/**
 * This component handles syncing Clerk user data with our backend.
 * It should be included in your application layout once, near the root level.
 */
const ClerkUserSync = () => {
    const { user, isLoaded, isSignedIn } = useUser();
    const { toast } = useToast();

    useEffect(() => {
        // Only run if Clerk has loaded and user is signed in
        if (!isLoaded || !isSignedIn) return;

        const syncUserData = async () => {
            try {
                // Prepare user data object from Clerk
                const userData = {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                };

                // Don't attempt to sync if email is missing
                if (!userData.email) {
                    console.warn('User email not available from Clerk, skipping sync');
                    return;
                }

                // Sync user with backend
                const response = await syncClerkUser(userData);
                console.log('User synced successfully', response.data);

            } catch (error) {
                console.error('Failed to sync user data with backend:', error);
                toast({
                    title: 'Sync Error',
                    description: 'Failed to sync your user profile. Some features may be limited.',
                    variant: 'destructive',
                });
            }
        };

        syncUserData();
    }, [isLoaded, isSignedIn, user, toast]);

    // This component doesn't render anything
    return null;
};

export default ClerkUserSync; 
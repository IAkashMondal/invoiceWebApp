# Clerk User Synchronization

This document explains how user data from Clerk authentication is synchronized with your backend database.

## Overview

When a user signs in with Clerk, their basic profile information is automatically synced to your backend API. This creates or updates a user record in your database, allowing you to:

1. Maintain user profiles in your own database
2. Link user-specific data (like vehicle records) to your users
3. Track user activity and sign-in history

## How It Works

### 1. Backend API Function (GlobalApi.js)

The `syncClerkUser` function handles communication with your backend:

```javascript
const syncClerkUser = async (userData) => {
  // Check if user exists by email
  // If exists: update the user
  // If new: create the user
};
```

This function does the following:

- Searches for existing users by email address
- Updates existing users with fresh Clerk data
- Creates new user records for first-time users
- Tracks sign-in dates and other metadata

### 2. React Component (ClerkUserSync.jsx)

A special React component manages the synchronization process:

```jsx
const ClerkUserSync = () => {
  const { user, isLoaded, isSignedIn } = useUser();

  useEffect(() => {
    // Syncs user data when user is signed in
  }, [isLoaded, isSignedIn, user]);

  return null; // Renders nothing
};
```

This component:

- Runs whenever a user signs in
- Extracts relevant profile data from Clerk
- Calls the syncClerkUser function to update the backend
- Handles errors gracefully with toast notifications

### 3. Integration in App Layout

The component is added to your main App layout:

```jsx
function App() {
  return (
    <>
      <ClerkUserSync />
      {/* Rest of your app */}
    </>
  );
}
```

## User Data Synchronized

The following data is synchronized from Clerk to your backend:

| Field      | Description             | Source                                |
| ---------- | ----------------------- | ------------------------------------- |
| clerkId    | Unique Clerk user ID    | user.id                               |
| email      | Primary email address   | user.primaryEmailAddress.emailAddress |
| firstName  | User's first name       | user.firstName                        |
| lastName   | User's last name        | user.lastName                         |
| imageUrl   | Profile image URL       | user.imageUrl                         |
| lastSignIn | Last sign-in timestamp  | Generated on sync                     |
| dateJoined | First registration date | Generated on first sync               |

## Required Backend Setup

For this to work, you need a `clerk-users` collection in your Strapi backend with these fields:

1. clerkId (Text)
2. email (Email, unique)
3. firstName (Text)
4. lastName (Text)
5. imageUrl (Text)
6. lastSignIn (DateTime)
7. dateJoined (DateTime)

## Troubleshooting

If user synchronization fails:

1. Check browser console for specific error messages
2. Verify your Strapi backend is running and accessible
3. Check that the clerk-users collection exists with correct fields
4. Ensure proper authentication for the API endpoints

## Security Considerations

- The synchronization happens client-side after successful authentication
- Your API should have proper validation to prevent unauthorized creation of users
- Consider implementing rate limiting on the clerk-users endpoints

## Extending Functionality

You can extend this synchronization to:

- Track additional user metadata
- Sync user roles and permissions
- Implement custom onboarding flows for new users
- Create user-specific initialization tasks

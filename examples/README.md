# User Management Integration Guide

This guide provides instructions for integrating Clerk authentication with your Strapi backend.

## Steps to Setup and Use the Integration

### 1. Strapi Setup

Ensure your Strapi backend has the `clerck-webhooks` collection type with these fields:

```json
{
  "kind": "collectionType",
  "collectionName": "clerck_webhooks",
  "info": {
    "singularName": "clerck-webhook",
    "pluralName": "clerck-webhooks",
    "displayName": "ClerkWebhook",
    "description": ""
  },
  "options": {
    "draftAndPublish": true
  },
  "attributes": {
    "ClerkuserName": {
      "type": "string"
    },
    "Clerk_First_name": {
      "type": "string"
    },
    "Clerk_Last_Name": {
      "type": "string"
    },
    "Clerk_Full_Name": {
      "type": "string"
    },
    "ClerkPhonenumber": {
      "type": "biginteger"
    },
    "Clerk_Email": {
      "type": "email"
    },
    "Userlimit": {
      "type": "integer"
    },
    "UserCurrentBalance": {
      "type": "integer"
    },
    "UserPreviousBalance": {
      "type": "integer"
    },
    "clerkID": {
      "type": "text"
    },
    "ClerkLastSignIn": {
      "type": "datetime"
    },
    "userTotalQuantity": {
      "type": "integer"
    },
    "userPersonalQuantity": {
      "type": "integer"
    },
    "Clerk_ImageUrl": {
      "type": "text"
    },
    "RemaningCapacity": {
      "type": "integer"
    }
  }
}
```

### 2. API Integration

Use these functions from `GlobalApi.js` to sync user data:

- `createOrUpdateClerkUser`: Main function to create or update a user in Strapi
- `syncClerkUser`: Legacy function (backward compatibility)
- `updateUserLimits`: Function to update only specific fields (Userlimit, etc.)

### 3. Integration in Your App

Add the `ClerkUserSync` component to your app to automatically sync user data:

```jsx
import { ClerkProvider } from "@clerk/clerk-react";
import ClerkUserSync from "./path/to/ClerkUserSync";

function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <ClerkUserSync />
      <YourApp />
    </ClerkProvider>
  );
}
```

### 4. Admin Panel Usage

The Admin panel now correctly handles user data by:

1. Reading from the clerck-webhooks collection
2. Displaying user information in a table
3. Allowing updates to user limits and balances (except Max CTF)

## Troubleshooting

- **404 Errors**: Ensure the clerck-webhooks collection exists with the exact field names
- **Validation Errors**: Check the field types match between your frontend and backend
- **Missing User Data**: Verify the user sync happens on login by checking console logs

## API Reference

See `GlobalApi.js` documentation comments for detailed information on each function.

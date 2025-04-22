import { ClerkProvider } from "@clerk/clerk-react";
import ClerkUserSync from "./ClerkUserSyncExample";
import { Toaster } from "sonner";
import { Routes, Route, BrowserRouter } from "react-router-dom";

// Your main app components
import InvoiceHeader from "../src/components/Customs/InvoiceHeader";

// Sample Dashboard component (just for illustration)
const Dashboard = () => (
    <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>This is a protected dashboard page. Only authenticated users can see this.</p>
    </div>
);

// Sample Home component (just for illustration)
const Home = () => (
    <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Home</h1>
        <p>Welcome to our application. Please sign in to access more features.</p>
    </div>
);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function TestApp() {
    if (!PUBLISHABLE_KEY) {
        throw new Error("Missing Clerk Publishable Key");
    }

    return (
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
            {/* Add ClerkUserSync component - this will handle user data syncing automatically */}
            <ClerkUserSync />

            <BrowserRouter>
                <InvoiceHeader />
                <Toaster position="top-center" />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </BrowserRouter>
        </ClerkProvider>
    );
}

export default TestApp;

/**
 * HOW THIS WORKS:
 * 
 * 1. The ClerkProvider wraps our entire application
 * 2. The ClerkUserSync component is added as a direct child of ClerkProvider
 * 3. ClerkUserSync will automatically:
 *    - Monitor when a user signs in
 *    - Sync user data with our Strapi backend
 *    - Update user info when it changes
 * 4. The rest of the app works normally with Clerk authentication
 */ 
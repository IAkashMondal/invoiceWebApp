import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from './auth/sign-in/index.jsx';
import Home from './apps/Landing/Home.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import Dashboard from './apps/Dashboard/Dashboard.jsx';
import EditRoyalty from './apps/Dashboard/create-royalty/[royaltyID]/edit/index.jsx';
import VehicleDetailPage from './Testing/VehicleDetailPage.jsx';
import RoyaltyPreview from './apps/Dashboard/create-royalty/[royaltyID]/edit/Components/RoyaltyPreview.jsx';



// ✅ Fetch Clerk Publishable Key Correctly
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("❌ Missing Publishable Key - Check .env.local or Vercel!");
}


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/dashboard/create-royalty/:royaltyID/edit", element: <EditRoyalty /> },
      { path: "/recharge", element: "recharge" },
      { path: "/Royalty-Download", element: <RoyaltyPreview /> }
    ]
  },
  { path: "/", element: <Home /> },
  { path: "/auth/sign-in", element: <SignInPage /> },
  // { path: "mdtcl.wb.gov.in/WBMD/Page/:echid", element: <VehicleDetailPage /> },
  { path: `/WBMD/Page/each/aspx/id/:EchallanId/S/24-25/RPS`, element: <VehicleDetailPage /> },
  // { path: "mdtcl.wb.gov.in/WBMD/Page/ech.aspxx?:EChallanId/S/24-25/RPS", element: <VehicleDetailPage /> },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);

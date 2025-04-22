import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignInPage from './auth/sign-in/index.jsx';
import Home from './apps/Landing/Home.jsx';
import { ClerkProvider } from '@clerk/clerk-react';
import Dashboard from './apps/Dashboard/Dashboard.jsx';
import EditRoyalty from './apps/Dashboard/create-royalty/[royaltyID]/edit/index.jsx';
import FeedbackFrom from './apps/FedBack/FeedbackFrom.jsx';
import InvoiceDashboard from './apps/Invoice/Dashboard/InvoiceDashboard.jsx';
import RechargePage from './apps/Dashboard/Recharge/Recharge.jsx';
import Career from './apps/Others/Carreer.jsx';
import TermsAndConditions from './apps/Others/T&C.jsx';
import About from './apps/Others/About.jsx';
import ContactPage from './apps/Others/Contact.jsx';
import Graph from './apps/Dashboard/Recharge/Graph.jsx';
import AdminPanel from './apps/Admin/AdminPanel.jsx';

// ✅ Fetch Clerk Publishable Key Correctly
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const ViteUrl = import.meta.env.VITE_REDIRECT
if (!PUBLISHABLE_KEY) {
  throw new Error("❌ Missing Publishable Key - Check .env.local or Vercel!");
}


const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      { path: `${ViteUrl}`, element: <Dashboard /> },
      { path: "/dashboard/feedback", element: <FeedbackFrom /> },
      { path: `${ViteUrl}/:royaltyID/edit`, element: <EditRoyalty /> },
      { path: "/recharge", element: <RechargePage /> },
      { path: "/dashboard/graph", element: <Graph /> },
      { path: "/dashboard/admin", element: <AdminPanel /> },
    ]
  },
  { path: "/", element: <Home /> },
  { path: "/auth/sign-in", element: <SignInPage /> },
  { path: "/dashboard", element: <InvoiceDashboard /> },
  { path: "/career", element: <Career /> },
  { path: "terms-and-condition", element: <TermsAndConditions /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <ContactPage /> }
]);
createRoot(document.getElementById('root')).render(
  <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <RouterProvider router={router} />
  </ClerkProvider>
);


import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import { useUser } from '@clerk/clerk-react';
import { Toaster } from 'sonner';
import InvoiceHeader from './components/Customs/InvoiceHeader';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"/auth/sign-in"} />
  }
  return (
    <>
      <InvoiceHeader />
      <Outlet />
      <Toaster id="no-print" />
    </>
  )
}

export default App

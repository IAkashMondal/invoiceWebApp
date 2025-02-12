
import { Navigate, Outlet } from 'react-router-dom'
import './App.css'
import { useUser } from '@clerk/clerk-react'
import Header from './components/Customs/Header';
import { Toaster } from 'sonner';

function App() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isSignedIn && isLoaded) {
    return <Navigate to={"/auth/sign-in"} />
  }
  return (
    <>
      <Header />
      <Outlet />
      <Toaster id="no-print" />
    </>
  )
}

export default App

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

const Header = () => {
  const { isSignedIn } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      {/* Header Section */}
      <div
        id="no-print"
        className="px-4 py-3 flex items-center justify-between shadow-md bg-white w-full"
      >
        {/* Left: Hamburger Menu (Hidden on lg screens) */}
        <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <SheetTrigger className="lg:hidden">
            <Menu className="w-6 h-6 cursor-pointer" />
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg font-semibold text-red-500">Menu</p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Max CFT</p>
              <Button className="w-full">Recharge</Button>
              <Link to="/dashboard">
                <Button variant="outline" className="w-full">Dashboard</Button>
              </Link>
              <Button variant="outline" className="w-full">Demo</Button>
              <Button variant="outline" className="w-full">Admin</Button>
              <Button variant="outline" className="w-full">Add Royalty Owners</Button>
              <Button variant="outline" className="w-full">Edit Video Permit</Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Center: Logo */}
        <Link to="/">
          <img
            width={100}
            height={100}
            src="./Logo.svg"
            alt="Logo"
            className="h-8 md:h-10 lg:h-12 w-auto"
          />
        </Link>

        {/* Right: User Actions (Responsive) */}
        <div className="flex items-center gap-4">
          {isSignedIn ? (
            <>
              {/* Show Dashboard link only on md+ screens */}
              <Link to="/dashboard" className="hidden md:block">
                <Button variant="outline">Dashboard</Button>
              </Link>
              <UserButton />
            </>
          ) : (
            <Link to="/auth/sign-in">
              <Button className="w-full sm:w-auto">Get Started</Button>
            </Link>
          )}
        </div>
      </div>

      {/* Floating Recharge Button (Visible on small screens) */}
      <div
        id="no-print"
        className="fixed bottom-6 right-6 md:right-10 z-50 sm:hidden"
      >
        <Button className="rounded-full p-4 shadow-lg">Recharge</Button>
      </div>
    </>
  );
};

export default Header;

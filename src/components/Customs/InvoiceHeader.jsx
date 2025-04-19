import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
    Menu,
    BarChart4,
    CreditCard,
    MessageSquare,
    LayoutDashboard
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";

const InvoiceHeader = () => {
    const VITE_ADMIN = import.meta.env.VITE_ADMIN_TOKEN;
    const ViteUrl = import.meta.env.VITE_REDIRECT;
    const { isSignedIn } = useUser();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loginEnable, setLoginEnable] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("OnlineID");

        if (storedToken === VITE_ADMIN) {
            setLoginEnable(true);
        }
    }, []); // Runs once when the component mounts

    // Function to close drawer when clicking a navigation link
    const handleNavClick = () => {
        setIsDrawerOpen(false);
    };

    return (
        <>
            {/* Header Section */}
            <div
                id="no-print"
                className="px-4 py-3 flex items-center justify-between shadow-md bg-white w-full"
            >
                {/* Left: Hamburger Menu (Hidden on lg screens) */}
                <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <SheetTrigger className="">
                        <Menu className="w-6 h-6 cursor-pointer" />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-semibold text-red-500">Menu</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-sm font-semibold">Max CFT</p>
                            <Link to={"/recharge"} onClick={handleNavClick}>
                                <Button className="w-full flex items-center gap-2">
                                    <CreditCard className="h-4 w-4" />
                                    <span>Recharge</span>
                                </Button>
                            </Link>
                            {
                                loginEnable ?
                                    <Link to={ViteUrl} onClick={handleNavClick}>
                                        <Button variant="outline" className="w-full flex items-center gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Button>
                                    </Link >
                                    :
                                    <Link to="/dashboard" onClick={handleNavClick}>
                                        <Button variant="outline" className="w-full flex items-center gap-2">
                                            <LayoutDashboard className="h-4 w-4" />
                                            <span>Dashboard</span>
                                        </Button>
                                    </Link >

                            }

                            <Link to="/dashboard/graph" onClick={handleNavClick}>
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <BarChart4 className="h-4 w-4" />
                                    <span>Graph</span>
                                </Button>
                            </Link>
                            <Link to="/dashboard/feedback" onClick={handleNavClick}>
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>FeedBack</span>
                                </Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Center: Logo */}
                {
                    loginEnable ? <Link to={ViteUrl}>
                        <img
                            width={180}
                            height={100}
                            src="./public/InLogo.png"
                            alt="Logo"
                            className="h-8 md:h-10 lg:h-12 w-auto"
                        />
                    </Link> :
                        <Link to="/">
                            <img
                                width={180}
                                height={100}
                                src="./public/InLogo.png"
                                alt="Logo"
                                className="h-8 md:h-10 lg:h-12 w-auto"
                            />
                        </Link>
                }


                {/* Right: User Actions (Responsive) */}
                <div className="flex items-center gap-4">
                    {isSignedIn ? (
                        <>
                            {/* Show Dashboard link only on md+ screens */}
                            <Link to="/dashboard-create-roylaty" className="hidden md:block">
                                {/* <Button variant="outline">Dashboard</Button> */}
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
                <Link to={"/recharge"}>
                    <Button className="rounded-full p-4 shadow-lg flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Recharge</span>
                    </Button>
                </Link>
            </div>
        </>
    );
};

export default InvoiceHeader;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@clerk/clerk-react";
import {
    Menu,
    BarChart4,
    CreditCard,
    MessageSquare,
    LayoutDashboard,
    UserCog,
    Archive,
    Droplet,
    Box,
    Boxes
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { findMatchingClerkUser } from "../../../Apis/Clerk/ClerkApis";

const InvoiceHeader = () => {
    const VITE_ADMIN = import.meta.env.VITE_ADMIN_TOKEN;
    const ViteUrl = import.meta.env.VITE_REDIRECT;
    const { isSignedIn, user } = useUser();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [loginEnable, setLoginEnable] = useState(false);

    // User stat states
    const [userData, setUserData] = useState(null);
    const [userTotalQuantity, setUserTotalQuantity] = useState(0);
    const [userPersonalQuantity, setUserPersonalQuantity] = useState(0);
    const [remainingCapacity, setRemainingCapacity] = useState(0);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Log Clerk user data for debugging
    useEffect(() => {
        if (isSignedIn && user) {
          
            console.log("Full user object:", user);
            console.log("======================");

            // Find matching user in clerck-webhooks
            const fetchMatchingUser = async () => {
                try {
                    setDataLoaded(false); // Reset loaded state while fetching
                    const match = await findMatchingClerkUser(user);
                    if (match) {
                        console.log("========== MATCHING USER FOUND! ==========");
                        console.log("Match criteria: email, name, username, and ID");
                        console.log("User found in clerck-webhooks database:");
                        console.log("ID:", match.id);
                        console.log("Clerk ID:", match.attributes?.clerkID);
                        console.log("Email:", match.attributes?.Clerk_Email);
                        console.log("Name:", match.attributes?.Clerk_Full_Name ||
                            `${match.attributes?.Clerk_First_name || ""} ${match.attributes?.Clerk_Last_Name || ""}`);
                        console.log("Username:", match.attributes?.ClerkuserName);
                        console.log("Balance:", match.attributes?.UserCurrentBalance);
                        console.log("Limit:", match.attributes?.Userlimit);
                        console.log("Total Quantity:", match.attributes?.userTotalQuantity);
                        console.log("Personal Quantity:", match.attributes?.userPersonalQuantity);
                        console.log("Full matched user data:", match);
                        console.log("===========================================");

                        // Store user data in localStorage for admin panel access
                        

                        // Update state with user data
                        setUserData(match);

                        // Set specific user stats - check both in attributes and directly on the object
                        // First try attributes, then direct properties if attributes don't have the value
                        const total = Number(match.attributes?.userTotalQuantity || match.userTotalQuantity || 0);
                        const personal = Number(match.attributes?.userPersonalQuantity || match.userPersonalQuantity || 0);
                        const limit = Number(match.attributes?.Userlimit || match.Userlimit || 0);

                        // Check for remaining capacity in both places
                        let remaining = Number(match.attributes?.RemaningCapacity || match.RemaningCapacity || 0);
                        // If remaining capacity wasn't explicitly set, calculate it
                        if (remaining === 0 && limit > 0) {
                            remaining = limit > total ? limit - total : 0;
                        }

                        console.log("Extracted user data:", {
                            total,
                            personal,
                            limit,
                            remaining,
                            rawTotal: match.attributes?.userTotalQuantity || match.userTotalQuantity,
                            rawPersonal: match.attributes?.userPersonalQuantity || match.userPersonalQuantity,
                            rawLimit: match.attributes?.Userlimit || match.Userlimit,
                            rawRemaining: match.attributes?.RemaningCapacity || match.RemaningCapacity
                        });

                        setUserTotalQuantity(total);
                        setUserPersonalQuantity(personal);
                        setRemainingCapacity(remaining);
                        setDataLoaded(true); // Mark data as loaded after all state updates
                    } else {
                        console.log("No matching user found in clerck-webhooks database");
                       
                        setUserData(null);
                        setDataLoaded(false);
                    }
                } catch (error) {
                    console.error("Error finding matching user:", error);
                    setDataLoaded(false);
                }
            };

            // fetchMatchingUser();
        }
    }, [isSignedIn, user]);

    
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
                    <SheetContent side="left" className="w-80 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-lg font-semibold text-red-500">Menu</p>
                        </div>

                        {/* Premium User Stats Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-6 shadow-md border border-blue-100">
                            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <Droplet className="h-4 w-4 mr-1.5 text-blue-500" />
                                <span>Resource Usage</span>
                            </h3>

                            {/* Three Key Metrics - Premium Design */}
                            <div className="space-y-4">
                                {/* Total Usage Card */}
                                <div className="bg-white rounded-lg shadow-sm border border-blue-100 overflow-hidden">
                                    <div className="p-3 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                <Boxes className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs font-medium text-gray-500">Remaining</p>
                                                <p className="text-lg font-semibold text-blue-700">
                                                    {userData && dataLoaded && remainingCapacity  || "0"}
                                                    <span className="text-xs ml-1 text-gray-500">CFT</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Remaining & Personal Usage Row */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* Remaining Capacity */}
                                    <div className="bg-white rounded-lg shadow-sm border border-green-100 overflow-hidden">
                                        <div className="p-3">
                                            <div className="bg-green-100 p-1.5 rounded-lg w-fit mb-1.5">
                                                <Archive className="h-4 w-4 text-green-600" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-500">Total Usage</p>
                                            <p className="text-lg font-semibold text-green-600">
                                                {userData && dataLoaded && userTotalQuantity || "0"}
                                                <span className="text-xs ml-1 text-gray-500">CFT</span>
                                            </p>
                                        </div>
                                    </div>

                                    {/* Personal Usage */}
                                    <div className="bg-white rounded-lg shadow-sm border border-purple-100 overflow-hidden">
                                        <div className="p-3">
                                            <div className="bg-purple-100 p-1.5 rounded-lg w-fit mb-1.5">
                                                <Box className="h-4 w-4 text-purple-600" />
                                            </div>
                                            <p className="text-xs font-medium text-gray-500">Personal</p>
                                            <p className="text-lg font-semibold text-purple-600">
                                                {userData && dataLoaded && userPersonalQuantity || "0"}
                                                <span className="text-xs ml-1 text-gray-500">CFT</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
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
                            <Link to="/dashboard/admin" onClick={handleNavClick}>
                                <Button variant="outline" className="w-full flex items-center gap-2">
                                    <UserCog className="h-4 w-4" />
                                    <span>Admin</span>
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

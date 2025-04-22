import { useState, useEffect } from "react";
import { getAllClerkUsers, updateUserLimits } from "../../../Apis/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search, User, CreditCard, Activity, DollarSign, Loader2, Calendar, Phone, Clock } from "lucide-react";

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        creditLimit: "",
        // maxCTF: "",
        balance: "",
        Userlimit: "",
        UserCurrentBalance: "",
        UserPreviousBalance: "",
        userTotalQuantity: "",
        userPersonalQuantity: ""
    });
    const [activeTab, setActiveTab] = useState("users");
    const [showMobileMenu, setShowMobileMenu] = useState(false);

    // Fetch users on component mount and when page changes
    useEffect(() => {
        fetchUsers(page);

        // Check for matched user in localStorage - only run once on mount
        const matchedUserData = localStorage.getItem("matchedClerkUser");
        if (matchedUserData) {
            try {
                const matchedUser = JSON.parse(matchedUserData);
                console.log("Found matched user data in localStorage:", matchedUser);

                // Check if this user is already in the users list
                const existingUserIndex = users.findIndex(user =>
                    user.id === matchedUser.id ||
                    (user.attributes?.clerkID && user.attributes.clerkID === matchedUser.attributes?.clerkID)
                );

                if (existingUserIndex === -1) {
                    // Add the matched user to the list if not already there
                    const formattedUser = {
                        id: matchedUser.id,
                        attributes: matchedUser.attributes || {}
                    };

                    console.log("Adding matched user to display:", formattedUser);
                    setUsers(prevUsers => [formattedUser, ...prevUsers]);
                } else {
                    console.log("Matched user already in list at index:", existingUserIndex);
                }
            } catch (err) {
                console.error("Error parsing matched user data:", err);
            }
        }
    }, [page]); // Only depend on page changes

    // Function to fetch users from API
    const fetchUsers = async (pageNum) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getAllClerkUsers(pageNum, 10);

            console.log("API Response:", response);

            // Ensure we have valid data and map it to expected structure
            const userData = Array.isArray(response?.data?.data) ?
                response.data.data.map(user => {
                    // Check what format the data is in
                    const rawData = user.attributes || user;

                    // Create a properly structured user object
                    return {
                        id: user.id,
                        attributes: {
                            // Map fields from API to expected attributes
                            Clerk_Full_Name: rawData.Clerk_Full_Name ||
                                rawData.ClerkuserName ||
                                `${rawData.Clerk_First_name || ''} ${rawData.Clerk_Last_Name || ''}`,
                            ClerkuserName: rawData.ClerkuserName,
                            Clerk_First_name: rawData.Clerk_First_name || rawData.Clerk_First_Name,
                            Clerk_Last_Name: rawData.Clerk_Last_Name,
                            Clerk_Email: rawData.Clerk_Email || rawData.email,
                            ClerkPhonenumber: rawData.ClerkPhonenumber,
                            clerkID: rawData.clerkID || user.id?.toString(),
                            Userlimit: rawData.Userlimit || rawData.creditLimit,
                            maxCTF: rawData.maxCTF,
                            UserCurrentBalance: rawData.UserCurrentBalance || rawData.balance,
                            UserPreviousBalance: rawData.UserPreviousBalance,
                            userTotalQuantity: rawData.userTotalQuantity,
                            userPersonalQuantity: rawData.userPersonalQuantity,
                            ClerkLastSignIn: rawData.ClerkLastSignIn,
                            Clear_time: rawData.Clear_time
                        }
                    };
                }) : [];

            setUsers(userData);

            // Set pagination info
            const pagination = response?.data?.meta?.pagination;
            if (pagination) {
                setTotalPages(pagination.pageCount || 1);
            } else {
                setTotalPages(1);
            }

        } catch (err) {
            console.error("Failed to fetch users:", err);
            if (err.message === "User database not available. Please contact support.") {
                setError("Admin API endpoints are not available. Please ensure the backend services are properly configured.");
            } else {
                setError("Failed to load users. Please try again.");
            }
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    // Handle user search
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user => {
        if (!searchTerm.trim()) return true;
        if (!user || !user.attributes) return false;

        const userData = user.attributes || {};
        const searchLower = searchTerm.toLowerCase();

        // Enhanced search - check multiple name fields with API variations
        const firstName = userData.Clerk_First_name || userData.Clerk_First_Name || '';
        const lastName = userData.Clerk_Last_Name || '';
        const userName = userData.ClerkuserName || '';
        const fullName = userData.Clerk_Full_Name || `${firstName} ${lastName}` || userName || '';

        // Email may come in different fields
        const email = userData.Clerk_Email || userData.email || '';

        // Phone number may be string or number
        const phone = userData.ClerkPhonenumber ? String(userData.ClerkPhonenumber) : '';

        // ID may be in attributes or directly on user
        const id = userData.clerkID || user.id || '';

        return (
            fullName.toLowerCase().includes(searchLower) ||
            email.toLowerCase().includes(searchLower) ||
            phone.includes(searchTerm) ||
            (id && String(id).toLowerCase().includes(searchLower))
        );
    });

    // Handle edit button click
    const handleEditClick = (user) => {
        setEditingUser(user);
        // Ensure we have attributes to work with
        const attrs = user?.attributes || {};
        setEditForm({
            creditLimit: attrs.creditLimit || "",
            maxCTF: attrs.maxCTF || "",
            balance: attrs.balance || "",
            Userlimit: attrs.Userlimit || "",
            UserCurrentBalance: attrs.UserCurrentBalance || "",
            UserPreviousBalance: attrs.UserPreviousBalance || "",
            userTotalQuantity: attrs.userTotalQuantity || "",
            userPersonalQuantity: attrs.userPersonalQuantity || ""
        });
    };

    // Handle form input changes
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setEditForm({
            ...editForm,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async () => {
        if (!editingUser) return;

        try {
            setLoading(true);

            // Prepare data for update with correct field names based on the error message
            const updateData = {};

            // Only include fields that actually changed and with exact names matching schema
            if (editForm.Userlimit) updateData.Userlimit = Number(editForm.Userlimit);
            if (editForm.UserCurrentBalance) updateData.UserCurrentBalance = Number(editForm.UserCurrentBalance);
            if (editForm.UserPreviousBalance) updateData.UserPreviousBalance = Number(editForm.UserPreviousBalance);
            if (editForm.userTotalQuantity) updateData.userTotalQuantity = Number(editForm.userTotalQuantity);
            if (editForm.userPersonalQuantity) updateData.userPersonalQuantity = Number(editForm.userPersonalQuantity);

            // Removing Max_CTF since it's causing issues
            // if (editForm.maxCTF) updateData.Max_CTF = Number(editForm.maxCTF);

            console.log("Sending user update with data:", updateData);

            if (Object.keys(updateData).length === 0) {
                toast.info("No changes to update");
                setEditingUser(null);
                return;
            }

            await updateUserLimits(editingUser.id, updateData);

            // Update local state
            setUsers(users.map(user => {
                if (user.id === editingUser.id) {
                    // Map the backend field names back to our frontend naming for display
                    const updatedAttributes = { ...user.attributes };

                    if (updateData.Userlimit) updatedAttributes.Userlimit = updateData.Userlimit;
                    if (updateData.UserCurrentBalance) updatedAttributes.UserCurrentBalance = updateData.UserCurrentBalance;
                    if (updateData.UserPreviousBalance) updatedAttributes.UserPreviousBalance = updateData.UserPreviousBalance;
                    if (updateData.userTotalQuantity) updatedAttributes.userTotalQuantity = updateData.userTotalQuantity;
                    if (updateData.userPersonalQuantity) updatedAttributes.userPersonalQuantity = updateData.userPersonalQuantity;

                    return {
                        ...user,
                        attributes: updatedAttributes
                    };
                }
                return user;
            }));

            toast.success("User information updated successfully");
            setEditingUser(null);

        } catch (err) {
            console.error("Failed to update user:", err);
            toast.error(err.response?.data?.error?.message || "Failed to update user information");
        } finally {
            setLoading(false);
        }
    };

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            // If it's already in the format we want (MM/DD/YYYY)
            if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
                return dateString;
            }

            // Otherwise parse it as ISO string
            const date = new Date(dateString);
            return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        } catch {
            return dateString; // Return as is if it can't be parsed
        }
    };

    // Check if a user is matched
    const isMatchedUser = (user) => {
        const matchedUserData = localStorage.getItem("matchedClerkUser");
        if (matchedUserData) {
            try {
                const matchedUser = JSON.parse(matchedUserData);
                return user.id === matchedUser.id ||
                    (user.attributes?.clerkID && user.attributes.clerkID === matchedUser.attributes?.clerkID);
            } catch {
                return false;
            }
        }
        return false;
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
            {/* Sidebar for desktop */}
            <div className={`w-64 bg-gray-900 text-white hidden md:block flex-shrink-0`}>
                <div className="p-6">
                    <h1 className="text-2xl font-bold mb-6">ADMIN PANEL</h1>

                    <nav className="space-y-4">
                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => setActiveTab('users')}
                        >
                            <User className="mr-2 h-5 w-5" />
                            Users
                        </button>

                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'credits' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => setActiveTab('credits')}
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Credit Limits
                        </button>

                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'maxctf' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => setActiveTab('maxctf')}
                        >
                            <Activity className="mr-2 h-5 w-5" />
                            Max CTF
                        </button>

                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'balance' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => setActiveTab('balance')}
                        >
                            <DollarSign className="mr-2 h-5 w-5" />
                            Balance
                        </button>
                    </nav>
                </div>
            </div>

            {/* Mobile Navbar */}
            <div className="md:hidden bg-gray-900 text-white p-4 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold">ADMIN PANEL</h1>
                    <button
                        className="p-2 rounded-md bg-gray-800"
                        onClick={() => setShowMobileMenu(!showMobileMenu)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {showMobileMenu && (
                    <nav className="mt-4 space-y-2">
                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'users' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => {
                                setActiveTab('users');
                                setShowMobileMenu(false);
                            }}
                        >
                            <User className="mr-2 h-5 w-5" />
                            Users
                        </button>

                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'credits' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => {
                                setActiveTab('credits');
                                setShowMobileMenu(false);
                            }}
                        >
                            <CreditCard className="mr-2 h-5 w-5" />
                            Credit Limits
                        </button>

                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'maxctf' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => {
                                setActiveTab('maxctf');
                                setShowMobileMenu(false);
                            }}
                        >
                            <Activity className="mr-2 h-5 w-5" />
                            Max CTF
                        </button>

                        <button
                            className={`flex items-center w-full py-2 px-4 rounded ${activeTab === 'balance' ? 'bg-blue-600' : 'hover:bg-gray-800'}`}
                            onClick={() => {
                                setActiveTab('balance');
                                setShowMobileMenu(false);
                            }}
                        >
                            <DollarSign className="mr-2 h-5 w-5" />
                            Balance
                        </button>
                    </nav>
                )}
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8">
                <Card className="p-4 md:p-6 max-w-6xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Manage Users</h2>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Search by name, email, phone, or ID..."
                            className="pl-10 pr-4 py-2"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Users Table */}
                    {loading && !users.length ? (
                        <div className="flex justify-center items-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                            <span className="ml-2 text-gray-600">Loading users...</span>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 p-4 rounded-md">
                            <div className="text-red-600 font-medium mb-2">{error}</div>
                            <div className="text-sm text-gray-600 mb-3">
                                {error.includes("not available") ? (
                                    <>
                                        <p>The application is unable to connect to the admin API endpoints.</p>
                                        <p className="mt-1">Possible solutions:</p>
                                        <ul className="list-disc ml-5 mt-1">
                                            <li>Check if the backend service is running</li>
                                            <li>Verify that the API endpoints are correctly configured</li>
                                            <li>Ensure that the API Key and Base URL are properly set</li>
                                        </ul>
                                    </>
                                ) : (
                                    <p>There was an error connecting to the server. Please try again or contact support.</p>
                                )}
                            </div>
                            <Button className="mt-2" onClick={() => fetchUsers(page)}>Retry</Button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full table-auto">
                                    <thead className="text-left bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Email/Phone</th>
                                            <th className="px-4 py-3">Credit Limit</th>
                                            <th className="px-4 py-3">Balance</th>
                                            <th className="px-4 py-3">Quantity</th>
                                            <th className="px-4 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredUsers.length > 0 ? (
                                            filteredUsers.map((user, index) => (
                                                <tr key={user.id || index} className={`hover:bg-gray-50 ${isMatchedUser(user) ? 'bg-green-50' : ''}`}>
                                                    <td className="px-4 py-3">
                                                        <div className="font-medium flex items-center">
                                                            {isMatchedUser(user) && (
                                                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2" title="Current logged-in user"></span>
                                                            )}
                                                            {user?.attributes?.Clerk_Full_Name ||
                                                                user?.attributes?.ClerkuserName ||
                                                                `${user?.attributes?.Clerk_First_name || user?.attributes?.Clerk_First_Name || ''} ${user?.attributes?.Clerk_Last_Name || ''}`}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            ID: {user?.id || user?.attributes?.clerkID || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            {user?.attributes?.Clerk_Email || user?.attributes?.email || 'N/A'}
                                                        </div>
                                                        <div className="text-xs text-gray-500 flex items-center">
                                                            <Phone className="h-3 w-3 mr-1" />
                                                            {user?.attributes?.ClerkPhonenumber || 'N/A'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            Limit: {user?.attributes?.Userlimit || user?.attributes?.creditLimit || '0'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Max CTF: {user?.attributes?.maxCTF || '0'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            Current: ${user?.attributes?.UserCurrentBalance || user?.attributes?.balance || '0'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Previous: ${user?.attributes?.UserPreviousBalance || '0'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <div>
                                                            Total: {user?.attributes?.userTotalQuantity || '0'}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Personal: {user?.attributes?.userPersonalQuantity || '0'}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    className="bg-blue-600 hover:bg-blue-700"
                                                                    onClick={() => handleEditClick(user)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-md" aria-describedby="edit-user-description">
                                                                <DialogHeader>
                                                                    <DialogTitle>Edit User Limits</DialogTitle>
                                                                </DialogHeader>
                                                                <div id="edit-user-description" className="sr-only">
                                                                    Edit limits and balance information for this user
                                                                </div>
                                                                <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="grid gap-2">
                                                                            <label>Credit Limit</label>
                                                                            <Input
                                                                                name="Userlimit"
                                                                                type="number"
                                                                                value={editForm.Userlimit}
                                                                                onChange={handleFormChange}
                                                                                placeholder="Enter credit limit"
                                                                            />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <label>Max CTF</label>
                                                                            <Input
                                                                                name="maxCTF"
                                                                                type="number"
                                                                                value={editForm.maxCTF}
                                                                                onChange={handleFormChange}
                                                                                placeholder="Enter max CTF"
                                                                                disabled
                                                                                title="This field cannot be updated at this time"
                                                                            />
                                                                            <p className="text-xs text-amber-600">This field is read-only</p>
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="grid gap-2">
                                                                            <label>Current Balance</label>
                                                                            <Input
                                                                                name="UserCurrentBalance"
                                                                                type="number"
                                                                                value={editForm.UserCurrentBalance}
                                                                                onChange={handleFormChange}
                                                                                placeholder="Enter current balance"
                                                                            />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <label>Previous Balance</label>
                                                                            <Input
                                                                                name="UserPreviousBalance"
                                                                                type="number"
                                                                                value={editForm.UserPreviousBalance}
                                                                                onChange={handleFormChange}
                                                                                placeholder="Enter previous balance"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                        <div className="grid gap-2">
                                                                            <label>Total Quantity</label>
                                                                            <Input
                                                                                name="userTotalQuantity"
                                                                                type="number"
                                                                                value={editForm.userTotalQuantity}
                                                                                onChange={handleFormChange}
                                                                                placeholder="Enter total quantity"
                                                                            />
                                                                        </div>
                                                                        <div className="grid gap-2">
                                                                            <label>Personal Quantity</label>
                                                                            <Input
                                                                                name="userPersonalQuantity"
                                                                                type="number"
                                                                                value={editForm.userPersonalQuantity}
                                                                                onChange={handleFormChange}
                                                                                placeholder="Enter personal quantity"
                                                                            />
                                                                        </div>
                                                                    </div>

                                                                    <div className="mt-2">
                                                                        <h4 className="font-medium mb-2">User Information</h4>
                                                                        <div className="bg-gray-50 p-3 rounded-md text-sm">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <User className="h-4 w-4 text-gray-500" />
                                                                                <span className="font-medium">
                                                                                    {editingUser?.attributes?.Clerk_Full_Name ||
                                                                                        editingUser?.attributes?.ClerkuserName ||
                                                                                        `${editingUser?.attributes?.Clerk_First_name || ''} ${editingUser?.attributes?.Clerk_Last_Name || ''}` ||
                                                                                        'Unnamed User'}
                                                                                </span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                                                <span>Last Sign In: {formatDate(editingUser?.attributes?.ClerkLastSignIn) || 'N/A'}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-2">
                                                                                <Clock className="h-4 w-4 text-gray-500" />
                                                                                <span>Time: {editingUser?.attributes?.Clear_time || 'N/A'}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <DialogFooter>
                                                                    <Button type="submit" onClick={handleSubmit}>
                                                                        {loading ? (
                                                                            <>
                                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                                Saving...
                                                                            </>
                                                                        ) : "Save Changes"}
                                                                    </Button>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                                                    No users found matching your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-6 space-x-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                        disabled={page === 1}
                                    >
                                        Previous
                                    </Button>
                                    <span className="py-2 px-4 rounded-md bg-gray-100">
                                        Page {page} of {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                        disabled={page === totalPages}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default AdminPanel; 
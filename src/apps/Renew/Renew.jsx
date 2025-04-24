import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { GetParticularVehicle, updatePurchaserDetails, updateUserQuantitiesForVehicle } from "../../../Apis/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateNewChallanID, generateTimeObject } from "../../../Apis/GlobalFunction";
import { getDynamicYearRange } from "../Dashboard/RoyaltyCard";
import { useUser } from "@clerk/clerk-react";

// Add Time to Generated Time function
const addTimeToGeneratedTime = async (generatedTime, validityInput) => {
    // Parse input as integer in days
    const validityDays = parseInt(validityInput);
    if (isNaN(validityDays)) {
        throw new Error("Invalid validity input");
    }

    // Calculate milliseconds for the given days
    const validityMilliseconds = validityDays * 24 * 60 * 60 * 1000;

    // Current time in milliseconds
    const currentTime = new Date().getTime();

    // Add validity period to current time
    const validityTimestamp = currentTime + validityMilliseconds;
    const validityDate = new Date(validityTimestamp);

    // Format validity date as DD/MM/YYYY
    const day = String(validityDate.getDate()).padStart(2, "0");
    const month = String(validityDate.getMonth() + 1).padStart(2, "0");
    const year = validityDate.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    return {
        validityTime: formattedDate,
        VerefyChallanNum: validityTimestamp
    };
};

const Renew = () => {
    const { user } = useUser();
    const { royaltyID } = useParams();
    const navigate = useNavigate();
    const [royaltyData, setRoyaltyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validityPeriod, setValidityPeriod] = useState("0");
    const [validyPreview, setValidyPreview] = useState("");
    const [prevChallanID, setPrevChallanID] = useState("");
    const [newChallanID, setNewChallanID] = useState("");
    const [newRoyaltyID, setNewRoyaltyID] = useState("");
    const [IssueDates, setIssueDates] = useState({
        generatedTime: 0,
        IssueDate: "",
        ChallandT: ""
    });
    const ViteUrl = import.meta.env.VITE_REDIRECT;

    // Get current time data and update IssueDates
    useEffect(() => {
        const { generatedTime, issueDate, ChallandT } = generateTimeObject();
        setIssueDates({
            generatedTime,
            IssueDate: issueDate,
            ChallandT
        });
    }, []);

    // Effect to handle validity calculation when royalty data is loaded
    useEffect(() => {
        if (royaltyData?.data) {
            // Get TimeDiffrence from data, default to 0 if undefined or empty
            const timeDiff = royaltyData.data.TimeDiffrence;
            const validityInput = timeDiff && timeDiff !== "" ? Number(timeDiff) : 0;
            setValidityPeriod(validityInput.toString());

            // Calculate validity using IssueDates
            handleValidityCalculation(validityInput);
        }
    }, [royaltyData?.data, IssueDates.generatedTime]);

    // One-time ID generation effect
    useEffect(() => {
        const generateIDs = async () => {
            if (!royaltyData?.data || !IssueDates.ChallandT) return;

            try {
                // Generate new challan ID only if not already generated
                if (!newChallanID) {
                    const previousChallanID = royaltyData.data.EchallanId;
                    const newChallan = generateNewChallanID(previousChallanID);
                    setNewChallanID(newChallan);
                    setPrevChallanID(previousChallanID);
                }

                // Generate new royalty ID only if not already generated
                if (!newRoyaltyID) {
                    const uuid = uuidv4();
                    setNewRoyaltyID(uuid);
                }

                // Update form data with IDs and user data
                setFormData(prev => ({
                    ...prev,
                    EchallanId: newChallanID || "",
                    EChallanNo: newChallanID ? `${newChallanID}/T/${getDynamicYearRange()}/${IssueDates.ChallandT}/PS` : "",
                    royaltyID: newRoyaltyID || "",
                    GeneratedDT: String(IssueDates.IssueDate),
                    TimeStamp: Number(IssueDates.generatedTime),
                    EChallanDT: String(IssueDates.ChallandT),
                    userEmail: user?.primaryEmailAddress?.emailAddress || '',
                    userName: user?.fullName || ''
                }));

                console.log('Generated IDs (one-time):', {
                    previousRoyaltyID: royaltyData.data.royaltyID,
                    newRoyaltyID,
                    previousChallanID: prevChallanID,
                    newChallanID
                });
            } catch (error) {
                console.error('Error generating IDs:', error);
                toast.error('Error generating new IDs');
            }
        };

        generateIDs();
    }, [royaltyData?.data, IssueDates.ChallandT]); // Only depend on initial data load and ChallandT

    const handleValidityCalculation = async (validityInput) => {
        try {
            // Convert validity input to string (required by addTimeToGeneratedTime)
            const validityInputStr = validityInput.toString();

            // Calculate new validity date using IssueDates.generatedTime
            const { validityTime, VerefyChallanNum } = await addTimeToGeneratedTime(IssueDates.generatedTime, validityInputStr);

            setValidyPreview(validityTime);

            // Update form data with new validity
            setFormData(prev => ({
                ...prev,
                ValidityDate: validityTime,
                VerefyChallanNum: VerefyChallanNum,
                TimeDiffrence: validityInputStr,
                IssueDate: IssueDates.IssueDate
            }));

            // Update royalty data with time information
            setRoyaltyData(prev => ({
                ...prev,
                data: {
                    ...prev.data,
                    IssueDate: IssueDates.IssueDate,
                    ValidityDate: validityTime
                }
            }));

        } catch (error) {
            console.error("Error calculating validity time:", error);
            toast.error("Error calculating validity");
        }
    };

    const [formData, setFormData] = useState({
        Registration_No: "",
        royaltyID: "",
        userEmail: user?.primaryEmailAddress?.emailAddress || "",
        userName: user?.fullName || "",
        quantity: "",
        NameofPurchaser: "",
        VehicleType: "",
        VehicleCapacity: "",
        VehicleQunText: "",
        PurchaserMobileNo: "",
        PurchaserDristic: "",
        OwnerName: "",
        SandID: "",
        River: "",
        OwnerDistrict: "",
        PurchaserAdd: "",
        PoliceStation: "",
        EChallanDT: "",
        GeneratedDT: "",
        TimeStamp: 0,
        IssueDate: "",
        CreatedTimeStamp: "0",
        ValidityDate: "",
        VerefyChallanNum: "",
        EChallanNo: "",
        TimeDiffrence: ""
    });

    // Fetch royalty data based on ID
    useEffect(() => {
        const fetchRoyaltyData = async () => {
            if (!royaltyID) {
                setError("Royalty ID is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await GetParticularVehicle(royaltyID);
                if (response?.data) {
                    setRoyaltyData(response.data);
                    const data = response.data.data || {};

                    // Set form data with existing values but don't set royaltyID here
                    setFormData(prev => ({
                        ...prev,
                        Registration_No: data.Registration_No,
                        userEmail: data.userEmail,
                        userName: data.userName,
                        quantity: data.quantity,
                        NameofPurchaser: data.NameofPurchaser,
                        VehicleType: data.VehicleType,
                        VehicleCapacity: data.VehicleCapacity,
                        VehicleQunText: data.VehicleQunText,
                        PurchaserMobileNo: data.PurchaserMobileNo,
                        PurchaserDristic: data.PurchaserDristic,
                        OwnerName: data.OwnerName,
                        SandID: data.SandID,
                        River: data.River,
                        OwnerDistrict: data.OwnerDistrict,
                        PurchaserAdd: data.PurchaserAdd,
                        PoliceStation: data.PoliceStation,
                    }));

                    // Calculate initial validity
                    handleValidityCalculation(Number(data.TimeDiffrence));
                } else {
                    setError("Royalty not found");
                }
            } catch (error) {
                console.error("Error fetching royalty data:", error);
                setError("Failed to fetch royalty data");
            } finally {
                setLoading(false);
            }
        };

        fetchRoyaltyData();
    }, [royaltyID]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // First update the purchaser details
            await updatePurchaserDetails(royaltyID, formData);

            // Then update the user quantities based on vehicle number
            if (formData.Registration_No && formData.quantity) {
                await updateUserQuantitiesForVehicle(
                    formData.Registration_No,
                    formData.quantity,
                    user
                );
            }

            console.log("Form Data sent successfully:", formData);
            toast.success("Royalty renewed successfully!");

            // Navigate back to dashboard after successful update
            setTimeout(() => {
                navigate(ViteUrl);
            }, 1000);
        } catch (error) {
            console.error("Error updating royalty data:", error);
            toast.error("Failed to renew royalty. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 text-xl mb-4">{error}</div>
                <Button onClick={() => navigate(ViteUrl)}>
                    Back to Dashboard
                </Button>
            </div>
        );
    }
    console.log("formData   ", formData)
    return (
        <div className="container mx-auto max-w-md p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Renew Royalty</h1>

            {royaltyData && (
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Previous Royalty ID
                        </label>
                        <Input
                            value={royaltyData.data?.royaltyID || "N/A"}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Royalty ID
                        </label>
                        <Input
                            value={newRoyaltyID || "Generating..."}
                            disabled
                            className="bg-gray-100 font-medium text-blue-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Registration Number
                        </label>
                        <Input
                            value={formData.Registration_No}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Previous Challan ID
                        </label>
                        <Input
                            value={prevChallanID || "N/A"}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Challan ID
                        </label>
                        <Input
                            value={newChallanID || "Generating..."}
                            disabled
                            className="bg-gray-100 font-medium text-green-600"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Current Validity
                        </label>
                        <Input
                            value={royaltyData.data?.ValidityDate || "Not available"}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Validity Period (Days)
                        </label>
                        <Input
                            value={validityPeriod}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Validity Date
                        </label>
                        <Input
                            value={validyPreview || "Calculating..."}
                            disabled
                            className="bg-gray-100 font-medium text-green-700"
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="w-1/2"
                            onClick={() => navigate(ViteUrl)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="w-1/2 bg-green-600 hover:bg-green-700"
                        >
                            Renew Royalty
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Renew; 
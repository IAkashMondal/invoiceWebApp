import { GetParticularVehicle, updatePurchaserDetails } from "../../../Apis/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateTimeObject } from "../../../Apis/GlobalFunction";
import { useUser } from "@clerk/clerk-react";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

// Helper functions
const getDynamicYearRange = () => {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1;
    return `${currentYear}-${nextYear}`;
};

const generateNewChallanID = (previousChallanID) => {
    if (!previousChallanID) return "1";
    const numericPart = parseInt(previousChallanID);
    return isNaN(numericPart) ? "1" : String(numericPart + 1);
};

const Renew = () => {
    const { user } = useUser();
    const { royaltyID } = useParams();
    const navigate = useNavigate();
    const [royaltyData, setRoyaltyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const ViteUrl = import.meta.env.VITE_REDIRECT;

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

    const handleRenew = async () => {
        if (!royaltyData) return;
        setUpdating(true);

        try {
            const newRoyaltyID = uuidv4();
            const previousChallanID = royaltyData.data.EchallanId;
            const newChallanID = generateNewChallanID(previousChallanID);
            const { IssueDate, ChallandT } = generateTimeObject();

            const renewalData = {
                royaltyID: newRoyaltyID,
                EchallanId: newChallanID,
                EChallanNo: `${newChallanID}/T/${getDynamicYearRange()}/${ChallandT}/PS`,
                IssueDate,
                EChallanDT: ChallandT,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                ...royaltyData.data
            };

            await updatePurchaserDetails(royaltyID, renewalData);
            toast.success("Royalty renewed successfully!");
            navigate(ViteUrl);
        } catch (error) {
            console.error("Error renewing royalty:", error);
            toast.error("Failed to renew royalty");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto max-w-md p-6">
            <h1 className="text-2xl font-bold text-center mb-6">Renew</h1>

            {royaltyData && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Registration Number
                        </label>
                        <Input
                            value={royaltyData.data?.Registration_No || ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Challan ID
                        </label>
                        <Input
                            value={royaltyData.data?.EchallanId || ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Current Validity
                        </label>
                        <Input
                            value={royaltyData.data?.ValidityDate || ""}
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            New Validity Period
                        </label>
                        <Input
                            value="3 months from today"
                            disabled
                            className="bg-gray-100"
                        />
                    </div>

                    <div className="flex gap-4 mt-6">
                        <Button
                            variant="outline"
                            className="w-1/2"
                            onClick={() => navigate(ViteUrl)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="w-1/2 bg-green-600 hover:bg-green-700"
                            onClick={handleRenew}
                            disabled={updating}
                        >
                            {updating ? "Renewing..." : "Renew"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Renew;

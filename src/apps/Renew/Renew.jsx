import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GetParticularVehicle, updatePurchaserDetails } from "../../../Apis/GlobalApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { generateTimeObject } from "../../../Apis/GlobalFunction";

const Renew = () => {
    const { royaltyID } = useParams();
    const navigate = useNavigate();
    const [royaltyData, setRoyaltyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState(null);
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
            // Generate new verification time (3 months from now)
            const { generatedTimeMili } = await generateTimeObject();
            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

            // Format date for display (DD/MM/YYYY)
            const day = String(threeMonthsFromNow.getDate()).padStart(2, "0");
            const month = String(threeMonthsFromNow.getMonth() + 1).padStart(2, "0");
            const year = threeMonthsFromNow.getFullYear();
            const formattedDate = `${day}/${month}/${year}`;

            // Update validity data
            const updatedData = {
                VerefyChallanNum: Date.UTC(
                    year,
                    threeMonthsFromNow.getMonth(),
                    day,
                    threeMonthsFromNow.getHours(),
                    threeMonthsFromNow.getMinutes(),
                    threeMonthsFromNow.getSeconds()
                ),
                ValidityDate: formattedDate
            };

            // Call API to update
            await updatePurchaserDetails(royaltyID, updatedData);

            toast.success("Royalty renewed successfully!");

            // Navigate back to dashboard
            navigate(ViteUrl);
        } catch (error) {
            console.error("Error renewing royalty:", error);
            toast.error("Failed to renew royalty");
        } finally {
            setUpdating(false);
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
                            value={royaltyData.data?.ValidityDate || "Not available"}
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
                            {updating ? "Processing..." : "Renew Royalty"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Renew;

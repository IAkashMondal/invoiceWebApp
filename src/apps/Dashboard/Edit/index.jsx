import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";

import { useParams } from "react-router-dom";
import EditAddRoyaltyForm from "./MainDoc/EditAddRoyaltyFrom";
import EditRoyaltyPreview from "./MainDoc/EditRoyaltyPreview";

import { GetParticularVehicle } from "../../../../Apis/R_Apis/VehicleApis";
import { RoyaltyInfoContext } from "../../../Context/RoyaltyInfoContext";
import { generateTimeObject } from "../../../../Apis/GlobalFunction";

const EditOldRoyalty = () => {
    const [RoyaltyData, setRoyaltyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qrCode, setQrCode] = useState(null);
    const params = useParams();
    const [view, setView] = useState(() => {
        return localStorage.getItem("preview") === "true";
    });

    useEffect(() => {
        const fetchVehicleAndTimeData = async () => {
            try {
                if (!params?.royaltyID) {
                    console.warn("Royalty ID is missing");
                    setLoading(false);
                    return;
                }

                // Set up time data
                generateTimeObject(); // We don't need the returned values here

                // Fetch vehicle details
                const response = await GetParticularVehicle(params.royaltyID);
                if (response.data?.data) {
                    setRoyaltyData(response.data.data);
                    console.log("Fetched Vehicle Data:", response.data.data);
                } else {
                    console.warn("No vehicle data found for this Royalty ID.");
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchVehicleAndTimeData();
    }, [params?.royaltyID]);

    useEffect(() => {
        localStorage.setItem("preview", view);
    }, [view]);

    const generateQrCode = (QRBASEURL, EChallanId) => {
        if (!QRBASEURL) {
            console.log("QRBASEURL no found")
        }
        const url = `${QRBASEURL}/WBMD/Page/each/aspx/id/${EChallanId}/S/24-25/RPS`;
        setQrCode(url);
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <RoyaltyInfoContext.Provider value={{ RoyaltyData, setRoyaltyData }}>
            <div id="no-print" >
                {/* Left Section - Form */}
                <div className="flex justify-center items-center">
                    <EditAddRoyaltyForm
                        generateQrCode={generateQrCode}
                        qrCode={qrCode}
                        RoyaltyData={RoyaltyData}
                        setRoyaltyData={setRoyaltyData}
                    />
                </div>

                {/* Right Section - Preview */}
            </div>
            <div id="no-print" className="flex justify-center items-center w-[90%]">
                <Button
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-md ${view ? "bg-green-500" : "bg-red-500"}`}
                    onClick={() => setView(prev => !prev)}
                >
                    Preview {view ? <>On <Eye /></> : <>Off <EyeClosed /></>}
                </Button>
            </div>

            {view ?
                <div className="flex justify-center items-center sm:h-full w-full">
                    <EditRoyaltyPreview generateQrCode={generateQrCode} RoyaltyData={RoyaltyData} setRoyaltyData={setRoyaltyData} qrCode={qrCode} />
                </div>
                : ""}
        </RoyaltyInfoContext.Provider>
    );
};

export default EditOldRoyalty;

import { useContext, useEffect, useRef, useState } from "react";
import Hader from "./Hader";
import Footer from "./Footer";
import { RoyaltyInfoContext } from "@/Context/RoyaltyInfoContext";
import { getDynamicYearRange } from "../../../../../../../../Apis/GlobalFunction";
import { GetParticularVehicle } from "../../../../../../../../Apis/R_Apis/VehicleApis";
import "../../../../../../../invoice.css";
import { useParams } from "react-router-dom";
import SandDetailsBoxes from "./SandDetailsBoxes";

const InvoicePreview = ({ qrCode }) => {
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const contentRef = useRef(null);


    const reactToPrintFn = () => {
        document.title = `WBMD_TP_${RoyaltyData?.EchallanId}_T_${getDynamicYearRange()}_RPS`;
        window.print();
    };

    // Fetch params from URL
    const params = useParams();

    useEffect(() => {
        // Fetch vehicle details based on the Royalty ID
        const fetchVehicleDetails = async () => {
            if (!params?.royaltyID) {
                return;
            }
            try {
                const response = await GetParticularVehicle(params.royaltyID);
                if (response.data?.data) {
                    setvehicleRegData(response.data.data);
                    setIsLoadind(true);
                } else {
                    console.warn("No vehicle data found for this Royalty ID.");
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };
        fetchVehicleDetails();
    }, [params?.royaltyID]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="invoice-page shadow-2xl" >
                <div ref={contentRef} className="invoice-content">
                    <Hader qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                    <SandDetailsBoxes RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                    <Footer RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                </div>
            </div>

            <button
                onClick={reactToPrintFn}
                className="no-print px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 mt-6 cursor-pointer"
            >
                <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10"
                    />
                </svg>
                Print / Save PDF
            </button>
        </div>
    );
};

export default InvoicePreview;
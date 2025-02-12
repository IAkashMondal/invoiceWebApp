import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckPickup } from "@fortawesome/free-solid-svg-icons";
import { GetEchallanData } from "../../Apis/GlobalApi";
import { generateTimeObject } from "../../Apis/GlobalFunction";

const VehicleDetailPage = () => {
    const params = useParams(); // Extract parameter from URL
    const [echallanId, setEchallanId] = useState("");
    const [vehicledata, setVehicleData] = useState({});
    const [viewComponent, setViewComponent] = useState(false);
    const [generatedTimeV, SetgeneratedTimeV] = useState(null);
    const [expire, setexpire] = useState(false);
    // VerefyChallanNum
    useEffect(() => {
        const interval = setInterval(() => {
            if (vehicledata?.VerefyChallanNum > generatedTimeV) {
                setexpire(true)
            } else {
                expire(false)
            }
        }, 5000); // Runs every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [generatedTimeV, vehicledata, expire]); // Dependencies ensure proper updates
    ;



    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!params.EchallanId) {
                console.warn("Echallan ID is missing");
                return;
            }
            const { generatedTime } = await generateTimeObject()
            try {
                const response = await GetEchallanData(params?.EchallanId);
                if (response?.data && response?.data.length > 0) {
                    setVehicleData(response?.data[0]);
                    SetgeneratedTimeV(generatedTime)
                    setEchallanId(response?.data[0].EchallanId);
                    setViewComponent(true);
                } else {
                    console.warn("No vehicle data found for this E-Challan ID.");
                    setViewComponent(false);
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
                setViewComponent(false);
            }
        };

        fetchVehicleDetails();
    }, [params]);

    if (!viewComponent) return null; // Prevents rendering an empty string
    console.log(generatedTimeV, vehicledata?.VerefyChallanNum)
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center "
            style={{ backgroundImage: "url('/BgImg.jpg')" }}
        >
            <div className="sm:w-auto sm:h-auto bg-white rounded-lg shadow-lg ">
                <div className="p-[0.25rem]">
                    <h4 className="m-2 flex items-center gap-2">
                        <FontAwesomeIcon icon={faTruckPickup} size="2xs" style={{ color: "#63E6BE" }} />
                        WBMDTCL e-Challan
                    </h4>
                </div>
                <div className="px-3 py-5 font-bold text-red-700  col-lg-4 col-md-4 col-sm-12 col-xs-12">
                    <h3>{expire ? " e-challan Validity Expired" : ""}</h3>
                </div>
                <div>
                    <p><strong>Challan No:</strong> {vehicledata?.EchallanId ? `${vehicledata.EchallanId}/S/24-25/${vehicledata.GE}/PS` : "N/A"}</p>
                    <p><strong>e-Challan Issue Date:</strong> {vehicledata?.IssueDate || "N/A"}</p>
                    <p><strong>e-Challan Validity Till:</strong> {vehicledata?.ValidityDate || "N/A"}</p>
                    <p><strong>Quantity of Sand:</strong> {vehicledata?.quantity || "N/A"}</p>
                    <p><strong>Vehicle No:</strong> {vehicledata?.Registration_No || "N/A"}</p>
                    <p><strong>River:</strong> {vehicledata?.River || "N/A"}</p>
                    <p><strong>District:</strong> {vehicledata?.OwnerDistrict || "N/A"}</p>
                    <p><strong>Lesse/MDO:</strong> {vehicledata?.OwnerName || "N/A"}</p>
                    <p><strong>Purchaser Name:</strong> {vehicledata?.NameofPurchaser || "N/A"}</p>
                    <p><strong>Destination District:</strong> {vehicledata?.PurchaserDristic || "N/A"}</p>
                </div>
            </div>
        </div>
    );
};

export default VehicleDetailPage;

import PropTypes from "prop-types"; // Import PropTypes
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GetParticularVehicle } from "../../../../../../../../Apis/GlobalApi";

const BuyerDetailsTemp = ({ RoyaltyData }) => {
    const [vehicleNoQnt, setvehicleNoQnt] = useState("");
    const params = useParams();
    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                if (!params?.royaltyID) {
                    console.warn("Royalty ID is missing");
                    return;
                }
                const response = await GetParticularVehicle(params.royaltyID); // Await API call
                setvehicleNoQnt(response.data.data);
                if (response.data?.data) {
                    setvehicleNoQnt(response.data.data);
                } else {
                    console.warn("No vehicle data found for this Royalty ID.");
                }

            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };

        fetchVehicleDetails();
    }, [params?.royaltyID, setvehicleNoQnt]);
    return (
        <div className="m-0 ml-[0.3cm] mr-[0.5cm]">

            <div>
                <p className="font font-semibold font-serif italic text-[10pt] ml-[0.3cm]">Vehicle & Destination Details</p>

                <div className="border border-black"
                    style={{
                        height: "10.3cm",
                        width: "9.3cm",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        marginTop: "1mm"
                    }}
                >
                    {/* Directly access and display each RoyaltyData?.RoyaltyData. point */}
                    <p className="flex font-serif font-normal ml-[1mm] mt-[3mm] text-[11pt]">
                        <span className="w-[3.6cm]">Name Of Purchaser</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.NameofPurchaser || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">Mobile No.</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.PurchaserMobileNo || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">Address</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.PurchaserAdd || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">Police Station</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.PoliceStation || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">District</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.PurchaseDristic || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">State</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.State || "West Bengal"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">Registration No</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{vehicleNoQnt?.Registration_No || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">Vehicle Type</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.VehicleType || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm] text-[11pt]">
                        <span className="w-[3.6cm]">Capacity (in Kg)</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.VehicleCapacity || "NA"}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

// ✅ PropTypes Validation
BuyerDetailsTemp.propTypes = {
    RoyaltyData: PropTypes.shape({
        NameofPurchaser: PropTypes.string,
        PurchaserMobileNo: PropTypes.string,
        PurchaserAdd: PropTypes.string,
        PurchaserPoliceStaion: PropTypes.string,
        PurchaserDistic: PropTypes.string,
        State: PropTypes.string,
        Registration_No: PropTypes.string,
        VehicleType: PropTypes.string,
        VehicleCapacity: PropTypes.string,
        RoyaltyData: PropTypes.object,

    }),
};

export default BuyerDetailsTemp;

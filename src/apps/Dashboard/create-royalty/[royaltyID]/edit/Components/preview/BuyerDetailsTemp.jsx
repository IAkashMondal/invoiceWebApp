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
        <div id="buyerbox " className="m-0 lg:ml-[0.3cm] mb-0  sm:mr-[0.3cm] sm:p-0 sm:m-0">

            <div>
                <p id="large-screen-styles" className="font font-semibold font-serif italic lg:mt-[4mm] lg:text-[10pt]  sm:text-[5pt] sm:ml-[0.3cm]">VEHICLE & DESTINATION DETAILS</p>

                <div id="sellerBox" className="border-[1px]  border-black h-auto  sm:max-w-[100%]"
                    style={{
                        // height: "10.5cm",
                        width: "9cm",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        marginTop: "1mm"
                    }}
                >
                    <p className="flex font-serif font-normal ml-[1mm] mt-[3mm] lg:mb-[6mm] sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">
                            <p>Name of Purchaser </p>
                            <p className="text-transparent sm:text-transparent">.</p>
                        </span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.NameofPurchaser || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Mobile No. </span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.PurchaserMobileNo || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm] sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Address</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.PurchaserAdd || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] lg:mb-[6mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Police Station</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.PoliceStation || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm] sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">District</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.PurchaserDristic}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">State </span>
                        <span className="mr-[2mm]">:</span>
                        <span>{"West Bengal"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[6.5pt]">
                        <div className="grid">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">Vehicle Type </span>
                            <span className="text-transparent">H</span>
                        </div>
                        <span className="mr-[2mm] ">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.VehicleType || "NA"}</span>
                    </p>
                    <p id="sellergap" className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Registration No.</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.Registration_No || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm] lg:mb-[2mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Capacity (in Kg) </span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.VehicleCapacity || "NA"}</span>
                    </p>
                    {RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine1 &&
                        <p id="sellerBoxgrid" className="flex font-serif font-normal ml-[1mm] lg:text-[11pt] sm:text-[5pt] mb-[2mm]  sm:mb-[2mm]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]"></span>
                            <div className="grid grid-flow-row">
                                <p className="text-transparent sm:text-transparent p-0">{"."}</p>
                                <p className="text-transparent sm:text-transparent" >{"."}</p>
                            </div>
                        </p>
                    }
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

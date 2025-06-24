import PropTypes from "prop-types"; // Import PropTypes


const BuyerDetailsTemp = ({ RoyaltyData }) => {

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

                    {RoyaltyData?.RoyaltyData.RoyaltyOwners.River !== null && RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Contemporary Remedies" ?
                        (<p className="flex font-serif font-normal ml-[1mm] mt-[3mm] lg:mb-[6mm] sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">
                                <p>Name of Purchaser </p>
                            </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.RoyaltyData?.NameofPurchaser || "NA"}</span>
                        </p>) :
                        (<p className="flex font-serif font-normal ml-[1mm] mt-[3mm] lg:mb-[6mm] sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">
                                <p>Name of Purchaser </p>
                                <p className="text-transparent sm:text-transparent">.</p>
                            </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.RoyaltyData?.NameofPurchaser || "NA"}</span>
                        </p>)}


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
                    {RoyaltyData?.RoyaltyData.RoyaltyOwners.River !== null && RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Contemporary Remedies" ?
                        (<p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm] sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">Vehicle Type </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.RoyaltyData?.VehicleType}</span>
                        </p>)
                        :
                        (<p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[6.5pt]">
                            <div className="grid">
                                <span className="lg:w-[3.7cm] sm:w-[2cm]">Vehicle Type </span>
                                <span className="text-transparent">H</span>
                            </div>
                            <span className="mr-[2mm] ">:</span>
                            <span>{RoyaltyData?.RoyaltyData?.VehicleType || "NA"}</span>
                        </p>)
                    }

                    <p id="sellergap" className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Registration No.</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.Registration_No || "NA"}</span>
                    </p>
                    {RoyaltyData?.RoyaltyData.RoyaltyOwners.River !== null && RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Contemporary Remedies" ?
                        (<p className="flex font-serif font-normal ml-[1mm] lg:mb-[2mm] mt-[5mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">Capacity (in Kg) </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.RoyaltyData?.VehicleCapacity || "NA"}</span>
                        </p>)
                        :
                        (<p className="flex font-serif font-normal ml-[1mm] lg:mb-[2mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">Capacity (in Kg) </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.RoyaltyData?.VehicleCapacity || "NA"}</span>
                        </p>)}
                    {RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine1 && (
                        <div  style={{ height: "12mm" }}>&nbsp;</div>
                    )}
                    {RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine2 && RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Contemporary Remedies" && (
                        <div  style={{ height: "12mm" }}>&nbsp;</div>
                    )}
                    {RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine3 && RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Contemporary Remedies" && (
                        <div style={{ height: "4mm" }}>&nbsp;</div>
                    )}
                    {RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine4 && RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Contemporary Remedies" && (
                        <div  style={{ height: "10mm" }}>&nbsp;</div>
                    )}
                    <div className="ml-[1mm]  lg:text-[11pt] sm:text-[5pt] mb-[2mm]  sm:mb-[2mm] text-transparent sm:text-transparent"></div>
                </div>
            </div>
        </div >
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

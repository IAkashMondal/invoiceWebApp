import PropTypes, { array, object } from "prop-types"; // Import PropTypes
const SellerDetailsTemp = ({ RoyaltyData, }) => {

    return (
        <div id="sellerboxs " className="m-0 mb-0  lg:mr-0 sm:m-0 sm:mb-0 sm:mr-[0.3cm] ">

            <div>
                <p id="large-screen-styles" className="font font-semibold font-serif italic lg:mt-[4mm] lg:text-[10pt] ml-[0.3cm] sm:text-[5pt] sm:ml-[0.3cm]">PERMISSION HOLDER DETAILS</p>
                <div id="sellerBox" className="border-[1px] border-black h-auto sm:max-w-[100%] sm:p-0"
                    style={{
                        // height: "10.5cm", sm
                        width: "9cm",
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "1mm",
                        justifyContent: "start"
                    }}
                >
                    {/* Directly access and display each RoyaltyData point */}
                    <p className="flex font-serif font-normal ml-[1mm] mt-[3mm] lg:mb-[6mm]  sm:mb-[2mm]  lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] ml-[-1px] sm:ml-[-1px] sm:w-[2cm]">
                            <p className="ml-[-1px] sm:ml-[-1px]">PERMISSION</p>
                            <p className="ml-[-1px] sm:ml-[-1px]">HOLDER Id</p>
                        </span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.RoyaltyOwners.SandID || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Mouza</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerMouza || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">GP / Ward</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerGpWard || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] lg:mb-[6mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Sub-Division</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerSubDivision || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Police Station</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerPoliceStation || "West bengal"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">District</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerDistrict || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[6.5pt]">
                        <div className="grid">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">Name of the </span>
                            <span>Permission Holder</span>
                        </div>
                        <span className="mr-[2mm] ">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName || "NA"}</span>
                    </p>
                    <p id="sellergap" className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Mobile No</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerMobileNo || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm] lg:mb-[2mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Address</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddress || "NA"}</span>
                    </p>
                    {RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine1 &&
                        <p id="sellerBoxgrid" className="flex font-serif font-normal ml-[1mm] lg:text-[11pt] sm:text-[5pt] mb-[2mm]  sm:mb-[2mm]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]"></span>
                            <div className="grid grid-flow-row">
                                <p className=" p-0">{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine1 || ""}</p>
                                <span >{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine2 || ""}</span>
                                <p >{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine3 || ""}</p>
                            </div>
                        </p>
                        }
                </div>
            </div>
        </div>
    );
};

// ✅ PropTypes Validation
SellerDetailsTemp.propTypes = {
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
        selectedOwner: array,
        RoyaltyOwners: object
    }),
};

export default SellerDetailsTemp;

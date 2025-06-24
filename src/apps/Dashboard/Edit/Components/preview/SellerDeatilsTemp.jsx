import PropTypes from "prop-types"; // Import PropTypes
const SellerDetailsTemp = ({ RoyaltyData, }) => {
    console.log(RoyaltyData)
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

                    {(RoyaltyData?.River !== null && RoyaltyData?.OwnerName === "Contemporary Remedies") ? (
                        <p className="flex font-serif font-normal ml-[1mm] mt-[3mm] lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]">Sand Block Id</span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.SandID || "NA"}</span>
                        </p>
                    ) : (
                        <p className="flex font-serif font-normal ml-[1mm] mt-[3mm] lg:mb-[6mm]  sm:mb-[2mm]  lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] ml-[-1px] sm:ml-[-1px] sm:w-[2cm]">
                                <p className="ml-[-1px] sm:ml-[-1px]">PERMISSION</p>
                                <p className="ml-[-1px] sm:ml-[-1px]">HOLDER Id</p>
                            </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.SandID || "NA"}</span>
                        </p>
                    )}
                    {RoyaltyData?.River !== null && RoyaltyData?.OwnerName === "Contemporary Remedies" ?
                        (<p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]  lg:text-[11pt] sm:text-[7pt]">
                            <span className="lg:w-[3.7cm] ml-[-1px] sm:ml-[-1px] sm:w-[2cm]">
                                <p className="ml-[-1px] sm:ml-[-1px]">River</p>

                            </span>
                            <span className="mr-[2mm]">:</span>
                            <span>{RoyaltyData?.River || "NA"}</span>
                        </p>) : ""}
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Mouza</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerMouza || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">GP / Ward</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerGpWard || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] lg:mb-[6mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Sub-Division</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerSubDivision || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Police Station</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerPoliceStation || "West bengal"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">District</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerDistrict || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]  sm:mb-[2mm]   lg:text-[11pt] sm:text-[6.5pt]">
                        {RoyaltyData?.River !== null && RoyaltyData?.OwnerName === "Contemporary Remedies" ?
                            (<div className="grid">
                                <span className="lg:w-[3.7cm] sm:w-[2cm]">Name of the Mining</span>
                                <span>Lease Holder</span>
                            </div>)
                            :
                            <div className="grid">
                                <span className="lg:w-[3.7cm] sm:w-[2cm]">Name of the </span>
                                <span>Permission Holder</span>
                            </div>}

                        <span className="mr-[2mm] ">:</span>
                        <span>{RoyaltyData?.OwnerName || "NA"}</span>
                    </p>
                    <p id="sellergap" className="flex font-serif font-normal ml-[1mm]  lg:mb-[6mm]   lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Mobile No</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerMobileNo || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm] lg:mb-[2mm]  sm:mb-[2mm] lg:text-[11pt] sm:text-[7pt]">
                        <span className="lg:w-[3.7cm] sm:w-[2cm]">Address</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.OwnerAddress || "NA"}</span>
                    </p>
                    {RoyaltyData?.OwnerAddressLine1 &&
                        <p id="sellerBoxgrid" className="flex font-serif font-normal ml-[1mm] lg:text-[11pt] sm:text-[5pt] ">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]"></span>
                            <div className="grid grid-flow-row">
                                <p className=" p-0">{RoyaltyData?.OwnerAddressLine1 || ""}</p>
                                <span >{RoyaltyData?.OwnerAddressLine2 || ""}</span>
                            </div>
                        </p>
                    }
                    {RoyaltyData?.OwnerAddressLine3 &&
                        <p id="sellerBoxgrid" className="flex font-serif font-normal ml-[1mm] lg:text-[11pt] sm:text-[5pt]">
                            <span className="lg:w-[3.7cm] sm:w-[2cm]"></span>
                            <div className="grid grid-flow-row">
                                <p className=" p-0">{RoyaltyData?.OwnerAddressLine3 || ""}</p>
                                <span >{RoyaltyData?.OwnerAddressLine4 || ""}</span>
                            </div>
                        </p>
                    }
                    <p className="ml-[1mm] lg:text-[11pt] sm:text-[5pt] mb-[2mm]  sm:mb-[2mm]"></p>
                </div>
            </div>
        </div>
    );
};

// ✅ PropTypes Validation
SellerDetailsTemp.propTypes = {
    RoyaltyData: PropTypes.shape({
        SandID: PropTypes.string.isRequired,
        OwnerMouza: PropTypes.string.isRequired,
        OwnerGpWard: PropTypes.string.isRequired,
        OwnerSubDivision: PropTypes.string.isRequired,
        OwnerPoliceStation: PropTypes.string.isRequired,
        OwnerDistrict: PropTypes.string.isRequired,
        OwnerName: PropTypes.string.isRequired,
        OwnerMobileNo: PropTypes.string.isRequired,
        OwnerAddress: PropTypes.string.isRequired,
        OwnerAddressLine1: PropTypes.string,
        OwnerAddressLine2: PropTypes.string,
        OwnerAddressLine3: PropTypes.string,
        OwnerAddressLine4: PropTypes.string,
    }).isRequired,
};

export default SellerDetailsTemp;

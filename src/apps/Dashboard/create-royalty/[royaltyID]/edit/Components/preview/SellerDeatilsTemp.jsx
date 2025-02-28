import PropTypes, { array, object } from "prop-types"; // Import PropTypes
const SellerDetailsTemp = ({ RoyaltyData, }) => {

    return (
        <div className="m-0">

            <div>
                <p className="font font-semibold font-serif italic text-[10pt] ml-[0.3cm]">SAND Block & leaseholder/MDO Details</p>
                <div className="border border-black"
                    style={{
                        height: "10.3cm",
                        width: "9.2cm",
                        display: "flex",
                        flexDirection: "column",
                        marginTop: "1mm",
                        justifyContent: "start",
                    }}
                >
                    {/* Directly access and display each RoyaltyData point */}
                    <p className="flex font-serif font-normal ml-[1mm] mt-[3mm]  text-[11pt]">
                        <span className="w-[3.8cm]">Sand Block Id</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData.RoyaltyOwners.SandID || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal  ml-[1mm] mt-[4mm]  text-[11pt]">
                        <span className="w-[3.8cm]">River</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.River || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm]  text-[11pt]">
                        <span className="w-[3.8cm]">Mouza</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerMouza || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm]  text-[11pt]">
                        <span className="w-[3.8cm]">GP / Ward</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerGpWard || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm]  text-[11pt]">
                        <span className="w-[3.8cm]">Police Station</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerPoliceStation || "West bengal"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm]  text-[11pt]">
                        <span className="w-[3.8cm]">District</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerDistrict || "NA"}</span>
                    </p>

                    <p className="flex font-serif font-normal ml-[1mm] mt-[4mm]  text-[11pt]">
                        <div className="grid">
                            <span className="w-[3.6cm]">Name of the Mining</span>
                            <span>Lease Holder</span>
                        </div>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[3mm]  text-[10pt]">
                        <span className="w-[3.6cm]">Mobile No</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerMobileNo || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] mt-[3mm]  text-[11pt]">
                        <span className="w-[3.6cm]">Address</span>
                        <span className="mr-[2mm]">:</span>
                        <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddress || "NA"}</span>
                    </p>
                    <p className="flex font-serif font-normal ml-[1mm] text-[11pt]">
                        <span className="w-[3.6cm]"></span>
                        <div className="grid grid-flow-row">
                            <span className=" p-0">{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine1 || ""}</span>
                            <span>{RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerAddressLine2 || ""}</span>
                        </div>
                    </p>
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

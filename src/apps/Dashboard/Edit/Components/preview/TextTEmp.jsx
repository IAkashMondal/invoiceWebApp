import PropTypes from "prop-types";


const TextTEmp = ({ RoyaltyData }) => {
    // Defensive programming - handle cases where RoyaltyData might be undefined
    if (!RoyaltyData) {
        console.warn('TextTEmp: RoyaltyData is undefined or null');
        return (
            <div className="mt-0 m-0 p-0 sm:h-auto">
                <div className="mt-[5mm] sm:mt-[2mm]">
                    <p className="font-serif lg:text-[11.3pt] sm:text-[6.5pt] text-red-500">
                        Error: Royalty data not available
                    </p>
                </div>
            </div>
        );
    }

    // Extract data with fallbacks
    const ownerDistrict = RoyaltyData?.OwnerDistrict || RoyaltyData?.RoyaltyOwners?.OwnerDistrict || "N/A";
    const videPermitNo = RoyaltyData?.VidePermitNo || RoyaltyData?.RoyaltyOwners?.VidePermitNo || "N/A";
    const ownerName = RoyaltyData?.OwnerName || RoyaltyData?.RoyaltyOwners?.OwnerName || "N/A";
    const sandID = RoyaltyData?.SandID || RoyaltyData?.RoyaltyOwners?.SandID || "N/A";

    return (
        <div className="mt-0  m-0 p-0 sm:h-auto">
            <div className="mt-[5mm] sm:mt-[2mm]">
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6.5pt]">Note :</p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6pt] ">{"1) Prior approval was accorded by : "}
                    <span id="TempTexBold" className="font font-bold lg:text-[11.3pt] sm:text-[6pt]">
                        {`ADM and DL & LRO, ${ownerDistrict} `}
                        <span id="textsizes" className="font-serif font-medium lg:text-[11.3pt] sm:text-[6.5pt]">vide permit no .
                            <span id="TempTexBold" className="font font-bold lg:text-[11.3pt] sm:text-[6pt]">
                                {` ${videPermitNo}`}
                            </span>
                        </span>
                    </span>

                    <span id="TempTex" className="font-serif lg:text-[10pt] sm:text-[6pt]">

                    </span>
                </p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6.5pt]">{"2) Loaded vehicle must depart for its destination within 30 minutes from issuance of this E-challan. To verify \n authenticity of the E-challan, please scan above  QR Code using smart phone."}</p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6.5pt]">{"3) This is a system generated document and does not requried any signature."}</p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] mt-[5mm] sm:text-[5.5pt]">{"4) Self Certitication by Lessee/MDO : I/WE(Lessee/MDO/Q.P.) hereby declare that the above statements are correct and complete to be best of my knowledge and belied. "}
                    <span id="TempTexBold1" className="font-bold font-serif lg:text-[11.3pt] sm:text-[5.5pt]">
                        {ownerName}
                    </span>
                </p>
            </div>

            <p id="TempTexBold1" className=" grid justify-end font-serif lg:text-[11.3pt] mt-[11mm] mr-[5mm] sm:text-[6.5pt] sm:mr-[2mm]">Issued by</p>
            <p id="TempTexBold1" className=" grid justify-end font font-bold font-serif lg:text-[11.3pt]  mr-[5mm] sm:text-[6.5pt] sm:mr-[2mm] ">
                {ownerName}</p>
            <p id="TempTexBold1" className="grid justify-end font font-bold font-serif lg:text-[11.3pt]  mr-[5mm] sm:text-[6.5pt] sm:mr-[2mm]">{`
             ${ownerName === "Prasanta Kumar Hait" ? "PERMISSION HOLDER ID " : "Sand Block Id "} 
             ${sandID}`}</p>

            <p id="qrText" className="lg:ml-[-5mm] lg:p-0 font font-bold font-serif lg:text-[11.5pt] italic mt-[3mm] sm:text-[4.5pt] sm:mt-[2mm]">{`** On QR code scanning pl check that the website address bar shows mdtcl.wb.gov.in as that is the only genuine website of the government.`}</p>

        </div>
    )
}
TextTEmp.propTypes = {
    RoyaltyData: PropTypes.shape({
        OwnerDistrict: PropTypes.string,
        VidePermitNo: PropTypes.string,
        OwnerName: PropTypes.string,
        SandID: PropTypes.string,
        // Optional nested structure for backward compatibility
        RoyaltyOwners: PropTypes.shape({
            VidePermitNo: PropTypes.string,
            OwnerName: PropTypes.string,
            SandID: PropTypes.string,
            OwnerDistrict: PropTypes.string
        })
    }).isRequired,
};

export default TextTEmp
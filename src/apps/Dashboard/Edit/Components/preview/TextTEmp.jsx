import PropTypes from "prop-types";


const TextTEmp = ({ RoyaltyData }) => {
    return (
        <div className="mt-0  m-0 p-0 sm:h-auto">
            <div className="mt-[5mm] sm:mt-[2mm]">
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6.5pt]">Note :</p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6pt] ">{"1) Prior approval was accorded by : "}
                    <span id="TempTexBold" className="font font-bold lg:text-[11.3pt] sm:text-[6pt]">
                        {`ADM and DL & LRO, ${RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerDistrict} `}
                        <span id="textsizes" className="font-serif font-medium lg:text-[11.3pt] sm:text-[6.5pt]">vide permit no .
                            <span id="TempTexBold" className="font font-bold lg:text-[11.3pt] sm:text-[6pt]">
                                {` ${RoyaltyData?.RoyaltyData?.RoyaltyOwners?.VidePermitNo || "N/A"}`}
                            </span>
                        </span>
                    </span>

                    <span id="TempTex" className="font-serif lg:text-[10pt] sm:text-[6pt]">

                    </span>
                </p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6.5pt]">{"2) Loaded vehicle must depart for its destination within 30 minutes from issuance of this E-challan. To verify \n authenticity of the E-challan, please scan above  QR Code using smart phone."}</p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] sm:text-[6.5pt]">{"3) This is a system generated document and does not requried any signature."}</p>
                <p id="TempTex" className="font-serif lg:text-[11.3pt] mt-[5mm] sm:text-[5.5pt]">{"4) Self Certitication by Lessee/MDO : I/WE(Lessee/MDO/Q.P.) hereby declare that the above statements are correct and complete to be best of my knowledge and belied. "}
                    <span id="TempTexBold TempTexBold1" className="font-bold font-serif lg:text-[11.3pt] sm:text-[5.5pt]">
                        {`${RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName}`}
                    </span>
                </p>
            </div>

            <p id="TempTexBold1" className=" grid justify-end font-serif lg:text-[11.3pt] mt-[11mm] mr-[5mm] sm:text-[6.5pt] sm:mr-[2mm]">Issued by</p>
            <p id="TempTexBold1" className=" grid justify-end font font-bold font-serif lg:text-[11.3pt]  mr-[5mm] sm:text-[6.5pt] sm:mr-[2mm] ">
                {`${RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName}`}</p>
            <p id="TempTexBold1" className="grid justify-end font font-bold font-serif lg:text-[11.3pt]  mr-[5mm] sm:text-[6.5pt] sm:mr-[2mm]">{`
             ${RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName === "Prasanta Kumar Hait" ? "PERMISSION HOLDER ID " : "Sand Block Id "} 
             ${RoyaltyData?.RoyaltyData?.RoyaltyOwners.SandID}`}</p>

            <p id="qrText" className="lg:ml-[-5mm] lg:p-0 font font-bold font-serif lg:text-[11.5pt] italic mt-[3mm] sm:text-[4.5pt] sm:mt-[2mm]">{`** On QR code scanning pl check that the website address bar shows mdtcl.wb.gov.in as that is the only genuine website of the government.`}</p>

        </div>
    )
}
TextTEmp.propTypes = {
    RoyaltyData: PropTypes.shape({
        RoyaltyData: PropTypes.shape({
            RoyaltyOwners: PropTypes.shape({
                VidePermitNo: PropTypes.string,
                OwnerName: PropTypes.string,
                SandID: PropTypes.string,
                OwnerDistrict: PropTypes.string
            })

        }),
    }).isRequired,

};

export default TextTEmp
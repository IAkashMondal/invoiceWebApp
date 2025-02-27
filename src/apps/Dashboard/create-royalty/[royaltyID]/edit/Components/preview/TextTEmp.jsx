import PropTypes from "prop-types";


const TextTEmp = ({ RoyaltyData }) => {
    return (
        <div className="h-[6.6cm] m-0 mt-[0mm]">
            <div className="mt-[5mm]">
                <p className="font-serif text-[10.7pt]">Note :</p>
                <p className="font-serif text-[10.7pt]">{"1) Prior approval for excarvation permission was accorded by : "}
                    <span className="font font-bold">{`ADM and DL & LRO, DARJEELING `}</span>
                    <span>vide permit</span></p>
                <p className="font-serif text-[10.7pt]"><span >{`no. `}</span ><span className="font font-bold">{`${RoyaltyData?.RoyaltyData?.RoyaltyOwners?.VidePermitNo || "N/A"}`}</span></p>
                <p className="font-serif text-[10.7pt]">{"2) Loaded vehicle must depart for its destination within 30 minutes from issuance of this E-challan. To verify authenticity of the E-challan, please scan above  QR Code using smart phone."}</p>
                <p className="font-serif text-[10.7pt]">{"3) This is a system generated document and does not requried any signature."}</p>
                <div className="font-serif text-[10.7pt] mt-[5mm]">
                    <p>{"4) Self Certitication by Lessee/MDO : I/WE(Lessee/MDO/Q.P.) hereby declare that the above statements are correct and complete to be best of my knowledge and belied. "}
                        <span className="font font-bold">{`${RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName}`}</span></p>

                </div>
                <p className="font-serif text-[10.7pt] italic">Remarks :</p>
            </div>

            <p className=" grid justify-end font-serif text-[10.7pt] mt-[0mm] mr-[5mm]">Issued by</p>
            <p className=" grid justify-end font font-bold font-serif text-[10.7pt]  mr-[5mm] ">{`${RoyaltyData?.RoyaltyData?.RoyaltyOwners.OwnerName}`}</p>
            <p className="grid justify-end font font-bold font-serif text-[10.7pt]  mr-[5mm]">{`${RoyaltyData?.RoyaltyData?.RoyaltyOwners.SandID}`}</p>

            <p className="font font-bold font-serif text-[8.7pt] italic mt-[3mm]">{`** On QR code scanning pl check that the website address bar shows mdtcl.wb.gov.in as that is the only genuine website of the government.`}</p>

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
            })

        }),
    }).isRequired,

};

export default TextTEmp
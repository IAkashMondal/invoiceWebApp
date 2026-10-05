import React from "react";
import PropTypes from "prop-types";

const Footer = ({ RoyaltyData, vehicleRegData, data }) => {
    const royalty = RoyaltyData?.RoyaltyData ?? RoyaltyData ?? data?.RoyaltyData ?? data ?? {};
    const owners = royalty?.RoyaltyOwners ?? {};

    const approvalDistrict =
        owners?.OwnerDistrict || royalty?.OwnerDistrict || data?.approvalAuthorityDistrict;
    const approvalAuthority = data?.approvalAuthority || `ADM and DL & LRO, ${approvalDistrict}`;
    const stockNo = owners?.SandID || royalty?.SandID || data?.stockNo;
    const lesseeName = owners?.OwnerName || royalty?.OwnerName || data?.lesseeName;
    const issuedByName = owners?.OwnerName || royalty?.OwnerName || data?.issuedByName;
    const stockPointId = owners?.SandID || royalty?.SandID || data?.stockPointId;
    const remarks = royalty?.Remarks || royalty?.remarks || data?.remarks || "SAND";
    const generatedOn = vehicleRegData?.GeneratedDT || royalty?.GeneratedDT || data?.generatedOn;

    return (
        <>
            {/* Lower content block: Note, Issued by, Remarks, QR warning */}
            <div style={{ width: "551pt", breakInside: "avoid" }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 551 232"
                    role="group"
                    aria-label="Challan notes, issuer, remarks and warning"
                    style={{
                        display: "block",
                        width: "551pt",
                        height: "232pt",
                        maxWidth: "none",
                        overflow: "visible",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        letterSpacing: 0,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact"
                    }}
                >
                    {/* Note box: x=0, y=0, w=551, h=110 */}
                    <g id="notes-section">
                        <rect
                            x="0"
                            y="0"
                            width="551"
                            height="110"
                            fill="none"
                            stroke="#E68C32"
                            strokeWidth="1"
                        />

                        <text x="7" y="17" fontSize="10" fontWeight="700" fill="#1E1E1E">
                            Note :
                        </text>

                        <text x="7" y="34" fontSize="8.5" fill="#1E1E1E">
                            <tspan fontWeight="400">1) Prior approval for stock permission was accorded by : </tspan>
                            <tspan fontWeight="700">{approvalAuthority}</tspan>
                            <tspan fontWeight="400"> vide Stock no. </tspan>
                            <tspan fontWeight="700">{stockNo}.</tspan>
                        </text>

                        <text x="7" y="51" fontSize="8.5" fill="#1E1E1E">
                            2) Loaded vehicle must depart for its destination within 30 minutes from issuance of this E-challan. To verify authenticity of the E-challan,
                        </text>
                        <text x="7" y="59.5" fontSize="8.5" fill="#1E1E1E">
                            please scan above QR Code using smart phone.
                        </text>

                        <text x="7" y="76.5" fontSize="8.5" fill="#1E1E1E">
                            3) This is a system generated document and does not require any signature.
                        </text>

                        <text x="7" y="93.5" fontSize="8.5" fill="#1E1E1E">
                            4) Self Certification by Lessee/MDO : I/We (Lessee/MDO/Q.P.) hereby declare that the above statements are correct and complete to best of
                        </text>
                        <text x="7" y="102" fontSize="8.5" fill="#1E1E1E">
                            <tspan fontWeight="400">my/our knowledge and belief. </tspan>
                            <tspan fontWeight="700">{lesseeName}.</tspan>
                        </text>
                    </g>

                    {/* Issued by box: x=0, y=115, w=551, h=37.5 */}
                    <g id="issued-by-section">
                        <rect
                            x="0"
                            y="115"
                            width="551"
                            height="37.5"
                            fill="none"
                            stroke="#E68C32"
                            strokeWidth="1"
                        />
                        <text x="6" y="129.5" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            Issued by
                        </text>
                        <text x="6" y="138" fontSize="8.5" fontWeight="700" fill="#1E1E1E">
                            {issuedByName}
                        </text>
                        <text x="6" y="146.5" fontSize="8.5" fontWeight="700" fill="#1E1E1E">
                            SAND Processig Stock Id {stockPointId}
                        </text>
                    </g>

                    {/* Remarks box: x=0, y=157.5, w=551, h=32.5 */}
                    <g id="remarks-section">
                        <rect
                            x="0"
                            y="157.5"
                            width="551"
                            height="32.5"
                            fill="none"
                            stroke="#E68C32"
                            strokeWidth="1"
                        />
                        <text x="7" y="172" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            Remarks : {remarks}
                        </text>
                    </g>

                    {/* QR warning: left aligned, two lines, outside all boxes */}
                    <g id="qr-warning" fontSize="8.5" fill="#1E1E1E">
                        <text x="0" y="214.8">
                            <tspan fontWeight="400">** On QR code scanning pl check that the website address bar shows </tspan>
                            <tspan fontWeight="700">https://mdtcl.wb.gov.in</tspan>
                            <tspan fontWeight="400"> as that is the only genuine website of the</tspan>
                        </text>
                        <text x="0" y="228.6">
                            <tspan fontWeight="400">government.</tspan>
                        </text>
                    </g>
                </svg>
            </div>

            {/* Page footer: anchored to the page, not to content flow */}
            <div
                className="footer"
                style={{
                    position: "absolute",
                    top: "812pt",
                    left: "15pt",
                    width: "551pt",
                    pointerEvents: "none"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 551 20"
                    role="contentinfo"
                    aria-label="Page footer details"
                    style={{
                        display: "block",
                        width: "551pt",
                        height: "20pt",
                        fontFamily: "Helvetica, Arial, sans-serif"
                    }}
                >
                    <g id="footer-bar" fill="#000000" fontSize="7.5" fontWeight="700">
                        <text x="0" y="15" textAnchor="start">
                            <tspan>Generated On : </tspan>
                            <tspan>{generatedOn}</tspan>
                        </text>
                        <text x="275.5" y="15" textAnchor="middle">
                            &lt;eGov-Fin&gt;
                        </text>
                        <text x="551" y="15" textAnchor="end">
                            Page No: 1
                        </text>
                    </g>
                </svg>
            </div>
        </>
    );
};

Footer.propTypes = {
    RoyaltyData: PropTypes.object,
    vehicleRegData: PropTypes.object,
    data: PropTypes.shape({
        approvalAuthority: PropTypes.string,
        approvalAuthorityDistrict: PropTypes.string,
        stockNo: PropTypes.string,
        lesseeName: PropTypes.string,
        issuedByName: PropTypes.string,
        stockPointId: PropTypes.string,
        remarks: PropTypes.string,
        generatedOn: PropTypes.string
    })
};

export default Footer;
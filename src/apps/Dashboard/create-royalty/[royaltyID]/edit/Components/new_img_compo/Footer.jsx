import React from "react";
import PropTypes from "prop-types";

const Footer = ({ RoyaltyData, vehicleRegData, data }) => {
    const royalty = RoyaltyData?.RoyaltyData ?? RoyaltyData ?? data?.RoyaltyData ?? data ?? {};
    const owners = royalty?.RoyaltyOwners ?? {};

    const approvalDistrict = owners?.OwnerDistrict || royalty?.OwnerDistrict || data?.approvalAuthorityDistrict || "JALPAIGURI";
    const approvalAuthority = data?.approvalAuthority || `ADM and DL & LRO, ${approvalDistrict}`;
    const stockNo = owners?.SandID || royalty?.SandID || data?.stockNo || "1392/PSP2026";
    const lesseeName = owners?.OwnerName || royalty?.OwnerName || data?.lesseeName || "MAJIBUL RAHAMAN";
    const issuedByName = owners?.OwnerName || royalty?.OwnerName || data?.issuedByName || "MAJIBUL RAHAMAN";
    const stockPointId = owners?.SandID || royalty?.SandID || data?.stockPointId || "1392/PSP2026";
    const remarks = royalty?.Remarks || royalty?.remarks || data?.remarks || "SAND";
    const generatedOn = vehicleRegData?.GeneratedDT || royalty?.GeneratedDT || data?.generatedOn || "30-09-2026 01:00 AM";

    return (
        <>
            <div style={{ width: "551pt", breakInside: "avoid" }}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 551 222"
                    role="group"
                    aria-label="Challan notes, issuer, remarks and warning"
                    style={{
                        display: "block",
                        width: "551pt",
                        height: "222pt",
                        maxWidth: "none",
                        overflow: "visible",
                        fontFamily: "Helvetica, Arial, sans-serif",
                        letterSpacing: 0,
                        WebkitPrintColorAdjust: "exact",
                        printColorAdjust: "exact"
                    }}
                >
                    {/* ==================== 1. NOTES SECTION (y: 0 to 114) ==================== */}
                    <g id="notes-section">
                        <rect
                            x="0.5"
                            y="0.5"
                            width="550"
                            height="113"
                            fill="none"
                            stroke="#E68C32"
                            strokeWidth="1"
                        />
                        {/* Title */}
                        <text x="7" y="14" fontSize="8.5" fontWeight="700" fill="#1E1E1E">
                            Note :
                        </text>

                        {/* Paragraph 1 */}
                        <text x="7" y="29.5" fontSize="8.5" fill="#1E1E1E">
                            <tspan fontWeight="400">1) Prior approval for stock permission was accorded by : </tspan>
                            <tspan fontWeight="700">{approvalAuthority}</tspan>
                            <tspan fontWeight="400"> vide Stock no. </tspan>
                            <tspan fontWeight="700">{stockNo}.</tspan>
                        </text>

                        {/* Paragraph 2 */}
                        <text x="7" y="44" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            2) Loaded vehicle must depart for its destination within 30 minutes from issuance of this E-challan. To verify
                        </text>
                        <text x="7" y="57" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            authenticity of the E-challan, please scan above QR Code using smart phone.
                        </text>

                        {/* Paragraph 3 */}
                        <text x="7" y="71.5" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            3) This is a system generated document and does not require any signature.
                        </text>

                        {/* Paragraph 4 */}
                        <text x="7" y="86" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            4) Self Certification by Lessee/MDO : I/We (Lessee/MDO/Q.P.) hereby declare that the above statements are correct and
                        </text>
                        <text x="7" y="99" fontSize="8.5" fill="#1E1E1E">
                            <tspan fontWeight="400">complete to best of my/our knowledge and belief. </tspan>
                            <tspan fontWeight="700">{lesseeName}.</tspan>
                        </text>
                    </g>

                    {/* ==================== 2. ISSUED BY SECTION (y: 122 to 168) ==================== */}
                    <g id="issued-by-section">
                        <rect
                            x="0.5"
                            y="122.5"
                            width="550"
                            height="45"
                            fill="none"
                            stroke="#E68C32"
                            strokeWidth="1"
                        />
                        <text x="7" y="135" fontSize="8.5" fontWeight="400" fill="#1E1E1E">
                            Issued by
                        </text>
                        <text x="7" y="148" fontSize="8.5" fontWeight="700" fill="#1E1E1E">
                            {issuedByName}
                        </text>
                        <text x="7" y="161" fontSize="8.5" fontWeight="700" fill="#1E1E1E">
                            SAND Processing Stock Id {stockPointId}
                        </text>
                    </g>

                    {/* ==================== 3. REMARKS SECTION (y: 176 to 201) ==================== */}
                    <g id="remarks-section">
                        <rect
                            x="0.5"
                            y="176.5"
                            width="550"
                            height="25"
                            fill="none"
                            stroke="#E68C32"
                            strokeWidth="1"
                        />
                        <text x="7" y="192" fontSize="8.5" fill="#1E1E1E">
                            <tspan fontWeight="400">Remarks : </tspan>
                            <tspan fontWeight="700">{remarks}</tspan>
                        </text>
                    </g>

                    {/* ==================== 4. QR WARNING (y: 214) ==================== */}
                    <g id="qr-warning" fontSize="8" fill="#1E1E1E" textAnchor="middle">
                        <text x="275.5" y="214">
                            <tspan fontWeight="400">** On QR code scanning pl check that the website address bar shows </tspan>
                            <tspan fontWeight="400">"https://mdtcl.wb.gov.in"</tspan>
                            <tspan fontWeight="400"> as that is the only genuine website of the government.</tspan>
                        </text>
                    </g>
                </svg>
            </div>

            {/* ==================== 5. FOOTER BAR (Pinned to bottom of page) ==================== */}
            <div
                className="footer"
                style={{
                    position: "absolute",
                    bottom: "3mm",
                    left: "8mm",
                    width: "551pt",
                    pointerEvents: "none"
                }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 551 16"
                    role="contentinfo"
                    aria-label="Page footer details"
                    style={{
                        display: "block",
                        width: "551pt",
                        height: "16pt",
                        fontFamily: "Helvetica, Arial, sans-serif"
                    }}
                >
                    <g id="footer-bar">
                        <text x="2" y="12" fontSize="8" fill="#1E1E1E" textAnchor="start">
                            <tspan fontWeight="400">Generated On : </tspan>
                            <tspan fontWeight="700">{generatedOn}</tspan>
                        </text>
                        <text x="275.5" y="12" fontSize="8" fontWeight="700" fill="#1E1E1E" textAnchor="middle">
                            &lt;eGov-Fin&gt;
                        </text>
                        <text x="549" y="12" fontSize="8" fontWeight="700" fill="#1E1E1E" textAnchor="end">
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
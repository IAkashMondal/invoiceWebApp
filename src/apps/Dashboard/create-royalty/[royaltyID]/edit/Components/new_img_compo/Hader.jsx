import React from "react";
import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";
import { getDynamicYearRange } from "../../../../../../../../Apis/GlobalFunction";

// Baselines measured from the top of the reference PDF's banner.
const ROWS = [
    { key: "challanNo", label: "E-Challan No.", y: 44.7 },
    { key: "issueDate", label: "Issue Date", y: 58.6 },
    { key: "validityTill", label: "Validity Till", y: 72.5 },
    { key: "quantity", label: "Quantity of Sand", y: 86.4 },
    { key: "vehicleNo", label: "Vehicle No.", y: 110.55 }
];

const formatQuantity = (value) => {
    if (value == null || String(value).trim() === "") return "";
    if (typeof value === "number" && !Number.isFinite(value)) return "";
    const text = String(value).trim();
    const parts = text.match(/^([+-]?\d+)(?:\.(\d*))?$/);
    return parts ? `${parts[1]}.${(parts[2] ?? "").padEnd(2, "0")}` : text;
};

const Hader = ({ qrCode, RoyaltyData }) => {
    const EChallanNumber =
        RoyaltyData?.EchallanId != null && RoyaltyData?.EChallanDT
            ? `${RoyaltyData.EchallanId}/T/${getDynamicYearRange()}/${RoyaltyData.EChallanDT}/PS`
            : "";

    const quantity = formatQuantity(RoyaltyData?.quantity);
    const quantityWords = RoyaltyData?.VehicleQunText?.trim();
    const info = {
        challanNo: EChallanNumber,
        issueDate: RoyaltyData?.IssueDate ?? "",
        validityTill: RoyaltyData?.ValidityDate ?? "",
        quantity: [
            quantity ? `${quantity} cft` : "",
            quantityWords ? `(${quantityWords}    cft)` : ""
        ].filter(Boolean).join(" "),
        vehicleNo: [
            RoyaltyData?.Registration_No,
            RoyaltyData?.VehicleType ? `(${RoyaltyData.VehicleType})` : ""
        ].filter(Boolean).join(" ")
    };

    return (
        <div style={{ width: "100%", maxWidth: "551pt", marginBottom: "8pt", breakInside: "avoid" }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 551 127"
                role="group"
                aria-label="Road E-Challan header and transportation details"
                style={{
                    display: "block",
                    width: "100%",
                    height: "auto",
                    maxWidth: "551pt",
                    overflow: "visible",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    letterSpacing: 0,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact"
                }}
            >
                <rect
                    x="0" y="0" width="551" height="25"
                    fill="#FBC990" stroke="#E68C32" strokeWidth="1"
                />
                <text x="77.54" y="20" fontSize="15" fontWeight="700" fill="#1E1E1E">
                    Road E-Challan for Sand / Riverbed Materials Transport
                </text>

                <rect
                    x="0" y="29" width="551" height="98"
                    fill="none" stroke="#E68C32" strokeWidth="1"
                />
                <line
                    x1="451.82" y1="29" x2="451.82" y2="127"
                    stroke="#E68C32" strokeWidth="1"
                />

                <g fontSize="9.5" fill="#1E1E1E">
                    {ROWS.map(({ key, label, y }) => (
                        <React.Fragment key={key}>
                            <text x="7" y={y} fontWeight="700">{label}</text>
                            <text x="174.65" y={y} fontWeight="400">:</text>
                            <text x="185.214" y={y} fontWeight="400" xmlSpace="preserve" style={{ whiteSpace: "pre" }}>
                                {info[key]}
                            </text>
                        </React.Fragment>
                    ))}
                </g>

                <rect x="457.41" y="34" width="88" height="88" fill="#FFFFFF" />
                {qrCode && (
                    <QRCodeSVG
                        value={qrCode}
                        x={457.41}
                        y={34}
                        size={88}
                        marginSize={4}
                        bgColor="#FFFFFF"
                        fgColor="#000000"
                        title="Challan verification QR code"
                    />
                )}
            </svg>
        </div>
    );
};

Hader.propTypes = {
    RoyaltyData: PropTypes.shape({
        EchallanId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        EChallanDT: PropTypes.string,
        IssueDate: PropTypes.string,
        ValidityDate: PropTypes.string,
        quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        Registration_No: PropTypes.string,
        VehicleQunText: PropTypes.string,
        VehicleType: PropTypes.string
    }),
    qrCode: PropTypes.string
};

export default Hader;

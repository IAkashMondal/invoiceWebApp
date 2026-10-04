import React from "react";
import PropTypes from "prop-types";

// Exact baseline definitions relative to SVG top (pitch: 15.5pt)
const LEFT_BOX_ROWS = [
    { key: "stockPointId", label: "Sand Stock Point Id", y: 32.5 },
    { key: "river", label: "River", y: 48 },
    { key: "mouza", label: "Mouza", y: 63.5 },
    { key: "gpWard", label: "GP/Ward", y: 79 },
    { key: "blockUlb", label: "Block/ULB", y: 94.5 },
    { key: "policeStation", label: "Police Station", y: 110 },
    { key: "district", label: "District", y: 141 }
];

const RIGHT_BOX_ROWS = [
    { key: "purchaserName", label: "Name of Purchaser", y: 32.5 },
    { key: "mobileNo", label: "Mobile No.", y: 48 },
    { key: "address", label: "Address.", y: 63.5 },
    { key: "policeStation", label: "Police Station", y: 79 },
    { key: "district", label: "District", y: 94.5 },
    { key: "state", label: "State", y: 110 },
    { key: "vehicleType", label: "Vehicle Type", y: 125.5 },
    { key: "regNo", label: "Registration No.", y: 141 },
    { key: "capacity", label: "Capacity (in Kg)", y: 156.5 }
];

const BOTTOM_BOX_ROWS = [
    { key: "lesseeName", label: "Name", y: 201.5 },
    { key: "lesseeMobile", label: "Mobile No", y: 217 },
    { key: "OwnerAddress", label: "Address", y: 232.5 }
];

const SandDetailsBoxes = ({ RoyaltyData, vehicleRegData, data }) => {
    // Normalize data from RoyaltyData context/prop (supports direct object or nested RoyaltyData)
    const royalty = RoyaltyData?.RoyaltyData ?? RoyaltyData ?? data?.RoyaltyData ?? data ?? {};
    const owners = royalty?.RoyaltyOwners ?? {};

    const stockInfo = {
        stockPointId: owners?.SandID ?? royalty?.SandID ?? royalty?.stockPointId ?? data?.stockPointId ?? "",
        river: (owners?.River && String(owners.River).trim() !== "") 
            ? owners.River 
            : (royalty?.River && String(royalty.River).trim() !== "") 
                ? royalty.River 
                : "NA",
        mouza: owners?.OwnerMouza ?? royalty?.OwnerMouza ?? royalty?.mouza ?? data?.mouza ?? "",
        gpWard: owners?.OwnerGpWard ?? royalty?.OwnerGpWard ?? royalty?.gpWard ?? data?.gpWard ?? "",
        blockUlb: owners?.OwnerSubDivision ?? royalty?.OwnerSubDivision ?? royalty?.blockUlb ?? data?.blockUlb ?? "",
        policeStation: owners?.OwnerPoliceStation ?? royalty?.OwnerPoliceStation ?? royalty?.stockPoliceStation ?? data?.stockPoliceStation ?? "",
        district: owners?.OwnerDistrict ?? royalty?.OwnerDistrict ?? royalty?.stockDistrict ?? data?.stockDistrict ?? ""
    };

    const destinationInfo = {
        purchaserName: royalty?.NameofPurchaser ?? royalty?.purchaserName ?? data?.purchaserName ?? "",
        mobileNo: royalty?.PurchaserMobileNo ?? royalty?.purchaserMobile ?? data?.purchaserMobile ?? "",
        address: royalty?.PurchaserAdd ?? royalty?.purchaserAddress ?? data?.purchaserAddress ?? "",
        policeStation: royalty?.PoliceStation ?? royalty?.destinationPoliceStation ?? data?.destinationPoliceStation ?? "",
        district: royalty?.PurchaserDristic ?? royalty?.PurchaseDristic ?? royalty?.destinationDistrict ?? data?.destinationDistrict ?? "",
        state: royalty?.State ?? data?.destinationState ?? "West Bengal",
        vehicleType: royalty?.VehicleType ?? royalty?.vehicleType ?? vehicleRegData?.VehicleType ?? data?.vehicleType ?? "",
        regNo: royalty?.Registration_No ?? royalty?.registrationNo ?? vehicleRegData?.Registration_No ?? data?.registrationNo ?? "",
        capacity: royalty?.VehicleCapacity && Number(royalty.VehicleCapacity) !== 0
            ? String(royalty.VehicleCapacity)
            : vehicleRegData?.VehicleCapacity && Number(vehicleRegData.VehicleCapacity) !== 0
                ? String(vehicleRegData.VehicleCapacity)
                : data?.capacity
                    ? String(data.capacity)
                    : ""
    };

    const OwnerAddress =
        owners?.OwnerAddress ||
        royalty?.OwnerAddress ||
        royalty?.RoyaltyOwners?.OwnerAddress ||
        data?.OwnerAddress ||
        [owners?.OwnerAddressLine1, owners?.OwnerAddressLine2, owners?.OwnerAddressLine3, owners?.OwnerAddressLine4]
            .filter(Boolean)
            .join(", ") ||
        data?.lesseeAddress ||
        "";

    const lesseeInfo = {
        lesseeName: owners?.OwnerName ?? royalty?.OwnerName ?? royalty?.lesseeName ?? data?.lesseeName ?? "",
        lesseeMobile: owners?.OwnerMobileNo ?? royalty?.OwnerMobileNo ?? royalty?.lesseeMobile ?? data?.lesseeMobile ?? "",
        OwnerAddress: OwnerAddress,
        address: OwnerAddress,
        lesseeAddress: OwnerAddress
    };

    return (
        <div style={{ width: "551pt", marginBottom: "8pt", breakInside: "avoid" }}>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 551 237"
                role="group"
                aria-label="Sand processing stock and mining leaseholder details"
                style={{
                    display: "block",
                    width: "551pt",
                    height: "237pt",
                    maxWidth: "none",
                    overflow: "visible",
                    fontFamily: "Helvetica, Arial, sans-serif",
                    letterSpacing: 0,
                    WebkitPrintColorAdjust: "exact",
                    printColorAdjust: "exact"
                }}
            >
                {/* ==================== 1. HEADING FILLS (#FBC990) ==================== */}
                {/* Upper Left Header Fill */}
                <rect x="0" y="0" width="275.5" height="19.5" fill="#FBC990" stroke="none" />

                {/* Upper Right Header Fill */}
                <rect x="275.5" y="0" width="275.5" height="19.5" fill="#FBC990" stroke="none" />

                {/* Lower Header Fill */}
                <rect x="0" y="169" width="551" height="19.5" fill="#FBC990" stroke="none" />

                {/* ==================== 2. BORDER STROKES (#E68C32, 1pt) ==================== */}
                {/* Upper Block - Outer Frame, Dividers, & Boundaries */}
                <line x1="0.5" y1="0.5" x2="550.5" y2="0.5" stroke="#E68C32" strokeWidth="1" />
                <line x1="0" y1="19.5" x2="551" y2="19.5" stroke="#E68C32" strokeWidth="1" />
                <line x1="275.5" y1="0" x2="275.5" y2="19.5" stroke="#E68C32" strokeWidth="1" />
                <path
                    d="M 0.5 0 L 0.5 160.5 L 550.5 160.5 L 550.5 0 M 275 19.5 L 275 160.5"
                    fill="none"
                    stroke="#E68C32"
                    strokeWidth="1"
                />

                {/* Lower Block - Outer Frame & Header/Body Boundary */}
                <rect
                    x="0"
                    y="169"
                    width="551"
                    height="68"
                    fill="none"
                    stroke="#E68C32"
                    strokeWidth="1"
                />
                <line
                    x1="0"
                    y1="188.5"
                    x2="551"
                    y2="188.5"
                    stroke="#E68C32"
                    strokeWidth="1"
                />

                {/* ==================== 3. HEADINGS (#1E1E1E, 9.5pt Helvetica-Bold) ==================== */}
                <g fontFamily="Helvetica, Arial, sans-serif" fontSize="9.5" fontWeight="700" fill="#1E1E1E">
                    <text x="5" y="14.5">
                        SAND Processing/Stock &amp; leaseholder/MDO Details
                    </text>
                    <text x="280.5" y="14.5">
                        VEHICLE &amp; DESTINATION DETAILS
                    </text>
                    <text x="5" y="183.5">
                        MINING LEASE HOLDER / MDO DETAILS
                    </text>
                </g>

                {/* ==================== 4. BODY CONTENT (#1E1E1E, 8.5pt Helvetica) ==================== */}
                {/* Upper Left Column Content */}
                <g fontFamily="Helvetica, Arial, sans-serif" fontSize="8.5" fill="#1E1E1E">
                    {LEFT_BOX_ROWS.map(({ key, label, y }) => (
                        <React.Fragment key={key}>
                            <text x="5" y={y} fontWeight="400">
                                {label}
                            </text>
                            <text x="109.67" y={y} fontWeight="400">
                                :
                            </text>
                            <text
                                x="119.122"
                                y={y}
                                fontWeight="400"
                                xmlSpace="preserve"
                                style={{ whiteSpace: "pre" }}
                            >
                                {stockInfo[key]}
                            </text>
                        </React.Fragment>
                    ))}
                </g>

                {/* Upper Right Column Content */}
                <g fontFamily="Helvetica, Arial, sans-serif" fontSize="8.5" fill="#1E1E1E">
                    {RIGHT_BOX_ROWS.map(({ key, label, y }) => (
                        <React.Fragment key={key}>
                            <text x="280.5" y={y} fontWeight="400">
                                {label}
                            </text>
                            <text x="385.17" y={y} fontWeight="400">
                                :
                            </text>
                            <text
                                x="394.622"
                                y={y}
                                fontWeight="400"
                                xmlSpace="preserve"
                                style={{ whiteSpace: "pre" }}
                            >
                                {destinationInfo[key]}
                            </text>
                        </React.Fragment>
                    ))}
                </g>

                {/* Lower Panel Content */}
                <g fontFamily="Helvetica, Arial, sans-serif" fontSize="8.5" fill="#1E1E1E">
                    {BOTTOM_BOX_ROWS.map(({ key, label, y }) => (
                        <React.Fragment key={key}>
                            <text x="5" y={y} fontWeight="400">
                                {label}
                            </text>
                            <text x="123.78" y={y} fontWeight="400">
                                :
                            </text>
                            <text
                                x="133.232"
                                y={y}
                                fontWeight="400"
                                xmlSpace="preserve"
                                style={{ whiteSpace: "pre" }}
                            >
                                {lesseeInfo[key]}
                            </text>
                        </React.Fragment>
                    ))}
                </g>
            </svg>
        </div>
    );
};

SandDetailsBoxes.propTypes = {
    RoyaltyData: PropTypes.object,
    vehicleRegData: PropTypes.object,
    data: PropTypes.shape({
        stockPointId: PropTypes.string,
        river: PropTypes.string,
        mouza: PropTypes.string,
        gpWard: PropTypes.string,
        blockUlb: PropTypes.string,
        stockPoliceStation: PropTypes.string,
        stockDistrict: PropTypes.string,
        purchaserName: PropTypes.string,
        purchaserMobile: PropTypes.string,
        purchaserAddress: PropTypes.string,
        destinationPoliceStation: PropTypes.string,
        destinationDistrict: PropTypes.string,
        destinationState: PropTypes.string,
        vehicleType: PropTypes.string,
        registrationNo: PropTypes.string,
        capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        lesseeName: PropTypes.string,
        lesseeMobile: PropTypes.string,
        lesseeAddress: PropTypes.string,
        OwnerAddress: PropTypes.string
    })
};

export default SandDetailsBoxes;
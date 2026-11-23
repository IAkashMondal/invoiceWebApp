import { useContext, useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams, useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

import Hader from "./Hader";
import Footer from "./Footer";
import SandDetailsBoxes from "./SandDetailsBoxes";

import { RoyaltyInfoContext } from "@/Context/RoyaltyInfoContext";
import { getDynamicYearRange } from "../../../../../../Apis/GlobalFunction";
import { GetParticularVehicle } from "../../../../../../Apis/R_Apis/VehicleApis";
import { GetOwnersDeatils } from "../../../../../../Apis/Minors/MinorsApi";
import "../../../../../invoice.css";

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const InvoicePreview = (props) => {
    // Context from RoyaltyInfoContext (like RoyaltyPreview.jsx)
    const contextData = useContext(RoyaltyInfoContext);
    const contextRoyaltyData = contextData?.RoyaltyData;
    const setContextRoyaltyData = contextData?.setRoyaltyData;

    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scale, setScale] = useState(1);
    const contentRef = useRef(null);
    const pageNaturalWidth = useRef(null);

    const location = useLocation();
    const params = useParams();

    // QR code resolution priority: navigation state -> props -> context
    const qrCode = location.state?.qrCode || props.qrCode || "";

    // Data fetching logic directly from EditRoyaltyPreview.jsx
    useEffect(() => {
        // If royaltyData is passed via navigation state, use it instantly
        if (location.state?.royaltyData) {
            setvehicleRegData(location.state.royaltyData);
            setIsLoading(true);
            console.log("Merged royaltyData in new_renew_pdf InvoicePreview:", location.state.royaltyData);
            return;
        }

        // Fallback: Fetch from API as in EditRoyaltyPreview
        const fetchVehicleDetails = async () => {
            if (!params?.royaltyID) {
                return;
            }
            try {
                const response = await GetParticularVehicle(params.royaltyID);
                let vehicleData = response.data?.data || {};

                // Merge owner data from navigation state if present
                if (location.state?.ownerData) {
                    console.log("Merging ownerData into vehicleData", location.state.ownerData);
                    vehicleData = { ...vehicleData, ...location.state.ownerData };
                } else if (vehicleData.OwnerName) {
                    // Fetch and merge by OwnerName matching
                    try {
                        const ownersResponse = await GetOwnersDeatils();
                        if (ownersResponse?.data?.data) {
                            const matchedOwner = ownersResponse.data.data.find(
                                (owner) =>
                                    owner.OwnerName &&
                                    owner.OwnerName.trim().toLowerCase() ===
                                        vehicleData.OwnerName.trim().toLowerCase()
                            );
                            if (matchedOwner) {
                                vehicleData = { ...vehicleData, ...matchedOwner };
                            }
                        }
                    } catch (err) {
                        console.error("Error fetching owners for merge:", err);
                    }
                }
                setvehicleRegData(vehicleData);
                setIsLoading(true);
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };

        fetchVehicleDetails();
    }, [params?.royaltyID, location]);

    // Unified merged data: combines vehicle data, owner data, and live edited form fields
    const activeRoyaltyData = {
        ...vehicleRegData,
        ...(props.RoyaltyData || {}),
        ...(contextRoyaltyData || {})
    };

    const echallanId = activeRoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan";
    const documentTitle = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS`;

    // Print functionality (identical to RoyaltyPreview.jsx)
    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: documentTitle,
        pageStyle: `@page { size: A4 portrait; margin: 0mm !important; } html, body { margin: 0mm !important; padding: 0mm !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; background: #ffffff !important; } .invoice-page { margin: 0 !important; padding: 0 !important; width: 210mm !important; height: 297mm !important; top: 0 !important; left: 0 !important; }`,
    });

    const reactToPrintFn = () => {
        document.title = documentTitle;
        if (typeof handlePrint === "function") {
            handlePrint();
        } else {
            window.print();
        }
    };

    /**
     * Viewport scaling: measures the A4 page's natural rendered width
     * and computes CSS transform scale factor so page fits viewport on mobile
     * (identical to RoyaltyPreview.jsx)
     */
    const updateScale = useCallback(() => {
        if (contentRef.current && !pageNaturalWidth.current) {
            pageNaturalWidth.current = contentRef.current.offsetWidth;
        }
        const pageWidth = pageNaturalWidth.current || 794; // 210mm ≈ 794px at 96dpi
        const viewportWidth = window.innerWidth;
        const padding = 32; // 16px padding on each side
        const maxWidth = viewportWidth - padding;
        setScale(maxWidth >= pageWidth ? 1 : maxWidth / pageWidth);
    }, []);

    useEffect(() => {
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, [updateScale]);

    /**
     * Single-click direct PDF download with guaranteed single-page A4
     * (identical to RoyaltyPreview.jsx)
     */
    const captureAndDownloadPDF = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            const content = contentRef.current;
            if (!content) {
                throw new Error("Content element not found");
            }

            const canvas = await html2canvas(content, {
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: "#FCE8C5",
                imageTimeout: 5000,
                windowWidth: 1280,
                windowHeight: 1810,
                onclone: (clonedDoc, clonedElement) => {
                    const noPrintElems = clonedDoc.querySelectorAll("button, #no-print, .no-print");
                    noPrintElems.forEach((el) => el.remove());

                    clonedElement.style.transform = "none";
                    clonedElement.style.webkitTransform = "none";
                    let parent = clonedElement.parentElement;
                    while (parent && parent !== clonedDoc.documentElement) {
                        parent.style.transform = "none";
                        parent.style.webkitTransform = "none";
                        parent = parent.parentElement;
                    }
                }
            });

            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4",
                compress: true
            });

            // Force exactly A4 dimensions — guarantees single page, no overflow
            pdf.addImage(
                canvas.toDataURL("image/png", 1.0),
                "PNG",
                0,
                0,
                A4_WIDTH_MM,
                A4_HEIGHT_MM,
                undefined,
                "FAST"
            );

            pdf.save(`${documentTitle}.pdf`);
        } catch (error) {
            console.error("PDF download failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div id="Maindiv" className="flex flex-col items-center justify-center w-full py-4 print:py-0 print:p-0 print:m-0">
            {/* ═══════════════════════════════════════════════════════════
                InvoiceViewport — responsive scaling wrapper
                (Desktop: scale = 1; Mobile: scale < 1 shrinks viewport)
            ═══════════════════════════════════════════════════════════ */}
            <div
                className="invoice-viewport"
                style={{
                    width: scale < 1 ? `calc(${A4_WIDTH_MM}mm * ${scale})` : `${A4_WIDTH_MM}mm`,
                    height: scale < 1 ? `calc(${A4_HEIGHT_MM}mm * ${scale})` : `${A4_HEIGHT_MM}mm`,
                    overflow: "hidden",
                    margin: "0 auto",
                    transition: "width 0.15s ease, height 0.15s ease",
                }}
            >
                {/* Transform wrapper — applies the scale */}
                <div
                    className="invoice-scale-wrapper"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        width: `${A4_WIDTH_MM}mm`,
                        height: `${A4_HEIGHT_MM}mm`,
                    }}
                >
                    {/* Fixed 210mm × 297mm A4 Page Canvas */}
                    <div
                        id="print"
                        ref={contentRef}
                        className="invoice-page shadow-2xl"
                        style={{
                            width: `${A4_WIDTH_MM}mm`,
                            height: `${A4_HEIGHT_MM}mm`,
                            minWidth: `${A4_WIDTH_MM}mm`,
                            maxWidth: `${A4_WIDTH_MM}mm`,
                            minHeight: `${A4_HEIGHT_MM}mm`,
                            maxHeight: `${A4_HEIGHT_MM}mm`,
                            position: "relative",
                            overflow: "hidden",
                            boxSizing: "border-box",
                            margin: "0 auto",
                        }}
                    >
                        <div className="invoice-content">
                            <Hader
                                qrCode={qrCode}
                                RoyaltyData={activeRoyaltyData}
                                vehicleRegData={vehicleRegData}
                            />
                            <SandDetailsBoxes
                                RoyaltyData={activeRoyaltyData}
                                vehicleRegData={vehicleRegData}
                            />
                            <Footer
                                RoyaltyData={activeRoyaltyData}
                                vehicleRegData={vehicleRegData}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons for Direct 1-Click PDF Download & Print */}
            <div id="no-print" className="no-print flex flex-col sm:flex-row gap-4 mt-8 mb-16">
                <button
                    disabled={!isLoading || isGenerating}
                    onClick={captureAndDownloadPDF}
                    className={`px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isGenerating
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 active:scale-95"
                    }`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </>
                    )}
                </button>

                <button
                    disabled={!isLoading || isGenerating}
                    onClick={reactToPrintFn}
                    className="no-print px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print Document
                </button>
            </div>
        </div>
    );
};

InvoicePreview.propTypes = {
    qrCode: PropTypes.string,
    RoyaltyData: PropTypes.object,
    setRoyaltyData: PropTypes.func,
    generateQrCode: PropTypes.func
};

export default InvoicePreview;
export { InvoicePreview as RoyaltyPreview };

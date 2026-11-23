import { useContext, useEffect, useRef, useState, useCallback } from "react";
import { useParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

// Classic preview components
import BuyerDetailsTemp from "../Components/preview/BuyerDetailsTemp";
import ChallanTemp from "../Components/preview/ChallanTemp";
import SellerDetailsTemp from "../Components/preview/SellerDeatilsTemp";
import TextTEmp from "../Components/preview/TextTEmp";

// New renew PDF components (4 JSX files)
import InvoicePreview from "../Components/new_renew_pdf/InvoicePreview";
import Hader from "../Components/new_renew_pdf/Hader";
import SandDetailsBoxes from "../Components/new_renew_pdf/SandDetailsBoxes";
import Footer from "../Components/new_renew_pdf/Footer";

import { RoyaltyInfoContext } from "@/Context/RoyaltyInfoContext";
import { getDynamicYearRange } from "../../../../../Apis/GlobalFunction";
import { GetParticularVehicle } from "../../../../../Apis/R_Apis/VehicleApis";
import { GetOwnersDeatils } from "../../../../../Apis/Minors/MinorsApi";

// A4 dimensions in mm
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const EditRoyaltyPreview = ({ qrCode: propQrCode, RoyaltyData: propRoyaltyData, setRoyaltyData: propSetRoyaltyData, ...props }) => {
    const contextData = useContext(RoyaltyInfoContext);
    const RoyaltyData = propRoyaltyData || contextData?.RoyaltyData;
    const setRoyaltyData = propSetRoyaltyData || contextData?.setRoyaltyData;

    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scale, setScale] = useState(1);
    const [activeTemplate, setActiveTemplate] = useState("new_renew_pdf"); // "new_renew_pdf" | "classic"

    const contentRef = useRef(null);
    const pageNaturalWidth = useRef(null);

    const location = useLocation();
    const qrCode = location.state?.qrCode || propQrCode || props.qrCode || "";

    const echallanId = RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan";
    const documentTitle = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS`;

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: documentTitle,
        pageStyle: `@page { size: A4 portrait; margin: 0mm !important; } html, body { margin: 0mm !important; padding: 0mm !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; background: #ffffff !important; } #print { margin: 0 !important; padding: 7mm !important; width: 210mm !important; height: 297mm !important; }`,
    });

    const reactToPrintFn = () => {
        document.title = documentTitle;
        if (typeof handlePrint === "function") {
            handlePrint();
        } else {
            window.print();
        }
    };

    // Fetch params from URL
    const params = useParams();

    useEffect(() => {
        // If royaltyData is passed via navigation state, use it instantly
        if (location.state?.royaltyData) {
            setvehicleRegData(location.state.royaltyData);
            setIsLoadind(true);
            return;
        }

        // Fetch vehicle details based on the Royalty ID
        const fetchVehicleDetails = async () => {
            if (!params?.royaltyID) {
                return;
            }
            try {
                const response = await GetParticularVehicle(params.royaltyID);
                let vehicleData = response.data?.data || {};

                // Merge owner data from navigation state if present
                if (location.state?.ownerData) {
                    vehicleData = { ...vehicleData, ...location.state.ownerData };
                } else if (vehicleData.OwnerName) {
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
                setIsLoadind(true);
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };

        fetchVehicleDetails();
    }, [params?.royaltyID, location]);

    // Unified merged data for passing to new_renew_pdf components
    const mergedRoyaltyData = {
        ...vehicleRegData,
        ...(RoyaltyData || {}),
        ...(contextData?.RoyaltyData || {})
    };

    /**
     * Viewport scaling: measures the A4 page's natural rendered width
     * and computes a CSS transform scale factor so the entire page
     * fits within the viewport on mobile — like a PDF viewer.
     */
    const updateScale = useCallback(() => {
        if (contentRef.current && !pageNaturalWidth.current) {
            pageNaturalWidth.current = contentRef.current.offsetWidth;
        }
        const pageWidth = pageNaturalWidth.current || 794; // 210mm ≈ 794px at 96dpi
        const viewportWidth = window.innerWidth;
        const padding = 32; // 16px margin on each side
        const maxWidth = viewportWidth - padding;
        setScale(maxWidth >= pageWidth ? 1 : maxWidth / pageWidth);
    }, []);

    useEffect(() => {
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, [updateScale]);

    /**
     * PDF capture and download.
     * Captures the fixed-size A4 page element directly (contentRef)
     * and forces addImage to exactly A4 dimensions for a guaranteed 1 page output.
     */
    const captureAndDownloadPDF = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            const content = contentRef.current;
            if (!content) {
                throw new Error("Content element not found");
            }

            const isNewRenew = activeTemplate === "new_renew_pdf";

            const canvas = await html2canvas(content, {
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: isNewRenew ? "#FCE8C5" : "#ffffff",
                imageTimeout: 5000,
                windowWidth: 1280,
                windowHeight: 1810,
                onclone: (clonedDoc, clonedElement) => {
                    // Remove buttons and non-printable elements from clone
                    const noPrintElems = clonedDoc.querySelectorAll("button, #no-print, .no-print");
                    noPrintElems.forEach((el) => el.remove());

                    // Reset viewport scaling transforms on all ancestors
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
        <div id="Maindiv" className="flex flex-col items-center print:p-0 print:m-0 w-full">
            {/* Template Switcher Tabs */}
            <div id="no-print" className="no-print flex items-center gap-3 mt-2 mb-4 bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-sm">
                <button
                    type="button"
                    onClick={() => setActiveTemplate("new_renew_pdf")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTemplate === "new_renew_pdf"
                            ? "bg-amber-600 text-white shadow-md shadow-amber-200 scale-105"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                >
                    New Renew PDF (Orange)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTemplate("classic")}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeTemplate === "classic"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                    }`}
                >
                    Classic Royalty Preview (Blue)
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                InvoiceViewport — responsive scaling wrapper
                ─────────────────────────────────────────────────────────
                Desktop: scale = 1, displays at natural A4 size.
                Mobile:  scale < 1, entire A4 page shrinks to fit
                         viewport width — like a PDF viewer.
                The DOCUMENT never reflows. Only the viewport scales.
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
                    {activeTemplate === "new_renew_pdf" ? (
                        /* ─────────────────────────────────────────────────────────
                            NEW RENEW PDF TEMPLATE
                            Sends values directly to new_renew_pdf and its 4 JSX files
                        ───────────────────────────────────────────────────────── */
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
                                    RoyaltyData={mergedRoyaltyData}
                                    vehicleRegData={vehicleRegData}
                                />
                                <SandDetailsBoxes
                                    RoyaltyData={mergedRoyaltyData}
                                    vehicleRegData={vehicleRegData}
                                />
                                <Footer
                                    RoyaltyData={mergedRoyaltyData}
                                    vehicleRegData={vehicleRegData}
                                />
                            </div>
                        </div>
                    ) : (
                        /* ─────────────────────────────────────────────────────────
                            CLASSIC ROYALTY PREVIEW TEMPLATE
                            (Exact code and layout from RoyaltyPreview.jsx)
                        ───────────────────────────────────────────────────────── */
                        <div
                            id="print"
                            ref={contentRef}
                            style={{
                                width: `${A4_WIDTH_MM}mm`,
                                height: `${A4_HEIGHT_MM}mm`,
                                minWidth: `${A4_WIDTH_MM}mm`,
                                maxWidth: `${A4_WIDTH_MM}mm`,
                                minHeight: `${A4_HEIGHT_MM}mm`,
                                maxHeight: `${A4_HEIGHT_MM}mm`,
                                padding: "7mm",
                                margin: "0 auto",
                                position: "relative",
                                background: "#ffffff",
                                boxSizing: "border-box",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Blue-bordered content area — fills available A4 space */}
                            <div
                                id="indigoborder"
                                style={{
                                    width: "19.1cm",
                                    flex: "1 1 0",
                                    paddingLeft: "5mm",
                                    paddingRight: "2mm",
                                    paddingTop: "2mm",
                                    border: "1.5px solid #0000FF",
                                    background: "#ffffff",
                                    display: "flex",
                                    flexDirection: "column",
                                    position: "relative",
                                    overflow: "hidden",
                                    margin: 0,
                                    boxSizing: "border-box",
                                }}
                            >
                                {/* Challan Section */}
                                <ChallanTemp className="" qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />

                                {/* Image Behind Content */}
                                <div id="ImageBehindContent" className="flex justify-center" style={{ width: "100%", position: "relative" }}>
                                    <img
                                        id="imgdiv"
                                        style={{
                                            position: "absolute",
                                            width: "7.4cm",
                                            height: "7.6cm",
                                            objectFit: "contain",
                                            opacity: 0.25,
                                            marginTop: "7.3cm",
                                        }}
                                        src="/mid_imga.png"
                                        alt="background"
                                    />
                                    {/* Buyer & Seller Details — always 2-column, never stacked */}
                                    <div className="z-10 grid grid-cols-2 w-full gap-0 m-0 p-0">
                                        <SellerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                        <BuyerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                    </div>
                                </div>

                                {/* Additional Text Section */}
                                <div className="z-10 m-0 p-0">
                                    <TextTEmp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                </div>
                            </div>

                            {/* Generated text — inside A4 page, below blue border */}
                            <div
                                id="genaratedtex"
                                style={{
                                    display: "flex",
                                    marginTop: 0,
                                    position: "relative",
                                    width: "100%",
                                }}
                            >
                                <p style={{ fontSize: "8pt", fontWeight: "bold", fontFamily: "serif", margin: 0, marginLeft: "1cm" }}>
                                    Generated on: {vehicleRegData?.GeneratedDT}
                                </p>
                                <p style={{ fontSize: "8pt", fontWeight: "bold", fontFamily: "serif", margin: 0, marginLeft: "5.1cm" }}>
                                    {`<NIC>`}
                                </p>
                                <p style={{ fontSize: "8pt", fontWeight: "bold", fontFamily: "serif", margin: 0, marginLeft: "4.7cm" }}>
                                    Page No: 1
                                </p>
                            </div>
                        </div>
                    )}
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
                    className={`no-print px-6 py-3 rounded-lg text-white font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        activeTemplate === "new_renew_pdf"
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-blue-600 hover:bg-blue-700"
                    }`}
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

EditRoyaltyPreview.propTypes = {
    qrCode: PropTypes.string,
    RoyaltyData: PropTypes.object,
    setRoyaltyData: PropTypes.func,
    generateQrCode: PropTypes.func
};

export default EditRoyaltyPreview;
export { EditRoyaltyPreview as RoyaltyPreview };

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

// Exact A4 physical constants at 96 DPI
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// Robust viewport calculation that prevents mobile overflow blowouts
const getDeviceViewportWidth = () => {
    if (typeof window === "undefined") return A4_WIDTH_PX;
    const visualVp = window.visualViewport ? window.visualViewport.width : null;
    const clientWidth = document.documentElement?.clientWidth || null;
    const innerWidth = window.innerWidth || null;

    const validWidths = [visualVp, clientWidth, innerWidth].filter(
        (w) => typeof w === "number" && w > 0
    );

    return validWidths.length > 0 ? Math.min(...validWidths) : A4_WIDTH_PX;
};

const calculateInitialScale = () => {
    if (typeof window === "undefined") return 1;
    const vpWidth = getDeviceViewportWidth();
    const padding = 24; // 12px margins
    const available = vpWidth - padding;
    if (available >= A4_WIDTH_PX) return 1;
    return Math.max(0.25, available / A4_WIDTH_PX);
};

const EditRoyaltyPreview = ({ qrCode: propQrCode, RoyaltyData: propRoyaltyData, setRoyaltyData: propSetRoyaltyData, ...props }) => {
    const contextData = useContext(RoyaltyInfoContext);
    const RoyaltyData = propRoyaltyData || contextData?.RoyaltyData;
    const setRoyaltyData = propSetRoyaltyData || contextData?.setRoyaltyData;

    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    // Initialize already scaled to device width to prevent mobile layout jump/stretch
    const [scale, setScale] = useState(calculateInitialScale);
    const [activeTemplate, setActiveTemplate] = useState("new_renew_pdf"); // "new_renew_pdf" | "classic"

    const contentRef = useRef(null);

    const location = useLocation();
    const qrCode = location.state?.qrCode || propQrCode || props.qrCode || "";

    const echallanId = RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan";
    const documentTitle = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS`;

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: documentTitle,
        pageStyle: `@page { size: A4 portrait; margin: 0mm !important; } @page :first { margin: 0mm !important; } *, *::before, *::after { box-sizing: border-box !important; } html, body { margin: 0mm !important; padding: 0mm !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } #print, .invoice-page { margin: 0 !important; width: 210mm !important; height: 297mm !important; max-width: 210mm !important; max-height: 297mm !important; min-width: 210mm !important; min-height: 297mm !important; transform: none !important; position: fixed !important; top: 0 !important; left: 0 !important; overflow: hidden !important; box-sizing: border-box !important; } #no-print, .no-print, button { display: none !important; }`,
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
        if (location.state?.royaltyData) {
            setvehicleRegData(location.state.royaltyData);
            setIsLoadind(true);
            return;
        }

        const fetchVehicleDetails = async () => {
            if (!params?.royaltyID) {
                return;
            }
            try {
                const response = await GetParticularVehicle(params.royaltyID);
                let vehicleData = response.data?.data || {};

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

    const mergedRoyaltyData = {
        ...vehicleRegData,
        ...(RoyaltyData || {}),
        ...(contextData?.RoyaltyData || {})
    };

    /**
     * Viewport scaling calculation
     */
    const updateScale = useCallback(() => {
        const vpWidth = getDeviceViewportWidth();
        const padding = 24; // 12px margin on each side
        const maxWidth = vpWidth - padding;
        const newScale = maxWidth >= A4_WIDTH_PX ? 1 : Math.max(0.25, maxWidth / A4_WIDTH_PX);
        setScale(newScale);
    }, []);

    useEffect(() => {
        updateScale();
        window.addEventListener("resize", updateScale);
        window.addEventListener("orientationchange", updateScale);
        if (window.visualViewport) {
            window.visualViewport.addEventListener("resize", updateScale);
        }
        return () => {
            window.removeEventListener("resize", updateScale);
            window.removeEventListener("orientationchange", updateScale);
            if (window.visualViewport) {
                window.visualViewport.removeEventListener("resize", updateScale);
            }
        };
    }, [updateScale]);

    /**
     * PDF capture and download
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
                    const noPrintElems = clonedDoc.querySelectorAll("button, #no-print, .no-print");
                    noPrintElems.forEach((el) => el.remove());

                    clonedElement.style.transform = "none";
                    clonedElement.style.webkitTransform = "none";
                    clonedElement.style.position = "relative";

                    let parent = clonedElement.parentElement;
                    while (parent && parent !== clonedDoc.documentElement) {
                        parent.style.transform = "none";
                        parent.style.webkitTransform = "none";
                        parent.style.position = "static";
                        parent.style.width = "auto";
                        parent.style.height = "auto";
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

    const scaledWidth = Math.round(A4_WIDTH_PX * scale);
    const scaledHeight = Math.round(A4_HEIGHT_PX * scale);

    return (
        <div id="Maindiv" className="flex flex-col items-center print:p-0 print:m-0 w-full max-w-full overflow-x-hidden">
            {/* Template Switcher Tabs */}
            <div id="no-print" className="no-print flex flex-wrap justify-center items-center gap-2 mt-2 mb-4 bg-gray-100 p-1.5 rounded-xl border border-gray-200 shadow-sm max-w-[95%]">
                <button
                    type="button"
                    onClick={() => setActiveTemplate("new_renew_pdf")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTemplate === "new_renew_pdf"
                            ? "bg-amber-600 text-white shadow-md shadow-amber-200 scale-105"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                >
                    (Orange)
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTemplate("classic")}
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTemplate === "classic"
                            ? "bg-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-200"
                        }`}
                >
                    (Blue)
                </button>
            </div>

            {/* ═══════════════════════════════════════════════════════════
                InvoiceViewport — responsive mobile-friendly scaling container
            ═══════════════════════════════════════════════════════════ */}
            <div
                className="invoice-viewport"
                style={{
                    width: `${scaledWidth}px`,
                    height: `${scaledHeight}px`,
                    maxWidth: "100%",
                    minWidth: 0,
                    overflow: "hidden",
                    position: "relative",
                    margin: "0 auto",
                    boxSizing: "border-box",
                }}
            >
                {/* Transform wrapper — absolutely positioned so it never stretches viewport */}
                <div
                    className="invoice-scale-wrapper"
                    style={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top left",
                        width: `${A4_WIDTH_PX}px`,
                        height: `${A4_HEIGHT_PX}px`,
                        position: "absolute",
                        top: 0,
                        left: 0,
                    }}
                >
                    {activeTemplate === "new_renew_pdf" ? (
                        /* ─────────────────────────────────────────────────────────
                            NEW RENEW PDF TEMPLATE
                        ───────────────────────────────────────────────────────── */
                        <div
                            id="print"
                            ref={contentRef}
                            className="invoice-page shadow-2xl"
                            style={{
                                width: `${A4_WIDTH_PX}px`,
                                height: `${A4_HEIGHT_PX}px`,
                                minWidth: `${A4_WIDTH_PX}px`,
                                maxWidth: `${A4_WIDTH_PX}px`,
                                minHeight: `${A4_HEIGHT_PX}px`,
                                maxHeight: `${A4_HEIGHT_PX}px`,
                                position: "relative",
                                overflow: "hidden",
                                boxSizing: "border-box",
                                margin: 0,
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
                        ───────────────────────────────────────────────────────── */
                        <div
                            id="print"
                            ref={contentRef}
                            style={{
                                width: `${A4_WIDTH_PX}px`,
                                height: `${A4_HEIGHT_PX}px`,
                                minWidth: `${A4_WIDTH_PX}px`,
                                maxWidth: `${A4_WIDTH_PX}px`,
                                minHeight: `${A4_HEIGHT_PX}px`,
                                maxHeight: `${A4_HEIGHT_PX}px`,
                                padding: "7mm",
                                margin: 0,
                                position: "relative",
                                background: "#ffffff",
                                boxSizing: "border-box",
                                overflow: "hidden",
                                display: "flex",
                                flexDirection: "column",
                            }}
                        >
                            {/* Blue-bordered content area */}
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
                                <ChallanTemp className="" qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />

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
                                    <div className="z-10 grid grid-cols-2 w-full gap-0 m-0 p-0">
                                        <SellerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                        <BuyerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                    </div>
                                </div>

                                <div className="z-10 m-0 p-0">
                                    <TextTEmp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                </div>
                            </div>

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

            {/* Action Buttons */}
            <div id="no-print" className="no-print flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 mb-12 w-full max-w-sm px-4">
                <button
                    disabled={!isLoading || isGenerating}
                    onClick={captureAndDownloadPDF}
                    className={`w-full px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base ${isGenerating
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700 active:scale-95"
                        }`}
                >
                    {isGenerating ? (
                        <>
                            <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-1 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Generating PDF...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download PDF
                        </>
                    )}
                </button>

                <button
                    disabled={!isLoading || isGenerating}
                    onClick={reactToPrintFn}
                    className={`no-print w-full px-5 py-2.5 rounded-lg text-white font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base ${activeTemplate === "new_renew_pdf"
                            ? "bg-amber-600 hover:bg-amber-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

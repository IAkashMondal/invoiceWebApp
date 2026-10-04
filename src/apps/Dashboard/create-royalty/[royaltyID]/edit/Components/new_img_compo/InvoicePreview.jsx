import { useContext, useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import Hader from "./Hader";
import Footer from "./Footer";
import SandDetailsBoxes from "./SandDetailsBoxes";
import { RoyaltyInfoContext } from "@/Context/RoyaltyInfoContext";
import { getDynamicYearRange } from "../../../../../../../../Apis/GlobalFunction";
import { GetParticularVehicle } from "../../../../../../../../Apis/R_Apis/VehicleApis";
import { useParams } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";
import "../../../../../../../invoice.css";

// A4 dimensions in millimeters
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

const InvoicePreview = ({ qrCode, RoyaltyData: propRoyaltyData }) => {
    const contextData = useContext(RoyaltyInfoContext);
    const RoyaltyData = propRoyaltyData || contextData?.RoyaltyData;

    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scale, setScale] = useState(1);
    const contentRef = useRef(null);
    const pageNaturalWidth = useRef(null);

    const params = useParams();

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `WBMD_TP_${RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan"}_T_${getDynamicYearRange()}_RPS`,
        pageStyle: `@page { size: A4 portrait; margin: 0mm !important; } html, body { margin: 0mm !important; padding: 0mm !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; background: #ffffff !important; } .invoice-page { margin: 0 !important; padding: 0 !important; width: 210mm !important; height: 297mm !important; top: 0 !important; left: 0 !important; }`,
    });

    const reactToPrintFn = () => {
        document.title = `WBMD_TP_${RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan"}_T_${getDynamicYearRange()}_RPS`;
        if (typeof handlePrint === "function") {
            handlePrint();
        } else {
            window.print();
        }
    };

    // Fetch vehicle details based on the Royalty ID
    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!params?.royaltyID) {
                return;
            }
            try {
                const response = await GetParticularVehicle(params.royaltyID);
                if (response.data?.data) {
                    setvehicleRegData(response.data.data);
                    setIsLoading(true);
                } else {
                    console.warn("No vehicle data found for this Royalty ID.");
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };
        fetchVehicleDetails();
    }, [params?.royaltyID]);

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
     * PDF capture and download:
     * - Captures ONLY the locked A4 page (.invoice-page)
     * - Strips transforms from clone ancestors
     * - Generates guaranteed single-page A4 PDF using jsPDF
     */
    const captureAndDownloadPDF = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            const content = contentRef.current;
            if (!content) {
                throw new Error("Invoice content element not found");
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
                    // Remove buttons and non-printable elements from clone
                    const noPrintElems = clonedDoc.querySelectorAll("button, #no-print, .no-print");
                    noPrintElems.forEach((el) => el.remove());

                    // Reset viewport scaling transforms on all ancestors
                    // so the A4 page renders at natural size in the clone
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

            // Force exact A4 dimensions — guarantees single page, no overflow
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

            const echallanId = RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan";
            const fileName = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS.pdf`;

            pdf.save(fileName);
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
                    {/* ═══════════════════════════════════════════════════════════
                        InvoiceA4Page — fixed 210mm × 297mm document canvas
                        ─────────────────────────────────────────────────────────
                        Single source of truth for:
                          • Preview layout (what user sees on screen)
                          • PDF capture layout (what html2canvas captures)
                          • Print layout (what gets printed)
                        Dimensions are LOCKED. overflow: hidden clips any excess.
                    ═══════════════════════════════════════════════════════════ */}
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
                            <Hader qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                            <SandDetailsBoxes RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                            <Footer RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons for Direct 1-Click PDF Download & Print */}
            <div id="no-print" className="no-print flex flex-col sm:flex-row gap-4 mt-8 mb-16">
                <button
                    disabled={isGenerating}
                    onClick={captureAndDownloadPDF}
                    className={`px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isGenerating ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
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
                    disabled={isGenerating}
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
};

export default InvoicePreview;
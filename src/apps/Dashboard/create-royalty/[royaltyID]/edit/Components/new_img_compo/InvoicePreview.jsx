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

// Exact A4 physical constants at 96 DPI
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

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
    const padding = 24;
    const available = vpWidth - padding;
    if (available >= A4_WIDTH_PX) return 1;
    return Math.max(0.25, available / A4_WIDTH_PX);
};

const InvoicePreview = ({ qrCode, RoyaltyData: propRoyaltyData }) => {
    const contextData = useContext(RoyaltyInfoContext);
    const RoyaltyData = propRoyaltyData || contextData?.RoyaltyData;

    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scale, setScale] = useState(calculateInitialScale);
    const contentRef = useRef(null);

    const params = useParams();

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: `WBMD_TP_${RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan"}_T_${getDynamicYearRange()}_RPS`,
        pageStyle: `@page { size: A4 portrait; margin: 0mm !important; } @page :first { margin: 0mm !important; } *, *::before, *::after { box-sizing: border-box !important; } html, body { margin: 0mm !important; padding: 0mm !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } .invoice-page, #print { margin: 0 !important; padding: 0 !important; width: 210mm !important; height: 297mm !important; max-width: 210mm !important; max-height: 297mm !important; min-width: 210mm !important; min-height: 297mm !important; top: 0 !important; left: 0 !important; transform: none !important; position: fixed !important; overflow: hidden !important; box-sizing: border-box !important; } #no-print, .no-print, button { display: none !important; }`,
    });

    const reactToPrintFn = () => {
        document.title = `WBMD_TP_${RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || "Challan"}_T_${getDynamicYearRange()}_RPS`;
        if (typeof handlePrint === "function") {
            handlePrint();
        } else {
            window.print();
        }
    };

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
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };
        fetchVehicleDetails();
    }, [params?.royaltyID]);

    const updateScale = useCallback(() => {
        const vpWidth = getDeviceViewportWidth();
        const padding = 24;
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

    const scaledWidth = Math.round(A4_WIDTH_PX * scale);
    const scaledHeight = Math.round(A4_HEIGHT_PX * scale);

    return (
        <div id="Maindiv" className="flex flex-col items-center justify-center w-full max-w-full py-2 print:py-0 print:p-0 print:m-0 overflow-x-hidden">
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
                            <Hader qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                            <SandDetailsBoxes RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                            <Footer RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />
                        </div>
                    </div>
                </div>
            </div>

            <div id="no-print" className="no-print flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 mb-12 w-full max-w-sm px-4">
                <button
                    disabled={isGenerating}
                    onClick={captureAndDownloadPDF}
                    className={`w-full px-5 py-2.5 rounded-lg text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base ${
                        isGenerating ? "bg-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 active:scale-95"
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
                    disabled={isGenerating}
                    onClick={reactToPrintFn}
                    className="no-print w-full px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm sm:text-base"
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

InvoicePreview.propTypes = {
    qrCode: PropTypes.string,
    RoyaltyData: PropTypes.object,
    setRoyaltyData: PropTypes.func,
};

export default InvoicePreview;

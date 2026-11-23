import { useContext, useEffect, useRef, useState, useCallback } from "react";
import BuyerDetailsTemp from "./preview/BuyerDetailsTemp";
import { RoyaltyInfoContext } from "../../../../../../Context/RoyaltyInfoContext";
import ChallanTemp from "./preview/ChallanTemp";
import SellerDetailsTemp from "./preview/SellerDeatilsTemp";
import TextTEmp from "./preview/TextTEmp";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { getDynamicYearRange } from "../../../../../../../Apis/GlobalFunction";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useReactToPrint } from 'react-to-print';
import { GetParticularVehicle } from "../../../../../../../Apis/R_Apis/VehicleApis";

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

const RoyaltyPreview = ({ qrCode }) => {
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [scale, setScale] = useState(calculateInitialScale);
    const contentRef = useRef(null);

    const echallanId = RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || 'Challan';
    const documentTitle = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS`;

    const handlePrint = useReactToPrint({
        contentRef: contentRef,
        documentTitle: documentTitle,
        pageStyle: `@page { size: A4 portrait; margin: 0mm !important; } @page :first { margin: 0mm !important; } *, *::before, *::after { box-sizing: border-box !important; } html, body { margin: 0mm !important; padding: 0mm !important; width: 210mm !important; height: 297mm !important; overflow: hidden !important; background: #ffffff !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; color-adjust: exact !important; } #print { margin: 0 !important; padding: 7mm !important; width: 210mm !important; height: 297mm !important; max-width: 210mm !important; max-height: 297mm !important; position: fixed !important; top: 0 !important; left: 0 !important; transform: none !important; overflow: hidden !important; box-sizing: border-box !important; } #no-print, .no-print, button { display: none !important; }`,
    });

    const reactToPrintFn = () => {
        document.title = documentTitle;
        if (typeof handlePrint === 'function') {
            handlePrint();
        } else {
            window.print();
        }
    };

    // Fetch params from URL
    const params = useParams();

    useEffect(() => {
        // Fetch vehicle details based on the Royalty ID
        const fetchVehicleDetails = async () => {
            if (!params?.royaltyID) {
                return;
            }
            try {
                const response = await GetParticularVehicle(params.royaltyID);
                if (response.data?.data) {
                    setvehicleRegData(response.data.data);
                    setIsLoadind(true);
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
     * Viewport scaling: measures the device viewport width
     * and computes a CSS transform scale factor so the entire page
     * fits within the viewport on mobile — like a PDF viewer.
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
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [updateScale]);

    /**
     * PDF capture and download.
     *
     * Key fixes:
     * 1. Captures the fixed-size A4 page element directly (contentRef).
     * 2. Resets viewport scaling transforms in the clone so html2canvas
     *    renders the page at its natural 210mm × 297mm size.
     * 3. Forces addImage to exactly A4 dimensions — guarantees 1 page.
     * 4. No more 200-line onclone CSS injection — single source of truth.
     */
    const captureAndDownloadPDF = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            const content = contentRef.current;
            if (!content) {
                throw new Error('Content element not found');
            }

            const canvas = await html2canvas(content, {
                scale: 3,
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                imageTimeout: 5000,
                windowWidth: 1280,
                windowHeight: 1810,
                onclone: (clonedDoc, clonedElement) => {
                    // Remove buttons and non-printable elements from clone
                    const noPrintElems = clonedDoc.querySelectorAll('button, #no-print, .no-print');
                    noPrintElems.forEach((el) => el.remove());

                    // Reset viewport scaling transforms on all ancestors
                    // so the A4 page renders at its natural size in the clone
                    let parent = clonedElement.parentElement;
                    while (parent && parent !== clonedDoc.documentElement) {
                        parent.style.transform = 'none';
                        parent.style.webkitTransform = 'none';
                        parent = parent.parentElement;
                    }
                }
            });

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Force exactly A4 dimensions — guarantees single page, no overflow
            pdf.addImage(
                canvas.toDataURL('image/png', 1.0),
                'PNG',
                0,
                0,
                A4_WIDTH_MM,
                A4_HEIGHT_MM,
                undefined,
                'FAST'
            );

            const echallanId = RoyaltyData?.EchallanId || vehicleRegData?.EchallanId || 'Challan';
            const fileName = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS.pdf`;

            pdf.save(fileName);
        } catch (error) {
            console.error('PDF download failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    const scaledWidth = Math.round(A4_WIDTH_PX * scale);
    const scaledHeight = Math.round(A4_HEIGHT_PX * scale);

    return (
        <div id="Maindiv" className="flex flex-col items-center print:p-0 print:m-0 w-full max-w-full overflow-x-hidden">
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
                {/* Transform wrapper — applies the scale */}
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
                    {/* ═══════════════════════════════════════════════════════════
                        InvoiceA4Page — fixed 210mm × 297mm document canvas
                        ─────────────────────────────────────────────────────────
                        Single source of truth for:
                          • Preview layout (what the user sees on screen)
                          • PDF capture layout (what html2canvas captures)
                          • Print layout (what gets printed)
                        Dimensions are LOCKED. overflow: hidden clips any excess.
                    ═══════════════════════════════════════════════════════════ */}
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
                            padding: '7mm',
                            margin: 0,
                            position: 'relative',
                            background: '#ffffff',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        {/* Blue-bordered content area — fills available A4 space */}
                        <div
                            id="indigoborder"
                            style={{
                                width: '19.1cm',
                                flex: '1 1 0',
                                paddingLeft: '5mm',
                                paddingRight: '2mm',
                                paddingTop: '2mm',
                                border: '1.5px solid #0000FF',
                                background: '#ffffff',
                                display: 'flex',
                                flexDirection: 'column',
                                position: 'relative',
                                overflow: 'hidden',
                                margin: 0,
                                boxSizing: 'border-box',
                            }}
                        >
                            {/* Challan Section */}
                            <ChallanTemp className="" qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />

                            {/* Image Behind Content */}
                            <div id="ImageBehindContent" className="flex justify-center" style={{ width: '100%', position: 'relative' }}>
                                <img
                                    id="imgdiv"
                                    style={{
                                        position: 'absolute',
                                        width: '7.4cm',
                                        height: '7.6cm',
                                        objectFit: 'contain',
                                        opacity: 0.25,
                                        marginTop: '7.3cm',
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
                                display: 'flex',
                                marginTop: 0,
                                position: 'relative',
                                width: '100%',
                            }}
                        >
                            <p style={{ fontSize: '8pt', fontWeight: 'bold', fontFamily: 'serif', margin: 0, marginLeft: '1cm' }}>
                                Generated on: {vehicleRegData?.GeneratedDT}
                            </p>
                            <p style={{ fontSize: '8pt', fontWeight: 'bold', fontFamily: 'serif', margin: 0, marginLeft: '5.1cm' }}>
                                {`<NIC>`}
                            </p>
                            <p style={{ fontSize: '8pt', fontWeight: 'bold', fontFamily: 'serif', margin: 0, marginLeft: '4.7cm' }}>
                                Page No: 1
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons for Direct 1-Click PDF Download */}
            <div id="no-print" className="flex flex-col sm:flex-row gap-4 mt-8 mb-16">
                <button
                    disabled={!isLoading || isGenerating}
                    onClick={captureAndDownloadPDF}
                    className={`px-6 py-3 rounded-lg text-white font-medium shadow-md transition-all flex items-center justify-center gap-2 ${
                        isGenerating ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:scale-95'
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
                    className="px-6 py-3 rounded-lg bg-blue-600 text-white font-medium shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
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

RoyaltyPreview.propTypes = {
    qrCode: PropTypes.string,
};

export default RoyaltyPreview;

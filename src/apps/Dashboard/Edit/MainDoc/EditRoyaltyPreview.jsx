import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import PropTypes from "prop-types";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import ChallanTemp from "../Components/preview/ChallanTemp";
import TextTEmp from "../Components/preview/TextTEmp";
import SellerDetailsTemp from "../Components/preview/SellerDeatilsTemp";
import BuyerDetailsTemp from "../Components/preview/BuyerDetailsTemp";
import { getDynamicYearRange } from "../../../../../Apis/GlobalFunction";
import { GetParticularVehicle } from "../../../../../Apis/R_Apis/VehicleApis";
import { GetOwnersDeatils } from "../../../../../Apis/Minors/MinorsApi";

const EditRoyaltyPreview = (props) => {
    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const contentRef = useRef(null);

    const location = useLocation();
    const qrCode = location.state?.qrCode || props.qrCode || "";

    const reactToPrintFn = () => {
        document.title = `WBMD_TP_${vehicleRegData?.EchallanId}_T_${getDynamicYearRange()}_RPS`;
        window.print();
    };

    // Fetch params from URL
    const params = useParams();

    useEffect(() => {
        // If royaltyData is passed via navigation state, use it instantly
        if (location.state?.royaltyData) {
            setvehicleRegData(location.state.royaltyData);
            setIsLoadind(true);
            console.log('Merged royaltyData in EditRoyaltyPreview:', location.state.royaltyData);
            return;
        }
        // Otherwise, fetch from API as fallback
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
                    // If no ownerData in state, fetch and merge by OwnerName
                    try {
                        const ownersResponse = await GetOwnersDeatils();
                        if (ownersResponse?.data?.data) {
                            const matchedOwner = ownersResponse.data.data.find(
                                owner => owner.OwnerName && owner.OwnerName.trim().toLowerCase() === vehicleData.OwnerName.trim().toLowerCase()
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

    // Single-click direct PDF download with exact desktop A4 layout (Screenshot 2)
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
                windowHeight: 1800,
                onclone: (clonedDoc) => {
                    // Remove buttons and non-printable elements
                    const noPrintElems = clonedDoc.querySelectorAll('button, #no-print, .no-print');
                    noPrintElems.forEach((el) => el.remove());

                    // Inject CSS rules to enforce exact desktop A4 layout matching target design
                    const styleElem = clonedDoc.createElement('style');
                    styleElem.type = 'text/css';
                    styleElem.innerHTML = `
                        * {
                            -webkit-print-color-adjust: exact !important;
                            print-color-adjust: exact !important;
                            box-sizing: border-box !important;
                        }
                        body {
                            background-color: #ffffff !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        #print {
                            width: 210mm !important;
                            max-width: 210mm !important;
                            min-width: 210mm !important;
                            padding: 7mm !important;
                            margin: 0 auto !important;
                            background: #ffffff !important;
                            position: relative !important;
                        }
                        #indigoborder {
                            width: 19.1cm !important;
                            height: 29.7cm !important;
                            min-height: 29.7cm !important;
                            max-height: 29.7cm !important;
                            padding-left: 5mm !important;
                            padding-right: 2mm !important;
                            padding-top: 2mm !important;
                            border: 1.5px solid #0000FF !important;
                            background: #ffffff !important;
                            display: flex !important;
                            flex-direction: column !important;
                            position: relative !important;
                        }
                        #nameText {
                            font-size: 15pt !important;
                            font-weight: bold !important;
                            font-family: helvetica, sans-serif !important;
                            text-align: center !important;
                            margin-top: 0 !important;
                            margin-bottom: 0 !important;
                            padding: 0 !important;
                            color: #000000 !important;
                            width: 100% !important;
                        }
                        #challnabox {
                            display: grid !important;
                            grid-auto-flow: column !important;
                            font-family: serif !important;
                            margin-bottom: 0 !important;
                            padding: 0 !important;
                        }
                        #detalsDiv {
                            width: 14.5cm !important;
                            height: 3.6cm !important;
                            padding-left: 2mm !important;
                            padding-right: 2mm !important;
                            border: 1.5px solid #000000 !important;
                            margin-top: 0 !important;
                        }
                        #boxtext {
                            display: flex !important;
                            font-weight: bold !important;
                            font-size: 13pt !important;
                            font-family: serif !important;
                            color: #000000 !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        #boxgap {
                            min-width: 3.7cm !important;
                            width: 3.7cm !important;
                            display: inline-block !important;
                        }
                        #qntText {
                            font-size: 9pt !important;
                            font-weight: 300 !important;
                        }
                        #qrcan {
                            width: 3.1cm !important;
                            height: 3.2cm !important;
                            margin-right: 7mm !important;
                            margin-left: 1mm !important;
                            margin-top: 4mm !important;
                        }
                        #ImageBehindContent {
                            display: flex !important;
                            justify-content: center !important;
                            width: 100% !important;
                            position: relative !important;
                        }
                        #ImageBehindContent > div {
                            display: grid !important;
                            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
                            width: 100% !important;
                            gap: 0 !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        #imgdiv {
                            position: absolute !important;
                            width: 7.4cm !important;
                            height: 7.6cm !important;
                            margin-top: 7.3cm !important;
                            object-fit: contain !important;
                            opacity: 0.25 !important;
                        }
                        #sellerBox, #buyerBox {
                            width: 9cm !important;
                            height: auto !important;
                            display: flex !important;
                            flex-direction: column !important;
                            margin-top: 1mm !important;
                            justify-content: flex-start !important;
                            border: 1.5px solid #000000 !important;
                            padding: 0 !important;
                        }
                        #large-screen-styles {
                            font-size: 10pt !important;
                            font-weight: 600 !important;
                            font-style: italic !important;
                            font-family: serif !important;
                            margin-top: 4mm !important;
                            margin-left: 0.3cm !important;
                            color: #000000 !important;
                        }
                        #sellerBox p, #buyerBox p, #sellerBox span, #buyerBox span {
                            font-size: 11pt !important;
                            font-family: serif !important;
                            color: #000000 !important;
                        }
                        #sellerBox p {
                            margin-bottom: 6mm !important;
                            margin-left: 1mm !important;
                            margin-top: 0 !important;
                        }
                        #buyerBox p {
                            margin-bottom: 6mm !important;
                            margin-left: 1mm !important;
                            margin-top: 0 !important;
                        }
                        #TempTex, #TempTexBold, #TempTexBold1 {
                            font-size: 11.3pt !important;
                            font-family: serif !important;
                            color: #000000 !important;
                        }
                        #qrText {
                            font-size: 11pt !important;
                            font-family: serif !important;
                            font-weight: bold !important;
                            font-style: italic !important;
                            margin-left: -5mm !important;
                            padding: 0 !important;
                            margin-top: 3mm !important;
                            color: #000000 !important;
                        }
                        #genaratedtex {
                            display: flex !important;
                            margin-top: 0 !important;
                            position: relative !important;
                            width: 100% !important;
                        }
                        #genaratedtex p {
                            font-size: 8pt !important;
                            font-weight: bold !important;
                            font-family: serif !important;
                            color: #000000 !important;
                            margin: 0 !important;
                        }
                        #genaratedtex p:nth-child(1) {
                            margin-left: 1cm !important;
                        }
                        #genaratedtex p:nth-child(2) {
                            margin-left: 5.1cm !important;
                        }
                        #genaratedtex p:nth-child(3) {
                            margin-left: 4.7cm !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleElem);
                }
            });

            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            pdf.addImage(
                canvas.toDataURL('image/png', 1.0),
                'PNG',
                0,
                0,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );

            const echallanId = vehicleRegData?.EchallanId || 'Challan';
            const fileName = `WBMD_TP_${echallanId}_T_${getDynamicYearRange()}_RPS.pdf`;

            pdf.save(fileName);
        } catch (error) {
            console.error('PDF download failed:', error);
            alert('Failed to generate PDF. Please try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div id="Maindiv" className="flex flex-col items-center">
            {/* The entire Royalty Preview component wrapped inside a reference */}
            <div className="">
                <div id="print" ref={contentRef} className="m-0 relative lg:p-[7mm] sm:p-[0.3cm]">
                    {/* A4 Sized Container */}
                    <div id="indigoborder" className="border-[1.5px] border-[#0000FF] lg:w-[19.1cm] lg:h-[29.7cm] lg:pl-[5mm] sm:h-auto sm:w-[100%] sm:p-[0.3cm] m-0 pt-[0mm] bg-white flex flex-col">

                        {/* Challan Section */}
                        <ChallanTemp qrCode={qrCode} RoyaltyData={vehicleRegData} />

                        {/* Image Behind Content */}
                        <div id="ImageBehindContent" className="flex justify-center sm:p-0 sm:w-[100%]">
                            <img
                                id="imgdiv"
                                className="absolute sm:absolute lg:w-[7.4cm] lg:h-[7.6cm] object-contain opacity-25 lg:mt-[7.3cm] sm:w-[4.2cm] sm:h-[4.2cm] sm:mt-36"
                                src="/mid_imga.png"
                                alt="background"
                            />
                            {/* Buyer & Seller Details */}
                            <div className="z-10 grid grid-cols-1 sm:grid-cols-2 w-full sm:w-full gap-0 sm:gap-0 m-0 sm:m-0 sm:mr-0 sm:ml-0 p-0">
                                <SellerDetailsTemp RoyaltyData={vehicleRegData} />
                                <BuyerDetailsTemp RoyaltyData={vehicleRegData} />
                            </div>
                        </div>

                        {/* Additional Text Section */}
                        <div className="z-10 m-0 p-0">
                            <TextTEmp RoyaltyData={vehicleRegData} />
                        </div>
                    </div>

                    <div id="genaratedtex" className="relative flex mt-0">
                        <p className="font font-bold font-serif lg:text-[8pt] lg:ml-[1cm] sm:text-[5pt] sm:ml-[0.3cm]">Generated on: {vehicleRegData?.GeneratedDT}</p>
                        <p className="font font-bold font-serif lg:text-[8pt] lg:ml-[5.1cm] sm:ml-[3cm] sm:text-[5pt]">{`<NIC>`}</p>
                        <p className="font font-bold font-serif lg:text-[8pt] lg:ml-[4.7cm] sm:text-[5pt] sm:ml-[3cm]">Page No: 1</p>
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

EditRoyaltyPreview.propTypes = {
    qrCode: PropTypes.string,
    RoyaltyData: PropTypes.object
};

export default EditRoyaltyPreview;

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
    const contentRef = useRef(null);

    const location = useLocation();
    const qrCode = location.state?.qrCode || props.qrCode || "";

    const reactToPrintFn = () => {
        document.title = `WBMD_TP_${vehicleRegData?.EchallanId}_T_${getDynamicYearRange()}_RPS`,
            window.print()
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

    // Capture screenshot and generate PDF
    const captureScreenshot = async () => {
        try {
            const content = contentRef.current;
            if (!content) {
                throw new Error('Content not found');
            }

            // Optimize canvas capture settings
            const canvas = await html2canvas(content, {
                scale: 3, // Reduced scale for better performance
                useCORS: true,
                logging: false,
                allowTaint: true,
                backgroundColor: '#ffffff',
                imageTimeout: 2000,
                removeContainer: true,
                foreignObjectRendering: false,
                async: true,
                onclone: (clonedDoc) => {
                    const buttons = clonedDoc.getElementsByTagName('button');
                    for (let button of buttons) {
                        button.remove();
                    }
                }
            });

            // Create PDF with optimized settings
            const imgWidth = 210;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Add image with compression
            pdf.addImage(
                canvas.toDataURL('image/jpeg', 0.8),
                'JPEG',
                0,
                0,
                imgWidth,
                imgHeight,
                undefined,
                'FAST'
            );

            // Get blob with compression
            const pdfBlob = pdf.output('blob');

            canvas.remove();

            return pdfBlob;
        } catch (error) {
            console.error('Screenshot capture failed:', error);
            throw new Error('Failed to capture PDF content');
        }
    };

    // Direct download function
    const downloadPDF = (file) => {
        const url = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 100);
    };

    // Handle share button click
    const handleShare = async () => {
        if (isGenerating) return;

        try {
            setIsGenerating(true);

            const pdfBlob = await captureScreenshot();
            const fileName = `WBMD_TP_${vehicleRegData}_T_${getDynamicYearRange()}_RPS.pdf`;
            const file = new File([pdfBlob], fileName, {
                type: 'application/pdf',
                lastModified: Date.now()
            });

            // Try native sharing first
            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    // Set a timeout for the share operation
                    const sharePromise = navigator.share({
                        files: [file]
                    });

                    // If share takes too long, fall back to download
                    const timeoutPromise = new Promise((_, reject) =>
                        setTimeout(() => reject(new Error('Share timeout')), 5000)
                    );

                    await Promise.race([sharePromise, timeoutPromise]);
                } catch (err) {
                    console.warn('Share failed, downloading instead:', err);
                    downloadPDF(file);
                }
            } else {
                // If sharing not supported, download directly
                downloadPDF(file);
            }
        } catch (error) {
            console.error('Operation failed:', error);
            alert('Failed to process PDF. Trying direct download...');
            try {
                const pdfBlob = await captureScreenshot();
                const fileName = `WBMD_TP_${vehicleRegData.EchallanId}_T_${getDynamicYearRange()}_RPS.pdf`;
                const file = new File([pdfBlob], fileName, { type: 'application/pdf' });
                downloadPDF(file);
            } catch {
                alert('Failed to generate PDF. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    // Share the generated PDF with loading state
    const [isGenerating, setIsGenerating] = useState(false);

    return (
        <div id="Maindiv" className="flex flex-col items-center">
            {/* The entire Royalty Preview component wrapped inside a reference */}
            <div className="">
                <div id="print" ref={contentRef} className="m-0 relative lg:p-[7mm] sm:p-[0.3cm]">
                    {/* A4 Sized Container */}
                    <div id="indigoborder" className="border-[1px] border-indigo-700 lg:w-[19.1cm] lg:h-[29.7cm] lg:pl-[5mm] sm:h-auto sm:w-[100%] sm:p-[0.3cm] m-0 pt-[0mm] bg-white flex flex-col">

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

            {/* Button to Download as PDF */}
            <button
                id="no-print"
                disabled={!isLoading}
                onClick={reactToPrintFn}
                className="mt-32 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-[100px] sm:mt-10 sm:mb-[60px]"
            >
                Download as PDF
            </button>

            {/* Updated Share/Download Button */}
            <button
                id="no-print"
                disabled={!isLoading || isGenerating}
                onClick={handleShare}
                className={`mt-10 ${isGenerating ? 'bg-gray-500' : 'bg-green-500'
                    } text-white px-4 py-2 rounded hover:bg-green-700 mb-[60px] flex items-center gap-2`}
            >
                {isGenerating ? (
                    <>
                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                    </>
                ) : (
                    'Share PDF unde devlopment'
                )}
            </button>
        </div>
    );
};

EditRoyaltyPreview.propTypes = {
    qrCode: PropTypes.string,
    RoyaltyData: PropTypes.object
};

export default EditRoyaltyPreview;

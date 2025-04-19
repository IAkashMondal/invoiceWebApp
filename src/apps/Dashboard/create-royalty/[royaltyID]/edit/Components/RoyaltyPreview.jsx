import { useContext, useEffect, useRef, useState } from "react";
import BuyerDetailsTemp from "./preview/BuyerDetailsTemp";
import { RoyaltyInfoContext } from "../../../../../../Context/RoyaltyInfoContext";
import ChallanTemp from "./preview/ChallanTemp";
import SellerDetailsTemp from "./preview/SellerDeatilsTemp";
import TextTEmp from "./preview/TextTEmp";
import { GetParticularVehicle } from "../../../../../../../Apis/GlobalApi";
import { useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
// import { useReactToPrint } from "react-to-print";
const ViteUrl = import.meta.env.VITE_REDIRECT;
import { getDynamicYearRange } from "../../../../../../../Apis/GlobalFunction";
const RoyaltyPreview = ({ qrCode }) => {
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const navigate = useNavigate();
    const contentRef = useRef(null);
    // const reactToPrintFn = useReactToPrint({
    //     contentRef,
    //     documentTitle: `WBMD_TP_${RoyaltyData?.EchallanId}_T_${getDynamicYearRange()}_RPS`
    // });
    const reactToPrintFn = () => {
        document.title = `WBMD_TP_${RoyaltyData?.EchallanId}_T_${getDynamicYearRange()}_RPS`;
        window.print();
        // navigate(ViteUrl)
    };


    // const reactToPrintFn = useReactToPrint({ contentRef });
    // Get formatted date & time
    // Get params from URL
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
    }, [params?.royaltyID]); // Run effect when `royaltyID` changes
    // const handleDownloadPDF = async () => {
    //     document.title = `WBMD_TP_${RoyaltyData.EchallanId}_S_24-25_RPS`; // Set the desired PDF title
    //     window.print();
    // };
    return (
        <div id="Maindiv" className="flex flex-col items-center ">
            {/* The entire Royalty Preview component wrapped inside a reference */}
            <div className="">
                <div id="print" ref={contentRef} className="m-0 relative lg:p-[7mm]  sm:p-[0.3cm]">
                    {/* A4 Sized Container */}
                    <div id="indigoborder" className="border-[1px] border-indigo-700 lg:w-[19.1cm] lg:h-[29.7cm] lg:pl-[5mm]  sm:h-auto sm:w-[100%] sm:p-[0.3cm] m-0 pt-[0mm] bg-white flex flex-col">

                        {/* Challan Section */}
                        <ChallanTemp className="" qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />

                        {/* Image Behind Content */}
                        <div id="ImageBehindContent" className="flex justify-center   sm:p-0 sm:w-[100%] ">
                            <img
                                id="imgdiv"
                                className="absolute sm:absolute lg:w-[7.4cm] lg:h-[7.6cm]  object-contain opacity-25 lg:mt-[7.3cm] sm:w-[4.2cm] sm:h-[4.2cm] sm:mt-36"
                                src="/mid_imga.png"
                                alt="background"
                            />
                            {/* Buyer & Seller Details */}
                            <div className="z-10 grid grid-cols-1 sm:grid-cols-2 w-full sm:w-full gap-0 sm:gap-0 m-0 sm:m-0 sm:mr-0 sm:ml-0  p-0">
                                <SellerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                <BuyerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                            </div>

                        </div>

                        {/* Additional Text Section */}
                        <div className="z-10 m-0 p-0">
                            <TextTEmp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                        </div>
                    </div>
                    <div id="genaratedtex" className=" relative flex mt-0 ">
                        <p className="font font-bold font-serif lg:text-[8pt] lg:ml-[1cm] sm:text-[5pt] sm:ml-[0.3cm]">Generated on: {vehicleRegData?.GeneratedDT}</p>
                        <p className="font font-bold font-serif lg:text-[8pt] lg:ml-[5.1cm] sm:ml-[3cm] sm:text-[5pt]">{`<NIC>`}</p>
                        <p className="font font-bold font-serif lg:text-[8pt] lg:ml-[4.7cm]  sm:text-[5pt] sm:ml-[3cm]">Page No: 1</p>
                    </div>
                </div>
            </div>

            {/* Button to Download as PDF */}
            <button id="no-print" disabled={!isLoading}
                onClick={reactToPrintFn}
                className="mt-32 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-[100px] sm:mt-10 sm:mb-[60px]"
            >
                Download as PDF
            </button>
        </div>
    );
};

export default RoyaltyPreview;
RoyaltyPreview.propTypes = {

    qrCode: PropTypes.string, // QR code should be a string (URL or encoded data)

};
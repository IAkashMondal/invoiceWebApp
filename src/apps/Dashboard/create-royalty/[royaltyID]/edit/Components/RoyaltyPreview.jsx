import { useContext, useEffect, useRef, useState } from "react";
import BuyerDetailsTemp from "./preview/BuyerDetailsTemp";
import { RoyaltyInfoContext } from "../../../../../../Context/RoyaltyInfoContext";
import ChallanTemp from "./preview/ChallanTemp";
import SellerDetailsTemp from "./preview/SellerDeatilsTemp";
import TextTEmp from "./preview/TextTEmp";
import { GetParticularVehicle } from "../../../../../../../Apis/GlobalApi";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useReactToPrint } from "react-to-print";
const RoyaltyPreview = ({ qrCode }) => {
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [vehicleRegData, setvehicleRegData] = useState({});
    const [isLoading, setIsLoadind] = useState(false);
    const contentRef = useRef(null);
    const reactToPrintFn = useReactToPrint({
        contentRef,
        documentTitle: `WBMD_TP_${RoyaltyData?.EchallanId}_S_24-25_RPS`
    });

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
        <div id="" className="flex flex-col items-center ">
            {/* The entire Royalty Preview component wrapped inside a reference */}
            <div className="">
                <div id="print" ref={contentRef} className="m-0 relative w-[21.1cm] h-[29.7cm] p-[0.5cm]">
                    {/* A4 Sized Container */}
                    <div className="border-[1px] border-indigo-700 p-[0.5cm] pb-[1.7cm] h-[28.7cm] m-0 pt-[0mm] bg-white flex flex-col">

                        {/* Challan Section */}
                        <ChallanTemp qrCode={qrCode} RoyaltyData={RoyaltyData} vehicleRegData={vehicleRegData} />

                        {/* Image Behind Content */}
                        <div className="flex justify-center items-center ">
                            <img
                                className="absolute w-[8.5cm] h-[8.5cm] object-contain opacity-25 mt-[8.9cm]"
                                src="/mid_imga.png"
                                alt="background"
                            />
                            {/* Buyer & Seller Details */}
                            <div className=" z-10 grid grid-flow-col gap-[0.2cm]">
                                <SellerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                <BuyerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                            </div>
                        </div>

                        {/* Additional Text Section */}
                        <div className="z-10 m-0 p-0">
                            <TextTEmp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                        </div>
                    </div>
                    <div className=" relative flex mt-0">
                        <p className="font font-bold font-serif text-[8.7pt] ml-[1cm]">Generated on: {vehicleRegData?.GeneratedDT}</p>
                        <p className="font font-bold font-serif text-[8.7pt] ml-[5cm]">{`<NIC>`}</p>
                        <p className="font font-bold font-serif text-[8.7pt] ml-[4.7cm]">Page No: 1</p>
                    </div>
                </div>
            </div>

            {/* Button to Download as PDF */}
            <button id="no-print" disabled={!isLoading}
                onClick={reactToPrintFn}
                className="mt-32 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-[100px]"
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
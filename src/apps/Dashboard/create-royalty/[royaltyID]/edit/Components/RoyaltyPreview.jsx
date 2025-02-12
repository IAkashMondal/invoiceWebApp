import { useContext, useRef } from "react";
import BuyerDetailsTemp from "./preview/BuyerDetailsTemp";
import { RoyaltyInfoContext } from "../../../../../../Context/RoyaltyInfoContext";
import ChallanTemp from "./preview/ChallanTemp";
import SellerDetailsTemp from "./preview/SellerDeatilsTemp";
import TextTEmp from "./preview/TextTEmp";

const RoyaltyPreview = ({ qrCode, }) => {
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    console.log(RoyaltyData, "RoyaltyData-------------------------------------------------------->")
    const royaltyRef = useRef(null); // Reference for capturing the component

    const handleDownloadPDF = async () => {
        document.title = "RoyaltyPreview"; // Set the desired PDF title
        window.print();
        setTimeout(() => {
            document.title = "YourOriginalTitle"; // Restore original title after printing
        }, 1000); // Restore title after 1s
    };

    return (
        <div id="print-container" className="flex flex-col items-center sm:w-[200px]">
            {/* The entire Royalty Preview component wrapped inside a reference */}
            <div id="print" ref={royaltyRef} className="w-[21.1cm] h-[29.7cm] border">
                <div className="m-0 relative w-[21.1cm] h-[29.7cm] p-[1.3cm]">
                    {/* A4 Sized Container */}
                    <div className="relative w-[18.8cm] h-[27.2cm] border-[1px] border-indigo-700  m-0  bg-white flex flex-col">

                        {/* Challan Section */}
                        <ChallanTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} qrCode={qrCode} />

                        {/* Image Behind Content */}
                        <div className="relative flex justify-center items-center ">
                            <img
                                className="absolute w-[7.5cm] h-[7.55cm] object-contain opacity-40 mt-[8.2cm]"
                                src="../../../../../../../public/mid_imga.png"
                                alt="background"
                            />

                            {/* Buyer & Seller Details */}
                            <div className="relative z-10 flex justify-between w-full">
                                <SellerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                                <BuyerDetailsTemp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                            </div>
                        </div>

                        {/* Additional Text Section */}
                        <div className="z-10">
                            <TextTEmp RoyaltyData={{ RoyaltyData, setRoyaltyData }} />
                        </div>
                    </div>
                    <div className="flex z-10">
                        <p className="font font-bold font-serif text-[8.7pt] ml-[1cm]">Generated on: {`12/10/2024 01:51 AM `}</p>
                        <p className="font font-bold font-serif text-[8.7pt] ml-[5cm]">{`<NIC>`}</p>
                        <p className="font font-bold font-serif text-[8.7pt] ml-[4.7cm]">Page No: 1</p>
                    </div>
                </div>
            </div>

            {/* Button to Download as PDF */}
            <button id="no-print"
                onClick={handleDownloadPDF}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Download as PDF
            </button>
        </div>
    );
};

export default RoyaltyPreview;
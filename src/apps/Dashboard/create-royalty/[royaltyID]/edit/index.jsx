import { useEffect, useState } from "react";
import AddRoyaltyFrom from "./Components/AddRoyaltyFrom";
import RoyaltyPreview from "./Components/RoyaltyPreview";
import { RoyaltyInfoContext } from "../../../../../Context/RoyaltyInfoContext";
import Dummydata from "../../../../../../Apis/DummyData";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
const EditRoyalty = () => {
    const [RoyaltyData, setRoyaltyData] = useState(Dummydata);
    const [qrCode, setQrCode] = useState(null);

    const [view, setView] = useState(() => {
        return localStorage.getItem("preview") === "true";
    });

    useEffect(() => {
        localStorage.setItem("preview", view);
    }, [view]);
    const generateQrCode = (QRBASEURL, EChallanId) => {
        if (!QRBASEURL) {
            console.log("QRBASEURL no found")
        }
        const url = `${QRBASEURL}/WBMD/Page/snstpass.aspx?id=${EChallanId}/S/24-25/RPS`;
      
        setQrCode(url);
    };
    useEffect(() => {
        setRoyaltyData(Dummydata);
    }, []);

    return (
        <RoyaltyInfoContext.Provider value={{ RoyaltyData, setRoyaltyData }}>
            <div id="no-print" >
                {/* Left Section - Form */}
                <div className="flex justify-center items-center">
                    <AddRoyaltyFrom generateQrCode={generateQrCode} qrCode={qrCode} RoyaltyData={RoyaltyData} setRoyaltyData={setRoyaltyData} />
                </div>

                {/* Right Section - Preview */}

            </div>
            <div id="no-print" className="flex justify-center items-center w-[90%]">
                <Button
                    className={`flex items-center gap-2 px-4 py-2 text-white rounded-md ${view ? "bg-green-500" : "bg-red-500"}`}
                    onClick={() => setView(prev => !prev)}
                >
                    Preview {view ? <>On <Eye /></> : <>Off <EyeClosed /></>}
                </Button>
            </div>

            {view ?
                <div className="flex justify-center items-center sm:h-full w-full">
                    <RoyaltyPreview RoyaltyData={RoyaltyData} setRoyaltyData={setRoyaltyData} qrCode={qrCode} />
                </div>
                : ""}
        </RoyaltyInfoContext.Provider>
    );
};

export default EditRoyalty;

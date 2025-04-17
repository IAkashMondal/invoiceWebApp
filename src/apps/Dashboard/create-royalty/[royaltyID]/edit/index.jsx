import { useEffect, useState } from "react";
import AddRoyaltyFrom from "./Components/AddRoyaltyFrom";
import RoyaltyPreview from "./Components/RoyaltyPreview";
import { RoyaltyInfoContext } from "../../../../../Context/RoyaltyInfoContext";
import Dummydata from "../../../../../../Apis/DummyData";

const EditRoyalty = () => {
    const [RoyaltyData, setRoyaltyData] = useState(Dummydata);
    const [qrCode, setQrCode] = useState(null);

    const generateQrCode = (QRBASEURL, EChallanId) => {
        if (!QRBASEURL) {
            console.log("QRBASEURL not found");
            return;
        }
        const url = `${QRBASEURL}/WBMD/Page/each/aspx/id/${EChallanId}/S/24-25/RPS`;
        setQrCode(url);
    };

    useEffect(() => {
        setRoyaltyData(Dummydata);
    }, []);

    return (
        <RoyaltyInfoContext.Provider value={{ RoyaltyData, setRoyaltyData }}>
            <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-5">
                {/* Left Section - Form */}
                <div>
                    <AddRoyaltyFrom
                        generateQrCode={generateQrCode}
                        qrCode={qrCode}
                    />
                </div>

                {/* Right Section - Preview */}
                <div>
                    <RoyaltyPreview
                        qrCode={qrCode}
                        RoyaltyData={RoyaltyData}
                    />
                </div>
            </div>
        </RoyaltyInfoContext.Provider>
    );
};

export default EditRoyalty;

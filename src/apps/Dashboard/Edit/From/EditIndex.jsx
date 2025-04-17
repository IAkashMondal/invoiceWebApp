import { useEffect, useState } from "react";
// import AddRoyaltyFrom from "./Components/AddRoyaltyFrom";
// import RoyaltyPreview from "./Components/RoyaltyPreview";

import { Button } from "@/components/ui/button";
import { Eye, EyeClosed } from "lucide-react";
import EditMainForm from "./EditMainFrom";
import RoyaltyPreview from "../../create-royalty/[royaltyID]/edit/Components/RoyaltyPreview";
import Dummydata from "../../../../../Apis/DummyData";
import { RoyaltyInfoContext } from "../../../../Context/RoyaltyInfoContext";
import { GetParticularVehicle } from "../../../../../Apis/GlobalApi";
import { useParams } from "react-router-dom";
const EditIndex = () => {
  const [RoyaltyData, setRoyaltyData] = useState(Dummydata);
  const [RoyaltyDatas, setRoyaltyDatas] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const params = useParams();
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
    const url = `${QRBASEURL}/WBMD/Page/each/aspx/id/${EChallanId}/S/24-25/RPS`;
    setQrCode(url);
  };
  useEffect(() => {
    const fetchVehicles = async () => {

      try {
        const response = await GetParticularVehicle(params.royaltyID);
        setRoyaltyDatas(response?.data?.data)
        console.log("resp",response)
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };
    fetchVehicles()
  }, [params.royaltyID]);

  return (
    <RoyaltyInfoContext.Provider value={{ RoyaltyData, setRoyaltyData }}>
      <div id="no-print" >
        {/* Left Section - Form */}
        <div className="flex justify-center items-center">
          <EditMainForm generateQrCode={generateQrCode} qrCode={qrCode} RoyaltyData={RoyaltyData} setRoyaltyData={setRoyaltyData} />
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

export default EditIndex;

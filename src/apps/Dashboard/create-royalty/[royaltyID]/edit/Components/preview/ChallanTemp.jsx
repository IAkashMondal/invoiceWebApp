import PropTypes from "prop-types"; // Import PropTypes
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { GetParticularVehicle } from "../../../../../../../../Apis/GlobalApi";
import { useParams } from "react-router-dom";
import { numberToWords } from "../../../../../../../../Apis/GlobalFunction";
const ChallanTemp = ({ RoyaltyData, qrCode }) => {
  // State variables

  const [EChallanId, setChallanID] = useState("Error");
  const [vehicleRegData, setvehicleRegData] = useState({});
  // Get formatted date & time

  // Get params from URL
  const params = useParams();

  // Convert quantity to words
  const TextAmount = vehicleRegData.quantity ? numberToWords(Number(vehicleRegData.quantity)) : "";

  useEffect(() => {
    // Fetch vehicle details based on the Royalty ID

    const fetchVehicleDetails = async () => {
      if (!params?.royaltyID) {
        console.warn("Royalty ID is missing");
        return;
      }

      try {
        const response = await GetParticularVehicle(params.royaltyID);
        setChallanID(response?.data?.data.EchallanId)
        if (response.data?.data) {
          setvehicleRegData(response.data.data);
          setChallanID(response?.data?.data.EchallanId)
        } else {
          console.warn("No vehicle data found for this Royalty ID.");
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error.response?.data || error.message);
      }
    };
    fetchVehicleDetails();
  }, [params?.royaltyID]); // Run effect when `royaltyID` changes


  return (
    <div className="mb-[0.4cm]">
      {/* Title */}
      <p className="font-bold text-[15pt] font-helvetica text-center m-[0.2cm]">ROAD E-Challan for sand / riverbed materials Transport</p>

      {/* Container for Details & QR Code */}
      <div className="grid grid-flow-col ">

        {/* Challan Details Section */}
        <div className="h-[3.6cm] w-[14.1cm] border m-0 ml-[0.5cm] mr-[0.5cm]  mt-[-7px] border-black ">

          <div className="mt-[7mm] ">
            <p className="flex font-bold font-serif  text-[13pt] ml-1  mb-[-1.5mm] ">
              <span className="w-[3.6cm]">E-Challan No.</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{`${EChallanId}/S/${vehicleRegData?.EChallanDT}/PS`}</span>
            </p>
          </div>
          <div>
            <p className="flex font-bold font-serif  text-[13pt] ml-1 mb-[-1.5mm]" >
              <span className="w-[3.6cm]" >Issue Date</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{vehicleRegData?.IssueDate}</span>
            </p>
          </div>
          <div>
            <p className="flex font-bold font-serif  text-[13pt] ml-1 mb-[-1.5mm]" >
              <span className="w-[3.6cm]">Validity Till</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{vehicleRegData?.ValidityDate}</span>
            </p>
            <div>
              <p className="flex font-bold font-serif  text-[13pt] ml-1  mb-[-1.5mm]" >
                <span className="w-[3.6cm]">Quantity</span>
                <span className="mr-[0.2cm]">:</span>
                <span>{`${vehicleRegData.quantity}.00 ctf`}<span className="font font-normal font-serif  text-[9pt]">{`(${TextAmount} ctf)`}</span></span>
              </p>
            </div>
          </div>
          <div>
            <p className="flex font-bold font-serif  text-[13pt] ] ml-1  mb-[-1.5mm]">
              <span className="w-[3.6cm]">Vehicle No.</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{`${vehicleRegData.Registration_No} (${RoyaltyData?.RoyaltyData.VehicleType})`}</span>
            </p>
          </div>

        </div>

        {/* QR Code Section (2.5cm × 2.5cm) */}

        <div className="w-[2.8cm] h-[2.8cm] ">
          {qrCode && (
            <div className="">
              {/* <h3 className="text-lg font-bold">QR Code</h3> */}
              <QRCodeSVG value={qrCode} className="w-[2.8cm] h-[2.8cm] mr-[0.8cm] ml-[-5mm] mt-[3mm] mb-[-4mm]" />
              {/* <p className="mt-2">Scan to visit: <a href={qrCode} target="_blank" rel="noopener noreferrer" className="text-blue-500">{qrCode}</a></p> */}
            </div>
          )}

        </div>


      </div>
    </div>
  );
};

export default ChallanTemp;
ChallanTemp.propTypes = {
  RoyaltyData: PropTypes.shape({
    EChallanNo: PropTypes.string,
    IssueDate: PropTypes.string,
    ValidityDate: PropTypes.string,
    Quantity: PropTypes.string,
    VehicleNo: PropTypes.string,
    VehicleType: PropTypes.string,
    RoyaltyData: PropTypes.object,
    quantity: PropTypes.string,
    Registration_No: PropTypes.string,

  }),
};

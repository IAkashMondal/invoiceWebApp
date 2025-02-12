import { useParams } from 'react-router-dom';
import RoyaltyPreview from '../RoyaltyPreview'
import { useEffect, useState } from 'react';
import { GetParticularVehicle } from '../../../../../../../../Apis/GlobalApi';
import PropTypes from "prop-types";

const PreData = ({ qrCode }) => {
  const [sellerData, setSellerData] = useState("")
  const params = useParams();
  console.log(sellerData, "sellerdata------=========0>")
  useEffect(() => {
    // Fetch vehicle details based on the Royalty ID

    const fetchVehicleDetails = async () => {
      if (!params?.royaltyID) {
        console.warn("Royalty ID is missing");
        return;
      }

      try {
        const response = await GetParticularVehicle(params.royaltyID);
        if (response.data?.data) {
          setSellerData(response.data.data);
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
    <div className="flex justify-center items-center sm:h-full w-full print:block">

      <RoyaltyPreview qrCode={qrCode}  />
    </div>
  )
}
PreData.propTypes = {
  qrCode: PropTypes.string, // qrCode should be a string
  RoyaltyData: PropTypes.object, // RoyaltyData should be an object
  setRoyaltyData: PropTypes.func.isRequired, // setRoyaltyData should be a function and required
};
export default PreData
{/* <RoyaltyInfoContext.Provider value={{ RoyaltyData, setRoyaltyData }}> */ }
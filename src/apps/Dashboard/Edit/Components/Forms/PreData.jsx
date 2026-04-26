
import PropTypes from "prop-types";
import EditRoyaltyPreview from "../../MainDoc/EditRoyaltyPreview";

const PreData = ({ qrCode, RoyaltyData }) => {

  return (
    <div className="flex justify-center items-center sm:h-full w-full">
      <EditRoyaltyPreview qrCode={qrCode} RoyaltyData={RoyaltyData} />
    </div>
  )
}
PreData.propTypes = {
  qrCode: PropTypes.string, // qrCode should be a string
  RoyaltyData: PropTypes.object, // RoyaltyData should be an object
};
export default PreData;
import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";

const ChallanTemp = ({ qrCode, RoyaltyData }) => {
  return (
    <div className="mb-4 w-full flex-col  mx-auto" id="pdf-container">
      {/* Title */}
      <p className="font-bold text-[22px]  text-center m-2">
        Road E-Challan for sand / riverbed materials Transport
      </p>
      {/* Container for Details & QR Code */}
      <div className="grid grid-flow-col">
        {/* Challan Details Section */}
        <div className="border border-black p-2 w-[15cm]">
          <div className="mb-1">
            <p className="flex font-bold text-base ">
              <span className=" min-w-[3.5cm]">E-Challan No.</span>
              <span className="mr-1">:</span>
              <span>{`${RoyaltyData?.EchallanId}/S/24-25/${RoyaltyData?.EChallanDT}/PS`}</span>
            </p>
          </div>
          <div className="mb-1">
            <p className="flex font-bold text-base ">
              <span className=" min-w-[3.5cm]">Issue Date</span>
              <span className="mr-1">:</span>
              <span>{RoyaltyData?.IssueDate}</span>
            </p>
          </div>
          <div className="mb-1">
            <p className="flex font-bold text-base ">
              <span className=" min-w-[3.5cm]">Validity Till</span>
              <span className="mr-1">:</span>
              <span>{RoyaltyData?.ValidityDate}</span>
            </p>
          </div>
          <div className="mb-1">
            <p className="flex font-bold text-base ">
              <span className=" min-w-[3.5cm]">Quantity</span>
              <span className="mr-1">:</span>
              <span>{`${RoyaltyData.quantity}.00 ctf`}<span className="text-sm"> ({RoyaltyData.VehicleQunText} ctf)</span></span>
            </p>
          </div>
          <div className="mb-[0mm]">
            <p className="flex font-bold text-base ">
              <span className=" min-w-[3.5cm]">Vehicle No.</span>
              <span className="mr-1">:</span>
              <span>{`${RoyaltyData.Registration_No} (${RoyaltyData?.VehicleType})`}</span>
            </p>
          </div>
        </div>
        {/* QR Code Section */}
        <div className="flex justify-center items-center ml-[2mm]">
          {qrCode && (
            <QRCodeSVG
              value={qrCode}
              className="w-[3.5cm] h-[3.6cm]"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ChallanTemp;

ChallanTemp.propTypes = {
  RoyaltyData: PropTypes.shape({
    EchallanId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    EChallanDT: PropTypes.string.isRequired,
    IssueDate: PropTypes.string.isRequired,
    ValidityDate: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    Registration_No: PropTypes.string.isRequired,
    VehicleQunText: PropTypes.string,
    VehicleType: PropTypes.string,
  }),
  qrCode: PropTypes.string,
};

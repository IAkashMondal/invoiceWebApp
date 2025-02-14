import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";

const ChallanTemp = ({ qrCode, RoyaltyData }) => {
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
              <span>{`${RoyaltyData?.EchallanId}/S/${RoyaltyData?.EChallanDT}/PS`}</span>
            </p>
          </div>
          <div>
            <p className="flex font-bold font-serif  text-[13pt] ml-1 mb-[-1.5mm]" >
              <span className="w-[3.6cm]" >Issue Date</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{RoyaltyData?.IssueDate}</span>
            </p>
          </div>
          <div>
            <p className="flex font-bold font-serif  text-[13pt] ml-1 mb-[-1.5mm]" >
              <span className="w-[3.6cm]">Validity Till</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{RoyaltyData?.ValidityDate}</span>
            </p>
            <div>
              <p className="flex font-bold font-serif  text-[13pt] ml-1  mb-[-1.5mm]" >
                <span className="w-[3.6cm]">Quantity</span>
                <span className="mr-[0.2cm]">:</span>
                <span>{`${RoyaltyData.quantity}.00 ctf`}<span className="font font-normal font-serif  text-[9pt]">{`(${RoyaltyData.VehicleQunText} ctf)`}</span></span>
              </p>
            </div>
          </div>
          <div>
            <p className="flex font-bold font-serif  text-[13pt] ] ml-1  mb-[-1.5mm]">
              <span className="w-[3.6cm]">Vehicle No.</span>
              <span className="mr-[0.2cm]">:</span>
              <span>{`${RoyaltyData.Registration_No} (${RoyaltyData?.VehicleType})`}</span>
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
    EchallanId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Ensure it handles string/number formats
    EChallanDT: PropTypes.string.isRequired, // Expected date string
    IssueDate: PropTypes.string.isRequired,
    ValidityDate: PropTypes.string.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, // Should be a number, not string
    Registration_No: PropTypes.string.isRequired, // Used in JSX
    VehicleQunText: PropTypes.string,
    VehicleType: PropTypes.string,

  }),
  qrCode: PropTypes.string, // QR code should be a string (URL or encoded data)

};

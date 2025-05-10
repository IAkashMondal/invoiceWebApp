import PropTypes from "prop-types";
import { QRCodeSVG } from "qrcode.react";
import { getDynamicYearRange } from "../../../../../../../../Apis/GlobalFunction";

const ChallanTemp = ({ qrCode, RoyaltyData }) => {
  const EChallanNumber = `${RoyaltyData?.EchallanId}/T/${getDynamicYearRange()}/${RoyaltyData?.EChallanDT}/PS`
  return (
    <div className="lg:mb-0 w-full max-w-[20.1cm] sm:mb-1" id="pdf-container ">
      {/* Title */}
      <p id="nameText" className="font-bold lg:text-[15pt] font-helvetica sm:text-[11px]
       text-center sm:w-full lg:mt-0 lg:p-0 sm:text-red-600 sm:m-[1mm] sm:mt-0">
        Road E-Challan for sand / riverbed materials Transport
      </p>
      {/* Container for Details & QR Code */}
      <div id="challnabox" className="grid grid-flow-col font-serif sm:mb-0 sm:p-0 ">
        {/* Challan Details Section */}
        <div id="detalsDiv" className="border-[1px] border-black sm:w-full lg:w-[14.5cm] lg:h-[3.6cm] sm:p-[1mm] sm:py-0 lg:px-[2mm]">
          <div id="detalsDiv-1" className="lg:mb-[0mm] sm:mb-[0mm] sm:m-0 sm:p-0  lg:mt-[7mm]">
            <p id="boxtext" className="flex font-bold lg:text-[13pt] sm:text-[7pt] lg:p-0 lg:m-0">
              <span id="boxgap" className="lg:w-[3.7cm] sm:w-[2.7cm]">E-Challan No.</span>
              <span className="mr-1">:</span>
              <span >{EChallanNumber}</span>
            </p>
          </div>
          <div className="mb-0  sm:mb-[0mm] leading-[2.5mm]">
            <p id="boxtext" className="flex font-bold lg:text-[13pt] sm:text-[7pt] ">
              <span id="boxgap" className="lg:min-w-[3.7cm] sm:min-w-[2.7cm]">Issue Date</span>
              <span className="mr-1">:</span>
              <span>{RoyaltyData?.IssueDate}</span>
            </p>
          </div>
          <div className="mb-0 sm:mb-[0mm] leading-[8mm]">
            <p id="boxtext" className="flex font-bold lg:text-[13pt] sm:text-[7pt] ">
              <span id="boxgap" className="lg:min-w-[3.7cm] sm:min-w-[2.7cm]">Validity Till</span>
              <span className="mr-1">:</span>
              <span>{RoyaltyData?.ValidityDate}</span>
            </p>
          </div>
          <div className="mb-[-5mm] sm:mb-[0mm] leading-[2.5mm]">
            <p id="boxtext" className="flex font-bold lg:text-[13pt] sm:text-[7pt] ">
              <span id="boxgap" className="lg:min-w-[3.7cm] sm:min-w-[2.7cm]">Quantity of Sand</span>
              <span className="mr-1">:</span>
              <span>{`${RoyaltyData.quantity}.00 ctf`}<span id="qntText" className="lg:text-[9pt] font-light sm:text-[5pt]"> ({RoyaltyData.VehicleQunText} ctf)</span></span>
            </p>
          </div>
          <div className="mb-[3mm] sm:mb-[0mm] leading-[8mm]">
            <p id="boxtext" className="flex font-bold lg:text-[13pt] sm:text-[7pt] ">
              <span id="boxgap" className=" lg:min-w-[3.7cm] sm:min-w-[2.7cm]">Vehicle No.</span>
              <span className="mr-1">:</span>
              <span>{`${RoyaltyData.Registration_No} (${RoyaltyData?.VehicleType})`}</span>
            </p>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="justify-center items-center mt-[4mm] sm:ml-[3mm] sm:mt-[2mm]">
          {qrCode && (
            <QRCodeSVG
              value={qrCode}
              id="qrcan"
              className=" lg:ml-[1mm] mr-[7mm] lg:w-[3.1cm] lg:h-[3.2cm] sm:w-[2cm] sm:h-[2.2cm]"
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

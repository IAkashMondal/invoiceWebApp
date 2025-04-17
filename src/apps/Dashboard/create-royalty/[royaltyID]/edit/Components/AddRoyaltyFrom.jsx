import { useState } from "react";
import PurchaserForm from "./Forms/PurchaserForm";
import PurchaserAdd from "./Forms/PurchaserAdd";
import PreData from "./Forms/PreData";
import PropTypes from "prop-types";

const AddRoyaltyForm = ({ generateQrCode, qrCode }) => {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, SetEnableNext] = useState(false);

  return (
    <div className="w-full">
      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        <div
          className={`step ${activeFormIndex >= 1 ? "active" : ""}`}
          onClick={() => enableNext && setActiveFormIndex(1)}
        >
          Step 1
        </div>
        <div
          className={`step ${activeFormIndex >= 2 ? "active" : ""}`}
          onClick={() => enableNext && setActiveFormIndex(2)}
        >
          Step 2
        </div>
        <div
          className={`step ${activeFormIndex >= 3 ? "active" : ""}`}
          onClick={() => enableNext && setActiveFormIndex(3)}
        >
          Preview
        </div>
      </div>

      {/* Form Components */}
      {activeFormIndex === 1 && (
        <PurchaserForm
          enableNext={SetEnableNext}
          setActiveFormIndex={setActiveFormIndex}
          generateQrCode={generateQrCode}
        />
      )}

      {activeFormIndex === 2 && (
        <PurchaserAdd
          enableNext={SetEnableNext}
          setActiveFormIndex={setActiveFormIndex}
        />
      )}

      {activeFormIndex === 3 && (
        <PreData
          enableNext={SetEnableNext}
          setActiveFormIndex={setActiveFormIndex}
          qrCode={qrCode}
        />
      )}
    </div>
  );
};

AddRoyaltyForm.propTypes = {
  generateQrCode: PropTypes.func.isRequired,
  qrCode: PropTypes.string,
};

export default AddRoyaltyForm;


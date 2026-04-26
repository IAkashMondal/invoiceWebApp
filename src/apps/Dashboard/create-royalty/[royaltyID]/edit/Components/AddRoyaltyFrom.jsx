import { MoveLeft, MoveRight } from "lucide-react";
import PurchaserForm from "./Forms/PurchaserForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import PurchaserAdd from "./Forms/PurchaserAdd";
// import PreData from "./Forms/PreData";
import PropTypes from "prop-types"; // ✅ Fix import (lowercase "prop-types")

const AddRoyaltyForm = ({ generateQrCode }) => {


  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, SetEnableNext] = useState(false);

  return (
    <div className="p-4 w-full">
      {/* Navigation Buttons */}
      <div className="flex justify-end gap-4 mb-4">
        {activeFormIndex > 1 && (
          <Button
            onClick={() => setActiveFormIndex((prev) => Math.max(prev - 1, 1))}
            size="sm"
            variant="outline"
            className="hover:bg-red-600 flex items-center gap-2"
          >
            <MoveLeft /> Back
          </Button>
        )}
        {activeFormIndex < 3 && (
          <Button
            disabled={!enableNext}
            onClick={() => setActiveFormIndex((prev) => Math.min(prev + 1, 3))}
            size="sm"
            className="bg-green-500 hover:bg-green-700 flex items-center gap-2"
          >
            Next <MoveRight />
          </Button>
        )}
      </div>

      {/* Form Component */}
      {activeFormIndex === 1 && <PurchaserForm enableNext={SetEnableNext} setActiveFormIndex={setActiveFormIndex} generateQrCode={generateQrCode} />}
      {activeFormIndex === 2 && <PurchaserAdd enableNext={SetEnableNext} setActiveFormIndex={setActiveFormIndex} />}
      {/* {activeFormIndex === 3 && <PreData enableNext={SetEnableNext} setActiveFormIndex={setActiveFormIndex} qrCode={qrCode} RoyaltyData={RoyaltyData} />} */}
    </div>
  );
};

// ✅ Fix: Change `PropTypes` to `propTypes` and ensure correct syntax
AddRoyaltyForm.propTypes = {
  generateQrCode: PropTypes.func.isRequired,
  qrCode: PropTypes.string,
};

export default AddRoyaltyForm;


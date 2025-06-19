import { MoveLeft, MoveRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";

// import PreData from "./Forms/PreData";
import PropTypes from "prop-types"; // ✅ Fix import (lowercase "prop-types")
import PurchaserForm from "../Components/Forms/PurchaserForm";
import PurchaserAdd from "../Components/Forms/PurchaserAdd";

const EditAddRoyaltyForm = ({ generateQrCode, RoyaltyData, setRoyaltyData }) => {


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
      {activeFormIndex === 1 && (
        <PurchaserForm
          enableNext={SetEnableNext}
          setActiveFormIndex={setActiveFormIndex}
          generateQrCode={generateQrCode}
          RoyaltyData={RoyaltyData}
          setRoyaltyData={setRoyaltyData}
        />
      )}
      {activeFormIndex === 2 && (
        <PurchaserAdd
          enableNext={SetEnableNext}
          setActiveFormIndex={setActiveFormIndex}
          RoyaltyData={RoyaltyData}
          setRoyaltyData={setRoyaltyData}
        />
      )}
      {/* {activeFormIndex === 3 && <PreData enableNext={SetEnableNext} setActiveFormIndex={setActiveFormIndex} qrCode={qrCode} RoyaltyData={RoyaltyData} />} */}
    </div>
  );
};

// ✅ Fix: Change `PropTypes` to `propTypes` and ensure correct syntax
EditAddRoyaltyForm.propTypes = {
  generateQrCode: PropTypes.func.isRequired,
  RoyaltyData: PropTypes.object,
  setRoyaltyData: PropTypes.func.isRequired
};

export default EditAddRoyaltyForm;


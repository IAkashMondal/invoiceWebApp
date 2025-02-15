import { useContext, useEffect, useState } from "react";
import { RoyaltyInfoContext } from "../../../../../../../Context/RoyaltyInfoContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { GetParticularVehicle, updatePurchaserDetails } from "../../../../../../../../Apis/GlobalApi";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import PropTypes from "prop-types";


const PurchaserForm = ({ enableNext, setActiveFormIndex, generateQrCode }) => {
  const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
  const [EChallanId, setChallanID] = useState("Error");
  const [vehicleNoQnt, setVehicleNoQnt] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const [formData, setFormData] = useState({
    NameofPurchaser: "",
    VehicleCapacity: "",
    VehicleType: "",
    PurchaserMobileNo: ""
  });
  const [errors, setErrors] = useState({});


  const fetchVehicles = async () => {

    try {
      const response = await GetParticularVehicle(params.royaltyID);
      setChallanID(response?.data?.data.EchallanId)
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [params?.royaltyID]);
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        if (!params?.royaltyID) {
          console.warn("Royalty ID is missing");
          return;
        }
        const response = await GetParticularVehicle(params.royaltyID);
        if (response.data?.data) {
          setVehicleNoQnt(response.data.data);
        } else {
          console.warn("No vehicle data found for this Royalty ID.");
        }
      } catch (error) {
        console.error("Error fetching vehicle details:", error.response?.data || error.message);
      }
    };

    fetchVehicleDetails();
  }, [params?.royaltyID]);

  const handleInputChange = (e) => {
    enableNext(false);
    const { name, value } = e.target;

    if (!name) {
      console.error("Missing name attribute in input field:", e.target);
      return;
    }
    setFormData({ ...formData, [name]: value, });
    setRoyaltyData(
      {
        ...RoyaltyData, [name]: value,
        EchallanId: EChallanId,
        GeneratedDT: vehicleNoQnt?.GeneratedDT,
        VehicleQunText: vehicleNoQnt.VehicleQunText,
        EChallanDT: vehicleNoQnt.EChallanDT,
        quantity: vehicleNoQnt.quantity,
        Registration_No: vehicleNoQnt.Registration_No
      });
    setErrors((prev) => ({ ...prev, [name]: "" }));

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const QRBASEURL = import.meta.env.VITE_QR_CODE_BASE_URL;
    if (QRBASEURL) {
      console.log("QRBASEURL on Captured")
    }

    try {
      await updatePurchaserDetails(params?.royaltyID, formData);
      generateQrCode(QRBASEURL, EChallanId)
      enableNext(true);
      toast.success("Purchaser vehicle added.");
      setActiveFormIndex((prev) => Math.min(prev + 1, 3));
    } catch (error) {
      console.error("Error updating purchaser details:", error);
      setErrors({ api: "Error saving data. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center w-full p-4">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-lg font-semibold text-center text-teal-500 mb-4">
          Add Vehicle Details
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Info */}
          <div className="border border-red-300 p-3 shadow-sm rounded-md bg-gray-100">
            <div className="flex justify-between items-center ">
              <div>
                <h4 className="text-sm text-gray-500 font-bold">Vehicle Number</h4>
                <h3 className="font-semibold">{vehicleNoQnt.Registration_No || "N/A"}</h3>
              </div>
              <div>
                <h4 className="text-sm text-gray-500 font-bold">Quantity</h4>
                <h3 className="font-semibold">
                  {vehicleNoQnt?.quantity ? `${vehicleNoQnt.quantity}.00 CFT` : "NA"}
                </h3>

              </div>
            </div>
          </div>

          {/* Name of Purchaser */}
          <div>
            <label className="block text-sm text-gray-700 font-bold">Name of Purchaser</label>
            <Input
              className="w-full p-2"
              name="NameofPurchaser"
              placeholder="Ram Chandra"
              value={formData.NameofPurchaser}
              required
              autoFocus
              type="text"
              onChange={handleInputChange}
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm text-gray-700 font-bold">Mobile No</label>
            <Input
              className="w-full p-2"
              name="PurchaserMobileNo"
              placeholder="9876543210"
              value={formData.PurchaserMobileNo}
              required
              type="number"
              onChange={handleInputChange}
            />
          </div>
          {/* Vehicle Capacity */}
          <div>
            <label className="block text-sm text-gray-700 font-bold">Vehicle Capacity (kg)</label>
            <Input
              className="w-full p-2"
              name="VehicleCapacity"
              placeholder="54000"
              value={formData.VehicleCapacity}
              required
              type="number"
              onChange={handleInputChange}
            />
          </div>

          {/* Vehicle Type Dropdown */}
          <div>
            <label className="block text-sm text-gray-700 font-bold">Vehicle Type</label>
            <select
              className="w-full p-2 border shadow-sm border-gray-300 rounded-md"
              name="VehicleType"
              required
              onChange={handleInputChange}
              value={formData.VehicleType}
            >
              <option value="">Select Vehicle Type</option>
              {["6 Wheels", "10 Wheels", "12 Wheels", "14 Wheels", "16 Wheels", "18 Wheels", "22 Wheels"].map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
              {loading ? <LoaderCircle className="animate-spin" /> : "Save and Continue"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaserForm;

// PropTypes validation
PurchaserForm.propTypes = {
  enableNext: PropTypes.func.isRequired,
  setActiveFormIndex: PropTypes.func.isRequired,
  generateQrCode: PropTypes.func.isRequired,
};

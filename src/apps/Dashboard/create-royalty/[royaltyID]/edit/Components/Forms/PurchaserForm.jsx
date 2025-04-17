import { useContext, useEffect, useState } from "react";
import { RoyaltyInfoContext } from "../../../../../../../Context/RoyaltyInfoContext";
import { updatePurchaserDetails } from "../../../../../../../../Apis/GlobalApi";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

const PurchaserForm = ({ enableNext, setActiveFormIndex, generateQrCode }) => {
  const { royaltyID } = useParams();
  const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
  const [formData, setFormData] = useState({
    NameofPurchaser: "",
    MobileNo: "",
    VehicleCapacity: "",
    VehicleType: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await updatePurchaserDetails(royaltyID);
        if (response?.data?.data) {
          setFormData(response.data.data);
          setRoyaltyData(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }
    };
    fetchVehicles();
  }, [royaltyID, setRoyaltyData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setRoyaltyData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.NameofPurchaser) {
      newErrors.NameofPurchaser = "Name is required";
    }
    if (!formData.MobileNo) {
      newErrors.MobileNo = "Mobile number is required";
    }
    if (!formData.VehicleCapacity) {
      newErrors.VehicleCapacity = "Vehicle capacity is required";
    }
    if (!formData.VehicleType) {
      newErrors.VehicleType = "Vehicle type is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await updatePurchaserDetails(royaltyID, formData);
      if (response?.data) {
        generateQrCode(response.data);
        enableNext(true);
        setActiveFormIndex(2);
      }
    } catch (error) {
      console.error("Error updating purchaser details:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="NameofPurchaser" className="block text-sm font-medium">
          Name of Purchaser
        </label>
        <input
          type="text"
          id="NameofPurchaser"
          name="NameofPurchaser"
          value={formData.NameofPurchaser}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.NameofPurchaser && (
          <p className="mt-1 text-sm text-red-600">{errors.NameofPurchaser}</p>
        )}
      </div>

      <div>
        <label htmlFor="MobileNo" className="block text-sm font-medium">
          Mobile Number
        </label>
        <input
          type="tel"
          id="MobileNo"
          name="MobileNo"
          value={formData.MobileNo}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.MobileNo && (
          <p className="mt-1 text-sm text-red-600">{errors.MobileNo}</p>
        )}
      </div>

      <div>
        <label htmlFor="VehicleCapacity" className="block text-sm font-medium">
          Vehicle Capacity
        </label>
        <input
          type="text"
          id="VehicleCapacity"
          name="VehicleCapacity"
          value={formData.VehicleCapacity}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.VehicleCapacity && (
          <p className="mt-1 text-sm text-red-600">{errors.VehicleCapacity}</p>
        )}
      </div>

      <div>
        <label htmlFor="VehicleType" className="block text-sm font-medium">
          Vehicle Type
        </label>
        <input
          type="text"
          id="VehicleType"
          name="VehicleType"
          value={formData.VehicleType}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.VehicleType && (
          <p className="mt-1 text-sm text-red-600">{errors.VehicleType}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? "Saving..." : "Save and Continue"}
      </button>
    </form>
  );
};

PurchaserForm.propTypes = {
  enableNext: PropTypes.func.isRequired,
  setActiveFormIndex: PropTypes.func.isRequired,
  generateQrCode: PropTypes.func.isRequired,
};

export default PurchaserForm;

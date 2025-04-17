import { useState, useEffect, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import PropTypes from "prop-types";
import { GetParticularVehicle, updatePurchaserDetails } from "../../../../../Apis/GlobalApi";
import Dummydata from "../../../../../Apis/DummyData";
import { RoyaltyInfoContext } from "../../../../Context/RoyaltyInfoContext";

const PurchaserFormEdit = ({ generateQrCode }) => {
    const [formData, setFormData] = useState({
        NameofPurchaser: "",
        VehicleCapacity: "",
        VehicleType: "",
        PurchaserMobileNo: "",
    });

    const [loading, setLoading] = useState(false);
    const [vehicleData, setVehicleData] = useState({});
    // const [RoyaltyData, setRoyaltyData] = useState();
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [errors, setErrors] = useState({});
    const params = useParams();

    // Fetch the existing vehicle data from the API
    const fetchVehicleData = async () => {
        setLoading(true);
        try {
            const response = await GetParticularVehicle(params.royaltyID);
            if (response?.data?.data) {
                const data = response.data.data;
                setVehicleData(data); // Save raw data
                setFormData({
                    NameofPurchaser: data.NameofPurchaser || "",
                    VehicleCapacity: data.VehicleCapacity || "",
                    VehicleType: data.VehicleType || "",
                    PurchaserMobileNo: data.PurchaserMobileNo || "",
                });
                if (response?.data?.data) {
                    const data = response.data.data;
                    setVehicleData(data); // Save raw data

                    const newFormData = {
                        NameofPurchaser: data.NameofPurchaser || "",
                        VehicleCapacity: data.VehicleCapacity || "",
                        VehicleType: data.VehicleType || "",
                        PurchaserMobileNo: data.PurchaserMobileNo || "",
                    };

                    setFormData(newFormData);

                    setRoyaltyData({
                        ...RoyaltyData,
                        EchallanId: data.EchallanId,
                        GeneratedDT: data.GeneratedDT,
                        VehicleQunText: data.VehicleQunText,
                        EChallanDT: data.EChallanDT,
                        quantity: data.quantity,
                        Registration_No: data.Registration_No,
                        NameofPurchaser: data.NameofPurchaser,
                        VehicleCapacity: data.VehicleCapacity,
                        VehicleType: data.VehicleType,
                        PurchaserMobileNo: data.PurchaserMobileNo,
                        ValidityDate:data.ValidityDate,
                        IssueDate: data.IssueDate,
                        RoyaltyOwners: {
                            id: 1,
                            OwnerName: data.OwnerName,
                            SandID: data.SandID,
                            VidePermitNo: data.VidePermitNo, //---------------------------->
                            EChallanId: data.EChallanId,
                            OwnerAddress: data.OwnerAddress,//---------------------------->
                            OwnerAddressLine1: data.OwnerAddressLine1,//---------------------------->
                            OwnerAddressLine2: data.OwnerAddressLine2,//---------------------------->
                            OwnerMobileNo: data.OwnerMobileNo,//---------------------------->
                            OwnerMouza: data.OwnerMouza,//---------------------------->
                            OwnerDistrict: data.OwnerDistrict,
                            OwnerPoliceStation: data.OwnerPoliceStation,//---------------------------->
                            OwnerGpWard: data.OwnerGpWard,//---------------------------->
                            River: data.River,
                            OwnerSubDivision: data.OwnerSubDivision,
                        },
                    });
                }

            } else {
                toast.error("No data found");
            }
        } catch (error) {
            toast.error("Error fetching data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setRoyaltyData((prev) => ({
            ...prev,
            NameofPurchaser: formData.NameofPurchaser,
            VehicleCapacity: formData.VehicleCapacity,
            VehicleType: formData.VehicleType,
            PurchaserMobileNo: formData.PurchaserMobileNo,
        }));
    }, [formData]);

    // Trigger fetching when the component mounts
    useEffect(() => {
        fetchVehicleData();
    }, [params.royaltyID]);

    // Handle input changes and update formData
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear any existing errors
    };

    // Submit the form to update data
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updatePurchaserDetails(params.royaltyID, formData);
            toast.success("Purchaser vehicle details updated successfully.");
            // enableNext(true);
            // setActiveFormIndex((prev) => Math.min(prev + 1, 3)); // Move to the next form
        } catch (error) {
            toast.error("Error updating data");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    console.log("RoyaltyData",vehicleData)
    return (
        <div className="flex justify-center w-full p-4">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-lg font-semibold text-center text-teal-500 mb-4">
                    Edit Purchaser Vehicle Details
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Vehicle Information Section */}
                    <div className="border p-3 shadow-sm rounded-md bg-gray-100">
                        <h4 className="text-sm text-gray-500">Vehicle Number: {vehicleData.Registration_No || "N/A"}</h4>
                        <h4 className="text-sm text-gray-500">Quantity: {vehicleData.quantity || "NA"}</h4>
                    </div>

                    {/* Name of Purchaser */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Name of Purchaser</label>
                        <Input
                            className="w-full p-2"
                            name="NameofPurchaser"
                            placeholder="Enter Purchaser Name"
                            value={formData.NameofPurchaser}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Mobile Number */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Mobile No</label>
                        <Input
                            className="w-full p-2"
                            name="PurchaserMobileNo"
                            type="text"
                            placeholder="Enter Mobile Number"
                            value={formData.PurchaserMobileNo}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Vehicle Capacity */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Vehicle Capacity</label>
                        <Input
                            className="w-full p-2"
                            name="VehicleCapacity"
                            type="number"
                            placeholder="Enter Capacity"
                            value={formData.VehicleCapacity}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Vehicle Type */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Vehicle Type</label>
                        <select
                            className="w-full p-2 border shadow-sm border-gray-300 rounded-md"
                            name="VehicleType"
                            value={formData.VehicleType}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Vehicle Type</option>
                            {["3 Wheels", "4 Wheels", "6 Wheels", "10 Wheels", "12 Wheels", "14 Wheels", "16 Wheels", "18 Wheels", "22 Wheels"].map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div className="flex justify-center">
                        <Button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
                            {loading ? <LoaderCircle className="animate-spin" /> : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaserFormEdit;

PurchaserFormEdit.propTypes = {
    enableNext: PropTypes.func.isRequired,
    setActiveFormIndex: PropTypes.func.isRequired,
    generateQrCode: PropTypes.func.isRequired,
};

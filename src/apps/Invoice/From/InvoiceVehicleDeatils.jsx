import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import { useState, useCallback } from "react";
import PropTypes from "prop-types";
import { updatePurchaserDetails } from "../../../../Apis/R_Apis/VehicleApis";

const InvoiceVehicleDetails = () => {
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [formData, setFormData] = useState({
        nameOfPurchaser: "",
        address1: "",
        district: "",
        state: "",
        gstIn: "",
        contactNumber: "",
    });
    const [errors, setErrors] = useState({});

    // Handle input change
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
    }, []);

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updatePurchaserDetails(params?.royaltyID, formData);
        } catch (error) {
            console.error("Error updating purchaser details:", error);
            setErrors({ api: "Error saving data. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center w-full p-4">
            <div className="w-3xl  bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-xl font-semibold text-center text-teal-500 mb-4">
                    Add Owner Details
                </h1>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name of Owner */}
                    <div className="col-span-2 max-w-2xl">
                        <label className="block text-sm font-bold text-gray-700">Name of Owner</label>
                        <Input
                            name="nameOfPurchaser"
                            placeholder="Ram Chandra"
                            value={formData.nameOfPurchaser}
                            required
                            autoFocus
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Address Line 1</label>
                        <Input
                            name="address1"
                            placeholder="Enter address"
                            value={formData.address1}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700">Address Line 2</label>
                        <Input
                            name="address2"
                            placeholder="Enter address"
                            value={formData.address2}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* District */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">District</label>
                        <Input
                            name="district"
                            placeholder="Enter district"
                            value={formData.district}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">State</label>
                        <Input
                            name="state"
                            placeholder="Enter state"
                            value={formData.state}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Pincode */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Pincode</label>
                        <Input
                            name="pincode"
                            placeholder="Enter Pincode"
                            value={formData.pincode}
                            required
                            type="text"
                            pattern="[0-9]{6}"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* GST Number */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">GST In/UIN Number</label>
                        <Input
                            name="gstIn"
                            placeholder="0XXXXX0000X0XX"
                            value={formData.gstIn}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Contact Number */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Contact Number</label>
                        <Input
                            name="contactNumber"
                            placeholder="0000000000"
                            value={formData.contactNumber}
                            required
                            type="tel"
                            pattern="[0-9]{10}"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700">Email Id</label>
                        <Input
                            name="email"
                            placeholder="xxxx.@xxxxx.com"
                            value={formData.email}
                            required
                            type="email"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="col-span-2 flex justify-center">
                        <Button type="submit" className="w-full md:w-1/2 bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
                            {loading ? <LoaderCircle className="animate-spin" /> : "Save and Continue"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

InvoiceVehicleDetails.propTypes = {
    royaltyID: PropTypes.string,
};

export default InvoiceVehicleDetails;

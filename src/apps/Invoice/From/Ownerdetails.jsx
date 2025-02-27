

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";
import PropTypes from "prop-types";
import { useState } from "react";
import { GetParticularVehicle, updatePurchaserDetails } from "../../../../Apis/GlobalApi";

const Ownerdetails = () => {
    const [EChallanId, setChallanID] = useState("Error");
    const [vehicleNoQnt, setVehicleNoQnt] = useState("");
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [formData, setFormData] = useState({
        NameofOwner: "",
        Address1: "",
        Address2: "",
        district: "",
        State: "",
        Pincode: "",
        GSTIN: "",
        ContactNumber: "",
        Emailadd: "",
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
    console.log(formData)


    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (!name) {
            console.error("Missing name attribute in input field:", e.target);
            return;
        }
        setFormData({ ...formData, [name]: value, });
        setErrors((prev) => ({ ...prev, [name]: "" }));

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // const QRBASEURL = import.meta.env.VITE_QR_CODE_BASE_URL || `https://oneroyalty-cf7qp82h6-iakashmondals-projects.vercel.app`;
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
            <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-lg font-semibold text-center text-teal-500 mb-4">
                    Add Owner Deatils
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name of Owner */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Name of Owner</label>
                        <Input
                            className="w-full p-2"
                            name="NameofOwner"
                            placeholder="Ram Chandra"
                            value={formData.NameofOwner}
                            required
                            autoFocus
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Address1 */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">AdressLine1</label>
                        <Input
                            className="w-full p-2"
                            name="Address1"
                            placeholder="xxxxxxx"
                            value={formData.Address1}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* Address2*/}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">AdressLine2</label>
                        <Input
                            className="w-full p-2"
                            name="Address2"
                            placeholder="xxxxxx xxxx"
                            value={formData.Address2}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* Disrrict */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">District</label>
                        <Input
                            className="w-full p-2"
                            name="district"
                            placeholder="xxxxxxxx"
                            value={formData.district}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />

                    </div>
                    {/* State */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">State</label>
                        <Input
                            className="w-full p-2"
                            name="State"
                            placeholder="xxxx xxxxx"
                            value={formData.State}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />

                    </div>
                    {/* Pincode */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Pincode</label>
                        <Input
                            className="w-full p-2"
                            name="Pincode"
                            placeholder="000000"
                            value={formData.Pincode}
                            required
                            type="number"
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* GstIn Number */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">GST In/UIN Number</label>
                        <Input
                            className="w-full p-2"
                            name="GSTIN"
                            placeholder="0xxxxx0000x0xx"
                            value={formData.GSTIN}
                            required
                            type="number"
                            onChange={handleInputChange}
                        />
                    </div>
                    {/* contac Number */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Contact Number</label>
                        <Input
                            className="w-full p-2"
                            name="ContactNumber"
                            placeholder="0000000000"
                            value={formData.ContactNumber}
                            required
                            type="Number"
                            onChange={handleInputChange}
                        />

                    </div>
                    {/* Email Adress */}
                    <div>
                        <label className="block text-sm text-gray-700 font-bold">Email Id</label>
                        <Input
                            className="w-full p-2"
                            name="Emailadd"
                            placeholder="xxxx.@xxxxx.com"
                            value={formData.Emailadd}
                            required
                            type="text"
                            onChange={handleInputChange}
                        />

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

export default Ownerdetails;


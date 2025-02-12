import { useContext, useEffect, useState } from "react";
import { RoyaltyInfoContext } from "../../../../../../../Context/RoyaltyInfoContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { GetOwnersDeatils, GetParticularVehicle, updatePurchaserDetails } from "../../../../../../../../Apis/GlobalApi";
import PropTypes from "prop-types";
import { addTimeToGeneratedTime, generateTimeObject } from "../../../../../../../../Apis/GlobalFunction";

const PurchaserAdd = ({ enableNext, setActiveFormIndex }) => {
    const { RoyaltyData, setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [ownersData, setOwnersData] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState("");
    const [Validypreview, setValidypreview] = useState("");
    const params = useParams();
    const [IssueDates, setIssueDates] = useState({
        generatedTime: Number,
        issueDate: ""
    })
    const [formDataAdd, setFormDataAdd] = useState({
        PurchaserAdd: "",
        PoliceStation: "",
        PurchaserDristic: "",
        ValidityDate: "",
        OwnerName: ""
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handelValidityCalculate = async (e) => {
        if (!e || !e.target) {
            console.error("Invalid event object:", e);
            return;
        }

        const { value } = e.target;
        const { validityTime, VerefyChallanNum, } = await addTimeToGeneratedTime(IssueDates?.generatedTime, value);
        console.log(validityTime, "Genar")
        setValidypreview(validityTime)
        // Save validity time in formDataAdd
        setFormDataAdd((prev) => ({
            ...prev,
            ValidityDate: Validypreview,
            VerefyChallanNum: VerefyChallanNum  // Store calculated time in ValidityDate

        }));
        setRoyaltyData((prev) => ({
            ...prev,
            ValidityDate: Validypreview,  // Store calculated time in ValidityDate
        }));
    };
    // console.log(formDataAdd, "fromdata------------------------------------------>")
    const handleOwnerChange = (e) => {
        const selectedValue = e.target.value;
        setSelectedOwner(selectedValue);

        const ownerDetails = ownersData.find((owner) => owner.OwnerName === selectedValue);
        if (ownerDetails) {
            setFormDataAdd((prev) => ({
                ...prev,
                OwnerName: ownerDetails.OwnerName,
                River: ownerDetails.River,
                SandID: ownerDetails.SandID,
                OwnerDistrict: ownerDetails.OwnerDistrict,

            }));
            setRoyaltyData((prev) => ({
                ...prev,
                RoyaltyOwners: {
                    OwnerName: ownerDetails.OwnerName,
                    River: ownerDetails.River,
                    SandID: ownerDetails.SandID,
                    OwnerDistrict: ownerDetails.OwnerDistrict,
                    OwnerAddress: ownerDetails.OwnerAddress,
                    OwnerMobileNo: ownerDetails.OwnerMobileNo,
                    OwnerMouza: ownerDetails.OwnerMouza,
                    OwnerPoliceStation: ownerDetails.OwnerPoliceStation,
                    OwnerSubDivision: ownerDetails.OwnerSubDivision,
                    OwnerGpWard: ownerDetails.OwnerGpWard,
                    VidePermitNo: ownerDetails.VidePermitNo,
                    OwnerAddressLine1: ownerDetails.OwnerAddressLine1,
                    OwnerAddressLine2: ownerDetails.OwnerAddressLine2,

                },

            })); console.log(ownerDetails, "owners detais selected")
        }

    };
    // console.logRoyaltyData, "check why not updated----r data----------->")

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                if (!params?.royaltyID) {
                    console.warn("Royalty ID is missing");
                    return;
                }
                const ownersResponse = await GetOwnersDeatils();
                const { generatedTime, issueDate } = generateTimeObject();
                setIssueDates({ generatedTime, issueDate })
                setOwnersData(ownersResponse?.data.data);

                const response = await GetParticularVehicle(params.royaltyID);
                if (response.data?.data) {
                    console.log("Fetched Vehicle Data:", response.data.data);
                } else {
                    console.warn("No vehicle data found for this Royalty ID.");
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };

        fetchVehicleDetails();
    }, [params?.royaltyID]);

    const handleInputChangeAdd = (e) => {

        enableNext(false);
        const { name, value } = e.target;

        if (!name) {
            console.error("Missing name attribute in input field:", e.target);
            return;
        }

        setErrors((prev) => ({ ...prev, [name]: "" }));
        setFormDataAdd((prev) => ({
            ...prev, [name]: value,
            IssueDate: IssueDates?.issueDate,
            CreatedTimeStamp: IssueDates?.generatedTime
        }));
        setRoyaltyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Data being sent:", formDataAdd);
        try {
            await updatePurchaserDetails(params?.royaltyID, formDataAdd);
            enableNext(true);
            setActiveFormIndex((prev) => Math.min(prev + 1, 3));
        } catch (error) {
            console.error("Error updating purchaser details:", error);
            setErrors({ api: "Error saving data. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmitAdd}>
            <h1>Address</h1>
            <div className="border border-red-300 p-3 shadow-sm rounded-md bg-gray-100 w-80">
                <div className="w-80">
                    <h4 className="text-sm text-gray-500 font-bold">Issue Date</h4>
                    <h3 className="font-semibold">{IssueDates?.issueDate || "N/A"}</h3>
                </div>
            </div>
            <div className="grid grid-cols-1 mt-3 gap-3">
                <label className="text-sm text-red-400 font-bold">Purchaser Address</label>
                <div className="w-80">
                    <Input
                        className="w-80"
                        name="PurchaserAdd"
                        placeholder="Haldia"
                        required
                        type="text"
                        value={formDataAdd.PurchaserAdd}
                        onChange={handleInputChangeAdd}
                    />
                </div>
            </div>

            <div>
                <label className="text-sm text-red-400 font-bold">Police Station</label>
                <div className="w-80">
                    <Input
                        className="w-80"
                        name="PoliceStation"
                        required
                        type="text"
                        value={formDataAdd.PoliceStation}
                        onChange={handleInputChangeAdd}
                    />
                </div>
            </div>

            <div className="border border-rose-500 w-80 m-0">
                <label className="text-sm text-red-400 font-bold">Dristic</label>
                <div>
                    <select
                        className="w-80"
                        name="PurchaserDristic"
                        required
                        value={formDataAdd.PurchaserDristic}
                        onChange={handleInputChangeAdd}
                    >
                        <option value="">Select District</option>
                        {["Malda", "Jalpaiguri", "Alipurduar", "Dakshin Dinajpur", "Uttar Dinajpur", "Murshidabad", "Darjeeling"].map(
                            (type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            )
                        )}
                    </select>
                </div>
            </div>

            <div>
                <label className="text-sm text-red-400 font-bold">Validity Till:<span className="text-lime-500 px-5">{`  ${Validypreview}`}</span></label>
                <div className="w-80">
                    <Input
                        name="ValidityCallculation"
                        placeholder="1.45 - HH.MM"
                        type="text"

                        onChange={handelValidityCalculate}
                    />
                </div>
            </div>

            <div className=" w-80">
                <h2 className="text-sm font-bold mb-2 text-rose-500 w-80">Select Owner</h2>
                <select
                    className="border p-2 rounded w-80"
                    name="OwnerName"
                    required
                    value={selectedOwner}
                    onChange={handleOwnerChange}
                >
                    <option value="">Select an owner</option>
                    {ownersData?.map((owner, index) => (
                        <option key={index} value={owner.OwnerName}>
                            {owner.OwnerName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-5">
                <Button type="submit" className="bg-blue-500 text-white p-2 rounded-md" disabled={loading}>
                    {loading ? "Saving..." : "Save and Continue"}
                </Button>
            </div>
        </form>
    );
};

export default PurchaserAdd;

PurchaserAdd.propTypes = {
    enableNext: PropTypes.func.isRequired,
    setActiveFormIndex: PropTypes.func.isRequired
};

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
    const [Validitypreview, setValidypreview] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const [IssueDates, setIssueDates] = useState({
        generatedTime: 0,
        IssueDate: ""
    })
    const [formDataAdd, setFormDataAdd] = useState({
        PurchaserAdd: "",
        PoliceStation: "",
        PurchaserDristic: "",
        ValidityDate: "",
        OwnerName: ""
    });
    const handelValidityCalculate = async (e) => {
        if (!e || !e.target) {
            console.error("Invalid event object:", e);
            return;
        }

        const { value } = e.target;
        const { validityTime, VerefyChallanNum, } = await addTimeToGeneratedTime(IssueDates?.generatedTime, value);
        setValidypreview(validityTime)
        // Save validity time in formDataAdd
        setFormDataAdd((prev) => ({
            ...prev,
            ValidityDate: validityTime,
            VerefyChallanNum: VerefyChallanNum  // Store calculated time in ValidityDate

        }));
        setRoyaltyData((prev) => ({
            ...prev,
            ValidityDate: validityTime,
        }));
    };
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

            }));
        }

    };

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            try {
                if (!params?.royaltyID) {
                    console.warn("Royalty ID is missing");
                    return;
                }
                const ownersResponse = await GetOwnersDeatils();
                const { generatedTime, issueDate } = generateTimeObject();
                setIssueDates({ generatedTime, IssueDate: issueDate });
                setOwnersData(ownersResponse?.data.data);
                setRoyaltyData((prev) => ({
                    ...prev,
                    IssueDate: issueDate,
                    ValidityDate: Validitypreview
                }));

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
    }, [params?.royaltyID,]);


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
            IssueDate: IssueDates?.IssueDate,
            ValidityDate: Validitypreview,
            CreatedTimeStamp: IssueDates?.generatedTime
        }));
        setRoyaltyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
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
        <div className="flex justify-center w-full p-4">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-lg font-semibold text-center text-teal-500 mb-4">
                    Buyer Adddress Details
                </h1>
                <form onSubmit={handleSubmitAdd}>

                    <div className=" flex justify-evenly border border-red-300 p-3 shadow-sm rounded-md bg-gray-100 w-full">
                        <div className="w-full">
                            <h4 className="text-sm text-gray-500 font-bold">Issue Date</h4>
                            <h3 className="font-semibold text-green-500">{IssueDates.IssueDate || "N/A"}</h3>
                        </div>
                        <div className="w-full">
                            <h4 className="text-sm text-gray-500 font-bold"> Validity Till </h4>
                            <h3 className="font-semibold text-red-500">{Validitypreview || "N/A"}</h3>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 mt-3 gap-2">
                        <label className="text-sm text-red-400 font-bold">Purchaser Address</label>
                        <div className="w-full">
                            <Input
                                className="w-full"
                                name="PurchaserAdd"
                                placeholder="Haldia"
                                autoFocus
                                required
                                type="text"
                                value={formDataAdd.PurchaserAdd}
                                onChange={handleInputChangeAdd}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-3 gap-2">
                        <label className="text-sm text-red-400 font-bold ">Police Station</label>
                        <div className="w-full">
                            <Input
                                className="w-full"
                                name="PoliceStation"
                                required
                                placeholder="Ram Ganj"
                                type="text"
                                value={formDataAdd.PoliceStation}
                                onChange={handleInputChangeAdd}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-3 gap-2 w-full">
                        <label className="text-sm text-red-400 font-bold">Dristic</label>
                        <div className="w-full">
                            <select
                                className="border p-2 rounded w-full"
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

                    <div className="grid grid-cols-1 mt-3 gap-2">
                        <label className="text-sm text-red-400 font-bold">Validity Till:<span className="text-lime-500 px-5">{`  ${Validitypreview}`}</span></label>
                        <div className="w-full">
                            <Input
                                className="w-full"
                                name="ValidityCallculation"
                                placeholder="1.45 - HH.MM"
                                type="text"
                                onChange={handelValidityCalculate}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-3 gap-2 w-full">
                        <h2 className="text-sm font-bold mb-2 text-rose-500 w-full">Select Royalty Owner</h2>
                        <select
                            className="border p-2 rounded w-full"
                            name="OwnerName"
                            required
                            value={selectedOwner}
                            onChange={handleOwnerChange}
                        >
                            <option value="">Select Royalty owner</option>
                            {ownersData?.map((owner, index) => (
                                <option key={index} value={owner.OwnerName}>
                                    {owner.OwnerName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mt-5 flex justify-center w-full">
                        <Button type="submit" className="bg-pink-500 text-white p-2 rounded-md w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save and Continue"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PurchaserAdd;

PurchaserAdd.propTypes = {
    enableNext: PropTypes.func.isRequired,
    setActiveFormIndex: PropTypes.func.isRequired
};

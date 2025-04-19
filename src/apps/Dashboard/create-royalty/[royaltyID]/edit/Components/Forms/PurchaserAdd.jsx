import { useContext, useEffect, useState } from "react";
import { RoyaltyInfoContext } from "../../../../../../../Context/RoyaltyInfoContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { GetOwnersDeatils, GetParticularVehicle, updatePurchaserDetails } from "../../../../../../../../Apis/GlobalApi";
import PropTypes from "prop-types";
import { addTimeToGeneratedTime, generateTimeObject } from "../../../../../../../../Apis/GlobalFunction";
import { policeStationData } from "../../../../../../../../Apis/TimeandPolicestation";

const PurchaserAdd = ({ enableNext, setActiveFormIndex }) => {
    // The component now imports policeStationData from TimeandPolicestation.js
    // This reference should be used everywhere in the component instead of a local definition

    const { setRoyaltyData } = useContext(RoyaltyInfoContext);
    const [ownersData, setOwnersData] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState("Prasanta Kumar Hait");
    const [Validitypreview, setValidypreview] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [validityInputValue, setValidityInputValue] = useState("");
    const params = useParams();
    const [IssueDates, setIssueDates] = useState({
        generatedTime: 0,
        IssueDate: ""
    });
    const [formDataAdd, setFormDataAdd] = useState({
        PurchaserAdd: "",
        PoliceStation: "",
        PurchaserDristic: "",
        ValidityDate: "",
        OwnerName: "Prasanta Kumar Hait"
    });

    // Function to auto-fill data based on police station
    const handlePoliceStationChange = (e) => {
        const inputPoliceStation = e.target.value;
        setFormDataAdd(prev => ({
            ...prev,
            PoliceStation: inputPoliceStation
        }));

        // Check if the police station exists in our predefined data
        if (inputPoliceStation) {
            const inputPS = inputPoliceStation.toLowerCase();
            const matchedData = policeStationData.find(
                item => item.policeStation.toLowerCase() === inputPS
            );

            if (matchedData) {
                // Auto-fill district
                const district = matchedData.PurchaserDristic;
                setFormDataAdd(prev => ({
                    ...prev,
                    PurchaserDristic: district
                }));

                // Update the RoyaltyData context with the district value too
                setRoyaltyData(prev => ({
                    ...prev,
                    PurchaserDristic: district
                }));

                // Auto-calculate validity time
                if (IssueDates.generatedTime) {
                    const validityValue = matchedData.validity.toString();
                    setValidityInputValue(validityValue);
                    handleValidityCalculation(validityValue);
                }
            }
        }

        enableNext(false);
        setRoyaltyData(prev => ({
            ...prev,
            PoliceStation: e.target.value
        }));
    };

    // Handle validity calculation with value parameter
    const handleValidityCalculation = async (value) => {
        try {
            const validityInput = value.toString(); // Convert number to string if needed
            const { validityTime, VerefyChallanNum } = await addTimeToGeneratedTime(IssueDates?.generatedTime, validityInput);

            setValidypreview(validityTime);

            // Save validity time in formDataAdd
            setFormDataAdd((prev) => ({
                ...prev,
                ValidityDate: validityTime,
                VerefyChallanNum: VerefyChallanNum
            }));

            setRoyaltyData((prev) => ({
                ...prev,
                ValidityDate: validityTime,
            }));
        } catch (error) {
            console.error("Error calculating validity time:", error);
        }
    };

    // Original validity calculation from user input
    const handelValidityCalculate = async (e) => {
        if (!e || !e.target) {
            console.error("Invalid event object:", e);
            return;
        }

        const { value } = e.target;
        setValidityInputValue(value);
        handleValidityCalculation(value);
    };

    // Separate useEffect for fetching owner data
    useEffect(() => {
        const fetchOwnerData = async () => {
            try {
                const ownersResponse = await GetOwnersDeatils();

                if (ownersResponse?.data?.data) {
                    setOwnersData(ownersResponse.data.data);

                    // Find Prasanta Kumar Hait in the owner data
                    const defaultOwner = ownersResponse.data.data.find(
                        owner => owner.OwnerName === "Prasanta Kumar Hait"
                    );

                    if (defaultOwner) {
                        // Set the form data with default owner
                        setFormDataAdd(prev => ({
                            ...prev,
                            OwnerName: defaultOwner.OwnerName,
                            River: defaultOwner.River,
                            SandID: defaultOwner.SandID,
                            OwnerDistrict: defaultOwner.OwnerDistrict,
                        }));

                        // Set context with default owner
                        setRoyaltyData(prev => ({
                            ...prev,
                            RoyaltyOwners: {
                                OwnerName: defaultOwner.OwnerName,
                                River: defaultOwner.River,
                                SandID: defaultOwner.SandID,
                                OwnerDistrict: defaultOwner.OwnerDistrict,
                                OwnerAddress: defaultOwner.OwnerAddress,
                                OwnerMobileNo: defaultOwner.OwnerMobileNo,
                                OwnerMouza: defaultOwner.OwnerMouza,
                                OwnerPoliceStation: defaultOwner.OwnerPoliceStation,
                                OwnerSubDivision: defaultOwner.OwnerSubDivision,
                                OwnerGpWard: defaultOwner.OwnerGpWard,
                                VidePermitNo: defaultOwner.VidePermitNo,
                                OwnerAddressLine1: defaultOwner.OwnerAddressLine1,
                                OwnerAddressLine2: defaultOwner.OwnerAddressLine2,
                            }
                        }));
                    }
                }
            } catch (error) {
                console.error("Error fetching owner details:", error.response?.data || error.message);
            }
        };

        // Fetch owner data immediately on component mount
        fetchOwnerData();
    }, [setRoyaltyData]);

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

    // Add debug to track district value changes
    useEffect(() => {
        console.log("District value updated:", formDataAdd.PurchaserDristic);

        // Update RoyaltyData to ensure district is always in sync
        if (formDataAdd.PurchaserDristic) {
            setRoyaltyData(prev => ({
                ...prev,
                PurchaserDristic: formDataAdd.PurchaserDristic
            }));
        }
    }, [formDataAdd.PurchaserDristic, setRoyaltyData]);

    // Separate useEffect for fetching vehicle details and setting up time data
    useEffect(() => {
        const fetchVehicleAndTimeData = async () => {
            try {
                if (!params?.royaltyID) {
                    console.warn("Royalty ID is missing");
                    return;
                }

                // Set up time data
                const { generatedTime, issueDate } = generateTimeObject();
                setIssueDates({ generatedTime, IssueDate: issueDate });

                // Update royalty data with time information
                setRoyaltyData((prev) => ({
                    ...prev,
                    IssueDate: issueDate,
                    ValidityDate: Validitypreview
                }));

                // Fetch vehicle details
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

        fetchVehicleAndTimeData();
    }, [params?.royaltyID, Validitypreview, setRoyaltyData]);

    const handleInputChangeAdd = (e) => {
        enableNext(false);
        const { name, value } = e.target;

        if (!name) {
            console.error("Missing name attribute in input field:", e.target);
            return;
        }

        setFormErrors((prev) => ({ ...prev, [name]: "" }));

        // Update form data
        setFormDataAdd((prev) => ({
            ...prev,
            [name]: value,
            IssueDate: IssueDates?.IssueDate,
            ValidityDate: Validitypreview,
            CreatedTimeStamp: IssueDates?.generatedTime
        }));

        // Make sure to update RoyaltyData with this value specifically
        setRoyaltyData((prev) => ({
            ...prev,
            [name]: value,
            // Make sure to explicitly include the district value to ensure it's always in the context
            ...(name === 'PurchaserDristic' ? { PurchaserDristic: value } : {})
        }));
    };

    const handleSubmitAdd = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Make sure district is explicitly included in the context
            setRoyaltyData(prev => ({
                ...prev,
                PurchaserDristic: formDataAdd.PurchaserDristic,
                PoliceStation: formDataAdd.PoliceStation,
                PurchaserAdd: formDataAdd.PurchaserAdd,
                ValidityDate: formDataAdd.ValidityDate
            }));

            console.log("Submitting data with district:", formDataAdd.PurchaserDristic);

            await updatePurchaserDetails(params?.royaltyID, formDataAdd);
            enableNext(true);
            setActiveFormIndex((prev) => Math.min(prev + 1, 3));
        } catch (error) {
            console.error("Error updating purchaser details:", error);
            setFormErrors({ api: "Error saving data. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center w-full p-4">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6">
                <h1 className="text-lg font-semibold text-center text-teal-500 mb-4">
                    Buyer Address Details
                </h1>
                <form onSubmit={handleSubmitAdd}>
                    {formErrors.api && (
                        <div className="text-red-500 mb-4 text-center">
                            {formErrors.api}
                        </div>
                    )}
                    <div className="flex justify-evenly border border-red-300 p-3 shadow-sm rounded-md bg-gray-100 w-full">
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
                                placeholder="Try 'sadar' or 'kumargram'"
                                type="text"
                                value={formDataAdd.PoliceStation}
                                onChange={handlePoliceStationChange}
                                list="police-stations"
                            />
                            <datalist id="police-stations">
                                {policeStationData.map(station => (
                                    <option key={station.id} value={station.policeStation} />
                                ))}
                            </datalist>
                            {formDataAdd.PoliceStation && (
                                <p className="text-xs text-blue-500 mt-1">
                                    {policeStationData.some(
                                        item => item.policeStation.toLowerCase() === formDataAdd.PoliceStation.toLowerCase()
                                    )
                                        ? `Auto-filled district (${policeStationData.find(item =>
                                            item.policeStation.toLowerCase() === formDataAdd.PoliceStation.toLowerCase()
                                        )?.PurchaserDristic}) and validity time`
                                        : ""}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 mt-3 gap-2 w-full">
                        <label className="text-sm text-red-400 font-bold">District</label>
                        <div className="w-full">
                            <select
                                className="border p-2 rounded w-full"
                                name="PurchaserDristic"
                                required
                                value={formDataAdd.PurchaserDristic}
                                onChange={handleInputChangeAdd}
                            >
                                <option value="">Select District</option>
                                {["MALDA", "JALPAIGURI", "ALIPURDUAR", "DAKSHIN DINAJPUR", "UTTAR DINAJPUR", "MURSHIDABAD", "DARJEELING"].map(
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
                                value={validityInputValue}
                                onChange={handelValidityCalculate}
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Enter time in format: hours.minutes (e.g., 4.30 for 4 hours 30 minutes)
                            </p>
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

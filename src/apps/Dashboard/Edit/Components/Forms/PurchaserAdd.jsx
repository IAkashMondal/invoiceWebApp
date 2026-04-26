import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";

import { useUser } from "@clerk/clerk-react";
import { addUserQuantity, findMatchingClerkUser } from "../../../../../../Apis/Clerk/ClerkApis";
import policeStationData from "../../../../../../Apis/TimeandPolicestation";
import { addTimeToGeneratedTime, generateTimeObject } from "../../../../../../Apis/GlobalFunction";
import { GetOwnersDeatils } from "../../../../../../Apis/Minors/MinorsApi";
import { updatePurchaserDetails, GetParticularVehicle } from "../../../../../../Apis/R_Apis/VehicleApis";
// import { RoyaltyInfoContext } from "../../../../../../Context/RoyaltyInfoContext";

const PurchaserAdd = ({ enableNext, setActiveFormIndex, RoyaltyData, setRoyaltyData }) => {
    // The component now imports policeStationData from TimeandPolicestation.js
    // This reference should be used everywhere in the component instead of a local definition
    const { user } = useUser();
    const [ownersData, setOwnersData] = useState([]);
    const [selectedOwner, setSelectedOwner] = useState("Prasanta Kumar Hait");
    const [Validitypreview, setValidypreview] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [validityInputValue, setValidityInputValue] = useState("");
    const [documentID, setDocumentID] = useState(null);
    const [quantity, setQuantity] = useState(null);
    const [vehicleNumber, setVehicleNumber] = useState(null);
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

    useEffect(() => {
        const fetchuser = async () => {
            if (user) {
                const match = await findMatchingClerkUser(user);
                setDocumentID(match);
            }
        }
        fetchuser();
    }, [user]);
    console.log(vehicleNumber, "ooc")
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
    console.log("documentID", documentID);

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
                    setVehicleNumber(response.data.data.Registration_No);
                    setQuantity(response.data.data.quantity);
                    console.log("Fetched Vehicle Data:", response.data.data);
                } else {
                    console.warn("No vehicle data found for this Royalty ID.");
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
            }
        };

        fetchVehicleAndTimeData();
    }, [params?.royaltyID]);

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

            // Get vehicle details to determine the quantity
            // const vehicleResponse = await GetParticularVehicle(params?.royaltyID);
            // const quantity = Number(vehicleResponse?.data?.data?.VehicleCapacity || 0);

            if (documentID && documentID.id) {
                // Calculate new quantity by adding vehicle capacity to current total
                const newQuantity = Number(documentID.userTotalQuantity);
                const newPersonalQuantity = Number(documentID.userPersonalQuantity);
                console.log("newQuantity", newQuantity, newPersonalQuantity);

                // Update user data with new quantity - wrap it in data object as required by API

                if (vehicleNumber === 'WB73E2234' || vehicleNumber === 'WB73E9469' || vehicleNumber === 'WB73C5024' || vehicleNumber === 'TEST1234') {
                    const updateData = {
                        userPersonalQuantity: newPersonalQuantity + Number(quantity),
                    };
                    // Call addUserQuantity with user ID and update data
                    await addUserQuantity(documentID.documentId, updateData);
                    console.log("Updated user total quantity to:", updateData);

                } else {
                    const updateDatas = {

                        userTotalQuantity: newQuantity + Number(quantity),
                        RemaningCapacity: Number(documentID.RemaningCapacity) - Number(quantity),

                    };
                    // Call addUserQuantity with user ID and update data
                    await addUserQuantity(documentID.documentId, updateDatas);
                    console.log("Updated user total quantity to:", updateDatas);
                }

            }

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
        <div className="flex flex-col gap-4">
            <PurchaserForm
                enableNext={enableNext}
                setActiveFormIndex={setActiveFormIndex}
                generateQrCode={generateQrCode}
                RoyaltyData={RoyaltyData}
                setRoyaltyData={setRoyaltyData}
            />
        </div>
    );
};

export default PurchaserAdd;

PurchaserAdd.propTypes = {
    enableNext: PropTypes.func.isRequired,
    setActiveFormIndex: PropTypes.func.isRequired,
    RoyaltyData: PropTypes.object.isRequired,
    setRoyaltyData: PropTypes.func.isRequired
};

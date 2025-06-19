import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { v4 as uuidv4 } from 'uuid';
import { GetParticularVehicle, addNewVehicle } from "../../../Apis/R_Apis/VehicleApis";
import { addPerChallaID, GetPrevChallanID } from "../../../Apis/GlobalApi";

import {
    ShieldBan,
    Truck,
    User,
    MapPin,
    Calendar,
    FileText,
    Clock,
    RefreshCw,
    WeightIcon
} from "lucide-react";
import { addUserQuantity, findMatchingClerkUser } from "../../../Apis/Clerk/ClerkApis";

const Renew = () => {
    const { user } = useUser();
    const { royaltyID } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const ViteUrl = import.meta.env.VITE_REDIRECT;
    const [receivedDatas, setReceivedDatas] = useState(null);
    const [fetchedData, setFetchedData] = useState(null);

    const displayData = receivedDatas || fetchedData?.data;
    const [documentID, setDocumentID] = useState(null);
    const QRBASEURL = import.meta.env.VITE_QR_CODE_BASE_URL;

    useEffect(() => {
        if (location.state && location.state.datas) {
            setReceivedDatas(location.state.datas);
        }
    }, [location.state]);
    useEffect(() => {
        const fetchuser = async () => {
            if (user) {
                const match = await findMatchingClerkUser(user);
                setDocumentID(match);
            }
        }
        fetchuser();
    }, [user]);
    useEffect(() => {
        const fetchRoyaltyData = async () => {
            if (!royaltyID) {
                setError("Royalty ID is missing");
                setLoading(false);
                return;
            }

            try {
                const response = await GetParticularVehicle(royaltyID);
                if (response?.data?.data) {
                    setFetchedData(response.data.data);
                } else {
                    setError("Royalty not found");
                }
            } catch (error) {
                console.error("Error fetching royalty data:", error);
                setError("Failed to fetch royalty data");
            } finally {
                setLoading(false);
            }
        };

        fetchRoyaltyData();
    }, [royaltyID, receivedDatas]);

    const handleRenew = async () => {
        const dataToUse = receivedDatas || fetchedData?.data;
        if (!dataToUse) {
            toast.error("Renewal data not available. Please try again from the dashboard.");
            return;
        }
        setUpdating(true);
        try {
            const newRoyaltyID_UUID = uuidv4();
            const newChallanID = dataToUse.EchallanId;
            const EChallanNumber = dataToUse.EChallanNo;
            const generatedTime = dataToUse.EChallanDT;
            const generatedOn = dataToUse.GeneratedDT;
            const ChallandT = dataToUse.ChallandT;
            const EachDate = dataToUse.EachDate;
            const validityTime = dataToUse.ValidityDate;
            const VerefyChallanNum = dataToUse.VerefyChallanNum;

            // Create renewal data without the old documentId and royaltyID
            const dataWithoutIds = { ...dataToUse };
            delete dataWithoutIds.documentId;
            delete dataWithoutIds.royaltyID;
            delete dataWithoutIds.id; // Remove any id field that might cause issues

            const renewalData = {
                data: {
                    royaltyID: newRoyaltyID_UUID, // Use new royaltyID
                    Registration_No: dataToUse.Registration_No,
                    userEmail: user?.primaryEmailAddress?.emailAddress,
                    userName: user?.fullName,
                    quantity: dataToUse.quantity,
                    EchallanId: newChallanID,
                    EChallanNo: EChallanNumber,
                    GeneratedDT: String(generatedOn),
                    TimeStamp: Number(generatedTime),
                    EChallanDT: String(ChallandT),
                    EachDate: EachDate,
                    ValidityDate: validityTime,
                    VerefyChallanNum: VerefyChallanNum,
                    NameofPurchaser: dataToUse.NameofPurchaser,
                    OwnerName: dataToUse.OwnerName,
                    PurchaserAdd: dataToUse.PurchaserAdd,
                    PurchaserDristic: dataToUse.PurchaserDristic,
                    // Add missing fields
                    VehicleType: dataToUse.VehicleType || "",
                    VehicleCapacity: dataToUse.VehicleCapacity || "",
                    VehicleQunText: dataToUse.VehicleQunText || "",
                    PurchaserMobileNo: dataToUse.PurchaserMobileNo || "",
                    PoliceStation: dataToUse.PoliceStation || "",
                    SandID: dataToUse.SandID || "",
                    River: dataToUse.River || "",
                    OwnerDistrict: dataToUse.OwnerDistrict || "",
                    TimeDiffrence: dataToUse.TimeDiffrence || "",
                    CreatedTimeStamp: dataToUse.CreatedTimeStamp || "",
                    IssueDate: dataToUse.IssueDate || "",
                }
            };
            const addVehicleResponse = await addNewVehicle(renewalData);
            const newDocumentIdForRenewedVehicle = addVehicleResponse?.data?.data?.documentId;

            if (!newDocumentIdForRenewedVehicle) {
                console.error("Error: Document ID is undefined after adding new vehicle.");
                throw new Error("Could not get document ID for the renewed vehicle.");
            }
            // Get the documentID for updating the challan ID
            const prevChallanResponse = await GetPrevChallanID();
            const echallanDocumentId = prevChallanResponse?.data?.data?.[0]?.documentId;

            if (!echallanDocumentId) {
                console.warn("Could not get echallan document ID for updating PrevChallanID");
            } else {
                const newChallanIdEntryData = {
                    PrevChallanID: newChallanID
                };
                await addPerChallaID(echallanDocumentId, newChallanIdEntryData);
            }
            const qrValue = `${QRBASEURL}/WBMD/Page/each/aspx/id/${newChallanID}/S/24-25/RPS`;
            navigate(`${ViteUrl}/${newDocumentIdForRenewedVehicle}/view`, {
                state: { qrCode: qrValue }
            });
            if (documentID && documentID.id) {
                const newQuantity = Number(documentID.userTotalQuantity);
                const newPersonalQuantity = Number(documentID.userPersonalQuantity);

                if (receivedDatas.Registration_No === 'WB73E2234' || receivedDatas.Registration_No === 'WB73E9469' || receivedDatas.Registration_No === 'WB73C5024' || receivedDatas.Registration_No === 'TEST1234') {
                    const updateData = {
                        userPersonalQuantity: newPersonalQuantity + Number(receivedDatas.quantity),
                    };
                    await addUserQuantity(documentID.documentId, updateData);
                } else {
                    const updateDatas = {
                        userTotalQuantity: newQuantity + Number(receivedDatas.quantity),
                        RemaningCapacity: Number(documentID.RemaningCapacity) - Number(receivedDatas.quantity),
                    };
                    await addUserQuantity(documentID.documentId, updateDatas);
                }
            }
        } catch (error) {
            console.error("Error renewing royalty:", error);
            toast.error("Failed to renew royalty");
            setError(error.message || "Failed to renew royalty");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh]">
                <div className="text-red-600 text-center px-4">
                    <ShieldBan className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 mb-3 sm:mb-4" />
                    <p className="text-base sm:text-lg md:text-xl font-semibold">{error}</p>
                </div>
            </div>
        );
    }

    const statusColors = {
        indicator: "bg-orange-500",
        icon: "text-orange-500",
        truckBackground: "text-orange-500",
        shield: "text-orange-500"
    };

    return (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 max-w-4xl">
            <div className="relative overflow-hidden rounded-xl p-4 sm:p-5 md:p-6 
                transition-all duration-300
                border border-gray-100 w-full bg-gradient-to-br from-white to-gray-50">

                <div className={`absolute top-0 right-0 w-1/3 h-1 ${statusColors.indicator}`}></div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">Renew </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start sm:items-center">
                            <Truck size={18} className="text-blue-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Registration Number</p>
                                <p className="text-sm sm:text-base font-semibold break-all">{displayData?.Registration_No || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center">
                            <User size={18} className="text-orange-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Purchaser</p>
                                <p className="text-sm sm:text-base font-semibold break-all">{displayData?.NameofPurchaser || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center">
                            <FileText size={18} className="text-amber-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Current Challan ID</p>
                                <p className="text-sm sm:text-base font-semibold break-all">{displayData?.EchallanId || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-start sm:items-center">
                            <User size={18} className="text-indigo-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Holder Name</p>
                                <p className="text-sm sm:text-base font-semibold break-all">{displayData?.OwnerName || "N/A"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                        <div className="flex items-start sm:items-center">
                            <WeightIcon size={18} className="text-teal-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Qunatity</p>
                                <p className="text-sm sm:text-base font-semibold break-all">{displayData?.quantity ? `${displayData.quantity} Ctf` : "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-start sm:items-center">
                            <Clock size={18} className="text-cyan-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Issue Date</p>
                                <p className="text-sm sm:text-base font-semibold">{displayData?.IssueDate || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-start sm:items-center">
                            <Calendar size={18} className="text-red-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Current Validity</p>
                                <p className="text-sm sm:text-base font-semibold">{displayData?.ValidityDate || "N/A"}</p>
                            </div>
                        </div>

                        <div className="flex items-start sm:items-center">
                            <MapPin size={18} className="text-orange-500 mr-2 mt-1 sm:mt-0 flex-shrink-0" />
                            <div>
                                <p className="text-xs sm:text-sm text-gray-600">Location</p>
                                <p className="text-sm sm:text-base font-semibold break-all">
                                    {displayData?.PurchaserAdd || "N/A"}
                                    {displayData?.PurchaserDristic ? `, ${displayData.PurchaserDristic}` : ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8">
                    <button
                        onClick={() => navigate(ViteUrl)}
                        className="w-full sm:w-1/2 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleRenew}
                        disabled={updating}
                        className="w-full sm:w-1/2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {updating ? (
                            <>
                                <RefreshCw className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                                Renewing...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="h-4 w-4 sm:h-5 sm:w-5" />
                                Renew Now
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Renew;


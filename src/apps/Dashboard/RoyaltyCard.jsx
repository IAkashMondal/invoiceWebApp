import { useState, useEffect } from "react";
import {
    ShieldCheck,
    ShieldBan,
    Truck,
    User,
    MapPin,
    Calendar,
    FileText,
    Clock,
    UserCircle,
    X,
    Edit3,
    RefreshCw
} from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// Time utility functions
export const generateTimeObject = () => {
    const now = new Date();

    // Extract date components
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = String(now.getFullYear());

    // Extract time components
    let hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const generatedTimeMili = Date.UTC(
        year,
        month - 1,
        day,
        hours,
        minutes,
        seconds
    );
    return { generatedTimeMili };
};

export const getDynamicYearRange = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const month = currentDate.getMonth();

    let startYear = currentYear;
    let endYear = currentYear + 1;

    // If the current month is before April (January, February, March)
    if (month < 3) {
        startYear = currentYear - 1;
        endYear = currentYear;
    }
    return `${startYear.toString().slice(-2)}-${endYear.toString().slice(-2)}`;
};

const RoyaltyCard = ({ data }) => {
    const [isValid, setIsValid] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();

    // Check validity based on challan verification time
    useEffect(() => {
        const checkValidity = async () => {
            const { generatedTimeMili } = await generateTimeObject();

            // Check if challan is valid based on verification time
            if (data?.VerefyChallanNum) {
                const isNotExpired = data.VerefyChallanNum > generatedTimeMili;
                setIsValid(isNotExpired);
            } else {
                setIsValid(false);
            }
        };

        checkValidity();
    }, [data]);

    // Colors based on validity status
    const statusColors = {
        indicator: isValid ? "bg-green-500" : "bg-red-500",
        icon: isValid ? "text-green-500" : "text-red-500",
        truckBackground: isValid ? "text-green-400" : "text-red-400",
        shield: isValid ? "text-green-500" : "text-red-500"
    };

    const handleCardClick = (e) => {
        e.preventDefault(); // Prevent the default Link behavior
        setShowDialog(true);
    };

    const handleCancel = () => {
        setShowDialog(false);
    };

    const handleEdit = () => {
        setShowDialog(false);
        navigate(`/dashboard/create-royalty/${data.documentId}/edit`);
    };

    const handleRenew = () => {
        setShowDialog(false);
        // Add renewal logic here
        console.log("Renew clicked for:", data.Registration_No);
    };

    return (
        <div className="relative w-full h-full">
            {/* Main Card */}
            <div
                onClick={handleCardClick}
                className="relative overflow-hidden rounded-xl p-3 sm:p-5 h-[195px] sm:h-[250px] md:h-[220px] 
                transition-all duration-300 cursor-pointer
                hover:shadow-lg hover:translate-y-[-5px] hover:border-blue-200
                hover:bg-gradient-to-br hover:from-white hover:to-blue-50
                group border border-gray-100 w-full bg-gradient-to-br from-white to-gray-50"
            >
                {/* Color indicator bar - expands on hover */}
                <div className={`absolute top-0 right-0 w-1/3 h-1 ${statusColors.indicator} transition-all duration-300 group-hover:w-full`}></div>

                {/* Registration number with truck icon */}
                <div className="flex items-center mb-2 sm:mb-3">
                    <div className="flex-shrink-0 mr-2 transition-transform duration-300 group-hover:scale-110">
                        <Truck size={12} className={`sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-blue-500 group-hover:text-blue-600`} />
                    </div>
                    <h3 className="lg:text-sm sm:text-sm md:text-base font-semibold text-gray-800 tracking-wide group-hover:text-blue-800">
                        {data?.Registration_No || "No Registration"}
                    </h3>
                </div>

                {/* E-challan ID with file icon */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <FileText size={12} className="text-amber-500 flex-shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:text-amber-600" />
                    <p className="lg:text-xs md:text-xs sm:text-[6px] text-gray-700 truncate font-medium group-hover:text-gray-900">
                        {data?.EchallanId ? `${data.EchallanId}/T/25-26/${data.TimeStamp}/PS` : "No Challan ID"}
                    </p>
                </div>

                {/* Purchaser information */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <UserCircle size={12} className="text-purple-500 flex-shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:text-purple-600" />
                    <p className="text-xs sm:text-sm text-gray-700 truncate font-medium group-hover:text-gray-900">
                        {data?.NameofPurchaser || "Unknown"}
                    </p>
                </div>

                {/* Owner Name */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <User size={12} className="text-indigo-500 flex-shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:text-indigo-600" />
                    <p className="lg:text-xs md:text-xs sm:text-[10px] text-gray-700 truncate font-medium group-hover:text-gray-900">
                        {data?.OwnerName ? `${data.OwnerName}` : "No Owner Data"}
                    </p>
                </div>

                {/* Location information */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <MapPin size={12} className="text-orange-500 flex-shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:text-orange-600" />
                    <p className="lg:text-xs md:text-xs sm:text-[9px] text-gray-600 truncate max-w-[90%] group-hover:text-gray-800">
                        {data?.PurchaserAdd || "N/A"}
                        {data?.PurchaserDristic ? `, ${data.PurchaserDristic}` : ""}
                    </p>
                </div>

                {/* Issue Date */}
                <div className="flex items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                    <Clock size={12} className="text-cyan-500 flex-shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:text-cyan-600" />
                    <p className="lg:text-xs md:text-xs sm:text-[10px] text-gray-600 group-hover:text-gray-800">
                        {data?.IssueDate ? `${data.IssueDate}` : "No Issue Date"}
                    </p>
                </div>

                {/* Validity Date */}
                <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    <Calendar size={12} className="text-red-500 flex-shrink-0 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 transition-transform duration-300 group-hover:text-red-600" />
                    <p className="lg:text-xs md:text-xs sm:text-[10px] text-gray-600 group-hover:text-gray-800">
                        {data?.ValidityDate || "No Validity Date"}
                    </p>
                </div>

                {/* Quantity information */}
                {data?.quantity && (
                    <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 transition-all duration-300 group-hover:bottom-5 sm:group-hover:bottom-6 group-hover:font-semibold">
                        <p className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-blue-700">
                            {data.quantity} CFT
                        </p>
                    </div>
                )}

                {/* Status info box - TOP RIGHT on md/lg screens */}
                <div className="absolute top-3 sm:top-5 sm:right-5 p-1.5 sm:p-2 items-center gap-1.5 md:flex hidden transition-all duration-300 group-hover:scale-105">
                    {isValid ? (
                        <ShieldCheck size={16} className="text-green-500 group-hover:text-green-600" />
                    ) : (
                        <ShieldBan size={16} className="text-red-500 group-hover:text-red-600" />
                    )}
                    <span className={`text-xs sm:text-sm font-medium ${isValid ? "text-green-700 group-hover:text-green-800" : "text-red-700 group-hover:text-red-800"}`}>
                        {isValid ? "Valid" : "Expired"}
                    </span>
                </div>

                {/* Status info box - BOTTOM LEFT on small screens */}
                <div className="absolute bottom-3 sm:bottom-4 flex items-center md:hidden transition-all duration-300 group-hover:bottom-5 sm:group-hover:bottom-6">
                    {isValid ? (
                        <ShieldCheck size={14} className="text-green-500 group-hover:text-green-600" />
                    ) : (
                        <ShieldBan size={14} className="text-red-500 group-hover:text-red-600" />
                    )}
                    <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full 
                    ${isValid
                            ? "bg-green-100 text-green-800 group-hover:bg-green-200 group-hover:text-green-900"
                            : "bg-red-100 text-red-800 group-hover:bg-red-200 group-hover:text-red-900"}`}>
                        {isValid ? "Valid" : "Expired"}
                    </span>
                </div>

                {/* Subtle gradient overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-8 sm:h-10 bg-gradient-to-t from-gray-50 to-transparent group-hover:from-blue-50"></div>
            </div>

            {/* Dialog Box */}
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden max-w-md w-full animate-fadeIn">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b flex justify-between items-center">
                            <h3 className="text-lg font-semibold text-gray-800">
                                {data?.Registration_No || "No Registration"}
                            </h3>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <p className="text-sm text-gray-600 mb-2">
                                Select an action for this royalty:
                            </p>

                            <div className="grid grid-cols-3 gap-3 mt-4">
                                {/* Cancel Button */}
                                <button
                                    onClick={handleCancel}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                >
                                    <X size={24} className="text-gray-600 mb-2" />
                                    <span className="text-sm font-medium text-gray-700">Cancel</span>
                                </button>

                                {/* Edit Button */}
                                <button
                                    onClick={handleEdit}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                                >
                                    <Edit3 size={24} className="text-blue-600 mb-2" />
                                    <span className="text-sm font-medium text-blue-700">Edit</span>
                                </button>

                                {/* Renew Button */}
                                <button
                                    onClick={handleRenew}
                                    className="flex flex-col items-center justify-center p-3 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                                >
                                    <RefreshCw size={24} className="text-green-600 mb-2" />
                                    <span className="text-sm font-medium text-green-700">Renew</span>
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="bg-gray-50 p-3 border-t text-center">
                            <p className="text-xs text-gray-500">
                                {isValid ? "Valid until: " : "Expired on: "}
                                {data?.ValidityDate || "Unknown"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// PropTypes validation for better type safety
RoyaltyCard.propTypes = {
    data: PropTypes.shape({
        Registration_No: PropTypes.string,
        NameofPurchaser: PropTypes.string,
        documentId: PropTypes.string,
        PurchaserAdd: PropTypes.string,
        PurchaserDristic: PropTypes.string,
        quantity: PropTypes.number,
        VerefyChallanNum: PropTypes.number,
        ValidityDate: PropTypes.string,
        GeneratedDT: PropTypes.string,
        EchallanId: PropTypes.string,
        TimeStamp: PropTypes.string,
        IssueDate: PropTypes.string,
        OwnerName: PropTypes.string,
    }).isRequired,
};

export default RoyaltyCard;

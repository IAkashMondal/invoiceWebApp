import { Link } from "react-router-dom"; // Ensure you import Link from react-router-dom
import { Truck } from "lucide-react";
import PropTypes from "prop-types"; // To handle prop validation

const RoyaltyCard = ({ data }) => {
    console.log(data.documentId,"documentId")
    return (
        <Link to={`/dashboard/create-royalty/${data.documentId}/edit`} className="block">
            <div
                className={`p-6 text-center rounded-2xl shadow-md hover:shadow-lg h-[280px] transition-shadow duration-300 
            ${data?.Registration_No? "bg-blue-100" : "bg-gray-200"}`}
            >
                <div className="flex justify-center">
                    <Truck color="#48ea9e" size={60} />
                </div>
                {/* Conditionally render vehicle and owner */}
                <h3 className="text-xl font-semibold text-gray-800 mt-4">{data?.Registration_No}</h3>
                <p className="text-gray-600">{data?.NameofPurchaser}</p>
            </div>
        </Link>
    );
};

// PropTypes validation for better type safety
RoyaltyCard.propTypes = {
    data: PropTypes.shape({
        Registration_No: PropTypes.string.isRequired,
        NameofPurchaser: PropTypes.string.isRequired,
        documentId:PropTypes.string,
        userID: PropTypes.string.isRequired, // Added validation for userID
    }).isRequired,
};

export default RoyaltyCard;

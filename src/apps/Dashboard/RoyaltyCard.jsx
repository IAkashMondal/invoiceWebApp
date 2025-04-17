import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import PropTypes from "prop-types"

export default function RoyaltyCard({ data }) {
    const [showOptions, setShowOptions] = useState(false)
    const navigate = useNavigate()

    const handleCardClick = () => {
        setShowOptions(!showOptions)
    }

    const handleAction = (action, e) => {
        e.stopPropagation() // Prevent card click event
        switch (action) {
            case 'edit':
                navigate(`/dashboard/create-royalty/${data.documentId}/edit`)
                break
            case 'renew':
                console.log('Renew clicked for:', data)
                break
            case 'cancel':
                setShowOptions(false)
                break
            default:
                break
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
            <div
                onClick={handleCardClick}
                className="cursor-pointer"
            >
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">{data.NameofPurchaser}</h3>
                        <p className="text-sm text-gray-600">Registration No: {data.Registration_No}</p>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                        {data.Status || "Active"}
                    </span>
                </div>
                <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Email:</span> {data.userEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {new Date(parseInt(data.CreatedTimeStamp)).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-medium">E-Challan ID:</span> {data.EchallanId}
                    </p>
                </div>
            </div>

            {showOptions && (
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <Button
                        variant="outline"
                        onClick={(e) => handleAction('cancel', e)}
                        className="flex-1 mr-2"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="default"
                        onClick={(e) => handleAction('edit', e)}
                        className="flex-1 mr-2"
                    >
                        Edit
                    </Button>
                    <Button
                        variant="default"
                        onClick={(e) => handleAction('renew', e)}
                        className="flex-1"
                    >
                        Renew
                    </Button>
                </div>
            )}
        </div>
    )
}

RoyaltyCard.propTypes = {
    data: PropTypes.shape({
        NameofPurchaser: PropTypes.string.isRequired,
        Registration_No: PropTypes.string.isRequired,
        Status: PropTypes.string,
        userEmail: PropTypes.string.isRequired,
        CreatedTimeStamp: PropTypes.string.isRequired,
        EchallanId: PropTypes.string.isRequired,
        documentId: PropTypes.string.isRequired
    }).isRequired
}

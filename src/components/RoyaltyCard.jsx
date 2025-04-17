"use client"

export function RoyaltyCard({ data }) {
    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{data.title || "Royalty Card"}</h2>
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {data.status || "Premium"}
                </span>
            </div>

            <div className="space-y-4">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl">{data.icon || "👑"}</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800">{data.memberType || "Royal Member"}</h3>
                        <p className="text-sm text-gray-600">{data.description || "Exclusive Benefits"}</p>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Benefits</h4>
                    <ul className="space-y-2">
                        {data.benefits?.map((benefit, index) => (
                            <li key={index} className="flex items-center text-sm text-gray-600">
                                <span className="mr-2">✓</span>
                                {benefit}
                            </li>
                        )) || (
                                <>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✓</span>
                                        Priority Access
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✓</span>
                                        Exclusive Events
                                    </li>
                                    <li className="flex items-center text-sm text-gray-600">
                                        <span className="mr-2">✓</span>
                                        Special Discounts
                                    </li>
                                </>
                            )}
                    </ul>
                </div>
            </div>
        </div>
    )
} 
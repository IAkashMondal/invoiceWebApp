import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import PropTypes from "prop-types"
import RoyaltyCard from "../../apps/Dashboard/RoyaltyCard"
import Pagination from "./pagination"

const SearchResults = ({
    results,
    isLoading,
    searchTerm,
    totalItems,
    totalPages,
    currentPage,
    onPageChange
}) => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        // Show results section when search term exists or has results
        if (searchTerm || (results && results.length > 0)) {
            setVisible(true)
        } else {
            // Hide with a small delay to allow for fade-out animation
            const timer = setTimeout(() => {
                setVisible(false)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [searchTerm, results])

    if (!visible) return null

    return (
        <Card className={`mt-2 p-3 sm:p-4 rounded-lg shadow-md transition-all duration-300 w-full ${visible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="mb-3 sm:mb-4 border-b pb-2">
                <h3 className="text-base sm:text-lg font-medium truncate">
                    {searchTerm ? `Search Results for "${searchTerm}"` : "Recent Searches"}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                    {isLoading
                        ? "Searching..."
                        : results?.length
                            ? `Found ${totalItems} result${totalItems !== 1 ? 's' : ''}`
                            : searchTerm
                                ? "No results found"
                                : ""}
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-purple-700"></div>
                </div>
            ) : results?.length ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4">
                        {results.map((data, index) => (
                            <RoyaltyCard key={index} data={data} />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center mt-3 sm:mt-4">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={totalItems}
                                onPageChange={onPageChange}
                            />
                        </div>
                    )}
                </>
            ) : searchTerm ? (
                <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                    <p className="text-sm sm:text-base text-gray-600">No matching results found</p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Try different keywords or check your spelling
                    </p>
                </div>
            ) : null}
        </Card>
    )
}

SearchResults.propTypes = {
    results: PropTypes.array,
    isLoading: PropTypes.bool,
    searchTerm: PropTypes.string,
    totalItems: PropTypes.number,
    totalPages: PropTypes.number,
    currentPage: PropTypes.number,
    onPageChange: PropTypes.func
}

SearchResults.defaultProps = {
    results: [],
    isLoading: false,
    totalItems: 0,
    totalPages: 1,
    currentPage: 1
}

export default SearchResults 
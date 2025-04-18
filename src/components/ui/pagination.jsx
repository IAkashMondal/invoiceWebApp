import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import PropTypes from "prop-types"

const Pagination = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pageNumbers = []
        const maxPagesToShow = 5 // Show max 5 page numbers at a time

        if (totalPages <= maxPagesToShow) {
            // If there are 5 or fewer pages, show all pages
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i)
            }
        } else {
            // Always show first page
            pageNumbers.push(1)

            // Calculate start and end of page numbers to display
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)

            // If we're at the start, show more pages after
            if (currentPage <= 2) {
                end = Math.min(totalPages - 1, 4)
            }

            // If we're at the end, show more pages before
            if (currentPage >= totalPages - 1) {
                start = Math.max(2, totalPages - 3)
            }

            // Add ellipsis if there's a gap after first page
            if (start > 2) {
                pageNumbers.push('...')
            }

            // Add middle page numbers
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i)
            }

            // Add ellipsis if there's a gap before last page
            if (end < totalPages - 1) {
                pageNumbers.push('...')
            }

            // Always show last page if more than one page
            if (totalPages > 1) {
                pageNumbers.push(totalPages)
            }
        }

        return pageNumbers
    }

    return (
        <div className="flex flex-col items-center space-y-2 md:space-y-0">
            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </Button>

                <div className="flex items-center space-x-1">
                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2">...</span>
                        ) : (
                            <Button
                                key={`page-${page}`}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="min-w-[32px] h-8"
                            >
                                {page}
                            </Button>
                        )
                    ))}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNext}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <div className="text-sm text-gray-500 mt-2">
                {totalItems} total items
            </div>
        </div>
    )
}

Pagination.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    totalItems: PropTypes.number.isRequired,
}

export default Pagination 
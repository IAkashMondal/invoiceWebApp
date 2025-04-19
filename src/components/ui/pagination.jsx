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
        // Show fewer page numbers on mobile
        const maxPagesToShow = window.innerWidth < 640 ? 3 : 5

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
                end = Math.min(totalPages - 1, window.innerWidth < 640 ? 2 : 4)
            }

            // If we're at the end, show more pages before
            if (currentPage >= totalPages - 1) {
                start = Math.max(2, totalPages - (window.innerWidth < 640 ? 1 : 3))
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
        <div className="flex flex-col items-center space-y-2 w-full max-w-full">
            <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2 w-full">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                    className="flex items-center h-8 px-2 sm:gap-1 text-xs sm:text-sm"
                >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Prev</span>
                </Button>

                <div className="flex flex-wrap items-center justify-center gap-1">
                    {getPageNumbers().map((page, index) => (
                        page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-1 sm:px-2 text-xs sm:text-sm">...</span>
                        ) : (
                            <Button
                                key={`page-${page}`}
                                variant={currentPage === page ? "default" : "outline"}
                                size="sm"
                                onClick={() => onPageChange(page)}
                                className="min-w-[28px] sm:min-w-[32px] h-8 px-1 sm:px-2 text-xs sm:text-sm"
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
                    className="flex items-center h-8 px-2 sm:gap-1 text-xs sm:text-sm"
                >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
            </div>

            <div className="text-xs sm:text-sm text-gray-500 mt-1">
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
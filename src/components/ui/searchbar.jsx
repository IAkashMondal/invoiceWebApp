import { useEffect, useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"
import PropTypes from "prop-types"

const SearchBar = ({ onSearch, placeholder, className, debounceTime = 300 }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const debounceTimerRef = useRef(null)

    // Debounce search input
    useEffect(() => {
        if (searchTerm === "") {
            // Immediately clear search when input is empty
            onSearch("")
            return
        }

        // Clear previous timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current)
        }

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
            onSearch(searchTerm.trim().toUpperCase())
        }, debounceTime)

        // Cleanup on unmount
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current)
            }
        }
    }, [searchTerm, debounceTime, onSearch])

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault()
            if (searchTerm.trim()) {
                onSearch(searchTerm.trim().toUpperCase())
            }
        }
    }

    const handleClear = () => {
        setSearchTerm("")
        onSearch("")
    }

    return (
        <div className={`relative w-full max-w-full ${className}`}>
            <div className="relative w-full">
                <SearchIcon
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10"
                    size={18}
                />
                <Input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder || "Search..."}
                    className="pl-10 pr-16 w-full focus-visible:ring-purple-500 uppercase text-sm sm:text-base"
                    aria-label="Search"
                />
                {searchTerm && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-2 text-gray-500 hover:text-gray-700"
                        onClick={handleClear}
                        aria-label="Clear search"
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    debounceTime: PropTypes.number
}

export default SearchBar 
"use client"

import { useEffect, useState } from "react"
import RoyaltyCard from "../apps/Dashboard/RoyaltyCard"
import { useUser } from "@clerk/clerk-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Pagination from "./ui/pagination"
import { GetUserRoyalties, SearchUserRoyalties } from "../../Apis/R_Apis/VehicleApis"

export default function Dashboard() {
    const { user } = useUser()
    const [showRoyaltyCard, setShowRoyaltyCard] = useState(true)
    const [royaltyData, setRoyaltyData] = useState(null)
    const [filteredData, setFilteredData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [sortOrder, setSortOrder] = useState("newest")
    const [searchTerm, setSearchTerm] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 10

    useEffect(() => {
        const fetchRoyaltyData = async () => {
            try {
                if (!user?.primaryEmailAddress?.emailAddress) {
                    throw new Error("User email not found")
                }

                const response = await GetUserRoyalties(
                    user.primaryEmailAddress.emailAddress,
                    currentPage,
                    itemsPerPage
                )
                console.log('Initial data fetch:', response?.data)
                const data = response?.data?.data || []
                setRoyaltyData(data)
                setFilteredData(data)
                setTotalPages(response?.data?.meta?.pagination?.pageCount || 1)
                setTotalItems(response?.data?.meta?.pagination?.total || 0)
            } catch (error) {
                console.error('Error fetching royalty data:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRoyaltyData()
    }, [user, currentPage])

    const handleSearch = async (value) => {
        setSearchTerm(value)
        setIsSearching(true)
        try {
            const response = await SearchUserRoyalties(value)
            const searchResults = response?.data?.data || []
            const filteredResults = searchResults.filter(
                (item) => item.userEmail === user?.email
            )
            setFilteredData(filteredResults)
            setCurrentPage(1) // Reset to first page on new search
        } catch (error) {
            console.error("Search error:", error)
            setError("Failed to search royalties")
        } finally {
            setIsSearching(false)
        }
    }

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold">Your Royalties</h1>
                <div className="flex gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                            type="text"
                            placeholder="Search by name, registration, or challan ID"
                            className="pl-10 w-[250px]"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <Select value={sortOrder} onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="oldest">Oldest First</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {showRoyaltyCard && (
                <div className="flex flex-col items-center">
                    {loading || isSearching ? (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading royalty data...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">
                            <p>Error: {error}</p>
                        </div>
                    ) : filteredData && filteredData.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                                {filteredData.map((data, index) => (
                                    <RoyaltyCard key={index} data={data} />
                                ))}
                            </div>
                            <div className="mt-8 w-full flex justify-center">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalItems}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center text-gray-600">
                            <p>No royalty data available</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
} 
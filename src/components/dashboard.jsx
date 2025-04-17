"use client"

import { useEffect, useState } from "react"
import RoyaltyCard from "../apps/Dashboard/RoyaltyCard"
import { useUser } from "@clerk/clerk-react"
import { GetUserRoyalties, SearchUserRoyalties } from "../../Apis/GlobalApi"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

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

    useEffect(() => {
        const fetchRoyaltyData = async () => {
            try {
                if (!user?.primaryEmailAddress?.emailAddress) {
                    throw new Error("User email not found")
                }

                const response = await GetUserRoyalties(user.primaryEmailAddress.emailAddress)
                console.log('Initial data fetch:', response?.data)
                const data = response?.data?.data || []
                setRoyaltyData(data)
                setFilteredData(data)
            } catch (error) {
                console.error('Error fetching royalty data:', error)
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }

        fetchRoyaltyData()
    }, [user])

    useEffect(() => {
        if (royaltyData) {
            const sortedData = [...royaltyData].sort((a, b) => {
                const timeA = parseInt(a.CreatedTimeStamp || 0)
                const timeB = parseInt(b.CreatedTimeStamp || 0)
                return sortOrder === "newest" ? timeB - timeA : timeA - timeB
            })
            setFilteredData(sortedData)
        }
    }, [sortOrder, royaltyData])

    const handleSearch = async (value) => {
        // Convert input to uppercase
        const uppercaseValue = value.toUpperCase()
        setSearchTerm(uppercaseValue)

        if (!uppercaseValue.trim()) {
            // If search is empty, show all user's data
            const response = await GetUserRoyalties(user.primaryEmailAddress.emailAddress)
            console.log('Empty search response:', response?.data)
            const data = response?.data?.data || []
            setFilteredData(data)
            return
        }

        setIsSearching(true)
        try {
            console.log('Searching for:', uppercaseValue)
            const response = await SearchUserRoyalties(uppercaseValue)
            console.log('Search response:', response?.data)

            // Filter the search results to only include user's data
            const userData = response?.data?.data?.filter(
                item => item.userEmail?.toLowerCase() === user.primaryEmailAddress.emailAddress.toLowerCase()
            ) || []

            console.log('Filtered user data:', userData)
            setFilteredData(userData)
        } catch (error) {
            console.error('Error searching royalty data:', error)
            setError(error.message)
        } finally {
            setIsSearching(false)
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
                            placeholder="Search by name or registration"
                            className="pl-10 w-[250px] uppercase"
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ textTransform: 'uppercase' }}
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
                <div className="flex justify-center items-center mt-8">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {filteredData.map((data, index) => (
                                <RoyaltyCard key={index} data={data} />
                            ))}
                        </div>
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
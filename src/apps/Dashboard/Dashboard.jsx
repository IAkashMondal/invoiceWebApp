import CreateRoyalty from "../../components/Comp/CreateRoyalty";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { GetUserRoyalties, SearchUserRoyalties, findMatchingClerkUser } from "../../../Apis/GlobalApi";
import RoyaltyCard from "./RoyaltyCard";
import Pagination from "../../components/ui/pagination";
import SearchBar from "../../components/ui/searchbar";
import SearchResults from "../../components/ui/searchresults";

const Dashboard = () => {
  const { user } = useUser();
  const [userRoyaltyData, setUserRoyaltyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const itemsPerPage = 10;

  // User stats
  const [remainingCapacity, setRemainingCapacity] = useState(0);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserRoyaltyList();
      fetchUserCapacity();
    }
  }, [user, currentPage]);

  // Separate effect for search to avoid conflicts
  useEffect(() => {
    if (searchTerm && user?.primaryEmailAddress?.emailAddress) {
      performSearch(searchTerm);
    }
  }, [searchTerm]);

  // Fetch user capacity data
  const fetchUserCapacity = async () => {
    if (!user) return;

    try {
      const match = await findMatchingClerkUser(user);
      if (match) {
        // Get remaining capacity from attributes or direct properties
        let remaining = Number(match.attributes?.RemaningCapacity || match.RemaningCapacity || 0);
        const total = Number(match.attributes?.userTotalQuantity || match.userTotalQuantity || 0);
        const limit = Number(match.attributes?.Userlimit || match.Userlimit || 0);

        // If remaining capacity wasn't explicitly set, calculate it
        if (remaining === 0 && limit > 0) {
          remaining = limit > total ? limit - total : 0;
        }

        setRemainingCapacity(remaining);
        setDataLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching user capacity:", error);
    }
  };

  const fetchUserRoyaltyList = async () => {
    try {
      setLoading(true);
      const response = await GetUserRoyalties(
        user.primaryEmailAddress.emailAddress,
        currentPage,
        itemsPerPage
      );
      setUserRoyaltyData(response?.data?.data || []);
      setTotalPages(response?.data?.meta?.pagination?.pageCount || 1);
      setTotalItems(response?.data?.meta?.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching user royalties:", error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    try {
      setIsSearching(true);
      const response = await SearchUserRoyalties(
        query,
        user.primaryEmailAddress.emailAddress,
        1, // Always start search results from page 1
        itemsPerPage
      );
      const results = response?.data?.data || [];
      setSearchResults(results);
      setTotalPages(response?.data?.meta?.pagination?.pageCount || 1);
      setTotalItems(response?.data?.meta?.pagination?.total || 0);
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query) => {
    setSearchTerm(query);
    if (!query) {
      setSearchResults(null);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleSearchPageChange = (newPage) => {
    if (searchTerm && user?.primaryEmailAddress?.emailAddress) {
      performSearchPagination(searchTerm, newPage);
    }
  };

  const performSearchPagination = async (query, page) => {
    try {
      setIsSearching(true);
      const response = await SearchUserRoyalties(
        query,
        user.primaryEmailAddress.emailAddress,
        page,
        itemsPerPage
      );
      const results = response?.data?.data || [];
      setSearchResults(results);
    } catch (error) {
      console.error("Search pagination error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">

      {/* Capacity and Search Section */}
      <div className="w-full px-2 sm:px-0 mb-6 sm:mb-8 mx-auto sm:max-w-xl md:max-w-2xl">
        {/* Header with Capacity Indicator */}
        <div className="flex justify-end mb-4">
          {dataLoaded && (
            <div className="flex items-center bg-gradient-to-r from-green-50 via-green-100 to-green-50 px-3 py-2 rounded-lg border border-green-200 shadow-sm">
              <div className="bg-white p-1.5 rounded-md mr-2">

              </div>
              <div>
                <p className="text-xs uppercase tracking-wide font-medium text-green-800">Remaining {remainingCapacity || "0"}</p>


              </div>
            </div>
          )}
        </div>

        <SearchBar
          onSearch={handleSearch}
          placeholder="Search by registration number, purchaser name, or challan ID..."
          className="w-full"
          debounceTime={300}
        />

        {/* Search Results */}
        <SearchResults
          results={searchResults}
          isLoading={isSearching}
          searchTerm={searchTerm}
          totalItems={totalItems}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handleSearchPageChange}
        />
      </div>

      {/* QR Code Section */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-evenly gap-4 sm:gap-10 p-6 sm:p-10">
        <CreateRoyalty />
      </div>

      {/* Main Royalty Cards Section - Only show when not searching */}
      {!searchTerm && (
        <div className="flex flex-col items-center">
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading royalty data...</p>
            </div>
          ) : userRoyaltyData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                {userRoyaltyData.map((data, index) => (
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
            <div className="text-center text-gray-500 w-full p-8 bg-gray-50 rounded-lg shadow-sm">
              <p className="text-lg font-medium">No royalty data available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;

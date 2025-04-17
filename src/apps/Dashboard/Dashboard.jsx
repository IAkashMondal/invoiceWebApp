import CreateRoyalty from "../../components/Comp/CreateRoyalty";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { GetUserRoyalties } from "../../../Apis/GlobalApi";
import RoyaltyCard from "./RoyaltyCard";
import { Input } from "@/components/ui/input";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 20;

const Dashboard = () => {
  const { user } = useUser();
  const [userRoyaltyData, setUserRoyaltyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterName, setFilterName] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // desc = newest first

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserRoyaltyList();
    }
  }, []);

  const fetchUserRoyaltyList = async () => {
    try {
      const response = await GetUserRoyalties(user.primaryEmailAddress.emailAddress);
      const data = response?.data?.data || [];
      setUserRoyaltyData(data);
    } catch (error) {
      console.error("Error fetching user royalties:", error);
    }
  };

  // Filter and sort data
  const filteredAndSortedData = userRoyaltyData
    .filter(item =>
      item.NameofPurchaser?.toLowerCase().includes(filterName.toLowerCase()) ||
      item.Registration_No?.toLowerCase().includes(filterName.toLowerCase())
    )
    .sort((a, b) => {
      const timeA = new Date(a.TimeStamp).getTime();
      const timeB = new Date(b.TimeStamp).getTime();
      return sortOrder === "desc" ? timeB - timeA : timeA - timeB;
    });

  // Calculate pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handle page changes
  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };



  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      {/* Title and Filter Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* <h2 className="font-bold text-3xl">Generate</h2> */}
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Filter by name or reg. no"
              className="pl-10"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* QR Code Generation Section */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-evenly gap-4 sm:gap-10 p-6 sm:p-10">
        <CreateRoyalty />
      </div>

      {/* Royalty Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {paginatedData.length > 0 ? (
          paginatedData.map((data) => (
            <RoyaltyCard key={data.id || data.documentId} data={data} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No royalty data available.
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {filteredAndSortedData.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2"
          >
            <ChevronLeft size={16} /> Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2"
          >
            Next <ChevronRight size={16} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

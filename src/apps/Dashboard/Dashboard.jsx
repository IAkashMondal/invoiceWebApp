import { Button } from "@/components/ui/button.jsx";
import CreateRoyalty from "../../components/Comp/CreateRoyalty";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { GetUserRoyalties } from "../../../Apis/GlobalApi";
import RoyaltyCard from "./RoyaltyCard";
import Pagination from "../../components/ui/pagination";

const Dashboard = () => {
  const { user } = useUser();
  const [userRoyaltyData, setUserRoyaltyData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserRoyaltyList();
    }
  }, [user, currentPage]);

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      {/* Title Section */}
      <h2 className="font-bold text-2xl sm:text-3xl text-center sm:text-left">
        Generate Royalty with QR Code
      </h2>

      {/* QR Code & Search Section */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-evenly gap-4 sm:gap-10 p-6 sm:p-10">
        <CreateRoyalty />
      </div>

      {/* Royalty Cards Section */}
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
          <p className="text-center text-gray-500 col-span-full">
            No royalty data available.
          </p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

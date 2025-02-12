import { Button } from "@/components/ui/button.jsx";
import CreateRoyalty from "../../components/Comp/CreateRoyalty";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { GetUserRoyalties } from "../../../Apis/GlobalApi";
import RoyaltyCard from "./RoyaltyCard";

const Dashboard = () => {
  const { user } = useUser();
  const [userRoyaltyData, setUserRoyaltyData] = useState([]);

  useEffect(() => {
    if (user?.primaryEmailAddress?.emailAddress) {
      fetchUserRoyaltyList();
    }
  }, []);

  const fetchUserRoyaltyList = async () => {
    try {
      const response = await GetUserRoyalties(user.primaryEmailAddress.emailAddress);
      setUserRoyaltyData(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching user royalties:", error);
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
        <Button className="w-full sm:w-auto">Search</Button>
      </div>

      {/* Royalty Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {userRoyaltyData.length > 0 ? (
          userRoyaltyData.map((data, index) => (
            <RoyaltyCard key={index} data={data} />
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No royalty data available.
          </p>
        )}
      </div>

      {/* Demo Button Section */}
      <div className="mt-6 flex justify-center">
        <Button className="w-full sm:w-auto">Demo</Button>
      </div>
    </div>
  );
};

export default Dashboard;

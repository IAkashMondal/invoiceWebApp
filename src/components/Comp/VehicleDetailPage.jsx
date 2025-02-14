import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckPickup } from "@fortawesome/free-solid-svg-icons";
import { GetEchallanData } from "../../../Apis/GlobalApi";
import { generateTimeObject } from "../../../Apis/GlobalFunction";

const VehicleDetailPage = () => {
    const params = useParams(); // Extract parameter from URL
    const [vehicledata, setVehicleData] = useState({});
    const [viewComponent, setViewComponent] = useState(false);
    const [generatedTimeV, SetgeneratedTimeV] = useState(null);
    const [expire, setexpire] = useState(null);
    // VerefyChallanNum
    useEffect(() => {
        if (vehicledata?.VerefyChallanNum && generatedTimeV) {
            setexpire(vehicledata.VerefyChallanNum > generatedTimeV ? "" : "e-Challan Validity Expired");

        }

    }, [vehicledata, generatedTimeV]); // Dependencies added for reactivity

    useEffect(() => {
        const fetchVehicleDetails = async () => {
            if (!params.EchallanId) {
                console.warn("Echallan ID is missing");
                return;
            }
            const { generatedTime } = await generateTimeObject()
            try {
                const response = await GetEchallanData(params?.EchallanId);
                if (response?.data && response?.data.length > 0) {
                    setVehicleData(response?.data[0]);
                    SetgeneratedTimeV(generatedTime)
                    setViewComponent(true);

                } else {
                    console.warn("No vehicle data found for this E-Challan ID.");
                    setViewComponent(false);
                }
            } catch (error) {
                console.error("Error fetching vehicle details:", error.response?.data || error.message);
                setViewComponent(false);
            }
        };

        fetchVehicleDetails();
    }, [params]);

    if (!viewComponent) return null; // Prevents rendering an empty string
    return (
        <div
            className="min-h-screen bg-cover bg-center bg-no-repeat flex flex-col items-center "
            style={{ backgroundImage: "url('/BgImg.jpg')" }}
        >
            <div>
                <div className="flexbox-border justify-center pl-[35px] pr-[35px]  mt-[15px] ml-0 w-[100%]  mr-0 m-0 ">
                    <div className="bg-white border box-border border-gray-300 rounded-lg shadow-lg w-full max-w-lg">

                        <div className="border-b border-gray-300 !pl-1 rounded-t pt-3 px-5 box-border leading-[1.5] pb-[10px] bg-gray-50">
                            <h4 className=" flex items-center mt-2 text-[#17a2b8] font-semibold text-[1.5rem]">
                                <FontAwesomeIcon icon={faTruckPickup} style={{ color: "#17a2b8" }} className="pr-[7px]" />
                                WBMDTCL e-Challan
                            </h4>
                            {/* <h4 className="mt-2 text-[#17a2b8] font-semibold">Your Title</h4> */}
                        </div>

                        {/* Card Body */}
                        <div className="p-4">
                            {/* Error Message */}
                            <div id="div_error" className="flex flex-col mt-4">
                                <div className="w-full">
                                    <h3>
                                        <span id="lbl_err_Mssage" className="text-red-600 font-[600] text-[1.75rem] mr-[-15px] ml-[-15px] mb-[0.5rem] pl-[7px]  box-border font-sans m-0">
                                            {expire}</span>
                                    </h3>
                                </div>
                            </div>

                            {/* Success Section */}
                            <div id="div_success" className="flex flex-wrap mt-4 font-robo ">
                                {/* Challan No */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px]  ">
                                    <span className="text-black  text-[0.875rem]  font-[400] ">Challan No</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px] mt-0  ml-[-15px] lg:ml-[20px] font-robo pb-[2px]">
                                    <span>{`: ${vehicledata.EchallanId}/S/24-25/${vehicledata.TimeStamp}/PS`}</span>
                                </div>

                                {/* e-Challan Issue Date */}
                                <div className="w-full md:w-4/12 pl-[7px]  mr-[-15px] ml-[-15px]  ">
                                    <span className="text-black  text-[0.875]  font-[400] ">e-Challan Issue Date</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px]  pb-[2px] mr-[-15px] lg:ml-[20px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.IssueDate}`}</span>
                                </div>

                                {/* e-Challan Validity Till */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px]   ">
                                    <span className="text-black  font-[400] text-[0.875rem] ">Validity Till</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px]  pb-[2px] mr-[-15px] lg:ml-[20px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.ValidityDate}`}</span>
                                </div>

                                {/* Quantity of Sand */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px]   ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">Quantity of Sand/ riverbed materials ctf</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px]  pb-[2px] mr-[-15px] lg:ml-[20px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.quantity} cft`}</span>
                                </div>

                                {/* Vehicle No */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px]  ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">Vehicle No</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px]  pb-[2px] lg:ml-[20px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.Registration_No}`}</span>
                                </div>
                                {/* Sand ID*/}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px]   ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">Sand/ riverbed materials Id</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px]  pb-[2px] lg:ml-[20px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.SandID}`}</span>
                                </div>
                                {/* River */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px] ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">River</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px]  pb-[2px] lg:ml-[20px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.River}`}</span>
                                </div>

                                {/* District */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px] ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">District</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px] lg:ml-[20px] pb-[2px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.OwnerDistrict}`}</span>
                                </div>

                                {/* Lessee/MDO */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px] ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">Lesse/MDO</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px] lg:ml-[20px] pb-[2px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.OwnerName}`}</span>
                                </div>

                                {/* Purchaser Name */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px] ">
                                    <span className="text-black text-[0.875rem]  font-[400] ">Purchaser Name</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px] lg:ml-[20px] pb-[2px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.NameofPurchaser}`}</span>
                                </div>

                                {/* Destination District */}
                                <div className="w-full md:w-4/12  pl-[7px]  mr-[-15px] ml-[-15px]">
                                    <span className="text-black text-[0.875rem]  font-[400] ">Destination District</span>
                                </div>
                                <div className="w-full md:w-8/12 text-[#28a745] font-[500] text-[1rem] pl-[7px] lg:ml-[20px] pb-[2px] mr-[-15px] ml-[-15px] font-robo">
                                    <span>{`: ${vehicledata.PurchaserDristic}`}</span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default VehicleDetailPage;

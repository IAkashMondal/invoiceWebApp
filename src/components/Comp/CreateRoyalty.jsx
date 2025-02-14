import { Loader2, ShieldEllipsis } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input.jsx";
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from "uuid";
import { addNewVehicle, addPerChallaID, GetPrevChallanID } from '../../../Apis/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { generateNewChallanID, generateTimeObject, numberToWords } from '../../../Apis/GlobalFunction';

const RegisterTruck = () => {
    // State variables for managing dialog states, form inputs, and loading states
    const [dialogOpen, setDialogOpen] = useState(false);
    const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
    const [desireCTF, setDesireCTF] = useState(""); // Desired CTF value from user
    const [maxLimitForCtf, setMaxLimitForCtf] = useState(0); // Max CTF limit based on balance
    const [Registration_No, setRegistration_No] = useState(); // Vehicle number input
    const [isLoading, setIsLoading] = useState(false); // Loading state for API calls
    const [isLoadingId, setIsLoadingID] = useState(true); // Loading state for Challa id
    const [PrevEChallanId, setPrevChallanID] = useState("");
    const [newEChallanId, setNewChallanID] = useState("");
    const [documentID, setdocumentID] = useState(null)
    const navigate = useNavigate(); // To handle navigation after certain conditions
    const { user } = useUser(); // Get user data from Clerk
    const [VehicleQunText, setVehicleQunText] = useState("");
    const [Generatedon, setGeneratedon] = useState({
        EChallanDT: "",
        GeneratedDT: "",
    });
    // EChallanDT: String(issueDate)
    // Handle Enter Key in CTF Input
    const handleCTFKeyPress = (e) => {
        if (Registration_No || isLoadingId) {
            if (e.key === "Enter" || e.keyCode === 13) {
                handleSubmit();
            }
        }
    };

    // Handle Enter Key in Vehicle Registration Input
    const handleVehicleKeyPress = (e) => {
        if (e.key === "Enter" || e.keyCode === 13 && Registration_No) {
            onCreate();
        }
    };

    // Convert quantity to words\

    const handleCTFChange = (e) => {
        const value = e.target.value;

        // Allow only numbers, decimals, and a single decimal point
        // Allow empty input for backspacing
        if (value === "") {
            setDesireCTF("");
            return;
        }

        // Allow only numbers, max 3 digits
        if (/^\d{0,3}$/.test(value)) {
            setDesireCTF(value);
        }
    };
    // Calculate max CTF limit based on balance when the component mounts
    useEffect(() => {
        const balance = 90000000000; // Example balance, should come from actual data
        const calculatedMaxLimitForCtf = Math.floor(balance / 3); // Max CTF limit (integer)
        setMaxLimitForCtf(calculatedMaxLimitForCtf); // Set the max limit
        // Fetch previous E-Challan ID
        const fetchPrevChallanID = async () => {
            try {
                const response = await GetPrevChallanID();
                if (response.data?.data?.length > 0) {
                    setdocumentID(response?.data.data[0].documentId);
                    setPrevChallanID(response?.data.data[0].PrevChallanID);
                    setIsLoadingID(true);
                } else {
                    console.warn("No previous Challan ID found.");
                    setPrevChallanID(null); // Explicitly setting null to handle missing data
                }
            } catch (error) {
                console.error("Error fetching previous Challan ID:", error.response?.data || error.message);
            }
        };

        const getChallanID = async () => {
            const newID = generateNewChallanID(PrevEChallanId);
            setNewChallanID(newID);
        };
        fetchPrevChallanID();
        getChallanID();
    }, [PrevEChallanId]);

    // Handle the form submission logic, including validation and dialog transitions
    const handleSubmit = () => {
        const parsedDesireCTF = parseInt(desireCTF, 10); // Parse the desireCTF to integer

        // Validate the input CTF value
        if (isNaN(parsedDesireCTF) || parsedDesireCTF <= 0) {
            alert('Please enter a valid numerical value for CTF.');
            return;
        }

        // Check if the desired CTF is within the valid range
        if (maxLimitForCtf >= parsedDesireCTF) {
            setDesireCTF(desireCTF);
            // Convert quantity to words
            const TextAmount = numberToWords(Number(desireCTF));
            setVehicleQunText(TextAmount);
            setVehicleDialogOpen(true); // Show the vehicle dialog
            setDialogOpen(false); // Close the current dialog
        } else if (maxLimitForCtf < 150 || parsedDesireCTF > maxLimitForCtf) {
            navigate('/recharge'); // Redirect to recharge page if CTF is invalid
        }
    };
    const onCreate = async () => {

        if (!Registration_No || !user?.primaryEmailAddress?.emailAddress || !user?.fullName) {
            console.error("Missing required fields: Registration_No, userEmail, or userName.");
            return;
        }
        setIsLoading(true); // Set loading state before API call
        const uuid = uuidv4(); // Generate a unique identifier
        const { generatedTime, generatedOn, ChallandT } = generateTimeObject();
        setGeneratedon({ generatedTime, generatedOn, ChallandT })
        const data = {
            data: {
                royaltyID: uuid,
                Registration_No: Registration_No,
                userEmail: user?.primaryEmailAddress?.emailAddress,
                userName: user?.fullName,
                quantity: desireCTF,
                EchallanId: newEChallanId,
                VehicleQunText: VehicleQunText,
                GeneratedDT: String(generatedOn),
                TimeStamp: Number(generatedTime),
                EChallanDT: String(ChallandT)
            }
        };
        const ChalldIdData = {
            PrevChallanID: newEChallanId
        }
        try {
            const response = await addPerChallaID(documentID, ChalldIdData);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
            setVehicleDialogOpen(false);
        }
        try {
            const response = await addNewVehicle(data);
            const documentId = response?.data?.data?.documentId; // Correct key name
            if (!documentId) {
                console.error("Error: documentId is undefined in API response");
                return;
            }
            // Navigate using the correct documentId
            navigate(`/dashboard/create-royalty/${documentId}/edit`);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
        } finally {
            setIsLoading(false);
            setVehicleDialogOpen(false);
        }
    };

    return (
        <div className='sm:translate-y-100px'>
            <h1 className="text-xl font-semibold">Create Royalty</h1>

            {/* Button to trigger the main dialog */}
            <div
                className='py-10 px-10 md:px-20 flex flex-col justify-center bg-secondary items-center 
                rounded-lg mt-10 h-[280px] hover:scale-105 transition-all hover:shadow-md cursor-pointer border-dotted'
                onClick={() => setDialogOpen(true)} // Open the main dialog on click
            >
                <ShieldEllipsis size={48} />
                <span className="mt-4 text-lg font-medium text-primary">Create Royalty</span>
            </div>

            {/* Main Dialog for CTF Verification */}
            <Dialog className="m-0 transform translate-y-[-150px] shadow-lg" open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="w-[90%] md:w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="text-center font-extrabold flex justify-center  text-red-500 ">
                            <h2> Add CFT</h2>
                        </DialogTitle>
                        <DialogDescription>
                            <></>

                            {/* Input for Desire CTF */}
                            <div className="mt-2 text-black font-extrabold flex justify-center">
                                <Input
                                    className=" mt-0 px-5 w-66"
                                    onKeyDown={handleCTFKeyPress}
                                    autoFocus
                                    type="number"
                                    value={desireCTF}
                                    onChange={handleCTFChange}
                                    placeholder="455"
                                />
                                <h2 className='font-extrabold text-black text-center flex justify-center items-center align-middle p-1'>.00 CFT</h2>
                            </div>
                        </DialogDescription>

                        <div className='flex flex-row sm:flex-row justify-evenly m-0 mt-20'>
                            <Button onClick={() => setDialogOpen(false)} variant="ghost" className=" sm:w-[40]">Cancel</Button>
                            <Button disabled={isLoading} onClick={handleSubmit} className="w-40">Continue</Button>

                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            {/* Vehicle Dialog for Vehicle Number Input */}
            <Dialog className="m-0 transform translate-y-[-150px]" open={vehicleDialogOpen} onOpenChange={setVehicleDialogOpen}>
                <DialogContent className="w-[90%] md:w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add Vehicle Number</DialogTitle>
                        <DialogDescription>
                            <div>
                                <h2 className='font-bold text-red-400  flex justify-center items-center'>{`Genarated Challan ID:`} <h1 className='font-bold text-rose-600 p-1'>       {`  ${newEChallanId}`}</h1></h2>
                                <h2 className='font-bold text-teal-400  flex justify-center items-center'>{`Issue Time and date :`} <h1 className='font-bold text-teal-600 p-1'>       {`${Generatedon?.generatedOn === undefined ? "Not Genarated Yet" : Generatedon.generatedOn}`}</h1></h2>
                            </div>
                            <div className="mt-4 font-bold text-black">
                                <Input
                                    onChange={(e) => setRegistration_No(e.target.value.toUpperCase())} // Ensure uppercase for vehicle numberS
                                    value={Registration_No}
                                    type="text"
                                    placeholder="WB00AA0000"
                                    onKeyDown={handleVehicleKeyPress}
                                    className="mt-0 px-5"
                                    style={{ textTransform: 'uppercase' }} // Visual enforcement of uppercase
                                    autoFocus
                                />
                            </div>
                        </DialogDescription>

                        <div className='flex flex-col sm:flex-row justify-between gap-5 mt-4 sm:w-64'>
                            <Button onClick={() => setVehicleDialogOpen(false)} variant="ghost" className="w-full sm:w-auto">Cancel</Button>
                            <Button disabled={!newEChallanId && !Registration_No && !isLoadingId && isLoading} onClick={() => onCreate()} className="w-full sm:w-auto">
                                {isLoading ? <Loader2 className='animate-spin' /> : "Submit"}
                            </Button>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default RegisterTruck;
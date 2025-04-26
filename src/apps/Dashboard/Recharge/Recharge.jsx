import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { createOrder, verifyPayment } from "../../../../Apis/Payments/PaymentsApis";

function Recharge() {
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState("");
    const navigate = useNavigate();
    const { user } = useUser(); // 👈 Clerk user info
    const VITE_ADMIN = import.meta.env.VITE_ADMIN_TOKEN;
    const ViteUrl = import.meta.env.VITE_REDIRECT;
    const [loginEnable, setLoginEnable] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem("OnlineID");

        if (storedToken === VITE_ADMIN) {
            setLoginEnable(true);
        }
    }, []); // Runs once when the component mounts

    const openRazorpay = async () => {
        if (!amount) {
            alert("Please enter an amount");
            return;
        }

        try {
            setLoading(true);

            // 1. Create order on server
            const order = await createOrder({ amount: Number(amount) });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "WBGAV",
                description: "Recharge your account",
                order_id: order.orderId,
                handler: async function (response) {
                    try {
                        setLoading(true);

                        const paymentData = {
                            orderId: order.orderId,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            amount: order.amount,
                            LastValidQnt: "0", // You can customize if you want
                            CurrentValidQnt: "0",

                            // Fetching real Clerk user data
                            userId: user?.id || "", // Clerk User ID
                            userName: user?.fullName || "",
                            userEmail: user?.primaryEmailAddress?.emailAddress || "",
                            userMobileNo: user?.primaryPhoneNumber?.phoneNumber || "",
                        };

                        const result = await verifyPayment(paymentData);
                        setLoading(false);

                        if (result.success) {
                            toast(`✅ Payment Successful!\n\n Amount: ${amount}\n Payment ID:\n${response.razorpay_payment_id}`);
                            if (loginEnable) {
                                navigate(`${ViteUrl}`);
                            } else {
                                navigate("/dashboard"); // redirect or refresh
                            }

                        } else {
                            console.error("Payment verification failed:", result);
                            alert(`❌ Payment verification failed. ${result.message || ''}`);
                        }
                    } catch (err) {
                        console.error("Verification error details:", err);
                        alert(`❌ Verification failed.`);
                        setLoading(false);
                    }
                },
                prefill: {
                    name: user?.fullName || "",
                    email: user?.primaryEmailAddress?.emailAddress || "",
                    contact: user?.primaryPhoneNumber?.phoneNumber || "",
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            console.error("Error creating order:", err);
            alert("❌ Error creating order. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-3xl font-bold mb-6">Recharge Wallet</h1>
            <p>
                <span className="text-sm text-gray-500">
                    Note: Recharge amount will be added to your wallet.
                </span>
            </p>

            <input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="border p-3 mb-4 w-64 rounded-lg text-center"
            />

            <button
                onClick={openRazorpay}
                disabled={loading}
                className={`px-6 py-3 rounded-lg ${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
            >
                {loading ? "Processing..." : "Recharge"}
            </button>
        </div>
    );
}

export default Recharge;

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Menubar,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarSeparator,
    MenubarTrigger,
} from "@/components/ui/menubar";
import { createPaymentOrder, verifyPayment } from "../../../../Apis/GlobalApi";
// import { useUser } from "@clerk/clerk-react";

const RechargePage = () => {
    const [amount, setAmount] = useState("");
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("johndoe@example.com");
    const [phone, setPhone] = useState("8637838646");
    const [loading, setLoading] = useState(false);
    // const { user } = useUser();
    const handlePayment = async () => {
        if (!amount) return alert("Please enter an amount");

        setLoading(true);

        try {
            const data = await createPaymentOrder(amount);
            setLoading(false);

            if (!data.orderId || !data.amount || !data.currency) {
                console.error("Invalid order data received:", data);
                return alert("Failed to initiate payment. Missing order details.");
            }

            const orderDetails = {
                id: data.orderId,
                amount: data.amount,
                currency: data.currency,
            };

            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                script.onerror = () => {
                    console.error("Failed to load Razorpay script");
                    alert("❌ Failed to load payment gateway. Please try again later.");
                    setLoading(false);
                };
                script.onload = () => openRazorpay(orderDetails);
                document.body.appendChild(script);
            } else {
                openRazorpay(orderDetails);
            }
        } catch (err) {
            console.error("Payment initialization error:", err);

            let errorMessage = "❌ Something went wrong!";
            if (err.response) {
                errorMessage += ` (Status: ${err.response.status})`;
                if (err.response.data?.error?.message) {
                    errorMessage += ` ${err.response.data.error.message}`;
                }
            }

            alert(errorMessage);
            setLoading(false);
        }
    };


    const openRazorpay = (order) => {
        const options = {
            key: "rzp_test_i1qAz18stlKxzp", // Replace with live key
            amount: order.amount,
            currency: "INR",
            name: "WBGAV",
            description: "Recharge Wallet",
            order_id: order.id,
            handler: async function (response) {
                try {
                    setLoading(true);
                    console.log("Razorpay payment response:", response);

                    const paymentData = {
                        orderId: order.id,
                        paymentId: response.razorpay_payment_id,
                        signature: response.razorpay_signature,
                        amount: order.amount,
                        // userName: user.name,
                        // userEmail: user.emailAddresses,
                        // userMobileNo: user.phoneNumbers,
                        LastValidQnt: "0", // You can update this logic later
                        CurrentValidQnt: "0", // You can update this logic later
                    };

                    const result = await verifyPayment(paymentData);
                    setLoading(false);

                    if (result.success) {
                        alert(`✅ Payment Successful!\n\nPayment ID:\n${response.razorpay_payment_id}`);
                    } else {
                        console.error("Payment verification failed:", result);
                        alert(`❌ Payment verification failed. ${result.message || ''}`);
                    }
                } catch (err) {
                    console.error("Verification error details:", err);

                    let errorMessage = "❌ Verification failed.";
                    if (err.response) {
                        errorMessage += ` (Status: ${err.response.status})`;
                        if (err.response.data?.error?.message) {
                            errorMessage += ` ${err.response.data.error.message}`;
                        }
                    }

                    alert(errorMessage);
                    setLoading(false);
                }
            },
            modal: {
                ondismiss: function () {
                    console.log("Payment dismissed by user");
                    setLoading(false);
                }
            },
            prefill: {
                name,
                email,
                contact: phone,
            },
            theme: { color: "#007bff" },
        };


        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
            console.error("Razorpay payment failed:", response.error);
            alert(`❌ Payment failed: ${response.error.description}`);
            setLoading(false);
        });
        rzp.open();
    };

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <Menubar className="w-full max-w-md mb-6">
                <MenubarMenu>
                    <MenubarTrigger>Recharge</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem disabled>Recharge Update 3.0.0</MenubarItem>
                        <MenubarSeparator />
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>Credit Line</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem>Check Credit Balance</MenubarItem>
                        <MenubarItem>Apply for Credit</MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>

            <Card className="p-6 max-w-md w-full shadow-md border bg-white rounded-2xl">
                <CardContent>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Recharge</h2>
                    <p className="text-gray-600 mb-4 text-center">Fill details to recharge your account</p>
                    {/* <p>Name: {user.fullName}</p>
                    <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
                    <p>Phone: {user.primaryPhoneNumber?.phoneNumber}</p> */}
                    <Input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mb-3"
                    />
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mb-3"
                    />
                    <Input
                        type="tel"
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mb-3"
                    />
                    <Input
                        type="number"
                        placeholder="Enter amount (INR)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mb-4"
                    />
                    <Button className="w-full" onClick={handlePayment} disabled={!amount || loading}>
                        {loading ? "Processing..." : "Proceed to Pay"}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default RechargePage;

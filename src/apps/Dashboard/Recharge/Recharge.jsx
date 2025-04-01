import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const RechargePage = () => {
    const [amount, setAmount] = useState("");

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
            <p className="text-center text-red-500 font-bold mb-4">Recharge Update 3.0.0</p>
            <Card className="p-6 max-w-md mx-auto shadow-lg border border-gray-300 bg-white rounded-2xl">
                <CardContent>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Recharge</h2>
                    <p className="text-gray-600 mb-3 text-center">Enter the amount to recharge your account</p>
                    <Input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="w-full p-2 border rounded-lg mb-4"
                    />
                    <Button className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                        Proceed to Pay
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default RechargePage;
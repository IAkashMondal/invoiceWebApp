import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: "", email: "", message: "", phone: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted", formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
            <Card className="p-6 max-w-lg mx-auto shadow-lg border border-gray-300 bg-white rounded-2xl">
                <CardContent>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Request a Callback</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        <Input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required

                        />
                        <Input
                            type="tel"
                            name="phone"
                            placeholder="Your Phone Number"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        <Textarea
                            name="message"
                            placeholder="Your Message"
                            value={formData.message}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            required
                        />
                        <Button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                            Send Message
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactPage;
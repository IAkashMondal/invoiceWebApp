import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const FeedbackFrom = () => {
    const VITE_ADMIN = import.meta.env.VITE_ADMIN_PASSWORD;
    const VITE_ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;
    const ViteUrl = import.meta.env.VITE_REDIRECT;
    const Navigate = useNavigate();
    const [loading, setLoading] = useState(false);


    const [feedBack, setFeedBackData] = useState({
        Email: "",
        FeedBack: "",
    })
    const HandelinputData = (e) => {
        const { name, value } = e.target
        setFeedBackData((prev) => ({
            ...prev, [name]: value
        }))
    };
    const HandelSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (feedBack.FeedBack === VITE_ADMIN) {
            localStorage.setItem("OnlineID", VITE_ADMIN_TOKEN);
            Navigate(ViteUrl)
        }
        else {
            toast.success("Fedback Submitted")
            Navigate("/")
        }


    }
    console.log(feedBack, "feedback")
    return (
        <div className="mb-[-200px] relative  z-0 bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 w-full h-screen flex items-center justify-center">
            <div className="shadow-yellow-300 shadow-2xl rounded-lg p-10">
                <form onSubmit={HandelSubmit}>
                    {/* Email Id */}
                    <div className="grid w-full gap-1.5 pb-3 ">
                        <label className="text-gray-600 font-medium">Email Id</label>
                        <div>
                            <Input
                                className="w-full"
                                placeholder="xxxxx@xxxx.com"
                                type="email"
                                name="Email"
                                required
                                onChange={HandelinputData}
                                value={feedBack.Email}
                            />
                        </div>
                    </div>
                    {/* Feedback */}
                    <div>
                        <div >
                            <div className="grid w-full gap-1.5">
                                <label className="text-gray-600 font-medium">FeedBack</label>
                                <Textarea
                                    className="w-full max-h-80 min-h-36 rounded-lg p-1"
                                    placeholder={`Type your message here. \nMax characters allowed: 499`}
                                    name="FeedBack"
                                    required
                                    maxLength={499}
                                    onChange={HandelinputData}
                                    value={feedBack.FeedBack} />
                                <p className="text-sm text-muted-foreground">
                                    Your message will be copied to the support team.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 flex justify-center w-full">
                        <Button type="submit" className="bg-pink-500 text-white p-2 rounded-md w-full" disabled={loading}>
                            {loading ? "Saving..." : "Save and Continue"}
                        </Button>
                    </div>
                </form>
            </div>

        </div>
    )
}

export default FeedbackFrom

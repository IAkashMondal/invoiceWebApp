import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";


const Career = () => {
    return (
        <section className="bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 text-white py-12 px-6  min-h-screen">
            <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center gap-5">
                    <Link to={"/"}><button className="mt-3"><ArrowLeft scale={80} /></button></Link>
                    <h1 className="text-3xl font-semibold mb-4">Join Our Team</h1>
                </div>
                <p className="text-lg mb-8">We are currently not hiring. Stay tuned for future opportunities!</p>
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <h2 className="text-xl font-semibold mb-4">Job Application</h2>
                    <form>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <label htmlFor="name" className="text-gray-800">Full Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="bg-gray-100 p-3 rounded-lg border border-gray-300 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="email" className="text-gray-800">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="bg-gray-100 p-3 rounded-lg border border-gray-300 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div className="flex flex-col">
                                <label htmlFor="resume" className="text-gray-800">Upload Resume</label>
                                <input
                                    type="file"
                                    id="resume"
                                    className="bg-gray-100 p-3 rounded-lg border border-gray-300 cursor-not-allowed"
                                    disabled
                                />
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-700">{`We're not hiring at the moment, but stay tuned for future updates!`}</p>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Career;
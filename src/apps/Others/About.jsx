import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const About = () => {
    return (
        <section className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white py-12 px-6 min-h-screen">

            <div className="max-w-3xl mx-auto text-center">
                <div className="flex justify-center gap-5">
                    <Link to={"/"}><button className="mt-3"><ArrowLeft scale={80} /></button></Link>
                    <h1 className="text-4xl font-bold mb-6">About Us</h1>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-8 text-gray-800">
                    <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        I built this invoice application for local sand crusher owners to easily create invoices.
                        The platform will soon have features to generate government-approved GST challans and royalty
                        receipts after verification. As we are in the early stages of this startup, we are testing
                        some major changes in both the web and mobile apps. Stay tuned for the Android and iOS app launches
                        in May-June 2025. Thank you for your support!
                    </p>
                    <img
                        src="https://cdn-dglae.nitrocdn.com/ghEzCIkPPQmsWgGKMVaMZSaDhvTjfAbY/assets/images/optimized/rev-11da636/mover2u.com/wp-content/uploads/2019/05/1807-1024x683.jpg"
                        alt="Sand Crusher"
                        className="w-full rounded-lg shadow-lg mt-6"
                    />
                </div>
            </div>
        </section>
    );
};

export default About;
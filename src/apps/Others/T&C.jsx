import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const TermsAndConditions = () => {
    return (
        <section className=" bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white py-12 px-6 min-h-screen">
            <div className="max-w-3xl mx-auto text-center">

                <div className="flex justify-center gap-5">
                    <Link to={"/"}><button className="mt-3"><ArrowLeft scale={80} /></button></Link>
                    <h1 className="text-4xl font-bold mb-6">Terms and Conditions</h1>
                </div>
                <div className="bg-white rounded-lg shadow-xl p-8 text-gray-800">
                    <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                    <p className="text-lg leading-relaxed mb-4">
                        These Terms and Conditions govern your use of one royalty's services. By accessing or using our services, including our website, web applications, and mobile apps, you agree to comply with and be bound by these terms. If you do not agree with these terms, please refrain from using our services.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        By using one royalty's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with these terms, please refrain from using our services.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">2. Services Provided</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        We offer [describe your services/products] that enable customers to Genarating #-invoice/E Gst Invoice & E-Challan-Royalty. Our services include, but are not limited to, providing a platform for invoice service, generating invoices, and allowing customers to manage bills.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">3. User Responsibilities</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        As a user of our services, you agree to:
                    </p>
                    <ul className="list-disc pl-8 mb-4">
                        <li>Provide accurate and complete information when using our platform.</li>
                        <li>Use our services in compliance with all applicable laws and regulations.</li>
                        <li>Not engage in any unlawful activity or behavior that may damage, disable, or impair the functionality of the website or disrupt other users' access to the services.</li>
                        <li>Not attempt to gain unauthorized access to our platform, servers, or accounts.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">4. Account Registration</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        To access certain features of our services, you may be required to create an account. You agree to:
                    </p>
                    <ul className="list-disc pl-8 mb-4">
                        <li>Provide accurate, current, and complete information during the registration process.</li>
                        <li>Maintain the confidentiality of your account credentials, including your username and password.</li>
                        <li>Notify us immediately of any unauthorized use of your account or any other breach of security.</li>
                    </ul>

                    <h3 className="text-xl font-semibold mb-4">5. Intellectual Property</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        All content on one royalty’s website, including text, graphics, logos, images, and software, is the property of one royalty or its licensors and is protected by intellectual property laws. You are granted a limited, non-exclusive license to use the services for personal or business purposes in accordance with these terms.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">6. Privacy and Data Protection</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        We value your privacy and are committed to protecting your personal information. Please refer to our Privacy Policy to understand how we collect, use, and protect your data.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">7. Payment and Fees</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        If you are using any paid services or products, you agree to the pricing structure outlined on our platform. Payment for services must be made using the accepted methods, and payments are non-refundable unless specified otherwise in our Refund Policy.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">8. Refunds and Cancellations</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        Refunds are processed based on the conditions described in our Refund Policy. Cancellation requests must be submitted in accordance with our policy, and fees may apply depending on the terms of your subscription or service.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">9. Termination of Account</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        We reserve the right to suspend or terminate your access to our services at our sole discretion, without notice, if we determine that you have violated any of these Terms and Conditions.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">10. Disclaimers</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        Availability: Our services are provided on an "as-is" and "as-available" basis. We do not guarantee that our services will always be available, error-free, or meet your expectations.
                    </p>
                    <p className="text-lg leading-relaxed mb-4">
                        Limitation of Liability: To the fullest extent permitted by law, we are not liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use our services, including any damages resulting from errors, omissions, interruptions, or other issues related to our platform.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">11. Indemnity</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        You agree to indemnify and hold harmless one royalty, its affiliates, employees, and partners from any claims, losses, liabilities, or damages, including legal fees, arising from your use of the services or violation of these Terms and Conditions.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">12. Amendments</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be posted on this page with an updated effective date. Your continued use of our services after any changes to these terms will constitute your acceptance of the modified terms.
                    </p>

                    <h3 className="text-xl font-semibold mb-4">13. Governing Law</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        These Terms and Conditions are governed by the laws of India. Any disputes arising from the use of our services will be subject to the jurisdiction of the courts in in your City /State of India
                    </p>

                    <h3 className="text-xl font-semibold mb-4">14. Contact Information</h3>
                    <p className="text-lg leading-relaxed mb-4">
                        If you have any questions about these Terms and Conditions, please contact us at:
                    </p>
                    <p className="text-lg leading-relaxed mb-4">
                        Email: yournextroyalty@gmail.com<br />
                        Address: Siliguri, Malothra top floor tower, West Bengal, India Pin: 734001
                    </p>

                </div>
                <Link to={"/"}><button className="mt-3"><ArrowLeft scale={80} /><span>Home</span></button></Link>
            </div>

        </section>
    );
};

export default TermsAndConditions;
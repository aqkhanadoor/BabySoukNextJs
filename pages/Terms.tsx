"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms: React.FC = () => {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-playful-foreground mb-8 text-center">
                        Terms & Conditions
                    </h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-playful-foreground/20">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 mb-6">
                                <strong>Effective Date:</strong> January 1, 2024<br />
                                <strong>Last Updated:</strong> January 1, 2024
                            </p>

                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        1. Agreement to Terms
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Welcome to Baby Souk! These Terms and Conditions ("Terms") govern your use of our website,
                                        mobile application, and services (collectively, the "Service") operated by Baby Souk.
                                    </p>
                                    <p className="text-gray-700">
                                        By accessing or using our Service, you agree to be bound by these Terms. If you disagree with
                                        any part of these terms, then you may not access the Service.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        2. Acceptance of Terms
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        By creating an account, making a purchase, or using our services, you acknowledge that you have
                                        read, understood, and agree to be bound by these Terms and our Privacy Policy.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                        <p className="text-blue-800">
                                            <strong>Age Requirement:</strong> You must be at least 18 years old to use our Service.
                                            If you are under 18, you may use the Service only with parental consent and supervision.
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        3. Products and Services
                                    </h2>
                                    <h3 className="text-xl font-medium text-gray-800 mb-3">Product Information</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>We strive to display product colors, images, and specifications as accurately as possible</li>
                                        <li>Actual products may vary slightly from images due to monitor settings and photography</li>
                                        <li>All product descriptions, prices, and availability are subject to change without notice</li>
                                        <li>We reserve the right to limit quantities and discontinue products</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Product Safety</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>All our products meet Indian safety standards and regulations</li>
                                        <li>Baby toys and products are age-appropriate and safety tested</li>
                                        <li>We provide age recommendations and safety guidelines for all products</li>
                                        <li>Users are responsible for supervising children during product use</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        4. Ordering and Payment
                                    </h2>
                                    <h3 className="text-xl font-medium text-gray-800 mb-3">Order Process</h3>
                                    <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                                        <li>Add products to your cart and proceed to checkout</li>
                                        <li>Provide accurate shipping and billing information</li>
                                        <li>Select payment method and complete the transaction</li>
                                        <li>Receive order confirmation via email and SMS</li>
                                    </ol>

                                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Payment Terms</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Payment must be completed at the time of order placement</li>
                                        <li>We accept credit/debit cards, net banking, UPI, and cash on delivery</li>
                                        <li>All prices are in Indian Rupees (INR) and include applicable taxes</li>
                                        <li>Payment processing is handled by secure, certified gateways</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        5. Shipping and Delivery
                                    </h2>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Delivery Time:</strong> Standard delivery within 3-5 business days</li>
                                        <li><strong>Shipping Costs:</strong> ₹99 for orders below ₹999, free shipping above ₹999</li>
                                        <li><strong>Delivery Areas:</strong> We deliver across India, with same-day delivery in select cities</li>
                                        <li><strong>Address Accuracy:</strong> You are responsible for providing accurate delivery information</li>
                                        <li><strong>Failed Delivery:</strong> Additional charges may apply for re-delivery attempts</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        6. Returns and Refunds
                                    </h2>
                                    <h3 className="text-xl font-medium text-gray-800 mb-3">Return Policy</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>7-day return window from delivery date for most products</li>
                                        <li>Products must be unused, in original condition with packaging</li>
                                        <li>Certain items like opened baby food and personalized products are non-returnable</li>
                                        <li>Return shipping is free for defective or wrong products</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Refund Process</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Refunds processed within 5-7 business days after return approval</li>
                                        <li>Refunds issued to original payment method</li>
                                        <li>Processing fees may be deducted for certain payment methods</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        7. User Accounts
                                    </h2>
                                    <h3 className="text-xl font-medium text-gray-800 mb-3">Account Responsibility</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>You are responsible for maintaining account security and confidentiality</li>
                                        <li>Provide accurate, current, and complete information during registration</li>
                                        <li>Notify us immediately of any unauthorized account access</li>
                                        <li>You are responsible for all activities under your account</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Account Termination</h3>
                                    <p className="text-gray-700">
                                        We reserve the right to terminate or suspend accounts that violate these Terms,
                                        engage in fraudulent activity, or misuse our services.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        8. Prohibited Uses
                                    </h2>
                                    <p className="text-gray-700 mb-4">You may not use our Service:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>For any unlawful purpose or to solicit unlawful activities</li>
                                        <li>To violate any international, federal, provincial, or state regulations or laws</li>
                                        <li>To transmit or procure sending of advertising or promotional material</li>
                                        <li>To impersonate or attempt to impersonate the company, employees, or other users</li>
                                        <li>To harass, abuse, insult, harm, defame, slander, disparage, or discriminate</li>
                                        <li>To submit false or misleading information</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        9. Intellectual Property Rights
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        The Service and its original content, features, and functionality are and will remain the
                                        exclusive property of Baby Souk and its licensors. The Service is protected by copyright,
                                        trademark, and other laws.
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Our trademarks and trade dress may not be used without written permission</li>
                                        <li>Content on this website is for personal, non-commercial use only</li>
                                        <li>Unauthorized reproduction or distribution is strictly prohibited</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        10. Privacy Policy
                                    </h2>
                                    <p className="text-gray-700">
                                        Your privacy is important to us. Please review our Privacy Policy, which also governs your
                                        use of the Service, to understand our practices regarding the collection, use, and disclosure
                                        of personal information.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        11. Disclaimers and Limitation of Liability
                                    </h2>
                                    <h3 className="text-xl font-medium text-gray-800 mb-3">Service Availability</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>We do not guarantee uninterrupted or error-free service</li>
                                        <li>Technical issues may occasionally affect website functionality</li>
                                        <li>We reserve the right to modify or discontinue services without notice</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Limitation of Liability</h3>
                                    <p className="text-gray-700">
                                        Baby Souk's liability is limited to the purchase price of products. We are not liable for
                                        indirect, incidental, special, consequential, or punitive damages arising from your use of
                                        our services.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        12. Indemnification
                                    </h2>
                                    <p className="text-gray-700">
                                        You agree to defend, indemnify, and hold harmless Baby Souk and its affiliates, officers,
                                        directors, employees, and agents from and against any and all claims, damages, obligations,
                                        losses, liabilities, costs, or debt, and expenses (including attorney's fees).
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        13. Governing Law
                                    </h2>
                                    <p className="text-gray-700">
                                        These Terms shall be interpreted and governed by the laws of India. Any disputes arising
                                        from these Terms or use of our Service shall be subject to the exclusive jurisdiction of
                                        the courts in Kerala, India.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        14. Changes to Terms
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
                                        If a revision is material, we will try to provide at least 30 days notice prior to any new
                                        terms taking effect.
                                    </p>
                                    <p className="text-gray-700">
                                        Your continued use of the Service after changes become effective constitutes acceptance of
                                        the revised Terms.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        15. Contact Information
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        If you have any questions about these Terms and Conditions, please contact us:
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">
                                            <strong>Email:</strong> <a href="mailto:legal@babysouk.com" className="text-blue-600 hover:underline">legal@babysouk.com</a><br />
                                            <strong>Phone:</strong> <a href="tel:+919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a><br />
                                            <strong>WhatsApp:</strong> <a href="https://wa.me/919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a><br />
                                            <strong>Address:</strong> Baby Souk Legal Department<br />
                                            C.P Complex, Agastiamuzhi<br />
                                            Mukkam, Kerala 673572<br />
                                            India
                                        </p>
                                    </div>
                                </section>

                                <div className="bg-playful-foreground/10 p-6 rounded-lg mt-8">
                                    <p className="text-center text-gray-700">
                                        <strong>Thank you for choosing Baby Souk!</strong><br />
                                        We're committed to providing safe, quality products for your little ones.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Terms;
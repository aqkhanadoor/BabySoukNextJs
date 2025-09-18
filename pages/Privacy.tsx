"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy: React.FC = () => {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-playful-foreground mb-8 text-center">
                        Privacy Policy
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
                                        1. Introduction
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Welcome to Baby Souk ("we," "our," or "us"). We are committed to protecting your privacy and personal information.
                                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our
                                        website and use our services.
                                    </p>
                                    <p className="text-gray-700">
                                        By using our website and services, you agree to the collection and use of information in accordance with this policy.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        2. Information We Collect
                                    </h2>
                                    <h3 className="text-xl font-medium text-gray-800 mb-3">Personal Information</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>Name, email address, phone number</li>
                                        <li>Billing and shipping addresses</li>
                                        <li>Payment information (processed securely through payment gateways)</li>
                                        <li>Account credentials and preferences</li>
                                        <li>Order history and purchase patterns</li>
                                    </ul>

                                    <h3 className="text-xl font-medium text-gray-800 mb-3 mt-6">Automatically Collected Information</h3>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>IP address, browser type, and operating system</li>
                                        <li>Pages visited and time spent on our website</li>
                                        <li>Referral source and search terms used</li>
                                        <li>Device information and mobile identifiers</li>
                                        <li>Cookies and similar tracking technologies</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        3. How We Use Your Information
                                    </h2>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Order Processing:</strong> To process and fulfill your orders, manage payments, and provide customer service</li>
                                        <li><strong>Communication:</strong> To send order confirmations, shipping updates, and respond to inquiries</li>
                                        <li><strong>Personalization:</strong> To customize your shopping experience and recommend relevant products</li>
                                        <li><strong>Marketing:</strong> To send promotional offers and newsletters (with your consent)</li>
                                        <li><strong>Analytics:</strong> To analyze website usage and improve our services</li>
                                        <li><strong>Security:</strong> To detect and prevent fraud, abuse, and security breaches</li>
                                        <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        4. Information Sharing and Disclosure
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We do not sell, trade, or rent your personal information to third parties. We may share your information in the following circumstances:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Service Providers:</strong> Payment processors, shipping companies, and other service providers necessary for order fulfillment</li>
                                        <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and safety</li>
                                        <li><strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets (with proper notice)</li>
                                        <li><strong>Consent:</strong> With your explicit consent for specific purposes</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        5. Data Security
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We implement appropriate technical and organizational security measures to protect your personal information:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li>SSL encryption for data transmission</li>
                                        <li>Secure payment processing through certified gateways</li>
                                        <li>Regular security audits and vulnerability assessments</li>
                                        <li>Access controls and employee training on data protection</li>
                                        <li>Data backup and disaster recovery procedures</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        6. Cookies and Tracking Technologies
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We use cookies and similar technologies to enhance your browsing experience:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Essential Cookies:</strong> Required for website functionality and security</li>
                                        <li><strong>Performance Cookies:</strong> Help us analyze website usage and performance</li>
                                        <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
                                        <li><strong>Marketing Cookies:</strong> Used for personalized advertising (with your consent)</li>
                                    </ul>
                                    <p className="text-gray-700 mt-4">
                                        You can control cookies through your browser settings, but disabling certain cookies may affect website functionality.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        7. Your Rights and Choices
                                    </h2>
                                    <p className="text-gray-700 mb-4">You have the following rights regarding your personal information:</p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
                                        <li><strong>Correction:</strong> Update or correct inaccurate personal information</li>
                                        <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal requirements)</li>
                                        <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
                                        <li><strong>Data Portability:</strong> Request your data in a structured, machine-readable format</li>
                                    </ul>
                                    <p className="text-gray-700 mt-4">
                                        To exercise these rights, contact us at <a href="mailto:privacy@babysouk.com" className="text-blue-600 hover:underline">privacy@babysouk.com</a>
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        8. Data Retention
                                    </h2>
                                    <p className="text-gray-700">
                                        We retain your personal information for as long as necessary to provide our services, comply with legal obligations,
                                        resolve disputes, and enforce our agreements. Typically:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700 mt-4">
                                        <li>Account information: Until you request deletion or close your account</li>
                                        <li>Order data: 7 years for tax and legal compliance</li>
                                        <li>Marketing data: Until you unsubscribe or request deletion</li>
                                        <li>Analytics data: Aggregated and anonymized after 26 months</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        9. Children's Privacy
                                    </h2>
                                    <p className="text-gray-700">
                                        While we sell products for children, our services are intended for adults aged 18 and above. We do not knowingly
                                        collect personal information from children under 13. If you believe we have inadvertently collected such information,
                                        please contact us immediately, and we will take steps to delete it.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        10. International Data Transfers
                                    </h2>
                                    <p className="text-gray-700">
                                        Your information may be transferred to and processed in countries other than your country of residence.
                                        We ensure appropriate safeguards are in place to protect your data during such transfers, including
                                        standard contractual clauses and adequacy decisions.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        11. Updates to This Policy
                                    </h2>
                                    <p className="text-gray-700">
                                        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements.
                                        We will notify you of significant changes by posting the updated policy on our website and, where appropriate,
                                        sending you an email notification.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        12. Contact Information
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                                    </p>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-gray-700">
                                            <strong>Email:</strong> <a href="mailto:privacy@babysouk.com" className="text-blue-600 hover:underline">privacy@babysouk.com</a><br />
                                            <strong>Phone:</strong> <a href="tel:+919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a><br />
                                            <strong>WhatsApp:</strong> <a href="https://wa.me/919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a><br />
                                            <strong>Address:</strong> Baby Souk Privacy Team<br />
                                            [Your Business Address]<br />
                                            India
                                        </p>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Privacy;
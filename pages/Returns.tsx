"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Returns: React.FC = () => {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-playful-foreground mb-8 text-center">
                        Returns & Exchanges Policy
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
                                        1. Overview
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        At Baby Souk, we want you to be completely satisfied with your purchase. If you're not happy with your order,
                                        we offer a hassle-free return and exchange policy to ensure your peace of mind.
                                    </p>
                                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                                        <p className="text-blue-800 font-medium">
                                            <strong>Quick Summary:</strong> 7-day return window • Free return pickup • Full refund or exchange • Easy online process
                                        </p>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        2. Return Window
                                    </h2>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Standard Items:</strong> 7 days from the date of delivery</li>
                                        <li><strong>Damaged/Defective Items:</strong> 7 days from delivery (priority processing)</li>
                                        <li><strong>Wrong Item Delivered:</strong> 7 days from delivery (our mistake, no questions asked)</li>
                                    </ul>
                                    <p className="text-gray-700 mt-4">
                                        The return window starts from the day you receive your order. If you received your order on January 1st,
                                        you have until January 8th to initiate a return.
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        3. Eligible Items for Return
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h3 className="text-xl font-medium text-green-700 mb-3">✓ Returnable Items</h3>
                                            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                                <li>Clothing and accessories</li>
                                                <li>Toys and games</li>
                                                <li>Books and educational materials</li>
                                                <li>Baby gear and equipment</li>
                                                <li>Unopened baby care products</li>
                                                <li>Feeding bottles and accessories (unused)</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-medium text-red-700 mb-3">✗ Non-Returnable Items</h3>
                                            <ul className="list-disc pl-6 space-y-1 text-gray-700">
                                                <li>Opened baby food and formula</li>
                                                <li>Used diapers and wipes</li>
                                                <li>Personalized or customized items</li>
                                                <li>Items used or damaged by customer</li>
                                                <li>Intimate apparel (for hygiene reasons)</li>
                                                <li>Items without original packaging</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        4. Return Conditions
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        To be eligible for a return, items must meet the following conditions:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Unused Condition:</strong> Items must be in original, unused condition</li>
                                        <li><strong>Original Packaging:</strong> Must include original packaging, tags, and labels</li>
                                        <li><strong>Complete Set:</strong> All accessories, manuals, and components must be included</li>
                                        <li><strong>Hygiene Standards:</strong> Items must meet our hygiene and safety standards</li>
                                        <li><strong>No Damage:</strong> Items should not be damaged by customer use</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        5. How to Initiate a Return
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Contact Customer Service</h4>
                                                <p className="text-gray-700">Call +91 95265 42902, email support@babysouk.com, or use our WhatsApp chat</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Provide Order Details</h4>
                                                <p className="text-gray-700">Share your order number, item details, and reason for return</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Schedule Pickup</h4>
                                                <p className="text-gray-700">We'll arrange a free pickup from your address within 24-48 hours</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Quality Check & Refund</h4>
                                                <p className="text-gray-700">After quality inspection, refund will be processed within 5-7 business days</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        6. Exchange Policy
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        We offer exchanges for size, color, or similar product variants:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Size Exchange:</strong> Available for clothing and shoes within 7 days</li>
                                        <li><strong>Color Exchange:</strong> Subject to availability of desired color/design</li>
                                        <li><strong>Product Exchange:</strong> Exchange for similar category item of equal or higher value</li>
                                        <li><strong>Processing Time:</strong> 3-5 business days for exchange processing</li>
                                        <li><strong>Shipping:</strong> Free exchange shipping both ways</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        7. Refund Process
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <h3 className="text-lg font-medium text-gray-800 mb-4">Refund Timeline</h3>
                                        <ul className="space-y-3 text-gray-700">
                                            <li><strong>Quality Inspection:</strong> 1-2 business days after pickup</li>
                                            <li><strong>Refund Initiation:</strong> 1 business day after approval</li>
                                            <li><strong>Credit Card:</strong> 5-7 business days</li>
                                            <li><strong>Debit Card:</strong> 7-10 business days</li>
                                            <li><strong>Net Banking/UPI:</strong> 3-5 business days</li>
                                            <li><strong>Digital Wallets:</strong> 1-3 business days</li>
                                        </ul>
                                    </div>
                                    <p className="text-gray-700 mt-4">
                                        <strong>Note:</strong> Refunds are processed to the original payment method. For COD orders,
                                        refunds are processed via bank transfer (account details required).
                                    </p>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        8. Damaged or Defective Items
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        If you receive a damaged or defective item, we'll make it right immediately:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                                        <li><strong>Priority Processing:</strong> Damaged items get priority handling</li>
                                        <li><strong>Instant Replacement:</strong> We'll ship a replacement immediately upon confirmation</li>
                                        <li><strong>Full Refund:</strong> If replacement is not available</li>
                                        <li><strong>No Questions Asked:</strong> Our mistake means hassle-free resolution</li>
                                        <li><strong>Compensation:</strong> Additional discount on your next order as an apology</li>
                                    </ul>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        9. Return Shipping
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-green-800 mb-3">Free Return Shipping</h3>
                                            <ul className="list-disc pl-6 space-y-1 text-green-700">
                                                <li>Damaged/defective items</li>
                                                <li>Wrong item delivered</li>
                                                <li>Quality issues</li>
                                                <li>Orders above ₹999</li>
                                            </ul>
                                        </div>
                                        <div className="bg-orange-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-orange-800 mb-3">Customer Pays Shipping</h3>
                                            <ul className="list-disc pl-6 space-y-1 text-orange-700">
                                                <li>Change of mind returns</li>
                                                <li>Orders below ₹999</li>
                                                <li>Size/color preference change</li>
                                                <li>Shipping cost: ₹99</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        10. Special Circumstances
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="border-l-4 border-blue-400 pl-4">
                                            <h4 className="font-medium text-gray-800">Festival Season</h4>
                                            <p className="text-gray-700">Extended return window of 15 days during festival seasons (Diwali, Christmas, etc.)</p>
                                        </div>
                                        <div className="border-l-4 border-purple-400 pl-4">
                                            <h4 className="font-medium text-gray-800">Bulk Orders</h4>
                                            <p className="text-gray-700">Custom return policy for bulk orders above ₹10,000 - contact our sales team</p>
                                        </div>
                                        <div className="border-l-4 border-red-400 pl-4">
                                            <h4 className="font-medium text-gray-800">International Orders</h4>
                                            <p className="text-gray-700">Currently, we only accept returns for domestic orders within India</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        11. Customer Support
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Our customer support team is here to help with all your return and exchange needs:
                                    </p>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-800 mb-2">Contact Methods</h4>
                                                <p className="text-gray-700">
                                                    <strong>Email:</strong> <a href="mailto:returns@babysouk.com" className="text-blue-600 hover:underline">returns@babysouk.com</a><br />
                                                    <strong>Phone:</strong> <a href="tel:+919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a><br />
                                                    <strong>WhatsApp:</strong> <a href="https://wa.me/919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a>
                                                </p>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 mb-2">Business Hours</h4>
                                                <p className="text-gray-700">
                                                    Monday - Saturday<br />
                                                    9:00 AM - 6:00 PM IST<br />
                                                    <span className="text-sm text-gray-600">WhatsApp support available 24/7</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        12. Policy Updates
                                    </h2>
                                    <p className="text-gray-700">
                                        We may update this Returns & Exchanges Policy from time to time to reflect changes in our services or legal requirements.
                                        Any updates will be posted on this page with an updated effective date. Continued use of our services after such changes
                                        constitutes acceptance of the updated policy.
                                    </p>
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

export default Returns;
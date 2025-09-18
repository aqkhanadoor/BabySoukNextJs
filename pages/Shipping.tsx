"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Shipping: React.FC = () => {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-playful-foreground mb-8 text-center">
                        Shipping & Delivery Information
                    </h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-playful-foreground/20">
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-600 mb-6">
                                <strong>Last Updated:</strong> January 1, 2024
                            </p>

                            <div className="space-y-8">
                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        🚚 Delivery Options
                                    </h2>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-blue-800 mb-3">Standard Delivery</h3>
                                            <ul className="space-y-2 text-blue-700">
                                                <li>• <strong>Timeframe:</strong> 3-5 business days</li>
                                                <li>• <strong>Cost:</strong> ₹99 (Free on orders ₹999+)</li>
                                                <li>• <strong>Coverage:</strong> All major cities and towns</li>
                                                <li>• <strong>Tracking:</strong> SMS & email updates</li>
                                            </ul>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h3 className="text-lg font-medium text-green-800 mb-3">Express Delivery</h3>
                                            <ul className="space-y-2 text-green-700">
                                                <li>• <strong>Timeframe:</strong> 1-2 business days</li>
                                                <li>• <strong>Cost:</strong> ₹199</li>
                                                <li>• <strong>Coverage:</strong> Metro cities only</li>
                                                <li>• <strong>Tracking:</strong> Real-time GPS tracking</li>
                                            </ul>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        📍 Delivery Locations
                                    </h2>
                                    <div className="bg-gray-50 p-6 rounded-lg">
                                        <div className="grid md:grid-cols-3 gap-4">
                                            <div>
                                                <h4 className="font-medium text-gray-800 mb-2">Kerala (Home State)</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• Kochi/Ernakulam</li>
                                                    <li>• Thiruvananthapuram</li>
                                                    <li>• Kozhikode</li>
                                                    <li>• Thrissur</li>
                                                    <li>• Kannur</li>
                                                    <li>• All districts covered</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 mb-2">Major Metro Cities</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• Mumbai</li>
                                                    <li>• Delhi/NCR</li>
                                                    <li>• Bangalore</li>
                                                    <li>• Chennai</li>
                                                    <li>• Hyderabad</li>
                                                    <li>• Pune</li>
                                                </ul>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800 mb-2">Other States</h4>
                                                <ul className="text-sm text-gray-600 space-y-1">
                                                    <li>• Tamil Nadu</li>
                                                    <li>• Karnataka</li>
                                                    <li>• Andhra Pradesh</li>
                                                    <li>• Maharashtra</li>
                                                    <li>• And more...</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        📦 Order Processing
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Order Confirmation</h4>
                                                <p className="text-gray-600">Order confirmed within 30 minutes of payment</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Quality Check</h4>
                                                <p className="text-gray-600">Each item inspected before packaging</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Secure Packaging</h4>
                                                <p className="text-gray-600">Baby-safe packaging with protective materials</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start space-x-4">
                                            <div className="bg-playful-foreground text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">4</div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Dispatch</h4>
                                                <p className="text-gray-600">Shipped within 24 hours (business days)</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        🏠 Same Day Delivery
                                    </h2>
                                    <div className="bg-yellow-50 p-6 rounded-lg border-l-4 border-yellow-400">
                                        <p className="text-yellow-800 mb-4">
                                            <strong>Available in select areas of Kochi, Thiruvananthapuram, and Kozhikode</strong>
                                        </p>
                                        <ul className="text-yellow-700 space-y-2">
                                            <li>• Order before 2:00 PM for same-day delivery</li>
                                            <li>• Additional charge: ₹299</li>
                                            <li>• Subject to product availability and location</li>
                                            <li>• Available Monday to Saturday only</li>
                                        </ul>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        📋 Delivery Guidelines
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-red-800 mb-2">Important Notes</h4>
                                            <ul className="text-red-700 space-y-1 text-sm">
                                                <li>• Photo ID required at delivery</li>
                                                <li>• Someone must be present to receive the order</li>
                                                <li>• Delivery attempted 3 times before return</li>
                                                <li>• Cash on Delivery: Exact change appreciated</li>
                                            </ul>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-green-800 mb-2">Delivery Partner</h4>
                                            <p className="text-green-700 text-sm">
                                                We work with trusted logistics partners including Bluedart, DTDC, and local Kerala couriers for safe and timely delivery.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        📱 Order Tracking
                                    </h2>
                                    <p className="text-gray-700 mb-4">
                                        Track your order easily with multiple options:
                                    </p>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-800 mb-2">SMS & Email Updates</h4>
                                            <ul className="text-blue-700 text-sm space-y-1">
                                                <li>• Order confirmation</li>
                                                <li>• Dispatch notification</li>
                                                <li>• Out for delivery alert</li>
                                                <li>• Delivery confirmation</li>
                                            </ul>
                                        </div>
                                        <div className="bg-purple-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-purple-800 mb-2">WhatsApp Support</h4>
                                            <p className="text-purple-700 text-sm mb-2">
                                                Get instant updates on WhatsApp at <br />
                                                <a href="https://wa.me/919526542902" className="font-medium underline">+91 95265 42902</a>
                                            </p>
                                            <p className="text-purple-600 text-xs">Available 24/7 for order status</p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        ❓ Shipping FAQs
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="border-l-4 border-playful-foreground pl-4">
                                            <h4 className="font-medium text-gray-800">What if I'm not home during delivery?</h4>
                                            <p className="text-gray-600 text-sm">
                                                Our delivery partner will attempt delivery 3 times. You can also reschedule delivery through the tracking link.
                                            </p>
                                        </div>
                                        <div className="border-l-4 border-playful-foreground pl-4">
                                            <h4 className="font-medium text-gray-800">Can I change my delivery address?</h4>
                                            <p className="text-gray-600 text-sm">
                                                Address can be changed within 1 hour of placing the order. Contact customer service immediately.
                                            </p>
                                        </div>
                                        <div className="border-l-4 border-playful-foreground pl-4">
                                            <h4 className="font-medium text-gray-800">Is my package insured?</h4>
                                            <p className="text-gray-600 text-sm">
                                                Yes, all orders are insured against damage or loss during transit at no extra cost.
                                            </p>
                                        </div>
                                    </div>
                                </section>

                                <section>
                                    <h2 className="text-2xl font-semibold text-playful-foreground mb-4">
                                        📞 Need Help?
                                    </h2>
                                    <div className="bg-playful-foreground/10 p-6 rounded-lg">
                                        <p className="text-gray-700 mb-4">
                                            Have questions about your delivery? We're here to help!
                                        </p>
                                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="font-medium text-gray-800">📧 Email Support</p>
                                                <a href="mailto:support@babysouk.com" className="text-blue-600 hover:underline">
                                                    support@babysouk.com
                                                </a>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">📞 Phone Support</p>
                                                <a href="tel:+919526542902" className="text-blue-600 hover:underline">
                                                    +91 95265 42902
                                                </a>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800">💬 WhatsApp</p>
                                                <a href="https://wa.me/919526542902" className="text-blue-600 hover:underline">
                                                    +91 95265 42902
                                                </a>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-600 mt-4">
                                            Business Hours: Monday - Saturday, 9:00 AM - 6:00 PM IST
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

export default Shipping;
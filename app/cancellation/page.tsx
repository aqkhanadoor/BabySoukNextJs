"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CancellationPage() {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-playful-foreground mb-8 text-center">
                        Cancellation Policy
                    </h1>

                    <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-playful-foreground/20">
                        <div className="prose max-w-none text-gray-700">
                            <h2 className="text-2xl font-semibold mb-4 text-playful-foreground">Order Cancellation</h2>
                            <p className="mb-6">
                                At Baby Souk, we understand that sometimes you may need to cancel your order.
                                We've made the cancellation process as simple as possible while ensuring fairness for all parties.
                            </p>

                            <h3 className="text-xl font-semibold mb-3 text-playful-foreground">When Can You Cancel?</h3>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                                <li>You can cancel your order within <strong>24 hours</strong> of placing it</li>
                                <li>Orders that have not yet been processed or shipped can be cancelled</li>
                                <li>Custom or personalized items cannot be cancelled once production begins</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-3 text-playful-foreground">How to Cancel Your Order</h3>
                            <ol className="list-decimal pl-6 mb-6 space-y-2">
                                <li>Contact our customer service team immediately</li>
                                <li>Provide your order number and registered email address</li>
                                <li>State the reason for cancellation (optional but helpful)</li>
                                <li>Our team will confirm the cancellation within 2-4 hours</li>
                            </ol>

                            <h3 className="text-xl font-semibold mb-3 text-playful-foreground">Refund Process</h3>
                            <p className="mb-4">
                                Once your cancellation is confirmed:
                            </p>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                                <li>Full refund will be processed within 5-7 business days</li>
                                <li>Refund will be credited to your original payment method</li>
                                <li>You will receive an email confirmation once the refund is processed</li>
                                <li>Bank processing times may vary (2-5 additional business days)</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-3 text-playful-foreground">Exceptions</h3>
                            <ul className="list-disc pl-6 mb-6 space-y-2">
                                <li>Orders already shipped cannot be cancelled (but can be returned)</li>
                                <li>Digital products or gift cards are non-cancellable</li>
                                <li>Sale items may have different cancellation terms</li>
                            </ul>

                            <h3 className="text-xl font-semibold mb-3 text-playful-foreground">Contact Information</h3>
                            <div className="bg-playful-background/30 p-4 rounded-lg border border-playful-foreground/20">
                                <p className="mb-2">
                                    <strong>Email:</strong> <a href="mailto:support@babysouk.com" className="text-blue-600 hover:underline">support@babysouk.com</a>
                                </p>
                                <p className="mb-2">
                                    <strong>Phone:</strong> <a href="tel:+919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a>
                                </p>
                                <p className="mb-2">
                                    <strong>WhatsApp:</strong> <a href="https://wa.me/919526542902" className="text-blue-600 hover:underline">+91 95265 42902</a>
                                </p>
                                <p>
                                    <strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};



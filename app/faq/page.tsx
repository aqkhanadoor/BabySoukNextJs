"use client";
"use client";

import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function FaqPage() {
    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold text-playful-foreground mb-8 text-center">
                        Frequently Asked Questions
                    </h1>

                    <div className="space-y-6">
                        {faqData.map((section, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-2 border-playful-foreground/20">
                                <h3 className="text-xl font-semibold mb-3 text-playful-foreground">
                                    {section.question}
                                </h3>
                                <div className="text-gray-700" dangerouslySetInnerHTML={{ __html: section.answer }} />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

const faqData = [
    {
        question: "What payment methods do you accept?",
        answer: `
      <p>We accept multiple payment methods for your convenience:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li>Credit/Debit Cards (Visa, MasterCard, Rupay)</li>
        <li>Net Banking</li>
        <li>UPI (PhonePe, Google Pay, Paytm, etc.)</li>
        <li>Digital Wallets (Paytm, Amazon Pay)</li>
        <li>Cash on Delivery (COD) - Available in select areas</li>
      </ul>
      <p class="mt-2">All payments are processed securely through encrypted gateways.</p>
    `
    },
    {
        question: "How long does shipping take?",
        answer: `
      <p>Shipping times vary based on your location:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Standard Delivery:</strong> 3-5 business days</li>
        <li><strong>Express Delivery:</strong> 1-2 business days (additional charges apply)</li>
        <li><strong>Same Day Delivery:</strong> Available in select metros (order before 2 PM)</li>
      </ul>
      <p class="mt-2">Free shipping on orders above ₹999. Delivery times may vary during festivals and peak seasons.</p>
    `
    },
    {
        question: "What is your return policy?",
        answer: `
      <p>We offer a hassle-free return policy:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Return Window:</strong> 7 days from delivery date</li>
        <li><strong>Condition:</strong> Items must be unused, with original packaging and tags</li>
        <li><strong>Process:</strong> Contact customer service to initiate return</li>
        <li><strong>Refund:</strong> Processed within 5-7 business days after return pickup</li>
      </ul>
      <p class="mt-2">Some items like personalized products and baby food items are not eligible for return.</p>
    `
    },
    {
        question: "Do you offer international shipping?",
        answer: `
      <p>Currently, we only ship within India. We are working on expanding our international shipping services.</p>
      <p class="mt-2">If you're located outside India and would like to place an order, please contact our customer service team at <a href="mailto:support@babysouk.com" class="text-blue-600 hover:underline">support@babysouk.com</a> for assistance.</p>
    `
    },
    {
        question: "How can I track my order?",
        answer: `
      <p>Tracking your order is easy:</p>
      <ol class="list-decimal pl-6 mt-2 space-y-1">
        <li>You'll receive an SMS and email with tracking details once your order ships</li>
        <li>Use the tracking number on our website or courier partner's website</li>
        <li>Contact customer service for real-time updates</li>
        <li>WhatsApp us at +91 95265 42902 for instant tracking info</li>
      </ol>
    `
    },
    {
        question: "Are your products safe for babies?",
        answer: `
      <p>Absolutely! Baby safety is our top priority:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li>All products meet Indian safety standards (BIS certified where applicable)</li>
        <li>Toys are non-toxic and free from harmful chemicals</li>
        <li>Baby care products are pediatrician approved</li>
        <li>Clothing items are made from baby-safe, hypoallergenic materials</li>
        <li>Regular quality checks ensure consistent safety standards</li>
      </ul>
    `
    },
    {
        question: "Can I modify my order after placing it?",
        answer: `
      <p>Order modifications depend on the processing status:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Within 1 hour:</strong> Full modifications possible (items, address, payment method)</li>
        <li><strong>Before shipping:</strong> Limited modifications (address changes, cancellation)</li>
        <li><strong>After shipping:</strong> No modifications possible</li>
      </ul>
      <p class="mt-2">Contact customer service immediately for any changes. We'll do our best to accommodate your request.</p>
    `
    },
    {
        question: "Do you offer bulk discounts?",
        answer: `
      <p>Yes! We offer special pricing for bulk orders:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Orders above ₹5,000:</strong> 5% additional discount</li>
        <li><strong>Orders above ₹10,000:</strong> 10% additional discount</li>
        <li><strong>Institutional buyers:</strong> Special wholesale rates available</li>
      </ul>
      <p class="mt-2">Contact our sales team at <a href="mailto:sales@babysouk.com" class="text-blue-600 hover:underline">sales@babysouk.com</a> for custom quotes.</p>
    `
    },
    {
        question: "How do I contact customer service?",
        answer: `
      <p>We're here to help! Reach out to us through:</p>
      <ul class="list-disc pl-6 mt-2 space-y-1">
        <li><strong>Email:</strong> <a href="mailto:support@babysouk.com" class="text-blue-600 hover:underline">support@babysouk.com</a></li>
        <li><strong>Phone:</strong> <a href="tel:+919526542902" class="text-blue-600 hover:underline">+91 95265 42902</a></li>
        <li><strong>WhatsApp:</strong> <a href="https://wa.me/919526542902" class="text-blue-600 hover:underline">+91 95265 42902</a> (Fastest response)</li>
        <li><strong>Live Chat:</strong> Available on our website during business hours</li>
      </ul>
      <p class="mt-2"><strong>Business Hours:</strong> Monday - Saturday, 9:00 AM - 6:00 PM IST</p>
    `
    }
];


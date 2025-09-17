"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted");
    };

    const contactInfo = [
        {
            icon: Phone,
            title: "Call Us",
            content: "+91 9526542902",
            description: "Mon-Sat, 9 AM - 7 PM"
        },
        {
            icon: Mail,
            title: "Email Us",
            content: "hello@babysouk.com",
            description: "We reply within 24 hours"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            content: "Baby Souk Store",
            description: "India"
        },
        {
            icon: Clock,
            title: "Business Hours",
            content: "Mon - Sat: 9 AM - 7 PM",
            description: "Sunday: Closed"
        }
    ];

    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-bold text-playful-foreground mb-4 animate-jump">
                            Get in Touch
                        </h1>
                        <p className="text-lg text-playful-foreground/80 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you! Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Form */}
                        <Card className="p-8">
                            <CardHeader className="p-0 mb-8">
                                <CardTitle className="text-3xl text-playful-foreground">Send us a Message</CardTitle>
                            </CardHeader>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-playful-foreground mb-2">
                                            First Name
                                        </label>
                                        <Input type="text" required className="w-full" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-playful-foreground mb-2">
                                            Last Name
                                        </label>
                                        <Input type="text" required className="w-full" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-playful-foreground mb-2">
                                        Email
                                    </label>
                                    <Input type="email" required className="w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-playful-foreground mb-2">
                                        Phone Number
                                    </label>
                                    <Input type="tel" className="w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-playful-foreground mb-2">
                                        Subject
                                    </label>
                                    <Input type="text" required className="w-full" />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-playful-foreground mb-2">
                                        Message
                                    </label>
                                    <Textarea
                                        rows={5}
                                        required
                                        className="w-full resize-none"
                                        placeholder="Tell us how we can help you..."
                                    />
                                </div>

                                <Button type="submit" size="lg" className="w-full">
                                    <MessageCircle className="mr-2 h-5 w-5" />
                                    Send Message
                                </Button>
                            </form>
                        </Card>

                        {/* Contact Information */}
                        <div className="space-y-6">
                            {contactInfo.map((info, index) => (
                                <Card key={index} className="p-6 hover:shadow-2d-hover transition-shadow">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-playful-primary text-white p-3 rounded-xl">
                                            <info.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-playful-foreground mb-1">
                                                {info.title}
                                            </h3>
                                            <p className="text-lg font-medium text-playful-primary mb-1">
                                                {info.content}
                                            </p>
                                            <p className="text-playful-foreground/70">
                                                {info.description}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ))}

                            {/* Quick WhatsApp Contact */}
                            <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
                                <div className="text-center">
                                    <div className="mb-4">
                                        <img
                                            src="/assets/whatsapp-icon.png"
                                            alt="WhatsApp"
                                            className="w-12 h-12 mx-auto"
                                        />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Quick WhatsApp</h3>
                                    <p className="mb-4">Get instant support on WhatsApp!</p>
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="bg-white text-green-600 hover:bg-gray-100"
                                    >
                                        <Link
                                            href="https://wa.me/919526542902"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Chat Now
                                        </Link>
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

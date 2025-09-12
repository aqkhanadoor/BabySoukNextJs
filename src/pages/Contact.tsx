import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
                    <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Contact Us</h1>
                    <p className="text-muted-foreground mb-10 max-w-2xl">
                        We'd love to hear from you. Reach out using any of the methods below and our team will get back to you shortly.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary"><MapPin className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-semibold text-lg">Address</h2>
                                    <p className="text-sm leading-relaxed">C.P Complex, Agastiamuzhi,<br />Mukkam, Kerala 673572</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary"><Phone className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-semibold text-lg">Phone</h2>
                                    <p className="text-sm">7907943740</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary"><Mail className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-semibold text-lg">Email</h2>
                                    <p className="text-sm">info@babysouk.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 rounded-xl bg-primary/10 text-primary"><Clock className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-semibold text-lg">Business Hours</h2>
                                    <p className="text-sm leading-relaxed">
                                        Mon - Sat: 9:00 AM - 8:00 PM<br />
                                        Sunday: 10:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border bg-card p-6 shadow-sm">
                            <h2 className="font-semibold text-xl mb-4">Send us a Message</h2>
                            <p className="text-sm text-muted-foreground mb-4">Email us directly with your query and we will respond as soon as possible.</p>
                            <a
                                href="mailto:info@babysouk.in"
                                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow hover:opacity-90 transition-colors"
                            >
                                Email info@babysouk.in
                            </a>
                            <div className="mt-6 text-xs text-muted-foreground">
                                For urgent matters, please call us at 7907943740 during business hours.
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Contact;

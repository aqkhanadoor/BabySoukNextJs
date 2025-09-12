import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

const Contact = () => {
    return (
        <div className="min-h-screen flex flex-col bg-playful-background font-sans">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight text-center text-playful-foreground animate-jump">Get In Touch!</h1>
                    <p className="text-playful-foreground/80 mb-12 max-w-2xl mx-auto text-center text-lg">
                        We'd love to hear from you! Whether you have a question, a fun idea, or just want to say hello, here's how you can reach us.
                    </p>

                    <div className="grid gap-8 md:grid-cols-2">
                        <div className="space-y-6">
                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border-2 border-playful-foreground shadow-2d">
                                <div className="p-3 rounded-xl bg-playful-primary text-white shadow-2d border-2 border-playful-foreground"><MapPin className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-bold text-lg text-playful-foreground">Our Clubhouse</h2>
                                    <p className="text-sm leading-relaxed text-playful-foreground/80">C.P Complex, Agastiamuzhi,<br />Mukkam, Kerala 673572</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border-2 border-playful-foreground shadow-2d">
                                <div className="p-3 rounded-xl bg-playful-secondary text-white shadow-2d border-2 border-playful-foreground"><Phone className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-bold text-lg text-playful-foreground">Ring, Ring!</h2>
                                    <p className="text-sm text-playful-foreground/80">7907943740</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border-2 border-playful-foreground shadow-2d">
                                <div className="p-3 rounded-xl bg-playful-accent text-white shadow-2d border-2 border-playful-foreground"><Mail className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-bold text-lg text-playful-foreground">Send a Mail!</h2>
                                    <p className="text-sm text-playful-foreground/80">info@babysouk.in</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border-2 border-playful-foreground shadow-2d">
                                <div className="p-3 rounded-xl bg-playful-primary/80 text-white shadow-2d border-2 border-playful-foreground"><Clock className="h-6 w-6" /></div>
                                <div>
                                    <h2 className="font-bold text-lg text-playful-foreground">Playtime Hours</h2>
                                    <p className="text-sm leading-relaxed text-playful-foreground/80">
                                        Mon - Sat: 9:00 AM - 8:00 PM<br />
                                        Sunday: 10:00 AM - 6:00 PM
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border-2 border-playful-foreground bg-white p-6 shadow-2d text-center flex flex-col justify-center">
                            <h2 className="font-bold text-2xl mb-4 text-playful-primary">Send a Message!</h2>
                            <p className="text-sm text-playful-foreground/80 mb-6">Have a question? Email us directly and we'll get back to you faster than a speeding toddler!</p>
                            <a
                                href="mailto:info@babysouk.in"
                                className="inline-flex items-center justify-center rounded-xl bg-playful-primary px-6 py-3 text-base font-medium text-playful-primary-foreground shadow-2d border-2 border-playful-foreground hover:bg-playful-primary/90 transition-colors animate-wiggle"
                            >
                                <Send className="h-5 w-5 mr-2" />
                                Email Us Now
                            </a>
                            <div className="mt-6 text-xs text-playful-foreground/60">
                                For super urgent stuff, give us a call at 7907943740 during our playtime hours.
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

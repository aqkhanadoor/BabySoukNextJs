import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Ban } from "lucide-react";

const Cancellation = () => {
    const updated = new Date().toLocaleDateString();
    return (
        <div className="min-h-screen flex flex-col bg-playful-base">
            <Header />
            <main className="flex-1 py-12 md:py-20">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-2xl border-2 border-black shadow-2d p-6 md:p-10 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <Ban className="w-12 h-12 text-playful-primary animate-shake" />
                            <h1 className="text-4xl md:text-5xl font-bold font-fredoka text-playful-primary ml-4">
                                Cancellation & Refund
                            </h1>
                        </div>
                        <p className="text-center text-playful-dark/80 mb-8 font-fredoka">
                            Last updated: {updated}
                        </p>

                        <div className="prose prose-lg max-w-none font-fredoka text-playful-dark 
                                        prose-headings:text-playful-primary prose-headings:font-bold prose-headings:mb-4
                                        prose-strong:text-playful-accent
                                        prose-a:text-playful-secondary hover:prose-a:text-playful-primary
                                        prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                                        prose-p:leading-relaxed">

                            <p>At <strong>Baby Souk</strong>, we get it—sometimes plans wiggle and wobble! Our policy is here to help.</p>

                            <h2>Order Cancellation</h2>
                            <h3>Before It Ships</h3>
                            <p>You can cancel your order any time before it leaves our playroom. Just buzz our friendly team at <a href="mailto:info@babysouk.in">info@babysouk.in</a> or call +91 7907943740.</p>
                            <h3>After It Ships</h3>
                            <p>Once your goodies are on their way, we can't cancel the order. But don't worry! You can still make a return once it arrives, just like in our super-friendly Return Policy.</p>

                            <h2>Refunds</h2>
                            <h3>How You Get It Back</h3>
                            <p>Refunds zoom back to your original payment method. Give it about <strong>5–10 business days</strong> to pop into your account.</p>
                            <h3>Special Items</h3>
                            <p>Custom-made toys or extra-special items can't be refunded unless they show up broken or sad. We'll make it right!</p>
                            <h3>Oopsie-Daisies (Damaged Items)</h3>
                            <p>If your order arrives looking a bit grumpy (damaged), we'll send a new one or give you a full refund. Just snap a few pictures for us so we can see what happened!</p>

                            <h2>Where's My Refund?</h2>
                            <p>Can't find your refund? Here’s a little treasure map:</p>
                            <ul>
                                <li>First, double-check your bank account.</li>
                                <li>Next, chat with your card company—sometimes they're a bit sleepy.</li>
                                <li>Still lost? Shout out to us at <a href="mailto:info@babysouk.in">info@babysouk.in</a>, and we'll help you find it!</li>
                            </ul>

                            <h2>Need a Hand?</h2>
                            <p>We're always here to help with your questions. Just give us a wave!</p>
                            <p>Email: <a href="mailto:info@babysouk.in">info@babysouk.in</a><br />Phone: +91 7907943740</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default Cancellation;

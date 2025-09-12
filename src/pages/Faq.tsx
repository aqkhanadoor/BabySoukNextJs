import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Faq = () => {
    const faqs = [
        {
            cat: "Ordering",
            q: "When Will My Order Ship?",
            a: "Baby Souk requires 1–2 business days to carefully pack and ship your order. For larger or custom items, please allow 3–4 business days. Orders placed after 1:00 pm IST on Sunday or over the weekend will be shipped on the next business day.",
        },
        { cat: "Ordering", q: "Where Do You Ship To?", a: "We proudly deliver across India, ensuring our toys, dresses, and kids’ products reach families nationwide with care." },
        { cat: "Ordering", q: "I Have a Question About My Order, Who Can I Talk To?", a: "Contact our support team at info@babysouk.in or call +91 7907943740 for any order queries." },
        { cat: "Products", q: "Are Your Products Safe for Children?", a: "Yes. All items are made from child-safe, high-quality materials sourced from trusted suppliers and meet safety and comfort standards." },
        { cat: "Products", q: "How Accurate Are the Colors Shown?", a: "We aim for accurate color representation, but screen settings and lighting may cause slight variations. Reach out if you’d like more details before ordering." },
        { cat: "Products", q: "Do You Offer Gift Wrapping?", a: "Yes. Gift wrapping is available at checkout or you can request it after placing an order." },
        { cat: "Returns & Refunds", q: "What Is Your Return Policy?", a: "We offer an easy return process if you’re not 100% satisfied. See our Return & Refund Policy page for full details." },
        { cat: "Returns & Refunds", q: "My Item Arrived Damaged. What Should I Do?", a: "Email us within 48 hours at info@babysouk.in with clear photos of the product and packaging. We’ll arrange a replacement or refund." },
        { cat: "Returns & Refunds", q: "How Long Does It Take to Process a Refund?", a: "Approved refunds are processed within 7 working days and credited to your original payment method." },
        { cat: "Payment", q: "Do You Offer Cash on Delivery (COD)?", a: "Yes, COD is available for eligible orders below ₹1000 (excludes personalized or made-to-order products)." },
        { cat: "Payment", q: "What Payment Methods Do You Accept?", a: "We accept UPI, debit / credit cards, net banking, and wallet payments. All transactions are secure." },
        { cat: "Shipping & Delivery", q: "How Much Do You Charge for Shipping?", a: "Orders < ₹1000 (COD): ₹90. Orders < ₹1000 (Online Payment): ₹45. Orders ≥ ₹1000: Free Delivery." },
        { cat: "Shipping & Delivery", q: "How Do I Track My Order?", a: "Once shipped, we send a tracking link via email / SMS so you can monitor delivery in real time." },
        { cat: "Shipping & Delivery", q: "Do You Offer Store Pickup?", a: "Yes. Pick up from C.P Complex, Agastiamuzhi, Mukkam, Kerala – 673572. Choose ‘Store Pick-Up’ at checkout." },
        { cat: "General", q: "Do You Offer Discounts or Promotions?", a: "Yes—festive offers, seasonal sales, and bundle deals. Subscribe to our newsletter or follow us on social media." },
        { cat: "General", q: "Can I Order as a Gift for Someone Else?", a: "Absolutely. Use a different delivery address and optionally add gift wrapping." },
        { cat: "General", q: "Do You Have a Physical Store?", a: "Yes—visit us at C.P Complex, Agastiamuzhi, Mukkam, Kerala – 673572." },
    ];

    const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, item) => {
        (acc[item.cat] ||= []).push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
                    <div className="mb-10 text-center">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Frequently Asked Questions</h1>
                        <p className="text-muted-foreground max-w-2xl mx-auto">Answers to common questions about ordering, shipping, products, payments, and more.</p>
                    </div>
                    <div className="space-y-14">
                        {Object.entries(grouped).map(([cat, items]) => (
                            <div key={cat}>
                                <h2 className="text-xl md:text-2xl font-semibold mb-4 flex items-center gap-2"><span className="h-6 w-1.5 rounded bg-primary" />{cat}</h2>
                                <Accordion type="single" collapsible className="border rounded-lg divide-y bg-card/40 backdrop-blur-sm">
                                    {items.map((f, idx) => (
                                        <AccordionItem key={f.q} value={`${cat}-${idx}`}>
                                            <AccordionTrigger className="px-4 text-left">{f.q}</AccordionTrigger>
                                            <AccordionContent className="px-4 leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>
                    <div className="mt-16 text-center text-sm text-muted-foreground">
                        Still have a question? <a href="/contact" className="text-primary underline underline-offset-4 hover:no-underline">Contact us</a> and we’ll help you out.
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Faq;

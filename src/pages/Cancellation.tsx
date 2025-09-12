import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Cancellation = () => {
    const updated = new Date().toLocaleDateString();
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-4xl prose prose-sm md:prose-base dark:prose-invert">
                    <h1 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">Cancellation & Refund Policy</h1>
                    <p className="text-muted-foreground text-sm">Last updated: {updated}</p>
                    <p>At <strong>Baby Souk</strong>, we understand that plans can change. Our cancellation and refund policy is designed to be fair and transparent while ensuring smooth order management.</p>

                    <h2>Order Cancellation</h2>
                    <h3>Before Dispatch</h3>
                    <p>Orders can be cancelled before they are dispatched from our facility. To cancel an order, please contact our customer support team immediately at <a href="mailto:info@babysouk.in">info@babysouk.in</a> or call +91 7907943740.</p>
                    <h3>After Dispatch</h3>
                    <p>Once an order has been dispatched, it cannot be cancelled. However, you may still be eligible for a return once the product is delivered, in line with our Return & Refund Policy.</p>

                    <h2>Refunds</h2>
                    <h3>Refund Method</h3>
                    <p>Approved refunds will be processed through the original method of payment. Please allow <strong>5–10 business days</strong> for the amount to reflect in your account.</p>
                    <h3>Non-Refundable Items</h3>
                    <p>Made-to-order, personalized, or hygiene-sensitive products are not eligible for refunds unless they arrive damaged or defective.</p>
                    <h3>Damaged or Defective Items</h3>
                    <p>If your order arrives damaged, we will provide a full refund or replacement after verification. Kindly share clear photos of the damaged product and packaging with our support team for quick resolution.</p>

                    <h2>Late or Missing Refunds</h2>
                    <p>If you haven’t received your refund within the expected timeframe:</p>
                    <ul>
                        <li>Recheck your bank account.</li>
                        <li>Contact your credit card company—posting times vary.</li>
                        <li>Still no update? Email us at <a href="mailto:info@babysouk.in">info@babysouk.in</a> or call +91 7907943740.</li>
                    </ul>

                    <h2>Need Assistance?</h2>
                    <p>We’re here to help with any cancellation or refund questions. Reach out anytime during business hours.</p>
                    <p>Email: <a href="mailto:info@babysouk.in">info@babysouk.in</a><br />Phone: +91 7907943740</p>
                    <p className="text-xs text-muted-foreground">Baby Souk reserves the right to amend this policy at any time to reflect operational, legal, or regulatory changes.</p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Cancellation;

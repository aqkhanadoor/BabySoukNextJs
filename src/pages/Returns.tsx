import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Returns = () => {
    const updated = new Date().toLocaleDateString();
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-4xl prose prose-sm md:prose-base dark:prose-invert">
                    <h1 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">Return & Refund Policy</h1>
                    <p className="text-muted-foreground text-sm">Last updated: {updated}</p>
                    <p>At <strong>Baby Souk</strong>, we want you to love your shopping experience. If something isn’t right, we’re here to help. Please review our returns and refunds policy below:</p>

                    <h2>Returns</h2>
                    <h3>What Items Cannot Be Returned?</h3>
                    <p>We do not accept returns on personalized items, made-to-order products, or hygiene-sensitive items (such as undergarments or innerwear).</p>

                    <h3>How Do I Return an Item?</h3>
                    <p>If you wish to return an eligible item, please contact our customer support team at <a href="mailto:info@babysouk.in">info@babysouk.in</a> or call +91 7907943740. Our team will guide you through the process to ensure a smooth experience.</p>

                    <h3>The Item Arrived Damaged. What Do I Do?</h3>
                    <p>We take extra care in packaging and delivery. However, if your item arrives damaged or defective, please notify us within <strong>48 hours</strong> of delivery. Kindly provide clear photos of the damaged product and its packaging to help us resolve the issue quickly. We’ll arrange for a replacement or refund depending on the situation.</p>

                    <h3>What Is Your Return Period?</h3>
                    <p>Items can be returned within <strong>15 days</strong> of delivery. After this period, we will not be able to process returns or refunds.</p>

                    <h2>Refunds</h2>
                    <h3>Personalized Products</h3>
                    <p>We do not offer refunds for personalized or made-to-order products, as these items are specially crafted for you.</p>

                    <h3>Refund Processing Time</h3>
                    <p>If your refund is approved (e.g., damaged or defective item), it will be processed within <strong>7 working days</strong>. The amount will be credited to your original method of payment.</p>

                    <h3>Damaged or Defective Items</h3>
                    <p>Please contact our support team within 48 hours of delivery with photos of the issue. Based on the situation, we will arrange a replacement or refund.</p>

                    <h3>How to Request a Refund</h3>
                    <p>To initiate a refund request, please reach out to us via the Contact page, email us at <a href="mailto:info@babysouk.in">info@babysouk.in</a>, or call +91 7907943740.</p>

                    <h2>Need Help?</h2>
                    <p>Email: <a href="mailto:info@babysouk.in">info@babysouk.in</a><br />Phone: +91 7907943740</p>
                    <p className="text-xs text-muted-foreground">All return & refund decisions are subject to verification and Baby Souk reserves the right to refuse requests that do not meet policy criteria.</p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Returns;

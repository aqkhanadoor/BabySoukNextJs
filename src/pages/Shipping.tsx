import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Shipping = () => {
    const updated = new Date().toLocaleDateString();
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-4xl prose prose-sm md:prose-base dark:prose-invert">
                    <h1 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">Shipping & Delivery Policy</h1>
                    <p className="text-muted-foreground text-sm">Last updated: {updated}</p>
                    <p>At <strong>Baby Souk</strong>, we are committed to making your shopping experience seamless, reliable, and delightful. Please review our shipping and delivery policy below.</p>

                    <h2>Nationwide Delivery</h2>
                    <p>We proudly ship across India so every child can enjoy our carefully selected toys, dresses, and kids’ products. Delivery times may vary depending on location and order type.</p>

                    <h2>Delivery Timeline</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Delivery Type</th>
                                <th>Estimated Timeframe</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Minimum Delivery Time</td>
                                <td>5 – 7 business days</td>
                            </tr>
                            <tr>
                                <td>Maximum Delivery Time</td>
                                <td>10 – 15 business days</td>
                            </tr>
                        </tbody>
                    </table>

                    <h2>Shipping Charges</h2>
                    <ul>
                        <li>Orders below ₹1000 (Cash on Delivery): ₹90</li>
                        <li>Orders below ₹1000 (Online Payment): ₹45</li>
                        <li>Orders ₹1000 and above: <strong>Free Delivery</strong></li>
                    </ul>

                    <h2>Order Dispatch & Tracking</h2>
                    <ul>
                        <li>Once your order is confirmed, you will receive an order confirmation via email / SMS.</li>
                        <li>After dispatch, we send a tracking link so you can monitor live delivery status.</li>
                    </ul>

                    <h2>Delayed or Missing Orders</h2>
                    <p>If your order has not arrived within the estimated delivery window, contact us at <a href="mailto:info@babysouk.in">info@babysouk.in</a> or call +91 7907943740 with your order number. We will investigate and update you promptly.</p>

                    <h2>Store Pick-Up Option</h2>
                    <p>Prefer to collect your order in person? You can pick it up from our Baby Souk store:</p>
                    <p><strong>C.P Complex, Agastiamuzhi, Mukkam, Kerala – 673572</strong></p>
                    <p>Select “Store Pick-Up” during checkout. We will notify you once your order is ready for collection.</p>

                    <h2>Need Help?</h2>
                    <p>Email: <a href="mailto:info@babysouk.in">info@babysouk.in</a><br />Phone: +91 7907943740</p>
                    <p className="text-xs text-muted-foreground">Business Hours: Mon - Sat 9:00 AM – 8:00 PM · Sunday 10:00 AM – 6:00 PM</p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Shipping;

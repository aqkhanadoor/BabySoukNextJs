import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Shipping = () => {
    const updated = new Date().toLocaleDateString();
    return (
        <div className="min-h-screen flex flex-col bg-playful-background font-sans">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-playful-foreground animate-jump">Shipping & Delivery</h1>
                        <p className="text-playful-foreground/80 text-lg">How your goodies get from our place to yours!</p>
                        <p className="text-playful-foreground/60 text-sm mt-2">Last updated: {updated}</p>
                    </div>

                    <div className="prose prose-lg max-w-none mx-auto bg-white p-8 rounded-2xl border-2 border-playful-foreground shadow-2d
                                    prose-headings:font-bold prose-headings:text-playful-primary prose-h2:text-3xl prose-h2:mb-4
                                    prose-p:text-playful-foreground/90 prose-p:leading-relaxed
                                    prose-ul:list-disc prose-ul:marker:text-playful-primary prose-li:text-playful-foreground/90
                                    prose-strong:text-playful-foreground prose-a:text-playful-secondary hover:prose-a:text-playful-primary
                                    prose-table:border-2 prose-table:border-playful-foreground/20 prose-th:bg-playful-background prose-th:p-3 prose-td:p-3">
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
                            <li>Orders ₹1000 and above: <strong>Free Delivery! Yay!</strong></li>
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
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Shipping;

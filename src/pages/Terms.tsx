import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Terms = () => {
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-4xl prose prose-sm md:prose-base dark:prose-invert">
                    <h1 className="mb-6 text-3xl md:text-4xl font-bold tracking-tight">Terms & Conditions</h1>
                    <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>

                    <h2>1. Company Information</h2>
                    <p><strong>Business Name:</strong> Baby Souk<br />
                        <strong>Address:</strong> C.P Complex, Agastiamuzhi, Mukkam, Kerala – 673572<br />
                        <strong>Phone:</strong> +91 7907943740<br />
                        <strong>Email:</strong> info@babysouk.in
                    </p>

                    <h2>2. Use of Website</h2>
                    <p>Our website is designed for customers looking to purchase toys, dresses, and accessories for children. By using our website, you agree not to misuse it for fraudulent, illegal, or harmful purposes. You must be at least 18 years old to make purchases, or have parental / guardian supervision.</p>

                    <h2>3. Products and Pricing</h2>
                    <ul>
                        <li>We strive to ensure product details, images, and pricing are accurate. However, errors may occur.</li>
                        <li>Prices are subject to change without prior notice.</li>
                        <li>All products are subject to availability.</li>
                    </ul>

                    <h2>4. Orders and Payments</h2>
                    <p>Orders are confirmed only after successful payment. We accept UPI, major debit / credit cards, net banking, and Cash on Delivery (where available). Baby Souk reserves the right to cancel or refuse any order due to stock unavailability, payment issues, or suspected fraudulent activity.</p>

                    <h2>5. Shipping and Delivery</h2>
                    <ul>
                        <li>We deliver across India. Delivery timelines may vary based on location.</li>
                        <li>Shipping charges (if any) are shown at checkout.</li>
                        <li>Delays caused by courier partners, weather, or unforeseen events are not our responsibility, but we will assist in tracking your order.</li>
                    </ul>

                    <h2>6. Returns and Refunds</h2>
                    <ul>
                        <li>Returns are accepted only if the product is defective, damaged, or incorrect.</li>
                        <li>Products must be unused and returned with original packaging and tags.</li>
                        <li>Certain items (e.g. undergarments or hygiene-sensitive products) are non-returnable.</li>
                        <li>Refunds are processed within 7–10 working days after inspection of the returned item.</li>
                    </ul>

                    <h2>7. Privacy Policy</h2>
                    <p>We respect your privacy and handle your personal information as per our Privacy Policy. Customer details are used only for processing orders, communication, and improving services.</p>

                    <h2>8. Intellectual Property</h2>
                    <p>All content on this website (logos, designs, product images, text, etc.) is the property of Baby Souk. Unauthorized use, reproduction, or distribution of our content is prohibited.</p>

                    <h2>9. Limitation of Liability</h2>
                    <p>Baby Souk is not responsible for any indirect, incidental, or consequential damages arising from the use of our products or website. All toys and products should be used under adult supervision. Baby Souk will not be liable for misuse of products.</p>

                    <h2>10. Governing Law</h2>
                    <p>These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of the courts in Kerala.</p>

                    <h2>11. Contact Us</h2>
                    <p>
                        Baby Souk<br />
                        C.P Complex, Agastiamuzhi, Mukkam, Kerala – 673572<br />
                        +91 7907943740<br />
                        info@babysouk.in
                    </p>

                    <p className="text-xs text-muted-foreground">If you have any questions about these Terms & Conditions, please contact us at the email or phone number above.</p>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Terms;

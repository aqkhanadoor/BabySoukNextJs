import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Privacy = () => {
    const updated = new Date().toLocaleDateString();
    return (
        <div className="min-h-screen flex flex-col bg-playful-background font-sans">
            <Header />
            <main className="flex-1">
                <section className="container mx-auto px-4 py-12 md:py-20 max-w-4xl">
                    <div className="text-center mb-12">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-playful-foreground animate-jump">Privacy Policy</h1>
                        <p className="text-playful-foreground/80 text-lg">Your secrets are safe with us!</p>
                        <p className="text-playful-foreground/60 text-sm mt-2">Last updated: {updated}</p>
                    </div>

                    <div className="prose prose-lg max-w-none mx-auto bg-white p-8 rounded-2xl border-2 border-playful-foreground shadow-2d
                                    prose-headings:font-bold prose-headings:text-playful-primary prose-h2:text-3xl prose-h2:mb-4
                                    prose-p:text-playful-foreground/90 prose-p:leading-relaxed
                                    prose-ul:list-disc prose-ul:marker:text-playful-primary prose-li:text-playful-foreground/90
                                    prose-strong:text-playful-foreground prose-a:text-playful-secondary hover:prose-a:text-playful-primary">
                        <p>At Baby Souk, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or make a purchase.</p>

                        <h2>1. Information We Collect</h2>
                        <p>When you use our website, we may collect the following information:</p>
                        <ul>
                            <li><strong>Personal Information:</strong> Name, email address, phone number, shipping / billing address.</li>
                            <li><strong>Payment Information:</strong> UPI, card details, or other payment methods (processed securely by payment partners).</li>
                            <li><strong>Usage Information:</strong> Pages visited, items viewed, and browsing activity.</li>
                            <li><strong>Device Information:</strong> IP address, browser type, operating system, and cookies.</li>
                        </ul>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use your information to:</p>
                        <ul>
                            <li>Process and deliver your orders.</li>
                            <li>Communicate with you regarding your purchases, promotions, or updates.</li>
                            <li>Improve our website, products, and services.</li>
                            <li>Ensure a secure and smooth shopping experience.</li>
                        </ul>

                        <h2>3. Protection of Children’s Privacy</h2>
                        <ul>
                            <li>Our website is intended for parents / guardians purchasing items for children.</li>
                            <li>We do not knowingly collect personal information from children under 13 years.</li>
                            <li>If you believe a child has provided personal information to us, please contact us at <a href="mailto:info@babysouk.in">info@babysouk.in</a> and we will take steps to delete it.</li>
                        </ul>

                        <h2>4. Sharing of Information</h2>
                        <p>We do not sell or rent your personal data to third parties. However, we may share your information with:</p>
                        <ul>
                            <li><strong>Service Providers:</strong> Courier, delivery, and payment partners who help us complete your orders.</li>
                            <li><strong>Legal Authorities:</strong> If required by law, regulation, or government request.</li>
                        </ul>

                        <h2>5. Cookies and Tracking</h2>
                        <p>We use cookies to enhance your browsing experience, remember your preferences, and analyze website traffic. You may choose to disable cookies through your browser settings, but some site features may not function properly.</p>

                        <h2>6. Data Security</h2>
                        <p>We take appropriate technical and organizational measures to protect your personal data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>

                        <h2>7. Your Rights</h2>
                        <p>You have the right to:</p>
                        <ul>
                            <li>Access the personal data we hold about you.</li>
                            <li>Request corrections or updates to your information.</li>
                            <li>Request deletion of your personal data (subject to legal or contractual obligations).</li>
                            <li>Opt-out of promotional communications anytime.</li>
                        </ul>

                        <h2>8. Policy Updates</h2>
                        <p>We may update this Privacy Policy from time to time. Changes will be posted on this page with the updated date. Please review it regularly.</p>

                        <h2>9. Contact Us</h2>
                        <p>For questions, concerns, or requests related to this Privacy Policy, contact us at:</p>
                        <p>
                            <strong>Baby Souk</strong><br />
                            C.P Complex, Agastiamuzhi, Mukkam, Kerala – 673572<br />
                            +91 7907943740<br />
                            <a href="mailto:info@babysouk.in">info@babysouk.in</a>
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Privacy;

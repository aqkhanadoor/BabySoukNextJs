import { FaStar, FaMale, FaFemale } from "react-icons/fa";

const testimonials = [
    {
        name: "Anjali R.",
        gender: "female" as const,
        location: "Kochi, Kerala",
        rating: 5,
        quote:
            "BabySouk is the best in Kerala! I found everything I needed for my newborn. The quality is amazing and delivery was super fast. Their support is the fastest and most helpful I've experienced.",
        avatar: "/placeholder.svg",
    },
    {
        name: "Suresh K.",
        gender: "male" as const,
        location: "Thiruvananthapuram, Kerala",
        rating: 5,
        quote:
            "Impressed with the variety. It's my one‑stop shop for baby gear. Smooth checkout and reliable shipping. Highly recommended!",
        avatar: "/placeholder.svg",
    },
    {
        name: "Fatima S.",
        gender: "female" as const,
        location: "Kozhikode, Kerala",
        rating: 5,
        quote:
            "Outstanding customer service. They guided me to the right products and answered all my questions quickly. You can tell they care!",
        avatar: "/placeholder.svg",
    },
    {
        name: "Rahul N.",
        gender: "male" as const,
        location: "Ernakulam, Kerala",
        rating: 4,
        quote:
            "Great prices and genuine products. The stroller we bought is sturdy and comfy. Delivery arrived a day earlier than expected!",
        avatar: "/placeholder.svg",
    },
    {
        name: "Neha P.",
        gender: "female" as const,
        location: "Thrissur, Kerala",
        rating: 5,
        quote:
            "Beautiful collection for newborns. Loved the soft fabrics and eco‑friendly options. Will definitely shop again.",
        avatar: "/placeholder.svg",
    },
    {
        name: "Ibrahim M.",
        gender: "male" as const,
        location: "Malappuram, Kerala",
        rating: 5,
        quote:
            "Customer care responded within minutes on WhatsApp and helped me pick the right bottle set. Fantastic experience!",
        avatar: "/placeholder.svg",
    },
    {
        name: "Aisha T.",
        gender: "female" as const,
        location: "Kannur, Kerala",
        rating: 4,
        quote:
            "Quality is top‑notch and packaging was safe. The toys are exactly as described and my baby loves them.",
        avatar: "/placeholder.svg",
    },
    {
        name: "Deepak L.",
        gender: "male" as const,
        location: "Alappuzha, Kerala",
        rating: 5,
        quote:
            "Fast shipping and genuine brands. The diaper bag is super practical and stylish. Totally worth it.",
        avatar: "/placeholder.svg",
    },
    {
        name: "Maria J.",
        gender: "female" as const,
        location: "Kottayam, Kerala",
        rating: 5,
        quote:
            "Loved the curated collections—made gift shopping so easy. The size guide was accurate too!",
        avatar: "/placeholder.svg",
    },
    {
        name: "Arun V.",
        gender: "male" as const,
        location: "Palakkad, Kerala",
        rating: 5,
        quote:
            "Seamless experience from browsing to delivery. The walker is sturdy and safe. Will recommend to friends.",
        avatar: "/placeholder.svg",
    },
];

const TestimonialsSection = () => {
    return (
        <section className="py-16 bg-playful-background sm:py-24">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold tracking-tight text-playful-foreground sm:text-5xl">
                        What Our Customers Say
                    </h2>
                    <p className="mt-4 text-xl text-playful-foreground/80">
                        Best in Kerala for a reason!
                    </p>
                </div>
                <div className="flex gap-6 overflow-x-auto no-scrollbar pb-2"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="min-w-[280px] sm:min-w-[320px] md:min-w-[360px] flex flex-col justify-between p-6 bg-white rounded-2xl shadow-card"
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <div>
                                <div className="flex items-center mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <FaStar key={i} className="h-5 w-5 text-yellow-400" />
                                    ))}
                                </div>
                                <p className="text-lg text-playful-foreground">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                            <div className="flex items-center mt-6">
                                <div
                                    className={`h-12 w-12 rounded-full flex items-center justify-center text-white shrink-0 ${testimonial.gender === "male" ? "bg-blue-500" : "bg-pink-500"
                                        }`}
                                    aria-label={`${testimonial.gender} avatar`}
                                >
                                    {testimonial.gender === "male" ? (
                                        <FaMale className="h-6 w-6" />
                                    ) : (
                                        <FaFemale className="h-6 w-6" />
                                    )}
                                </div>
                                <div className="ml-4">
                                    <p className="text-lg font-bold text-playful-foreground">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-sm text-playful-foreground/70">
                                        {testimonial.location}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TestimonialsSection;

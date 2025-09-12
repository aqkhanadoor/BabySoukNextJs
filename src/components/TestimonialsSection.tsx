import { Star } from "lucide-react";

const testimonials = [
    {
        name: "Anjali R.",
        location: "Kochi, Kerala",
        rating: 5,
        quote:
            "BabySouk is the best in Kerala! I found everything I needed for my newborn. The quality is amazing and the delivery was so fast. Their customer support is the fastest and most helpful I have ever experienced.",
        avatar: "/placeholder.svg",
    },
    {
        name: "Suresh K.",
        location: "Trivandrum, Kerala",
        rating: 5,
        quote:
            "I'm so impressed with the variety of products. It's my one-stop shop for all baby needs. The website is so easy to use and the checkout process is a breeze. Highly recommended!",
        avatar: "/placeholder.svg",
    },
    {
        name: "Fatima S.",
        location: "Calicut, Kerala",
        rating: 5,
        quote:
            "The customer service is outstanding. They were so helpful in answering my questions and guiding me to the right products. It's clear they care about their customers. Fastest response support for sure!",
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="flex flex-col justify-between p-6 bg-white rounded-2xl shadow-card"
                        >
                            <div>
                                <div className="flex items-center mb-4">
                                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>
                                <p className="text-lg text-playful-foreground">
                                    "{testimonial.quote}"
                                </p>
                            </div>
                            <div className="flex items-center mt-6">
                                <img
                                    className="h-12 w-12 rounded-full object-cover"
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                />
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

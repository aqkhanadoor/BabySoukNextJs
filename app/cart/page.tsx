"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
    const { state, updateQuantity, removeFromCart } = useCart();
    const subtotal = state.total;
    const shipping = subtotal > 999 ? 0 : 99;
    const total = subtotal + shipping;

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity < 1) {
            removeFromCart(itemId);
        } else {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleWhatsAppCheckout = () => {
        const phoneNumber = "919526542902";
        const baseUrl = window.location.origin;

        let message = "Hello! I would like to place an order:\n\n";

        state.items.forEach((item, index) => {
            const productUrl = `${baseUrl}/product/${item.product.slug || item.product.id}`;
            message += `${index + 1}. ${item.product.name}\n`;
            if (item.color) message += `   Color: ${item.color}\n`;
            if (item.size) message += `   Size: ${item.size}\n`;
            message += `   Link: ${productUrl}\n`;
            message += `   Quantity: ${item.quantity}\n`;
            message += `   Price: ₹${item.product.specialPrice} each\n`;
            message += `   Total: ₹${item.product.specialPrice * item.quantity}\n\n`;
        });

        message += `Subtotal: ₹${subtotal}\n`;
        message += `Shipping: ${shipping === 0 ? "Free" : `₹${shipping}`}\n`;
        message += `Total Amount: ₹${total}\n\n`;
        message += "Please confirm my order. Thank you!";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

        window.open(whatsappUrl, "_blank");
    };

    if (state.items.length === 0) {
        return (
            <div className="min-h-screen bg-playful-background font-sans">
                <Header />

                <main className="py-16 px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="relative mb-8">
                            <div className="text-8xl mb-6 animate-bounce">🛒</div>
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4">
                                <div className="w-4 h-4 bg-playful-accent rounded-full animate-ping"></div>
                            </div>
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-playful-foreground mb-4 animate-jump">
                            Your Cart is Empty!
                        </h1>
                        <p className="text-lg md:text-xl text-playful-foreground/80 mb-8 max-w-md mx-auto leading-relaxed">
                            Looks like you haven't found any magical treasures yet. Let's go on an adventure!
                        </p>

                        {/* Enhanced CTA section */}
                        <div className="space-y-6">
                            <Link href="/products">
                                <Button variant="default" size="lg" className="animate-wiggle text-lg px-8 py-4 shadow-2d hover:shadow-xl transform hover:-translate-y-1">
                                    🎪 Start Your Shopping Adventure
                                </Button>
                            </Link>

                            {/* Quick links */}
                            <div className="flex flex-wrap gap-4 justify-center pt-4">
                                <Link href="/products?category=Toys">
                                    <Button variant="outline" className="border-2 hover:bg-playful-accent/20">
                                        🧸 Toys
                                    </Button>
                                </Link>
                                <Link href="/products?category=Clothing">
                                    <Button variant="outline" className="border-2 hover:bg-playful-accent/20">
                                        👕 Clothes
                                    </Button>
                                </Link>
                                <Link href="/products?category=Care">
                                    <Button variant="outline" className="border-2 hover:bg-playful-accent/20">
                                        🧴 Care Products
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Fun fact or testimonial */}
                        <div className="mt-12 p-6 bg-white rounded-2xl border-2 border-playful-foreground shadow-2d max-w-md mx-auto">
                            <p className="text-sm text-playful-foreground/70 italic">
                                "Over 1,000 happy parents have found their perfect baby products here! ✨"
                            </p>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-playful-background font-sans">
            <Header />

            <main className="py-8 px-4">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-5xl font-bold text-playful-foreground mb-8 text-center animate-jump">My Treasure Chest</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {state.items.map((item, index) => (
                                <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow duration-300 border-2 border-playful-foreground/20">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                                        {/* Product image */}
                                        <Link href={`/product/${item.product.slug || item.product.id}`}>
                                            <div className="relative group">
                                                <Image
                                                    src={(item.product as any).image || (item.product.images && item.product.images[0]) || '/placeholder.svg'}
                                                    alt={`${item.product.name} - Product image`}
                                                    width={96}
                                                    height={96}
                                                    className="w-24 h-24 object-contain rounded-lg bg-white border-2 border-playful-foreground/20 hover:scale-105 transition-transform cursor-pointer shadow-sm"
                                                />
                                                <div className="absolute inset-0 bg-playful-primary/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                            </div>
                                        </Link>

                                        {/* Product details */}
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/product/${item.product.slug || item.product.id}`}>
                                                <h3 className="font-semibold text-lg text-playful-foreground mb-2 hover:text-playful-primary transition-colors cursor-pointer line-clamp-2">
                                                    {item.product.name}
                                                </h3>
                                            </Link>

                                            {/* Product variants */}
                                            {(item.color || item.size) && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {item.color && (
                                                        <span className="text-xs bg-playful-accent/20 text-playful-foreground px-2 py-1 rounded-full border">
                                                            Color: {item.color}
                                                        </span>
                                                    )}
                                                    {item.size && (
                                                        <span className="text-xs bg-playful-accent/20 text-playful-foreground px-2 py-1 rounded-full border">
                                                            Size: {item.size}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Price and savings */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="text-xl font-bold text-playful-primary">
                                                    ₹{item.product.specialPrice.toLocaleString('en-IN')}
                                                </p>
                                                {item.product.mrp > item.product.specialPrice && (
                                                    <>
                                                        <span className="text-sm text-playful-foreground/50 line-through">
                                                            ₹{item.product.mrp.toLocaleString('en-IN')}
                                                        </span>
                                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                                                            Save ₹{(item.product.mrp - item.product.specialPrice).toLocaleString('en-IN')}
                                                        </span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Item number */}
                                            <p className="text-xs text-playful-foreground/60">Item #{index + 1}</p>
                                        </div>

                                        {/* Quantity controls */}
                                        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
                                            <div className="flex items-center gap-2 bg-playful-accent/10 rounded-full p-1 border-2 border-playful-foreground/20">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-playful-primary/20"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-12 text-center font-bold text-lg px-2">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full hover:bg-playful-primary/20"
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <span className="text-sm text-playful-foreground/60">Qty</span>
                                        </div>

                                        {/* Item total and actions */}
                                        <div className="text-center sm:text-right space-y-2">
                                            <p className="text-xl font-bold text-playful-primary">
                                                ₹{(item.product.specialPrice * item.quantity).toLocaleString('en-IN')}
                                            </p>
                                            <div className="text-xs text-playful-foreground/60 mb-2">
                                                ₹{item.product.specialPrice.toLocaleString('en-IN')} × {item.quantity}
                                            </div>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                className="text-xs hover:scale-105 transition-transform shadow-sm"
                                                onClick={() => removeFromCart(item.id)}
                                            >
                                                <Trash2 className="h-3 w-3 mr-1" />
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="lg:col-span-1">
                            <Card className="p-6 sticky top-4 border-2 border-playful-foreground shadow-2d">
                                <CardHeader className="p-0 mb-6">
                                    <CardTitle className="text-3xl text-center text-playful-foreground">Order Summary</CardTitle>
                                    <p className="text-center text-sm text-playful-foreground/70 mt-2">
                                        {state.itemCount} item{state.itemCount !== 1 ? 's' : ''} in your cart
                                    </p>
                                </CardHeader>

                                <CardContent className="p-0 space-y-5">
                                    {/* Subtotal */}
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-playful-foreground/80">Subtotal</span>
                                        <span className="font-semibold text-playful-foreground">₹{subtotal.toLocaleString('en-IN')}</span>
                                    </div>

                                    {/* Shipping */}
                                    <div className="flex justify-between items-center text-lg">
                                        <span className="text-playful-foreground/80">Shipping</span>
                                        <span className="font-semibold">
                                            {shipping === 0 ? (
                                                <span className="text-green-600 font-bold animate-pulse">Free! 🚚</span>
                                            ) : (
                                                <span className="text-playful-foreground">₹{shipping.toLocaleString('en-IN')}</span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Free shipping progress */}
                                    {shipping > 0 && (
                                        <div className="bg-gradient-to-r from-playful-accent/20 to-playful-primary/20 p-4 rounded-xl border-2 border-dashed border-playful-primary/30">
                                            <div className="text-sm text-playful-foreground/80 text-center mb-2">
                                                <span className="font-semibold text-playful-primary">₹{(999 - subtotal).toLocaleString('en-IN')} more</span> for free shipping!
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-playful-primary to-playful-accent h-2 rounded-full transition-all duration-300"
                                                    style={{ width: `${Math.min((subtotal / 999) * 100, 100)}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Savings display */}
                                    {state.items.some(item => item.product.mrp > item.product.specialPrice) && (
                                        <div className="bg-green-50 p-3 rounded-lg border-2 border-green-200">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-green-700 font-medium">You're saving:</span>
                                                <span className="text-green-600 font-bold">
                                                    ₹{state.items.reduce((acc, item) =>
                                                        acc + ((item.product.mrp - item.product.specialPrice) * item.quantity), 0
                                                    ).toLocaleString('en-IN')}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    <Separator className="my-4 border-2 border-dashed border-playful-foreground/20" />

                                    {/* Total */}
                                    <div className="flex justify-between items-center text-2xl font-bold bg-playful-accent/10 p-4 rounded-xl">
                                        <span className="text-playful-foreground">Total</span>
                                        <span className="text-playful-primary">₹{total.toLocaleString('en-IN')}</span>
                                    </div>

                                    {/* Enhanced checkout buttons */}
                                    <div className="space-y-3 pt-4">
                                        <Button
                                            variant="default"
                                            size="lg"
                                            className="w-full flex items-center justify-center gap-3 animate-wiggle shadow-2d hover:shadow-xl transform hover:-translate-y-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                                            onClick={handleWhatsAppCheckout}
                                        >
                                            <Image
                                                src="/assets/whatsapp-icon.png"
                                                alt="WhatsApp icon"
                                                width={24}
                                                height={24}
                                                className="w-6 h-6"
                                            />
                                            <span className="font-semibold">Checkout on WhatsApp</span>
                                        </Button>

                                        {/* Trust indicators */}
                                        <div className="flex items-center justify-center gap-4 text-xs text-playful-foreground/60 py-2">
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                <span>Secure</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                <span>Fast Delivery</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                <span>Easy Returns</span>
                                            </div>
                                        </div>

                                        <Link href="/products" className="block">
                                            <Button variant="outline" size="lg" className="w-full border-2 hover:bg-playful-accent/10 transition-all">
                                                <ShoppingBag className="w-5 h-5 mr-2" />
                                                Continue Shopping
                                            </Button>
                                        </Link>

                                        {/* Additional info */}
                                        <div className="text-center text-xs text-playful-foreground/60 pt-2">
                                            <p>💝 Free gift wrapping on orders above ₹1,500</p>
                                            <p>🚚 Same-day delivery available in select cities</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import whatsappIcon from "@/assets/whatsapp-icon.png";

const Cart = () => {
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

    // Create message with cart items
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

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-playful-background font-sans">
        <Header />

        <main className="py-16 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="text-8xl mb-6 animate-bounce">🛒</div>
            <h1 className="text-4xl font-bold text-playful-foreground mb-4">Your Cart is Empty!</h1>
            <p className="text-lg text-playful-foreground/80 mb-8">
              Looks like you haven't found any treasures yet. Let's go find some!
            </p>
            <Link href="/products">
              <Button variant="default" size="lg" className="animate-shake">
                Start Shopping
              </Button>
            </Link>
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
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {state.items.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <Link href={`/product/${item.product.slug || item.product.id}`}>
                      <img
                        src={(item.product as any).image || (item.product.images && item.product.images[0]) || '/placeholder.svg'}
                        alt={item.product.name}
                        className="w-24 h-24 object-contain rounded-lg bg-white border-2 border-playful-foreground/20 hover:scale-105 transition-transform cursor-pointer"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1">
                      <Link href={`/product/${item.product.slug || item.product.id}`}>
                        <h3 className="font-semibold text-lg text-playful-foreground mb-1 hover:text-playful-primary transition-colors cursor-pointer">
                          {item.product.name}
                        </h3>
                      </Link>
                      {(item.color || item.size) && (
                        <div className="text-sm text-playful-foreground/80 mb-2">
                          {item.color && <span>Color: {item.color}</span>}
                          {item.color && item.size && <span> &bull; </span>}
                          {item.size && <span>Size: {item.size}</span>}
                        </div>
                      )}
                      <p className="text-xl font-bold text-playful-primary">
                        ₹{item.product.specialPrice}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-bold text-lg">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Total Price & Remove */}
                    <div className="text-right">
                      <p className="text-xl font-bold text-playful-primary mb-2">
                        ₹{item.product.specialPrice * item.quantity}
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs"
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

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <CardHeader className="p-0 mb-6">
                  <CardTitle className="text-3xl text-center">Order Summary</CardTitle>
                </CardHeader>

                <CardContent className="p-0 space-y-4">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal ({state.itemCount} items)</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between text-lg">
                    <span>Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free!</span>
                      ) : (
                        `₹${shipping}`
                      )}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-sm text-playful-foreground/80 text-center bg-playful-background p-2 rounded-lg border-2 border-dashed border-playful-foreground/30">
                      Add ₹{999 - subtotal} more for free shipping!
                    </div>
                  )}

                  <Separator className="my-4 border-2 border-dashed border-playful-foreground/20" />

                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-playful-primary">₹{total}</span>
                  </div>

                  <Button
                    variant="default"
                    size="lg"
                    className="w-full mt-6 flex items-center justify-center gap-3 animate-wiggle"
                    onClick={handleWhatsAppCheckout}
                  >
                    <img
                      src={whatsappIcon.src}
                      alt="WhatsApp"
                      className="w-6 h-6"
                    />
                    Checkout on WhatsApp
                  </Button>

                  <Link href="/products">
                    <Button variant="outline" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
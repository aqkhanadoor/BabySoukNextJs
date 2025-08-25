export interface Product {
  id: string;
  name: string;
  mrp: number;
  specialPrice: number;
  image: string;
  description: string;
  category: string;
  inStock: boolean;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Soft Plush Teddy Bear",
    mrp: 1299,
    specialPrice: 899,
    image: "/placeholder.svg",
    description: "Super soft and cuddly teddy bear perfect for babies and toddlers. Made with premium quality materials and completely safe for children.",
    category: "Toys",
    inStock: true
  },
  {
    id: "2", 
    name: "Organic Cotton Baby Onesie",
    mrp: 799,
    specialPrice: 599,
    image: "/placeholder.svg",
    description: "100% organic cotton onesie that's gentle on baby's sensitive skin. Available in multiple colors and sizes.",
    category: "Clothing",
    inStock: true
  },
  {
    id: "3",
    name: "Baby Care Gift Set",
    mrp: 1599,
    specialPrice: 1199,
    image: "/placeholder.svg", 
    description: "Complete baby care set including shampoo, lotion, powder and oil. All products are pediatrician approved and chemical-free.",
    category: "Care",
    inStock: true
  },
  {
    id: "4",
    name: "Educational Building Blocks",
    mrp: 999,
    specialPrice: 749,
    image: "/placeholder.svg",
    description: "Colorful building blocks that help develop motor skills and creativity. Made from non-toxic materials with smooth edges.",
    category: "Toys", 
    inStock: true
  },
  {
    id: "5",
    name: "Baby Winter Jacket",
    mrp: 1899,
    specialPrice: 1399,
    image: "/placeholder.svg",
    description: "Warm and cozy winter jacket to keep your baby comfortable. Water-resistant and machine washable.",
    category: "Clothing",
    inStock: false
  },
  {
    id: "6",
    name: "Natural Baby Soap",
    mrp: 299,
    specialPrice: 249,
    image: "/placeholder.svg",
    description: "Gentle and moisturizing baby soap made with natural ingredients. Perfect for daily use on delicate baby skin.",
    category: "Care",
    inStock: true
  }
];
export interface Product {
  id: string;
  name: string;
  mrp: number;
  specialPrice: number;
  image: string;
  description: string;
  category: string;
  subcategory: string;
  inStock: boolean;
  dateAdded: string;
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
    subcategory: "Stuffed Animals",
    inStock: true,
    dateAdded: "2024-01-15"
  },
  {
    id: "2", 
    name: "Organic Cotton Baby Onesie",
    mrp: 799,
    specialPrice: 599,
    image: "/placeholder.svg",
    description: "100% organic cotton onesie that's gentle on baby's sensitive skin. Available in multiple colors and sizes.",
    category: "Clothing",
    subcategory: "Bodysuits",
    inStock: true,
    dateAdded: "2024-01-20"
  },
  {
    id: "3",
    name: "Baby Care Gift Set",
    mrp: 1599,
    specialPrice: 1199,
    image: "/placeholder.svg", 
    description: "Complete baby care set including shampoo, lotion, powder and oil. All products are pediatrician approved and chemical-free.",
    category: "Care",
    subcategory: "Bath & Body",
    inStock: true,
    dateAdded: "2024-01-10"
  },
  {
    id: "4",
    name: "Educational Building Blocks",
    mrp: 999,
    specialPrice: 749,
    image: "/placeholder.svg",
    description: "Colorful building blocks that help develop motor skills and creativity. Made from non-toxic materials with smooth edges.",
    category: "Toys", 
    subcategory: "Learning Toys",
    inStock: true,
    dateAdded: "2024-01-18"
  },
  {
    id: "5",
    name: "Baby Winter Jacket",
    mrp: 1899,
    specialPrice: 1399,
    image: "/placeholder.svg",
    description: "Warm and cozy winter jacket to keep your baby comfortable. Water-resistant and machine washable.",
    category: "Clothing",
    subcategory: "Outerwear",
    inStock: false,
    dateAdded: "2024-01-12"
  },
  {
    id: "6",
    name: "Natural Baby Soap",
    mrp: 299,
    specialPrice: 249,
    image: "/placeholder.svg",
    description: "Gentle and moisturizing baby soap made with natural ingredients. Perfect for daily use on delicate baby skin.",
    category: "Care",
    subcategory: "Bath & Body",
    inStock: true,
    dateAdded: "2024-01-22"
  },
  {
    id: "7",
    name: "Baby Feeding Bottle Set",
    mrp: 899,
    specialPrice: 699,
    image: "/placeholder.svg",
    description: "BPA-free feeding bottles with anti-colic design. Perfect for transitioning from breastfeeding to bottle feeding.",
    category: "Feeding",
    subcategory: "Bottles",
    inStock: true,
    dateAdded: "2024-01-25"
  },
  {
    id: "8",
    name: "Musical Activity Toy",
    mrp: 1499,
    specialPrice: 1199,
    image: "/placeholder.svg",
    description: "Interactive musical toy that stimulates baby's senses with lights, sounds, and textures. Great for cognitive development.",
    category: "Toys",
    subcategory: "Musical Toys",
    inStock: true,
    dateAdded: "2024-01-28"
  },
  {
    id: "9",
    name: "Baby Sleep Suit",
    mrp: 699,
    specialPrice: 499,
    image: "/placeholder.svg",
    description: "Comfortable sleep suit made from breathable cotton. Designed for a peaceful night's sleep for your little one.",
    category: "Clothing",
    subcategory: "Sleepwear",
    inStock: true,
    dateAdded: "2024-01-30"
  },
  {
    id: "10",
    name: "Baby Massage Oil",
    mrp: 399,
    specialPrice: 299,
    image: "/placeholder.svg",
    description: "Natural massage oil enriched with coconut and almond oil. Perfect for baby's daily massage routine.",
    category: "Care",
    subcategory: "Massage & Skincare",
    inStock: true,
    dateAdded: "2024-02-01"
  },
  {
    id: "11",
    name: "High Chair for Feeding",
    mrp: 3999,
    specialPrice: 2999,
    image: "/placeholder.svg",
    description: "Adjustable high chair with safety harness and removable tray. Perfect for meal times and easy to clean.",
    category: "Furniture",
    subcategory: "High Chairs",
    inStock: true,
    dateAdded: "2024-02-03"
  },
  {
    id: "12",
    name: "Baby Walker with Toys",
    mrp: 2499,
    specialPrice: 1899,
    image: "/placeholder.svg",
    description: "Colorful baby walker with interactive toys and music. Helps baby learn to walk while having fun.",
    category: "Toys",
    subcategory: "Activity Toys",
    inStock: true,
    dateAdded: "2024-02-05"
  }
];

export const categories = [
  {
    name: "Toys",
    subcategories: ["Stuffed Animals", "Learning Toys", "Musical Toys", "Activity Toys"]
  },
  {
    name: "Clothing", 
    subcategories: ["Bodysuits", "Outerwear", "Sleepwear", "Accessories"]
  },
  {
    name: "Care",
    subcategories: ["Bath & Body", "Massage & Skincare", "Diapers & Wipes"]
  },
  {
    name: "Feeding",
    subcategories: ["Bottles", "Bowls & Spoons", "High Chairs"]
  },
  {
    name: "Furniture",
    subcategories: ["High Chairs", "Cribs & Beds", "Storage"]
  }
];
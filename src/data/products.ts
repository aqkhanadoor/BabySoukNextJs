import teddyBearImg from "@/assets/products/teddy-bear.jpg";
import babyOnesieImg from "@/assets/products/baby-onesie.jpg";
import babyCareSetImg from "@/assets/products/baby-care-set.jpg";
import buildingBlocksImg from "@/assets/products/building-blocks.jpg";
import winterJacketImg from "@/assets/products/winter-jacket.jpg";
import babySoapImg from "@/assets/products/baby-soap.jpg";
import feedingBottlesImg from "@/assets/products/feeding-bottles.jpg";
import musicalToyImg from "@/assets/products/musical-toy.jpg";
import sleepSuitImg from "@/assets/products/sleep-suit.jpg";
import massageOilImg from "@/assets/products/massage-oil.jpg";
import highChairImg from "@/assets/products/high-chair.jpg";
import babyWalkerImg from "@/assets/products/baby-walker.jpg";

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
    image: teddyBearImg,
    description: "Super soft and cuddly teddy bear perfect for babies and toddlers. Made with premium quality materials and completely safe for children. This adorable teddy bear is crafted from hypoallergenic fabrics and filled with high-quality stuffing that maintains its shape even after countless hugs. The embroidered eyes and nose ensure safety for young children, while the neutral brown color makes it suitable for any nursery decor.",
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
    image: babyOnesieImg,
    description: "100% organic cotton onesie that's gentle on baby's sensitive skin. Available in multiple colors and sizes. This premium onesie is made from GOTS-certified organic cotton, ensuring no harmful chemicals touch your baby's delicate skin. Features convenient snap closures for easy diaper changes and reinforced seams for durability through countless washes.",
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
    image: babyCareSetImg, 
    description: "Complete baby care set including shampoo, lotion, powder and oil. All products are pediatrician approved and chemical-free. This comprehensive set contains everything you need for your baby's daily care routine. The tear-free shampoo, moisturizing lotion, gentle powder, and nourishing massage oil are all made with natural ingredients and free from parabens, sulfates, and artificial fragrances.",
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
    image: buildingBlocksImg,
    description: "Colorful building blocks that help develop motor skills and creativity. Made from non-toxic materials with smooth edges. These 50-piece wooden blocks feature letters, numbers, and fun shapes that encourage learning through play. Each block is sanded smooth and finished with non-toxic, water-based paints that are safe for toddlers who love to explore with their mouths.",
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
    image: winterJacketImg,
    description: "Warm and cozy winter jacket to keep your baby comfortable. Water-resistant and machine washable. This premium winter jacket features a soft fleece lining and water-resistant outer shell to keep your little one warm and dry. The full-zip front makes dressing easy, while the hood provides extra protection from wind and cold weather.",
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
    image: babySoapImg,
    description: "Gentle and moisturizing baby soap made with natural ingredients. Perfect for daily use on delicate baby skin. This handcrafted soap is made with organic coconut oil, shea butter, and chamomile extract to cleanse and moisturize without irritation. Free from harsh chemicals, synthetic fragrances, and artificial colors.",
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
    image: feedingBottlesImg,
    description: "BPA-free feeding bottles with anti-colic design. Perfect for transitioning from breastfeeding to bottle feeding. This set includes three bottles in different sizes (4oz, 6oz, 9oz) with slow, medium, and fast flow nipples. The wide-neck design makes filling and cleaning easy, while the anti-colic vent system reduces gas and fussiness.",
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
    image: musicalToyImg,
    description: "Interactive musical toy that stimulates baby's senses with lights, sounds, and textures. Great for cognitive development. This engaging activity center features 15 different melodies, colorful LED lights, and various textures to explore. Helps develop hand-eye coordination, cause-and-effect understanding, and auditory skills in babies 6 months and up.",
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
    image: sleepSuitImg,
    description: "Comfortable sleep suit made from breathable cotton. Designed for a peaceful night's sleep for your little one. This cozy sleep suit features a two-way zipper for easy diaper changes and fold-over mittens to prevent scratching. Made from organic cotton that's gentle on sensitive skin and helps regulate body temperature for better sleep.",
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
    image: massageOilImg,
    description: "Natural massage oil enriched with coconut and almond oil. Perfect for baby's daily massage routine. This premium blend contains cold-pressed coconut oil, sweet almond oil, and vitamin E to nourish and protect delicate baby skin. Regular massage with this oil helps improve circulation, promotes better sleep, and strengthens the parent-child bond.",
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
    image: highChairImg,
    description: "Adjustable high chair with safety harness and removable tray. Perfect for meal times and easy to clean. This versatile high chair grows with your child from 6 months to toddler years. Features 6 height positions, 3 recline positions, and a 5-point safety harness. The removable tray is dishwasher safe, and the chair folds flat for storage.",
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
    image: babyWalkerImg,
    description: "Colorful baby walker with interactive toys and music. Helps baby learn to walk while having fun. This activity walker features a removable electronic toy bar with lights, sounds, and music. The padded seat rotates 360 degrees, and the walker folds flat for storage. Suitable for babies who can hold their head up unassisted, typically 4-16 months.",
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
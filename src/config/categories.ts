export interface CategoryConfig {
  name: string;
  subcategories: string[];
}

// Migrated from old static products data
export const categories: CategoryConfig[] = [
  { name: "Toys", subcategories: ["Stuffed Animals", "Learning Toys", "Musical Toys", "Activity Toys"] },
  { name: "Clothing", subcategories: ["Bodysuits", "Outerwear", "Sleepwear", "Accessories"] },
  { name: "Care", subcategories: ["Bath & Body", "Massage & Skincare", "Diapers & Wipes"] },
  { name: "Feeding", subcategories: ["Bottles", "Bowls & Spoons", "High Chairs"] },
  { name: "Furniture", subcategories: ["High Chairs", "Cribs & Beds", "Storage"] },
];

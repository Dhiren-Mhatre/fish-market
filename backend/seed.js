import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "./models/Category.js";
import Item from "./models/Item.js";

dotenv.config();

const itemsData = [
  { itemName: "Large Green King Prawns", order: 1, unit: "kg" },
  { itemName: "Medium Green King Prawns", order: 2, unit: "kg" },
  { itemName: "Green Prawn Cutlets", order: 3, unit: "kg" },
  { itemName: "Large Cooked King Prawns", order: 4, unit: "kg" },
  { itemName: "Large Cooked Tiger Prawns", order: 5, unit: "kg" },
  { itemName: "Medium Cooked Tiger Prawns", order: 6, unit: "kg" },
  { itemName: "Cooked Crystal Bays", order: 7, unit: "kg" },
  { itemName: "Wild Caught Tiger Prawns", order: 8, unit: "kg" },
  { itemName: "Cooked Blue Swimmer Crabs", order: 9, unit: "pcs" },
  { itemName: "Green Blue Swimmer Crabs", order: 10, unit: "pcs" },
  { itemName: "Large Snapper - 2kg to 4kg", order: 11, unit: "pos" },
  { itemName: "Medium Snapper - 1kg to 2kg", order: 12, unit: "pos" },
  { itemName: "Chris Boiton Coral Trout", order: 13, unit: "pos" },
  { itemName: "Ocean Trout", order: 14, unit: "pos" },
  { itemName: "Salmon - 2 to 3kg", order: 15, unit: "pcs" },
  { itemName: "Salmon - 3 to 4kg", order: 16, unit: "pcs" },
  { itemName: "Sydney Rock Oysters", order: 17, unit: "doz" },
  { itemName: "Large Sydney Rock Oysters", order: 18, unit: "doz" },
  { itemName: "Pacific Oysters", order: 19, unit: "doz" },
  { itemName: "Unshucked LIVE Sydney Rocks", order: 20, unit: "doz" },
  { itemName: "Black Mussels 1kg Bag", order: 21, unit: "doz" },
  { itemName: "Sashimi Salmon", order: 22, unit: "kg" },
  { itemName: "Sashimi Tuna", order: 23, unit: "kg" },
  { itemName: "100g Smoked Salmon", order: 24, unit: "pkt" },
  { itemName: "250g Smoked Salmon", order: 25, unit: "pkt" },
  { itemName: "500g Smoked Salmon", order: 26, unit: "pkt" },
  { itemName: "1kg Smoked Salmon", order: 27, unit: "pkt" },
  { itemName: "50g Salmon Roe", order: 28, unit: "jar" },
  { itemName: "100g Salmon Roe", order: 29, unit: "jar" },
  { itemName: "Palanco Caviar 30g", order: 30, unit: "jar" },
  { itemName: "Palanco Caviar 50g", order: 31, unit: "jar" },
  { itemName: "Cocktail Sauce", order: 32, unit: "pcs" },
  { itemName: "Tartare Sauce", order: 33, unit: "pcs" },
  { itemName: "WA/TAS/SA Lobsters", order: 34, unit: "pcs" },
  { itemName: "Local Lobsters", order: 35, unit: "pcs" },
  { itemName: "Lobster Tails - Raw", order: 36, unit: "pcs" },
  { itemName: "Cooked Bugs", order: 37, unit: "pcs" },
  { itemName: "King Crab Legs", order: 38, unit: "pcs" },
  { itemName: "Live Mud Crabs", order: 39, unit: "pcs" },
  { itemName: "Barramundi Fillets", order: 40, unit: "pos" },
  { itemName: "Salmon Fillets Skin On", order: 41, unit: "pcs" },
  { itemName: "Sea Perch Fillets", order: 42, unit: "pos" },
];

const categoriesData = [
  {
    categoryName: "RAW PRAWNS",
    isActive: true,
    order: 1,
    items: ["Large Green King Prawns", "Medium Green King Prawns", "Green Prawn Cutlets"],
  },
  {
    categoryName: "COOKED PRAWNS",
    isActive: true,
    order: 2,
    items: ["Large Cooked King Prawns", "Large Cooked Tiger Prawns", "Medium Cooked Tiger Prawns", "Cooked Crystal Bays"],
  },
  {
    categoryName: "WHOLE FISH",
    isActive: true,
    order: 3,
    items: [
      "Large Snapper - 2kg to 4kg",
      "Medium Snapper - 1kg to 2kg",
      "Chris Boiton Coral Trout",
      "Ocean Trout",
      "Salmon - 2 to 3kg",
      "Salmon - 3 to 4kg",
    ],
  },
  {
    categoryName: "MOLLUSCS",
    isActive: true,
    order: 4,
    items: ["Sydney Rock Oysters", "Large Sydney Rock Oysters", "Pacific Oysters", "Unshucked LIVE Sydney Rocks", "Black Mussels 1kg Bag"],
  },
  {
    categoryName: "SMOKED",
    isActive: true,
    order: 5,
    items: ["100g Smoked Salmon", "250g Smoked Salmon", "500g Smoked Salmon", "1kg Smoked Salmon"],
  },
  {
    categoryName: "SAUCES",
    isActive: true,
    order: 6,
    items: ["Cocktail Sauce", "Tartare Sauce"],
  },
  {
    categoryName: "CRUSTACEANS",
    isActive: true,
    order: 7,
    items: ["WA/TAS/SA Lobsters", "Local Lobsters", "Lobster Tails - Raw", "Cooked Bugs", "King Crab Legs", "Live Mud Crabs"],
  },
  {
    categoryName: "FILLETS",
    isActive: true,
    order: 8,
    items: ["Barramundi Fillets", "Salmon Fillets Skin On", "Sea Perch Fillets"],
  },
  {
    categoryName: "CAVIAR",
    isActive: true,
    order: 9,
    items: ["50g Salmon Roe", "100g Salmon Roe", "Palanco Caviar 30g", "Palanco Caviar 50g"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany();
    await Item.deleteMany();

    // Insert items
    const createdItems = await Item.insertMany(itemsData);

    // Map item names to item IDs
    const itemMap = createdItems.reduce((acc, item) => {
      acc[item.itemName] = item._id;
      return acc;
    }, {});

    // Update categories to use item IDs instead of names
    const updatedCategories = categoriesData.map((category) => ({
      ...category,
      items: category.items.map((itemName) => itemMap[itemName]),
    }));

    // Insert categories
    await Category.insertMany(updatedCategories);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();

import mongoose from "mongoose";
 
import Category from "./models/Category.js";
import Item from "./models/Item.js";
 
 
import dotenv from 'dotenv';
dotenv.config();
const itemsData = [
  { itemName: "Large Green King Prawns", sequenceNumber: 1 },
  { itemName: "Medium Green King Prawns", sequenceNumber: 2 },
  { itemName: "Green Prawn Cutlets", sequenceNumber: 3 },
  { itemName: "Large Cooked King Prawns", sequenceNumber: 4 },
  { itemName: "Large Cooked Tiger Prawns", sequenceNumber: 5 },
  { itemName: "Medium Cooked Tiger Prawns", sequenceNumber: 6 },
  { itemName: "Cooked Crystal Bays", sequenceNumber: 7 },
  { itemName: "Wild Caught Tiger Prawns", sequenceNumber: 8 },
  { itemName: "Cooked Blue Swimmer Crabs", sequenceNumber: 9 },
  { itemName: "Green Blue Swimmer Crabs", sequenceNumber: 10 },
  { itemName: "Large Snapper - 2kg to 4kg", sequenceNumber: 11 },
  { itemName: "Medium Snapper - 1kg to 2kg", sequenceNumber: 12 },
  { itemName: "Chris Boiton Coral Trout", sequenceNumber: 13 },
  { itemName: "Ocean Trout", sequenceNumber: 14 },
  { itemName: "Salmon - 2 to 3kg", sequenceNumber: 15 },
  { itemName: "Salmon - 3 to 4kg", sequenceNumber: 16 },
  { itemName: "Sydney Rock Oysters", sequenceNumber: 17 },
  { itemName: "Large Sydney Rock Oysters", sequenceNumber: 18 },
  { itemName: "Pacific Oysters", sequenceNumber: 19 },
  { itemName: "Unshucked LIVE Sydney Rocks", sequenceNumber: 20 },
  { itemName: "Black Mussels 1kg Bag", sequenceNumber: 21 },
  { itemName: "Sashimi Salmon", sequenceNumber: 22 },
  { itemName: "Sashimi Tuna", sequenceNumber: 23 },
  { itemName: "100g Smoked Salmon", sequenceNumber: 24 },
  { itemName: "250g Smoked Salmon", sequenceNumber: 25 },
  { itemName: "500g Smoked Salmon", sequenceNumber: 26 },
  { itemName: "1kg Smoked Salmon", sequenceNumber: 27 },
  { itemName: "50g Salmon Roe", sequenceNumber: 28 },
  { itemName: "100g Salmon Roe", sequenceNumber: 29 },
  { itemName: "Palanco Caviar 30g", sequenceNumber: 30 },
  { itemName: "Palanco Caviar 50g", sequenceNumber: 31 },
  { itemName: "Cocktail Sauce", sequenceNumber: 32 },
  { itemName: "Tartare Sauce", sequenceNumber: 33 },
  { itemName: "WA/TAS/SA Lobsters", sequenceNumber: 34 },
  { itemName: "Local Lobsters", sequenceNumber: 35 },
  { itemName: "Lobster Tails - Raw", sequenceNumber: 36 },
  { itemName: "Cooked Bugs", sequenceNumber: 37 },
  { itemName: "King Crab Legs", sequenceNumber: 38 },
  { itemName: "Live Mud Crabs", sequenceNumber: 39 },
  { itemName: "Barramundi Fillets", sequenceNumber: 40 },
  { itemName: "Salmon Fillets Skin On", sequenceNumber: 41 },
  { itemName: "Sea Perch Fillets", sequenceNumber: 42 },
];

const categoriesData = [
  {
    categoryName: "RAW PRAWNS",
    isActive: true,
    sequenceNumber: 1,
    items: ["Large Green King Prawns", "Medium Green King Prawns", "Green Prawn Cutlets"],
  },
  {
    categoryName: "COOKED PRAWNS",
    isActive: true,
    sequenceNumber: 2,
    items: ["Large Cooked King Prawns", "Large Cooked Tiger Prawns", "Medium Cooked Tiger Prawns", "Cooked Crystal Bays"],
  },
  {
    categoryName: "WHOLE FISH",
    isActive: true,
    sequenceNumber: 3,
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
    sequenceNumber: 4,
    items: ["Sydney Rock Oysters", "Large Sydney Rock Oysters", "Pacific Oysters", "Unshucked LIVE Sydney Rocks", "Black Mussels 1kg Bag"],
  },
  {
    categoryName: "SMOKED",
    isActive: true,
    sequenceNumber: 5,
    items: ["100g Smoked Salmon", "250g Smoked Salmon", "500g Smoked Salmon", "1kg Smoked Salmon"],
  },
  {
    categoryName: "SAUCES",
    isActive: true,
    sequenceNumber: 6,
    items: ["Cocktail Sauce", "Tartare Sauce"],
  },
  {
    categoryName: "CRUSTACEANS",
    isActive: true,
    sequenceNumber: 7,
    items: ["WA/TAS/SA Lobsters", "Local Lobsters", "Lobster Tails - Raw", "Cooked Bugs", "King Crab Legs", "Live Mud Crabs"],
  },
  {
    categoryName: "FILLETS",
    isActive: true,
    sequenceNumber: 8,
    items: ["Barramundi Fillets", "Salmon Fillets Skin On", "Sea Perch Fillets"],
  },
  {
    categoryName: "CAVIAR",
    isActive: true,
    sequenceNumber: 9,
    items: ["50g Salmon Roe", "100g Salmon Roe", "Palanco Caviar 30g", "Palanco Caviar 50g"],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
 
    await Category.deleteMany();
    await Item.deleteMany();
    

    const createdItems = await Item.insertMany(itemsData);

    const itemMap = createdItems.reduce((acc, item) => {
      acc[item.itemName] = item._id;
      return acc;
    }, {});

    const updatedCategories = categoriesData.map((category) => ({
      ...category,
      items: category.items.map((itemName) => itemMap[itemName]),
    }));

    await Category.insertMany(updatedCategories);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();

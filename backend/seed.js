import mongoose from "mongoose";
import UserMaster from "./models/User.js";
import Category from "./models/Category.js";
import Item from "./models/Item.js";
import OrderDetails from "./models/OrderDetails.js";
import OrderHistory from "./models/OrderHistory.js";
import dotenv from 'dotenv';
const itemsData = [
  { itemName: "Large Green King Prawns", sequenceNumber: 1 },
  { itemName: "Medium Green King Prawns", sequenceNumber: 2 },
  { itemName: "Green Prawn Cutlets", sequenceNumber: 3 },
  { itemName: "Peeled Tail Off Prawns", sequenceNumber: 4 },
  { itemName: "Banana Prawns", sequenceNumber: 5 },
  { itemName: "Endeavour Prawns", sequenceNumber: 6 },
  { itemName: "Large Cooked Tiger Prawns", sequenceNumber: 7 },
  { itemName: "Medium Cooked Tiger Prawns", sequenceNumber: 8 },
  { itemName: "Cooked Crystal Bay Prawns", sequenceNumber: 9 },
  { itemName: "Cooked Endeavour Prawns", sequenceNumber: 10 },
  { itemName: "Cooked Banana Prawns", sequenceNumber: 11 },
  { itemName: "Australian Salmon", sequenceNumber: 12 },
  { itemName: "Red Emperor", sequenceNumber: 13 },
  { itemName: "Flathead", sequenceNumber: 14 },
  { itemName: "Coral Trout", sequenceNumber: 15 },
  { itemName: "Yellowtail Kingfish", sequenceNumber: 16 },
  { itemName: "Atlantic Salmon", sequenceNumber: 17 },
  { itemName: "Mud Crab", sequenceNumber: 18 },
  { itemName: "Blue Swimmer Crab", sequenceNumber: 19 },
  { itemName: "Snow Crab", sequenceNumber: 20 },
  { itemName: "King Crab", sequenceNumber: 21 },
  { itemName: "Australian Lobster", sequenceNumber: 22 },
  { itemName: "Canadian Lobster", sequenceNumber: 23 },
  { itemName: "Lobster Tails", sequenceNumber: 24 },
  { itemName: "Sydney Rock Oysters", sequenceNumber: 25 },
  { itemName: "Pacific Oysters", sequenceNumber: 26 },
  { itemName: "Angasi Oysters", sequenceNumber: 27 },
  { itemName: "Frozen Scallops", sequenceNumber: 28 },
  { itemName: "Frozen Squid", sequenceNumber: 29 },
  { itemName: "Frozen Calamari Rings", sequenceNumber: 30 },
  { itemName: "Frozen Barramundi Fillets", sequenceNumber: 31 },
  { itemName: "Frozen Tuna Steaks", sequenceNumber: 32 },
];

const categoriesData = [
  {
    categoryName: "RAW PRAWNS",
    isActive: true,
    sequenceNumber: 1,
    items: [
      "Large Green King Prawns",
      "Medium Green King Prawns",
      "Green Prawn Cutlets",
      "Peeled Tail Off Prawns",
      "Banana Prawns",
      "Endeavour Prawns",
    ],
  },
  {
    categoryName: "COOKED SEAFOOD",
    isActive: true,
    sequenceNumber: 2,
    items: [
      "Large Cooked Tiger Prawns",
      "Medium Cooked Tiger Prawns",
      "Cooked Crystal Bay Prawns",
      "Cooked Endeavour Prawns",
      "Cooked Banana Prawns",
    ],
  },
  {
    categoryName: "FRESH FISH",
    isActive: true,
    sequenceNumber: 3,
    items: [
      "Australian Salmon",
      "Red Emperor",
      "Flathead",
      "Coral Trout",
      "Yellowtail Kingfish",
      "Atlantic Salmon",
    ],
  },
  {
    categoryName: "CRABS",
    isActive: true,
    sequenceNumber: 4,
    items: ["Mud Crab", "Blue Swimmer Crab", "Snow Crab", "King Crab"],
  },
  {
    categoryName: "LOBSTER",
    isActive: true,
    sequenceNumber: 5,
    items: ["Australian Lobster", "Canadian Lobster", "Lobster Tails"],
  },
  {
    categoryName: "OYSTERS",
    isActive: true,
    sequenceNumber: 6,
    items: ["Sydney Rock Oysters", "Pacific Oysters", "Angasi Oysters"],
  },
  {
    categoryName: "FROZEN SEAFOOD",
    isActive: true,
    sequenceNumber: 7,
    items: [
      "Frozen Scallops",
      "Frozen Squid",
      "Frozen Calamari Rings",
      "Frozen Barramundi Fillets",
      "Frozen Tuna Steaks",
    ],
  },
];

// Seed script
const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");

    // Clear existing collections
    await UserMaster.deleteMany();
    await Category.deleteMany();
    await Item.deleteMany();
    await OrderDetails.deleteMany();
    await OrderHistory.deleteMany();

    // Create items
    const createdItems = await Item.insertMany(itemsData);

    // Map item names to their ObjectIds
    const itemMap = createdItems.reduce((acc, item) => {
      acc[item.itemName] = item._id;
      return acc;
    }, {});

    // Update categories with item references
    const updatedCategories = categoriesData.map((category) => ({
      ...category,
      items: category.items.map((itemName) => itemMap[itemName]),
    }));

    // Insert categories with referenced items
    await Category.insertMany(updatedCategories);

    console.log("Data seeded successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    mongoose.connection.close();
  }
};

seed();

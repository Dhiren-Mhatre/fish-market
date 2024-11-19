import mongoose from "mongoose";
import dotenv from "dotenv";

import Category from "./models/Category.js";
import Item from "./models/Item.js";

dotenv.config();

const itemsData = [
  { itemName: "Large Green King Prawns", order: 1, unit: "kg", price: 10, img: " https://res.cloudinary.com/dguy5exjy/image/upload/v1732014110/your-cloudinary-folder-name/egaqyvu4avjqkfwvsola.jpg", },
  { itemName: "Medium Green King Prawns", order: 2, unit: "kg", price: 15,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014115/your-cloudinary-folder-name/sw9qbv9xhoovf76rzorr.jpg" },
  { itemName: "Green Prawn Cutlets", order: 3, unit: "kg", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014105/your-cloudinary-folder-name/evfj0rwiq8nizprkzbft.jpg"},
  { itemName: "Large Cooked King Prawns", order: 4, unit: "kg", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014107/your-cloudinary-folder-name/cfzhs6owp6j33fo21rlv.jpg"},
  { itemName: "Large Cooked Tiger Prawns", order: 5, unit: "kg", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014108/your-cloudinary-folder-name/n1fju7wvkqcablszdhuy.jpg"},
  { itemName: "Medium Cooked Tiger Prawns", order: 6, unit: "kg", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014114/your-cloudinary-folder-name/yotdaibycamoydym1jaa.jpg"},
  { itemName: "Cooked Crystal Bays", order: 7, unit: "kg", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014104/your-cloudinary-folder-name/bejoqzpjlbhtwchazzey.jpg"},
  { itemName: "Wild Caught Tiger Prawns", order: 8, unit: "kg", price: 10 ,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732014114/your-cloudinary-folder-name/yotdaibycamoydym1jaa.jpg"},
  { itemName: "Cooked Blue Swimmer Crabs", order: 9, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014112/your-cloudinary-folder-name/u4hooe6ek4gacvr1m2w5.jpg"},
  { itemName: "Green Blue Swimmer Crabs", order: 10, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014112/your-cloudinary-folder-name/u4hooe6ek4gacvr1m2w5.jpg"},
  { itemName: "Large Snapper - 2kg to 4kg", order: 11, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014111/your-cloudinary-folder-name/gn4byfuxgckxjfplaq84.jpg"},
  { itemName: "Medium Snapper - 1kg to 2kg", order: 12, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014128/your-cloudinary-folder-name/ejomfccqf6do4eb72qfo.jpg"},
  { itemName: "Chris Boiton Coral Trout", order: 13, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014101/your-cloudinary-folder-name/xwsuviggxtbiwijr0taq.jpg"},
  { itemName: "Ocean Trout", order: 14, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014116/your-cloudinary-folder-name/anw1ecdscrww7crwtmuj.jpg" },
  { itemName: "Salmon - 2 to 3kg", order: 15, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014129/your-cloudinary-folder-name/ayd40oqu4y23d5xrjkdy.jpg"},
  { itemName: "Salmon - 3 to 4kg", order: 16, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732023333/your-cloudinary-folder-name/zgzplb5nqoffo4uz9v6f.jpg"},
  { itemName: "Sydney Rock Oysters", order: 17, unit: "doz", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014128/your-cloudinary-folder-name/s8posipmxqsgyly4sysu.jpg"},
  { itemName: "Large Sydney Rock Oysters", order: 18, unit: "doz", price: 10 ,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732023331/your-cloudinary-folder-name/vmowj1gcseyjgkjtnhhs.jpg"},
  { itemName: "Pacific Oysters", order: 19, unit: "doz", price: 10 ,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732014117/your-cloudinary-folder-name/luf1jtonfn67bfdw5do6.jpg"},
  { itemName: "Unshucked LIVE Sydney Rocks", order: 20, unit: "doz", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014126/your-cloudinary-folder-name/dbss2cz2hg1da1ppay4o.jpg"},
  { itemName: "Black Mussels 1kg Bag", order: 21, unit: "doz", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732014127/your-cloudinary-folder-name/n2ogzookarwhw6ilfjbu.jpg" },
  { itemName: "Sashimi Salmon", order: 22, unit: "kg", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732023333/your-cloudinary-folder-name/a1uknjf2pmbyg5idijrd.jpg" },
  { itemName: "Sashimi Tuna", order: 23, unit: "kg", price: 10,img:"" },
  { itemName: "100g Smoked Salmon", order: 24, unit: "pkt", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732024109/your-cloudinary-folder-name/kmniyfxy1je8pm0xmgad.jpg" },
  { itemName: "250g Smoked Salmon", order: 25, unit: "pkt", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732023334/your-cloudinary-folder-name/lqpppnzzrx5griv72s8a.jpg" },
  { itemName: "500g Smoked Salmon", order: 26, unit: "pkt", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732024108/your-cloudinary-folder-name/vb2nzc4mmsjxt49wdv1j.jpg" },
  { itemName: "1kg Smoked Salmon", order: 27, unit: "pkt", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732023333/your-cloudinary-folder-name/zgzplb5nqoffo4uz9v6f.jpg"},
  { itemName: "50g Salmon Roe", order: 28, unit: "jar", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014099/your-cloudinary-folder-name/mrksowyamzugblwtrfy4.jpg" },
  { itemName: "100g Salmon Roe", order: 29, unit: "jar", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732023335/your-cloudinary-folder-name/owfltozqpc3yhix2m0bf.jpg"},
  { itemName: "Palanco Caviar 30g", order: 30, unit: "jar", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732023330/your-cloudinary-folder-name/ksxcfej1pi1srpm0uesn.jpg" },
  { itemName: "Palanco Caviar 50g", order: 31, unit: "jar", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014118/your-cloudinary-folder-name/gw6ezfou5ochan6aorql.jpg" },
  { itemName: "Cocktail Sauce", order: 32, unit: "pcs", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732014102/your-cloudinary-folder-name/gsw5ygvzpv5mbsup3vb2.jpg" },
  { itemName: "Tartare Sauce", order: 33, unit: "pcs", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732014125/your-cloudinary-folder-name/wdbxpjwdlhpqcecsn1iu.jpg" },
  { itemName: "WA/TAS/SA Lobsters", order: 34, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014121/your-cloudinary-folder-name/p6vbekmvcnj0i5vtoukr.png" },
  { itemName: "Local Lobsters", order: 35, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014114/your-cloudinary-folder-name/leklrjpvpapv2ubtwz3f.jpg"},
  { itemName: "Lobster Tails - Raw", order: 36, unit: "pcs", price: 10 ,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014113/your-cloudinary-folder-name/lxizrv4nsj9d5hndbh0w.jpg"},
  { itemName: "Cooked Bugs", order: 37, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732021679/your-cloudinary-folder-name/jlijvdq0pv8wvt6o7tt3.jpg" },
  { itemName: "King Crab Legs", order: 38, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014106/your-cloudinary-folder-name/rt4cfbmzlakqwszldnwj.jpg" },
  { itemName: "Live Mud Crabs", order: 39, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014112/your-cloudinary-folder-name/u4hooe6ek4gacvr1m2w5.jpg" },
  { itemName: "Barramundi Fillets", order: 40, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014100/your-cloudinary-folder-name/zztnlcudfng53soqpfim.jpg" },
  { itemName: "Salmon Fillets Skin On", order: 41, unit: "pcs", price: 10,img:"https://res.cloudinary.com/dguy5exjy/image/upload/v1732014122/your-cloudinary-folder-name/kew8tnwdlfgx5fjksez6.jpg" },
  { itemName: "Sea Perch Fillets", order: 42, unit: "pcs", price: 10,img:" https://res.cloudinary.com/dguy5exjy/image/upload/v1732014123/your-cloudinary-folder-name/rm5fldt6zrkjzfyezij2.jpg" },
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
    items: ["Large Cooked King Prawns", "Large Cooked Tiger Prawns" , "Cooked Crystal Bays"],
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

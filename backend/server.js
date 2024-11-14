import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import orderDetailsRoutes from "./routes/orderDetailsRoutes.js";
import orderHistoryRoutes from "./routes/orderHistoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import https from "https"; 
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors()); // Enabling CORS for all routes
app.use(bodyParser.json()); // Parse incoming JSON requests

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// Routes
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/order-details", orderDetailsRoutes);
app.use("/api/order-history", orderHistoryRoutes);
app.use("/api/users", userRoutes);

// Basic home route
app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});
// const serverURL = `${process.env.OPO}`; // Ensure this uses the correct protocol (http or https)

// setInterval(() => {
//   https.get(serverURL, (res) => { // Change to https.get if using HTTP
//     console.log(`Server pinged: ${res.statusCode}`);
//   }).on("error", (err) => {
//     console.error("Error pinging the server:", err.message);
//   });
// }, 600000);
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

import express from "express";
import {
  getOrderHistory,
  updateOrderHistory,
  deleteOrderHistory,
  createOrderHistory,
  getAllOrderHistory,
} from "../controllers/orderHistoryController.js";

const router = express.Router();

router.route("/").get(getAllOrderHistory).post(createOrderHistory);
router.route("/:id").get(getOrderHistory).put(updateOrderHistory).delete(deleteOrderHistory);

export default router;

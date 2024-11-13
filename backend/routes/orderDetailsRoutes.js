import express from "express";
import {
  getOrderDetails,
  updateOrderDetails,
  deleteOrderDetails,
  createOrderDetails,
  getAllOrderDetails,
  getLatestOrderNumber,
} from "../controllers/orderDetailsController.js";

const router = express.Router();

router.route("/").get(getAllOrderDetails).post(createOrderDetails);
router.route("/:id").get(getOrderDetails).put(updateOrderDetails).delete(deleteOrderDetails);
 

router.get('/latest-order-number', getLatestOrderNumber);
 

export default router;

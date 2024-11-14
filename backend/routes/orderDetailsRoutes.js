import express from "express";
import {
  getOrderDetails,
  updateOrderDetails,
  getNextOrderNumber,
  createOrderDetails,
  getAllOrderDetails,
  checkOrderNumber
} from "../controllers/orderDetailsController.js";

const router = express.Router();

router.route("/").get(getAllOrderDetails).post(createOrderDetails);
router.route("/:id").get(getOrderDetails).put(updateOrderDetails);
 
router.get('/order-number', getNextOrderNumber);
router.post("/api/checkOrderNumber", checkOrderNumber);
 

export default router;

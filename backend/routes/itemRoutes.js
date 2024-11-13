import express from "express";
import {
  getItem,
  updateItem,
  deleteItem,
  createItem,
  getAllItems,
} from "../controllers/itemController.js";

const router = express.Router();

router.route("/").get(getAllItems).post(createItem);
router.route("/:id").get(getItem).put(updateItem).delete(deleteItem);

export default router;

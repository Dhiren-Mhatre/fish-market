import express from "express";
import {
  getCategory,
  updateCategory,
  deleteCategory,
  createCategory,
  getAllCategories,
} from "../controllers/categoryController.js";

const router = express.Router();

router.route("/").get(getAllCategories).post(createCategory);
router.route("/:id").get(getCategory).put(updateCategory).delete(deleteCategory);

export default router;

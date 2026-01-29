const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProductById,
  getAllProducts
} = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createProduct);
router.get("/", getAllProducts);           
router.get("/:id", getProductById);        

module.exports = router;

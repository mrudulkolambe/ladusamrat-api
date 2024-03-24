const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth")
const { addProduct, editProduct, getProduct, getSingleProduct ,deleteProduct} = require("../controller/productController");


router.get("/", getProduct);
router.get("/:_id", getSingleProduct)
router.post("/add", adminAuth, addProduct);
router.patch("/edit", adminAuth, editProduct);
router.delete("/delete/:_id", adminAuth, deleteProduct);





module.exports = router


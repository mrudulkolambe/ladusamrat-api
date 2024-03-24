const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth")
const { getcategory, addCategory, editCategory } = require("../controller/categoryController")


router.get("/get", getcategory)
router.post("/add", adminAuth, addCategory);
router.patch("/edit", adminAuth, editCategory)

module.exports = router
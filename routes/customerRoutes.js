const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth")
const customerAuth = require("../middleware/customerAuth")
const { handleSignup, handleSignin, updateProfile, getAllCustomers, getCustomer } = require("../controller/customerController");

router.get("/get", getAllCustomers);
router.get("/get-profile", customerAuth, getCustomer)
router.post("/signup", handleSignup);
router.post("/signin", handleSignin);
router.patch("/update", customerAuth, updateProfile);

module.exports = router;

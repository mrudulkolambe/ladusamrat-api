const express = require("express");
const customerAuth = require("../middleware/customerAuth");
const { createOrder, createPrepaidOrder, getAllOrders } = require("../controller/orderController");
const router = express.Router();

router.post("/cod-order", customerAuth, createOrder)
router.post("/prepaid-order", customerAuth, createPrepaidOrder)

router.get("/orders", getAllOrders);


module.exports = router;

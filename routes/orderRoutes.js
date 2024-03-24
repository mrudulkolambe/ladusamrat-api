const express = require("express");
const customerAuth = require("../middleware/customerAuth");
const { createOrder, createPrepaidOrder, getAllOrders, createOrder1 } = require("../controller/orderController");
const router = express.Router();

router.post("/cod-order", customerAuth, createOrder)
router.post("/prepaid-order", customerAuth, createPrepaidOrder)
router.post("/prepaid-order", createPrepaidOrder)
router.get("/test", createOrder1)

router.get("/orders", getAllOrders);


module.exports = router;

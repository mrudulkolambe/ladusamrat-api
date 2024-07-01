const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/adminAuth");
const { getBanners, createBanner, updateBanners, deleteBanners } = require("../controller/bannerController");

router.get("/", getBanners);
router.post("/", adminAuth, createBanner);
router.patch("/:_id", adminAuth, updateBanners);
router.delete("/:_id", adminAuth, deleteBanners);

module.exports = router


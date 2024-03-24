const express = require("express");
const router = express.Router();
const { registerAdmin ,signinAdmin} = require("../controller/adminController")

router.post("/signup", registerAdmin)
router.post("/signin", signinAdmin)


module.exports = router;

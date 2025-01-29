const user_controller = require("../controller/user_controller");
const express = require("express");
const router = express.Router();

router.post("/create", user_controller.createUser);
router.post("/login", user_controller.loginUser);
router.post("/update-password", user_controller.updatePassword);
router.post("/reset-password", user_controller.resetPassword);

module.exports = router;

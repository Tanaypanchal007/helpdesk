const express = require("express");
const userController = require("../controller/user.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
    return res.status(200).json({
        message: "Protected profile accessed successfully!",
        user: req.user
    });
});

router.post("/createUser", userController.createUser);
router.post("/login", userController.loginUser);

module.exports = router;
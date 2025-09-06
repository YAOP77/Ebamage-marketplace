const express = require("express");
const router = express.Router();
const { verifyBoutiqueOtp } = require("../controllers/otpVerify");
const { createBoutique, LoginBoutique, resendBoutiqueOtp } = require("../controllers/boutiques.controllers");
// const isAuth = require("../middlewares/authUser.middleware");

router.post("/", createBoutique);
router.post("/otp-verify", verifyBoutiqueOtp);
router.post("/resend-otp", resendBoutiqueOtp);
router.post("/login", LoginBoutique);

module.exports = router;
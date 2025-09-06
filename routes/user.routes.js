const express = require("express");
const router = express.Router();
const { otpVerify } = require("../controllers/otpVerify.js");
const { RegisterUser, LoginUser, resendOtp } = require("../controllers/user.controllers.js");

router.post("/", RegisterUser);

router.post("/", (req, res) => {
  console.log("Requête reçue sur /api/auth/");
  RegisterUser(req, res);
});

router.post("/otp-verify", otpVerify);
router.post("/resend-otp", resendOtp);
router.post("/login", LoginUser);

module.exports = router;
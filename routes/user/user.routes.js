const express = require("express");
const router = express.Router();
const { otpVerify } = require("../../services/otpVerify.js");
// const isAuth = require("../../middlewares/authUser.middleware.js")
const { 
  RegisterUser, 
  LoginUser, 
  resendOtp,
} = require("../../controllers/user.controllers.js");

// Auth
router.post("/", RegisterUser);
router.post("/otp-verify", otpVerify);
router.post("/resend-otp", resendOtp);
router.post("/login", LoginUser);

module.exports = router;
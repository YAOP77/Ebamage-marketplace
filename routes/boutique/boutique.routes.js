const express = require("express");
const router = express.Router();
const { verifyBoutiqueOtp } = require("../../services/otpVerify");
const { createBoutique, LoginBoutique, resendBoutiqueOtp } = require("../../controllers/boutiques.controller");

const isBoutique = require("../../middlewares/authBoutique.middleware");
const middArticle = require("../../middlewares/article.middleware");
const { uploadItems, allShopItems, updateItems, deleteItems } = require("../../controllers/articles.controller");
const isAuth = require("../../middlewares/authUser.middleware");

router.post("/", createBoutique);
router.post("/otp-verify", verifyBoutiqueOtp);
router.post("/resend-otp", resendBoutiqueOtp);
router.post("/login", LoginBoutique);

router.get("/my-articles", isAuth, isBoutique, allShopItems);
router.post("/upload", isAuth, isBoutique, middArticle, uploadItems);
router.put("/article/update/:id", isAuth, isBoutique, middArticle, updateItems);
router.delete("/article/:id", isAuth, isBoutique, deleteItems);

module.exports = router;
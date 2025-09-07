const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/authUser.middleware.js");
const getCategories = require("../controllers/categories.controllers.js");
// const { getAllArticles } = require("../controllers/user.controllers.js")

// router.get("/", isAuth, getAllArticles);
router.get("/allCategories", isAuth, getCategories);

module.exports = router;
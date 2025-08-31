const User = require("../models/User.js");
const express = require("express");
const router = express.Router();
const isAuth = require("../middlewares/authUser.middleware.js");

// Mise à jour ou réinitialisation
router.post("/update-token", isAuth, async (req, res) => {
  const { deviceToken } = req.body;

    // vérification pour éviter les valeurs invalides
    if ((deviceToken !== null && typeof deviceToken !== "string") || deviceToken === "") {
        return res.status(400).json({ message: "Token invalide" });
    }

  await User.findByIdAndUpdate(req.user._id, { deviceToken });
  res.json({ message: "Token mis à jour" });
  console.log(`Device token mis à jour pour ${req.user._id}: ${deviceToken}`);
});
// Suppression du token à la déconnexion
router.post("/clear-token", isAuth, async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { deviceToken: null });
  res.json({ message: "Token supprimé" });
  console.log(`Device token supprimé pour ${req.user._id}`);
});

module.exports = router;
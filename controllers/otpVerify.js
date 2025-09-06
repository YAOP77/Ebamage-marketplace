const User = require("../models/User");
const Boutique = require("../models/Boutiques");

// User
const otpVerify = async (req, res) => {
    try {
        const { email, codeOtp } = req.body;
        // console.log("Donné utilisateur :", req.body);

        if (!email || !codeOtp) {
            return res.status(400).json({ message: "Email et OTP requis" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (user.isVerify) {
            return res.status(400).json({ message: "Compte déjà vérifié" });
        }

        if (Date.now() > user.otpExpiresAt) {
            return res.status(400).json({ message: "OTP expiré. Demandez un nouveau code." });
        }

        if (user.codeOtp !== codeOtp) {
            return res.status(400).json({ message: "OTP invalide" });
        }

        // Validation réussie
        user.isVerify = true;
        user.codeOtp = null;        // nettoyer OTP
        user.otpExpiresAt = null;   // nettoyer expiration
        await user.save();

        return res.status(200).json({ message: "Compte vérifié avec succès" });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ error: error.message });
    }
}

// Boutique
const verifyBoutiqueOtp = async (req, res) => {
  try {
    const { email, codeOtp } = req.body;

    if (!email || !codeOtp) {
      return res.status(400).json({ message: "Email et OTP requis" });
    }

    const boutique = await Boutique.findOne({ email });

    if (!boutique) {
      return res.status(404).json({ message: "Boutique non trouvée" });
    }

    if (boutique.isVerify) {
      return res.status(400).json({ message: "Boutique déjà vérifiée" });
    }

    if (!boutique.otp || !boutique.otp.expiresAt || Date.now() > boutique.otp.expiresAt) {
      return res.status(400).json({ message: "OTP expiré ou invalide" });
    }

    if (boutique.otp.code !== codeOtp) {
      return res.status(400).json({ message: "OTP incorrect" });
    }

    // Validation réussie
    boutique.isVerify = true;
    boutique.otp = undefined; // Nettoyage complet
    await boutique.save();

    return res.status(200).json({ message: "Boutique vérifiée avec succès" });
  } catch (error) {
    console.error("Erreur vérification OTP boutique :", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { otpVerify, verifyBoutiqueOtp };
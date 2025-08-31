const User = require("../models/User");

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

module.exports = otpVerify;
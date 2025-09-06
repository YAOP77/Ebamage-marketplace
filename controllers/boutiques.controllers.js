const Boutique = require("../models/Boutiques")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
const sendOtpEmail = require("../helpers/brevo");

const createBoutique = async (req, res) => {
  try {
    const { nom, email, tel, password } = req.body;

    if (!nom || !email || !tel || !password) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    const boutiqueExist = await Boutique.findOne({ email });
    if (boutiqueExist) {
      return res.status(400).json({ message: "Une boutique avec cet email existe déjà" });
    }

    const pw_hash = await bcrypt.hash(password, 10);

    // Générer OTP
    const otpCode = generateOtp();
    // expire dans 5 min
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const newBoutique = new Boutique({
      nom,
      email,
      tel,
      // à hasher avant save si ce n’est pas déjà fait
      password: pw_hash,
      isVerify: false,
      otp: {
        code: otpCode,
        expiresAt: otpExpiresAt
      }
    });

    await newBoutique.save();
    await sendOtpEmail(email, otpCode);

    return res.status(201).json({
      message: "Boutique créée. Un code OTP a été envoyé pour vérification.",
      email
    });
  } catch (error) {
    console.error("Erreur création boutique :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

const LoginBoutique = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Les champs sont requis" });
    }

    const boutique = await Boutique.findOne({ email });
    if (!boutique) {
      return res.status(401).json({ message: "Email inconnu" });
    }

    const isMatch = await bcrypt.compare(password, boutique.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Mot de passe incorrect" });
    }

    if (!boutique.isVerify) {
      return res.status(403).json({ message: "Boutique non vérifiée" });
    }

    const token = jwt.sign(
      { _id: boutique._id, role: "boutique" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Connexion réussie",
      token,
      boutique: {
        id: boutique._id,
        nom: boutique.nom,
        email: boutique.email,
        tel: boutique.tel
      }
    });
  } catch (error) {
    console.error("Erreur connexion boutique :", error);
    return res.status(500).json({ error: error.message });
  }
};

const resendBoutiqueOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    const boutique = await Boutique.findOne({ email });

    if (!boutique) {
      return res.status(404).json({ message: "Boutique non trouvée" });
    }

    if (boutique.isVerify) {
      return res.status(400).json({ message: "Boutique déjà vérifiée" });
    }

    // Générer un nouveau OTP
    const newOtp = generateOtp();
    boutique.otp = {
      code: newOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000)
    };
    boutique.otpResentAt = new Date();

    await boutique.save();
    await sendOtpEmail(email, newOtp);

    return res.status(200).json({ message: "Nouveau OTP envoyé à la boutique." });
  } catch (error) {
    console.error("Erreur renvoi OTP boutique :", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { createBoutique, resendBoutiqueOtp, LoginBoutique };
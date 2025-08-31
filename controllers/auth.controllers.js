require("dotenv").config();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendOtpEmail = require("../helpers/brevo");

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();
// console.log("Le Code otp :", generateOtp());

// Inscription d'un utilisateur
const RegisterUser = async (req, res) => {
    try {
        const { nom, email, tel, password, deviceToken, type } = req.body;
        // console.log("Reçu dans req.body :", req.body);

        if(!nom || !email || !tel || !password ) {
            return res.status(400).json({ message: "Tous les champs sont requis" });
        }

        const userExist = await User.findOne({ $or: [{ tel }, { email }] });
        if(userExist) return res.status(400).json({ message: "Utilisateur déja inscrit "});

        const passwordHash = await bcrypt.hash(password, 10);
        const otpCode = generateOtp();

        const allowedTypes = ["client", "boutique"];
        const userType = allowedTypes.includes(type) ? type : "client";

        const userData = {
            nom,
            email,
            tel,
            password: passwordHash,
            isVerify: false,
            deviceToken: deviceToken || null,
            otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000), // expire dans 5 min
            role: "user",
            type: userType,
            codeOtp: otpCode
            // ...(process.env.NODE_ENV !== "production" && { codeOtp: otpCode } )
        }

        // console.log("Données utilisateur :", userData);
        // console.log("Otp générer pour :", `${email}: ${otpCode}`);

        const user = new User(userData);
        await user.save();
        await sendOtpEmail(email, otpCode);

        return res.status(201).json({ message: "Inscription réussie" });

    } catch (error) {
        // console.error("Erreur :", error);
        return res.status(500).json({ error: error.message });
    }
}

// Renvoi du code Otp
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email requis" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        if (user.isVerify) {
            return res.status(400).json({ message: "Compte déjà vérifié" });
        }

        // Générer un nouveau OTP
        const newOtp = generateOtp();
        user.codeOtp = newOtp;
        // expire dans 5 min
        user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
        user.otpResentAt = new Date();
        await user.save();
        await sendOtpEmail(email, newOtp);

        // Pour test → affichage console (à remplacer par envoi email/SMS)
        // console.log(`NOUVEL OTP pour ${email}: ${newOtp}`);

        return res.status(200).json({ message: "Nouveau OTP envoyé." });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ error: error.message });
    }
}

const LoginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("Reçu dans req.body :", req.body);

        if(!email || !password) {
            return res.status(400).json({ message: "Les champs sont requis "});
        }

        const user = await User.findOne({ email });
        if(!user) return res.status(401).json({ message: "Email inconnu" });

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) return res.status(401).json({ message: "Mot de passe incorrect" });

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        if(!user.isVerify) {
            return res.status(403).json({ message: "Compte non verifié" });
        }
        
        return res.status(200).json({
            message: "Connexion réussi",
            token,
            user: {
                id: user.id,
                role: user.role,
                type : user.type
            }
        });

    } catch (error) {
        console.error("Erreur :", error);
        return res.status(500).json({ error: error.message })
    }
}

module.exports = { RegisterUser, LoginUser, resendOtp };
const jwt = require("jsonwebtoken");
const Boutique = require("../models/Boutiques");

const authBoutique = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token manquant ou invalide" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const boutique = await Boutique.findById(decoded._id);
    if (!boutique) {
      return res.status(404).json({ message: "Boutique introuvable" });
    }

    if (!boutique.isVerify) {
      return res.status(403).json({ message: "Boutique non vérifiée" });
    }

    // Optionnel : vérification du rôle si tu l’as dans le modèle
    if (decoded.role !== "boutique") {
      return res.status(403).json({ message: "Accès réservé aux boutiques" });
    }

    // Injecter les infos dans req pour les contrôleurs suivants
    req.boutique = {
      id: boutique._id.toString(),
      nom: boutique.nom,
      email: boutique.email
    };

    next();
  } catch (error) {
    console.error("Erreur authBoutique :", error);
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

module.exports = authBoutique;
const Article = require("../models/Article");
const mongoose = require("mongoose");
const path = require("path");
const uploadToImgBB = require("../helpers/uploadToImgBB");
const Category = require("../models/Categories");

const uploadItems = async (req, res) => {
    try {
        const { nomArticle, prixArticle, descriptionArticle, nomCategorie } = req.body;
        console.log("Données :", req.body);

        const categorieDoc = await Category.findOne({ nom: nomCategorie });
        if (!categorieDoc) {
            return res.status(404).json({ message: "Catégorie introuvable" });
        }

        const imageFile = req.files?.image?.[0];
            if (!imageFile) {
            return res.status(400).json({ message: "Image requise" });
        }

        const imageUrl = await uploadToImgBB(imageFile.buffer, imageFile.originalname);

        const newArticle = new Article({
            nomArticle,
            prixArticle: Number(prixArticle),
            descriptionArticle,
            imageUrl,
            idCategorie: categorieDoc._id,
            idBoutique: req.boutique?.id
        });

        await newArticle.save();

        return res.status(201).json({ message: "Article publié avec succès" });
    } catch (error) {
        return res.status(500).json({ 
            message: "Une erreur est survenue lors de la publication",
            error: error.message,
            details: error.errors || error
         });
    }
}

const allShopItems = async (req, res) => {
  try {
    const boutiqueId = req.boutique?.id;
    const allItems = await Article.find({ idBoutique: boutiqueId });
    res.status(200).json(allItems);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'affichage des articles",
      error: error.message
    });
  }
};

const updateItems = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID :", req.params);
    const { nomArticle, prixArticle, descriptionArticle } = req.body;
    // image facultative
    const imageFile = req.files?.image?.[0]; 

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article introuvable" });

    if (!article.idBoutique.equals(req.boutique.id)) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // Mise à jour des champs textuels si fournis
    if (nomArticle) article.nomArticle = nomArticle.trim();
    if (prixArticle) article.prixArticle = Number(prixArticle);
    if (descriptionArticle) article.descriptionArticle = descriptionArticle.trim();

    // Mise à jour de l’image si fournie
    if (imageFile) {
      const imageUrl = await uploadToImgBB(imageFile.buffer, imageFile.originalname);
      article.imageUrl = imageUrl;
    }

    await article.save();

    res.status(200).json({ message: "Article mis à jour", article });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la modification",
      error: error.message
    });
  }
};

const deleteItems = async (req, res) => {
  try {
    const { id } = req.params;
    // console.log("ID :", req.params);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID invalide" });
    }

    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article introuvable" });

    console.log("article.idBoutique :", article.idBoutique.toString());
    console.log("req.boutique.id :", req.boutique?.id);

    if (article.idBoutique.toString() !== req.boutique?.id) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    await article.deleteOne();

    res.status(200).json({ message: "Article supprimé avec succès" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression",
      error: error.message
    });
  }
};

module.exports = { uploadItems, allShopItems, updateItems, deleteItems };
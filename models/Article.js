const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema({
    nomArticle: { type: String, required: true },
    prixArticle: { type: Number, required: true },
    descriptionArticle: { type: String, required: true },
    imageUrl: { type: String, required: true },
    idCategorie: { type: mongoose.Types.ObjectId, ref: "Category", required: true },
    idBoutique: { type: mongoose.Types.ObjectId, ref: "boutique", required: true }
});

module.exports = mongoose.model("articles", articleSchema);
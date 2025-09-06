const mongoose = require("mongoose");

const panierSchema = new mongoose.Schema({
  idUser: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  idArticle: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
  quantite: { type: Number, default: 1 }
});

module.exports = mongoose.model("panier", panierSchema);
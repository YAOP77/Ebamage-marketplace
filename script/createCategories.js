require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Categories");

const categories = [
  "Électronique & High-Tech",
  "Mode & Accessoires",
  "Maison & Décoration",
  "Électroménager",
  "Beauté & Santé",
  "Sport & Loisirs",
  "Bébé & Enfants",
  "Supermarché & Produits alimentaires"
];

(async () => {
  try {
    await mongoose.connect(process.env.BASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    const existing = await Category.find();
    if (existing.length > 0) {
      console.log("ℹ️ Catégories déjà initialisées.");
      return;
    }

    const inserts = categories.map(nom => ({ nom }));
    await Category.insertMany(inserts);

    console.log("✅ Catégories insérées avec succès.");
  } catch (error) {
    console.error("❌ Erreur d'initialisation :", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
})();
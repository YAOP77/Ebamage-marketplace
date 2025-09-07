const Category = require("../models/Categories");

const getCategories = async (req, res) => {
  try {
    // récupère tous les noms
    const categories = await Category.find({}, "nom"); 
    if (categories.length === 0) {
      return res.status(404).json({ message: "Aucune catégorie trouvée" });
    }

    res.status(200).json({ categories });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la lecture des catégories",
      error: error.message
    });
  }
};

module.exports = getCategories;
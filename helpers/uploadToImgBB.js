const axios = require("axios");
const FormData = require("form-data");

const uploadToImgBB = async (fileBuffer, originalName) => {
  try {
    const form = new FormData();
    // buffer + nom original
    form.append("image", fileBuffer, originalName);
    form.append("key", process.env.IMGBB_API_KEY);
    // optionnel
    form.append("expiration", "600");

    const response = await axios.post("https://api.imgbb.com/1/upload", form, {
      headers: form.getHeaders(),
      timeout: 10000
    });

    if (!response.data.success) {
      console.error("Réponse ImgBB :", response.data);
      throw new Error("Échec de l'upload ImgBB");
    }

    return response.data.data.url;
  } catch (error) {
    console.error("Erreur ImgBB :", error.message);
    throw new Error("Échec de l'upload ImgBB");
  }
};

module.exports = uploadToImgBB;
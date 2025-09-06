const multer = require("multer");
const path = require("path");

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const extAllowed = ['.jpg', '.png', '.jpeg'];

    if (file.fieldname === "image" && !extAllowed.includes(ext)) {
        return cb(new Error("Extension non autorisée"));
    }

    cb(null, true);
};

const uploadsArticle = multer({
    // pas de stockage local
    storage: multer.memoryStorage(), 
    fileFilter
}).fields([
    { name: "image", maxCount: 1 }
]);

module.exports = uploadsArticle;
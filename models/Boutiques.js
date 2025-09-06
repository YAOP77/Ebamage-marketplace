const mongoose = require("mongoose");

const boutiqueSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    tel: { type: String, required: true },
    password: { type: String, required: true },
    isVerify: { type: Boolean, default: false },
    role: { type: String, enum: ["boutique"], default: "boutique", required: true },
    otp: {
        code: { type: String },
        expiresAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("boutique", boutiqueSchema);
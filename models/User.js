const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    email: { type: String, required: true },
    tel: { type: Number, required: true },
    password: { type: String, required: true },
    isVerify: { type: Boolean, default: false },
    codeOtp: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    deviceToken: { type: String, default: null },
    role: {
        type: String,
        enum :["user", "admin"],
        default: "user",
        required: true
    },
});

module.exports = mongoose.model("user", UserSchema);
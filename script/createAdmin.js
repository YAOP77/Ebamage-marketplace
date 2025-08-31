const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

(async () => {
    try {
        // Connexion a mongoose
        await mongoose.connect(process.env.BASE_URL);
        console.log("Connecté");
        console.log("etat de la connexion :", mongoose.connection.readyState);

        // Donnée Admin
        const emailAdmin = process.env.EMAIL_ADMIN;
        const passwordAdmin = process.env.PASSWORD_ADMIN;
        const tel = "0000000000";
        const isVerify = true;

        // Vérification de l'existance de l'admin
        const adminExist = await User.findOne({ email: emailAdmin });
        if(adminExist) return;

        // Hash du mot de passe
        const pw_hash = await bcrypt.hash(passwordAdmin, 10);

        // Création de l'Admin
        const addAdmin = new User({
            email: emailAdmin,
            password: pw_hash,
            role: "admin",
            tel,
            isVerify
        });

        await addAdmin.save();
        console.log("Admin créer avec succès");
    } catch (error) {
        console.error("Une erreur est survenue ", error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
})();
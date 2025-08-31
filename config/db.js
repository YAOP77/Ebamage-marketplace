require("dotenv").config();
const mongoose = require("mongoose");

const MongooseConnect = async () => {
    try {
        // console.log("env =", process.env.BASE_URL);
        await mongoose.connect(process.env.BASE_URL)
        console.log("Connecte");
        console.log("Etat de la connexion :", mongoose.connection.readyState);
    } catch (error) {
        console.error("Une erreur est survenue lors de la connexion" ,error);
    };
};

module.exports = MongooseConnect;
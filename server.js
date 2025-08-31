require("dotenv").config();
const dbConnect = require("./config/db");
const express = require("express");
const cors = require("cors");
const authRoute = require("./routes/auth.routes");
const deviceTokenRoute = require("./routes/deviceToken.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion
dbConnect();

// Config
app.use(cors());
app.use(express.json());
// app.use("/uploads", express.static("uploads"))

// Route
app.use("/api/auth", authRoute);
app.use("/api/device-token", deviceTokenRoute);

console.log("✅ Route /api/auth montée");


// app.get("/", (req, res) => {
//     res.send("Hello 👋 ...");
// })

app.listen(PORT, () => {
    console.log(`Serveur demarré sur: http://localhost:${PORT}`);
});
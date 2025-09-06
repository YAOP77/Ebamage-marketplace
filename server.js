require("dotenv").config();
const dbConnect = require("./config/db");
const express = require("express");
const cors = require("cors");
const mainRoute = require("./routes/mainRoad.routes");
const userhRoute = require("./routes/user/user.routes");
const boutiquehRoute = require("./routes/boutique/boutique.routes");
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
app.use("/api/user/", mainRoute);
app.use("/api/auth", userhRoute);
app.use("/api/auth/boutique", boutiquehRoute);
app.use("/api/device-token", deviceTokenRoute);

// app.get("/", (req, res) => {
//     res.send("Hello ...");
// })

app.listen(PORT, () => {
    console.log(`Serveur demarré sur: http://localhost:${PORT}`);
});
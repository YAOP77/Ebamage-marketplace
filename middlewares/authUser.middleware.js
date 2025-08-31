const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token) return res.status(401).json({ message : "Accès non autorisé" });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Une erreur est survenue lors de la connsion", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = isAuth;

// http://localhost:5000/api/device-token/update-token

// {
//   "deviceToken": "abc123xyz456"
// }
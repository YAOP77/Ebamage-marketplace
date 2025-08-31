const User = require("../models/User");

const requireAdmin = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if(!user.req || user.role !== "admin") {
            return res.status(403).json({ message: "Accès refusé "});
        }

        next();
    } catch (error) {
        console.error("Une erreur est survenue", error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = requireAdmin;
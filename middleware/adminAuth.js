const jwt = require("jsonwebtoken")
const adminAuth = async (req, res, next) => {
    try {
        let token = req?.headers?.authorization?.split(" ")[1];
        const data = await jwt.verify(token, process.env.SECRET_KEY);
        if (data && data.role == "admin") {
            next();
        } else {
            return res.json({ error: true, message: "Unauthorized access" });
        }

    } catch (err) {
        return res.status(500).json({ error: true, message: err.message })
    }
}
module.exports = adminAuth 
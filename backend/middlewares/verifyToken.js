import jwt from "jsonwebtoken";

//verify token
export const Token = (req, res, next) => {
    const { token } = req.params;
    if (!token) {
        return res.status(401).json({ error: "No token provided" })
    }
    try {
        const decoded = jwt.verify(token, process.env.TOKEN)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({ error: "token expired or invalid" })
    }
}


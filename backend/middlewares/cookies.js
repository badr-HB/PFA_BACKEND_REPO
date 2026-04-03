import jwt from "jsonwebtoken";

export const cookies = (req, res, next) => {
    const Token = req.cookies.jwt
    if (!Token) {
        return res.status(401).json({ error: "No token provided please login" })
    }
    try {
        const decoded = jwt.verify(Token, process.env.TOKEN)
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(401).json({ error: "session is invalid please login" })
    }
}
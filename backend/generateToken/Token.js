import jwt from "jsonwebtoken"

const getToken = (userId,res) => {
    const payload = {id:userId};
    const Token = jwt.sign(payload,process.env.TOKEN,{
        expiresIn : "48h",
    });

    res.cookie("jwt",Token,{
        httpOnly : true,
        secure : process.env.NODE_ENV === "production",
        sameSite : "strict",
        maxAge : 1000*60*60*48
    })
    return Token
}

export default getToken;


import { prisma } from "../lib/prisma.js"
import bcrypt from "bcrypt";
import { config } from "dotenv";
import getToken from "../generateToken/Token.js";
import { sendMail } from "../NodeMailer/mailesend.js";
import speakeasy from "speakeasy";
config()

export const register = async (req, res) => {
    const data = req.body;
    const UserAlreadyExist = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })
    if (UserAlreadyExist) {
        return res.status(400).json({ error: "user already exists" })
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const CreateUser = await prisma.user.create({
        data: {
            email: data.email,
            password: hashedPassword
        }
    })
    return res.status(200).json({ message: "user created successfully" })
}

export const Login = async (req, res) => {
    const data = req.body;
    const UserAlreadyExist = await prisma.user.findFirst({
        where: {
            email: data.email
        }
    })
    if (!UserAlreadyExist) {
        return res.status(404).json({ error: "user doesn't exists" })
    }

    const ComparePassword = await bcrypt.compare(data.password, UserAlreadyExist.password)

    if (!ComparePassword) {
        return res.status(400).json({ error: "password is uncorrect" })
    }
    res.status(200).json({
        message: "complete the varification steps to continue login to your account"
    })

}

export const resetpassword = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const FindUser = await prisma.user.findFirst({
        where: { id }
    })
    if (!FindUser) {
        return res.status(404).json({ error: "user not found" })
    }
    const ComparePassword = await bcrypt.compare(data.password, FindUser.password)
    if (!ComparePassword) {
        return res.status(400).json({ error: "password invalid" })
    }
    const ComparePasswordUsed = await bcrypt.compare(data.new_password, FindUser.password)
    if (ComparePasswordUsed) {
        return res.status(400).json({ error: "this is already your password" })
    }

    const hashedPassword = await bcrypt.hash(data.new_password, 10);
    const updatepassword = await prisma.user.update({
        where: { id },
        data: {
            password: hashedPassword
        }
    })
    return res.status(200).json({ message: "password updated success" })
}

export const forgetpassword = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const FindUser = await prisma.user.findFirst({
        where: {
            email: data.email,
            id
        }
    })
    if (!FindUser) {
        return res.status(404).json({ error: "user not found" })
    }
    const generateToken = getToken(FindUser.id, res)
    const link = ``
    await sendMail(
        data.email,
        "Password reset",
        `<p>just a test for now</p>`
    )
    res.json({ message: "email sent" })
}
export const ResetForgottenPassword = async (req, res) => {
    const data = req.body;
    const user = req.user.id;
    const lookforpassword = await prisma.user.findFirst({
        where: {
            id: user
        }
    })
    if (!lookforpassword) {
        return res.status(404).json({ error: "user doesn't exist" })
    }
    const ComparePassword = await bcrypt.compare(data.password, lookforpassword.password)
    if (ComparePassword) {
        return res.status(200).json({ message: "you already use this password" })
    }
    const hashedPassword = await bcrypt.hash(data.password, 10)
    const changePassword = await prisma.user.update({
        where: {
            id: user
        },
        data: {
            password: hashedPassword
        }
    })
    return res.status(200).json({ message: "password changed successfully" })
}
export const Logout = async (req, res) => {
    res.clearCookie("jwt")

    return res.status(200).json({
        message: "Logged out successfully"
    });

}

//2fa
export const DoubleAuthenticationenable = async (req, res) => {
        const { id } = req.params;
        const secret = speakeasy.generateSecret();
        const storeToken = await prisma.user.update({
            where: { id },
            data: { twoFactorSecret: secret.base32 },
        });
        res.json({
            message: "Put this secret in your authenticator app",
            secret: secret.base32,
        }); 
}


export const loginWith2FA = async (req, res) => {
    const { token } = req.body;
    const { id } = req.params;

    const user = await prisma.user.findUnique({
        where: { id },
    });

    if (!user) {
        return res.status(404).json({ error: "user not found" })
    }
    if (!user.twoFactorSecret) {
        return res.status(400).json({ error: "2FA not setup properly" })
    }
    if (!token) {
        return res.status(400).json({ error: "2FA token required" })
    }


    const verified = speakeasy.totp({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token,
    });

    if (verified !== token) {
        user.twoFactorEnabled = false
        return res.status(400).json({ message: "Invalid 2FA code" });
    }
    else {
        user.twoFactorEnabled = true;
    }
    const generateToken = getToken(user.id, res);

    res.status(200).json({
        message: "Login successful",
        token: generateToken
    });
};

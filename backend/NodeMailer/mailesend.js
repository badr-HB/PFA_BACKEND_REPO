import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport(
    {
        host:'smtp.gmail.com',
        port:465,
        secure: true,
        auth:{
            user:'badrsama300@gmail.com',
            pass:'rebbdzmzgaryagyl'
        }
    }
)

export const sendMail = async (to,sub,msg) => {
    transporter.sendMail({
        to:to,
        subject:sub,
        html:msg
    });
}

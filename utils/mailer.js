const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: dotenv.config().parsed.MAIL_USER, 
        pass: dotenv.config().parsed.MAIL_PASS,
    },
});

module.exports = {
    send: async function (to,url) {
        return await transporter.sendMail({
            from: "HE THONG QUAN LY THU VIEN",
            to: to,
            subject: "RESET MAT KHAU",
            html: `<a href=${url}>CLICK VAO DAY DE RESET MAT KHAU</a>`, 
        });
    }
}
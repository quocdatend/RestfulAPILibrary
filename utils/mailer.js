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
  send: async function (to, url) {
    return await transporter.sendMail({
      from: "HE THONG QUAN LY THU VIEN",
      to: to,
      subject: "RESET MAT KHAU",
      html: `<p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.</p>
<p>Vui lòng nhấn vào liên kết bên dưới để đặt lại mật khẩu mới:</p>
<a href="${url}">Nhấn vào đây để đặt lại mật khẩu</a>
<p>Nếu bạn không yêu cầu điều này, bạn có thể bỏ qua email này.</p>`,
    });
  },
};

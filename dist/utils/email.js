"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmail = async (options) => {
    const transporter = nodemailer_1.default.createTransport({
        service: "Gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "moses.me7662@gmail.com",
            pass: "wjcf tmja ddlp tbzd",
        },
    });
    const mailOptions = {
        from: '"Dira Real Estate" <moses.me7662@gmail.com>',
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully");
    }
    catch (error) {
        console.error("Error sending email:", error);
        throw new Error("There was an error sending the email. Please try again later.");
    }
};
exports.sendEmail = sendEmail;
////wjcf tmja ddlp tbzd
////wjcf tmja ddlp tbzd

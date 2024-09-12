import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export const sendOtpEmail = async (options: EmailOptions) => {
  const transporter = nodemailer.createTransport({
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
    from: '"Bomas Real Estate" <moses.me7662@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error(
      "There was an error sending the email. Please try again later."
    );
  }
};

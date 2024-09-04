import nodemailer from "nodemailer";

interface EmailOptions {
  email: string;
  agentEmail: string;
  subject: string;
  message: string;
  phone: number;
  name: string;
}

export const sendEmail = async (options: EmailOptions) => {
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
    from: `${options.name} <${options.email}>`,
    to: options.agentEmail,
    subject: options.subject,
    text: `Message: ${options.message} \n From: ${options.email} \n Phone Number: ${options.phone}`,
    replyTo: options.email,
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

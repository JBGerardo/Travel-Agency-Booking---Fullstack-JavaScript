const nodemailer = require("nodemailer");

// Configure transporter using Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your gmail address
    pass: process.env.EMAIL_PASS, // your app password
  },
});

// Send email helper function
const sendEmail = async (to, subject, text) => {
  const mailOptions = {
    from: `"Travel Booking System" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

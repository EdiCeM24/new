const nodemailer = require("nodemailer");
const { AUTH_EMAIL, AUTH_PASS } = require("./env");
const asyncHandler = require("../utils/asyncHandler");
const { user } = require("../controllers/authLogin.controller");

//
const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
});

const sendEmail = asyncHandler(async ({ email, verifyLink }) => {
  await transport.sendMail({
    from: "Mars Online Markets",
    to: (email = user.email),
    subject: "Verify your account",
    html: `
         <p> Click the link below to verify your account.</p>
         
         <a href="${verifyLink}">Verify Account</a>
    `,
  });
});

module.exports = sendEmail;

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });
const nodemailer = require("nodemailer");
const exportedMethods = {
	async sendEmail(email, subject, text) {
		if (!email || typeof email !== "string" || !email.trim()) {
			throw "Email not provided";
		}
		if (!subject || typeof subject !== "string" || !subject.trim()) {
			throw "Subject not provided";
		}
		if (!text || typeof text !== "string" || !text.trim()) {
			throw "Text not provided";
		}
		email = email.trim();
		subject = subject.trim();
		text = text.trim();

		try {
			const transporter = nodemailer.createTransport({
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				auth: {
					user: process.env.NODE_EMAIL,
					pass: process.env.NODE_EMAIL_PASSWORD,
				},
			});

			const mailOptions = {
				from: '"Jobaroo Admin" <stevensjobaroo@gmail.com>',
				to: email,
				subject: subject,
				text:
					text +
					"\n\n**This email is for a school project at Stevens Institute of Technology. " +
					"If you believe you have received this email by mistake, please disregard this email as we may have accidently used your email for testing purposes. " +
					"We apologize for any inconvenience caused.",
			};

			await transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					throw err;
				} else {
					return true;
				}
			});
		} catch (e) {
			throw e;
		}
	},
};

module.exports = exportedMethods;

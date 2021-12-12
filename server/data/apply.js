const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });
const nodemailer = require("nodemailer");
const exportedMethods = {
	async sendEmail(email, subject, text) {
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
				text: text,
			};

			let info = await transporter.sendMail(mailOptions);

			return true;
		} catch (e) {
			throw e;
		}
	},
};

module.exports = exportedMethods;

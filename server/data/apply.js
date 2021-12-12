const nodemailer = require("nodemailer");
const serviceAccount = require("../firebase/cs554finalproject-53b9e-firebase-adminsdk-g4a5k-f540f6956f.json");

const exportedMethods = {
	async sendEmail(email, subject, text) {
		try {
			const transporter = nodemailer.createTransport({
				// service: "gmail",
				host: "smtp.gmail.com",
				port: 465,
				secure: true,
				auth: {
					user: "stevensjobaroo@gmail.com",
					pass: "XtX4u@eFno&mqdr",
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
			console.log(e);
			throw e;
		}
	},
};

module.exports = exportedMethods;

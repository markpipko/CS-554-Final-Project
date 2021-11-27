const admin = require("firebase-admin");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const serviceAccount = require("./cs554finalproject-53b9e-firebase-adminsdk-g4a5k-f540f6956f.json");
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://cs554finalproject-53b9e.firebaseio.com",
});

const uploadImage = async (uid, newImage) => {
	const bucket = admin
		.storage()
		.bucket("gs://cs554finalproject-53b9e.appspot.com");
	const imageBuffer = Buffer.from(newImage, "base64");
	const imageByteArray = new Uint8Array(imageBuffer);
	const file = bucket.file(`profileImages/${uid}.jpg`);
	return file
		.save(imageByteArray, {
			metadata: { metadata: { firebaseStorageDownloadTokens: uuidv4() } },
		})
		.then(() => {
			return file.getSignedUrl({ action: "read", expires: "03-09-2500" });
		})
		.then((urls) => {
			const url = urls[0];
			return url;
		})
		.catch((err) => {
			console.log(`Unable to upload file ${err}`);
		});
};

const getUserById = async (token) => {
	try {
		let user = await admin.auth().verifyIdToken(token);
		return user.uid;
	} catch (e) {
		console.log(e);
		return null;
	}
};

const authenticate = async (req, res, next) => {
	if (req.headers.token) {
		try {
			let res = await admin.auth().verifyIdToken(req.headers.token);
			if (res) {
				next();
			}
		} catch (e) {
			return res.status(403).json({ message: "User is not authenticated" });
		}
	} else {
		return res.status(403).json({ message: "User is not authenticated" });
	}
};

module.exports = {
	uploadImage,
	authenticate,
	getUserById,
};

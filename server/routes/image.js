const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
	uploadImage,
	authenticate,
	getUserById,
} = require("../firebase/firebase");
let fs = require("fs"),
	gm = require("gm").subClass({ imageMagick: true });

const mimes = ["image/jpg", "image/jpeg", "image/png"];

const acceptedImgs = (req, file, cb) => {
	if (mimes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

const upload = multer({
	limits: { filesize: "5MB", files: 1 },
	fileFilter: acceptedImgs,
});

const transformImage = async (image) => {
	return new Promise((resolve, reject) => {
		gm(image)
			.resize(240, 240)
			.toBuffer("JPG", function (err, buffer) {
				if (err) {
					console.log(error);
					reject(err);
				} else {
					resolve(buffer);
				}
			});
	});
};
router.post(
	"/uploadImage",
	authenticate,
	upload.single("photo"),
	async (req, res) => {
		if (req.file) {
			let transformed = await transformImage(req.file.buffer);
			let uid = await getUserById(req.headers.token);
			if (uid) {
				try {
					let url = await uploadImage(uid, transformed);
					return res.status(200).json({ img: url });
				} catch (e) {
					return res.status(500).json({ error: e });
				}
			} else {
				return res.status(403).json({ message: "User is not authenticated" });
			}
		} else {
			return res.status(400).json({ message: "Error: No file provided" });
		}
	}
);

module.exports = router;

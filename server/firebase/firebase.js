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
	if (!uid || !newImage) {
		throw "One or more inputs were not provided";
	}
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
			throw err;
		});
};

const getUserById = async (token) => {
	if (!token) {
		throw "Token not provided";
	}
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

const apply = async (userUid, jobUid) => {
	if (!userUid || typeof userUid != "string" || !userUid.trim()) {
		throw "User uid not provided or not of type string";
	}
	if (!jobUid || typeof jobUid != "string" || !jobUid.trim()) {
		throw "Job uid not provided or not of type string";
	}

	let jobRef = await admin.firestore().doc(`posts/${jobUid}`);

	let jobData = {};
	await jobRef.get().then((documentSnapShot) => {
		if (documentSnapShot.exists) {
			jobData = documentSnapShot.data();
		} else {
			throw "Could not find corresponding job";
		}
	});
	let currentApplicants = jobData.applicants ? jobData.applicants : [];

	let userRef = await admin.firestore().doc(`seekers/${userUid}`);

	let userData = {};
	await userRef.get().then((documentSnapShot) => {
		if (documentSnapShot.exists) {
			userData = documentSnapShot.data();
		} else {
			throw "Could not find corresponding user";
		}
	});
	let newApplication = {
		uid: userUid,
		jobuid: jobUid,
		email: userData.email,
		name: userData.displayName,
		resume: userData.resume,
		decision: "Undecided"
	};
	if (
		currentApplicants.filter((x) => x.email === userData.email).length === 0
	) {
		currentApplicants.push(newApplication);
	} else {
		throw "User has already applied";
	}

	await jobRef.update({ applicants: currentApplicants });

	let newJob = {
		_id: jobUid,
		company: jobData.company,
		location: jobData.zip,
		email: jobData.email,
		summary: jobData.summary,
		title: jobData.title,
		url: "",
		status: "Pending",
	};

	let currentApplications = userData.applications ? userData.applications : [];
	if (currentApplications.filter((x) => x._id === jobUid).length === 0) {
		currentApplications.push(newJob);
	}
	await userRef.update({ applications: currentApplications });

	return jobData.email;
};

const updateStatus = async (jobUid, userUid, decision) => {
	if (!userUid || typeof userUid != "string" || !userUid.trim()) {
		throw "User uid not provided or not of type string";
	}
	if (!jobUid || typeof jobUid != "string" || !jobUid.trim()) {
		throw "Job uid not provided or not of type string";
	}
	if (!decision || typeof decision != "string" || !decision.trim()) {
		throw "Decision not provided or not of type string";
	}
	if (decision != "accept" && decision != "deny") {
		throw "Decision not specified";
	}

	// Grab job data
	let jobRef = await admin.firestore().doc(`posts/${jobUid}`);
	let jobData = {};
	await jobRef.get().then((documentSnapShot) => {
		if (documentSnapShot.exists) {
			jobData = documentSnapShot.data();
		} else {
			throw "Could not find corresponding job";
		}
	});

	// Grab user data
	let userRef = await admin.firestore().doc(`seekers/${userUid}`);
	let userData = {};
	await userRef.get().then((documentSnapShot) => {
		if (documentSnapShot.exists) {
			userData = documentSnapShot.data();
		} else {
			throw "Could not find corresponding user";
		}
	});

	// Check if user is on the list of current applicants
	let postIndex = jobData.applicants.findIndex(
		(x) => x.email == userData.email
	);
	if (postIndex < 0) {
		throw "Applicant is not on the list of current applicants";
	}

	let userIndex = userData.applications.findIndex((x) => x._id == jobUid);
	if (userIndex < 0) {
		throw "User has not applied to this job post";
	}

	userData.applications[userIndex].status =
		decision == "accept" ? "Accepted" : "Rejected";
	await userRef.update(userData);

	jobData.applicants[postIndex].decision =
		decision == "accept" ? "Accepted" : "Rejected";

	await jobRef.update(jobData);

	return userData.email;
};

module.exports = {
	uploadImage,
	authenticate,
	getUserById,
	apply,
	updateStatus,
};

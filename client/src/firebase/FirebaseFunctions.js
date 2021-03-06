import { firebaseApp, db } from "./Firebase";
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	// FacebookAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	EmailAuthProvider,
	updatePassword,
	updateProfile,
	reauthenticateWithCredential,
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";

const auth = getAuth(firebaseApp);

//
async function doCreateUserWithEmailAndPassword(
	email,
	password,
	role,
	displayName
) {
	if (!email || !email.trim()) {
		throw new Error("Email must be provided");
	}
	email = email.trim();
	if (!password) {
		throw new Error("Password must be provided");
	}
	if (!role) {
		throw new Error("Role must be provided");
	}
	if (!displayName || !displayName.trim()) {
		throw new Error("Display name must be provided");
	}
	displayName = displayName.trim();
	await createUserWithEmailAndPassword(auth, email, password)
		.then(async (user) => {
			if (role === "seeker") {
				await setDoc(doc(db, "seekers", user.user.uid), {
					uid: user.user.uid,
					email: email,
					role: role,
					displayName: displayName,
					resume: null,
					imageUrl: "",
					applications: [],
				}).catch(function (error) {
					console.log(error);
					throw error;
				});
			}
			if (role === "employer") {
				await setDoc(doc(db, "employer", user.user.uid), {
					uid: user.user.uid,
					email: email,
					role: role,
					displayName: displayName,
					imageUrl: "",
				}).catch(function (error) {
					console.log(error);
					throw error;
				});
			}
			updateProfile(auth.currentUser, { displayName: displayName }).catch(
				function (error) {
					console.log(error);
					throw error;
				}
			);
		})
		.catch(function (error) {
			console.log(error);
			throw error;
		});
}

//
async function doChangePassword(email, oldPassword, newPassword) {
	let credential = EmailAuthProvider.credential(email, oldPassword);
	await reauthenticateWithCredential(auth.currentUser, credential).catch(
		function (error) {
			throw error;
		}
	);
	await updatePassword(auth.currentUser, newPassword).catch(function (error) {
		throw error;
	});
	await doSignOut().catch(function (error) {
		throw error;
	});
}

//
async function doSignInWithEmailAndPassword(email, password) {
	await signInWithEmailAndPassword(auth, email, password).catch(function (
		error
	) {
		throw error;
	});
}

async function doSocialSignIn(provider) {
	let socialProvider = null;
	// if (provider === "google") {
	socialProvider = new GoogleAuthProvider(auth);
	// } else if (provider === "facebook") {
	// 	socialProvider = new FacebookAuthProvider(auth);
	// }
	let user = await signInWithPopup(auth, socialProvider);
	const docRef = doc(db, "seekers", user.user.uid);
	const docSnap = await getDoc(docRef);

	if (!docSnap.exists()) {
		console.log("here");
		await setDoc(doc(db, "seekers", user.user.uid), {
			uid: user.user.uid,
			email: user.user.email,
			role: "seeker",
			displayName: user.user.displayName,
			resume: null,
			imageUrl: "",
			applications: [],
		});
	}
}

//
async function doPasswordReset(email) {
	if (!email || !email.trim()) {
		throw new Error("Email must be provided");
	}
	await sendPasswordResetEmail(auth, email).catch(function (error) {
		throw error;
	});
}

//
async function doSignOut() {
	await signOut(auth).catch(function (error) {
		throw error;
	});
}

//
async function checkEmployer(uid) {
	if (!uid) {
		await doSignOut();
	}
	const docRef = doc(db, "employer", uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return true;
	} else {
		return false;
	}
}

//
async function checkSeekers(uid) {
	if (!uid) {
		await doSignOut();
	}
	const docRef = doc(db, "seekers", uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return true;
	} else {
		return false;
	}
}

//
async function getSeeker(uid) {
	if (!uid) {
		throw new Error("No uid provided");
	}
	const docRef = doc(db, "seekers", uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return docSnap.data();
	} else {
		return [];
	}
}

//
async function checkForImage(uid, role) {
	if (!uid) {
		throw new Error("No uid provided");
	}
	if (role === true) {
		const ref = doc(db, "seekers", uid);
		const docSnap = await getDoc(ref);
		if (docSnap.exists()) {
			if (docSnap.data().imageUrl) {
				return docSnap.data().imageUrl;
			} else {
				return "";
			}
		} else {
			return "";
		}
	} else {
		const ref = doc(db, "employer", uid);
		const docSnap = await getDoc(ref);
		if (docSnap.exists()) {
			if (docSnap.data().imageUrl) {
				return docSnap.data().imageUrl;
			} else {
				return "";
			}
		} else {
			return "";
		}
	}
}

//
async function imageUpload(uid, role) {
	if (!uid) {
		throw new Error("Uid not provided");
	}
	const storage = getStorage();
	let downloadUrl = await getDownloadURL(
		ref(storage, `profileImages/${uid}.jpg`)
	).catch(function (error) {
		throw error;
	});
	if (role === true) {
		const userRef = doc(db, "seekers", uid);
		await updateDoc(userRef, {
			imageUrl: downloadUrl,
		}).catch(function (error) {
			throw error;
		});
	} else {
		const userRef = doc(db, "employer", uid);
		await updateDoc(userRef, {
			imageUrl: downloadUrl,
		}).catch(function (error) {
			throw error;
		});
	}

	return downloadUrl;
}

//
async function resumeUpload(uid, resumeName) {
	if (!uid || !resumeName) {
		throw new Error("Uid or resume not provided");
	}
	const storage = getStorage();
	const storageRef = ref(storage, `resumes/${uid}`);
	await uploadBytes(storageRef, resumeName);
	let downloadUrl = await getDownloadURL(ref(storage, `resumes/${uid}`)).catch(
		function (error) {
			throw error;
		}
	);
	const userRef = doc(db, "seekers", uid);
	await updateDoc(userRef, {
		resume: downloadUrl,
	});
	return downloadUrl;
}

//
async function newApplicationUpload(uid, job) {
	if (!uid || !job) {
		throw new Error("Uid or job not provided");
	}
	const userRef = doc(db, "seekers", uid);
	const userSnap = await getDoc(userRef);
	if (!userSnap.exists()) {
		throw new Error("User data does not exist");
	}

	let currentApplications = userSnap.data().applications;

	if (
		!currentApplications ||
		currentApplications.filter((x) => x._id === job._id).length === 0
	) {
		let applicationObj = {
			_id: job._id,
			company: job.company,
			title: job.title,
			url: job.url,
			location: job.location,
			summary: job.summary,
			status: "Pending",
		};
		if (!currentApplications) currentApplications = [];

		currentApplications.push(applicationObj);

		await updateDoc(userRef, {
			applications: currentApplications,
		});
	}
}

async function removeJobAppliedFromSeeker(uid, jobId) {
	if (!uid || !jobId) {
		throw new Error("Uid or jobId not provided");
	}
	const userRef = doc(db, "seekers", uid);
	const userSnap = await getDoc(userRef);

	if (!userSnap.exists()) {
		throw new Error("User data does not exist");
	}

	let currentApplications = userSnap.data().applications;

	let filteredApplications = currentApplications.filter((x) => x._id !== jobId);
	await updateDoc(userRef, {
		applications: filteredApplications,
	});

	return filteredApplications;
}

async function retrieveCurrentApplicants(jobUid) {
	if (!jobUid) {
		throw new Error("Job uid not provided");
	}
	const jobRef = doc(db, "posts", jobUid);
	const jobSnap = await getDoc(jobRef);
	if (jobSnap.exists()) {
		return jobSnap.data().applicants;
	} else {
		return [];
	}
}

async function getFieldNumbers() {
	const postRef = doc(db, "posts", "fieldsDoc");
	const postSnap = await getDoc(postRef);
	if (postSnap.exists()) {
		return postSnap.data();
	} else {
		await setDoc(doc(db, "posts", "fieldsDoc"), {
			"Architecture, Planning & Environmental Design": 0,
			"Arts & Entertainment": 0,
			Business: 0,
			Communications: 0,
			Education: 0,
			"Engineering & Computer Science": 0,
			Environment: 0,
			Government: 0,
			"Health & Medicine": 0,
			International: 0,
			"Law & Public Policy": 0,
			"Sciences - Biological & Physical": 0,
			"Social Impact": 0,
			Other: 0,
		});

		return {
			"Architecture, Planning & Environmental Design": 0,
			"Arts & Entertainment": 0,
			Business: 0,
			Communications: 0,
			Education: 0,
			"Engineering & Computer Science": 0,
			Environment: 0,
			Government: 0,
			"Health & Medicine": 0,
			International: 0,
			"Law & Public Policy": 0,
			"Sciences - Biological & Physical": 0,
			"Social Impact": 0,
			Other: 0,
		};
	}
}

async function updateFieldNumbers(field) {
	if (!field) {
		throw new Error("Field not provided");
	}
	const postRef = doc(db, "posts", "fieldsDoc");
	const postSnap = await getDoc(postRef);
	if (postSnap.exists()) {
		await updateDoc(postRef, {
			[`${field}`]: increment(1),
		});
	}
}

export {
	doCreateUserWithEmailAndPassword,
	doSocialSignIn,
	doSignInWithEmailAndPassword,
	doPasswordReset,
	doSignOut,
	doChangePassword,
	checkEmployer,
	checkSeekers,
	getSeeker,
	checkForImage,
	imageUpload,
	resumeUpload,
	newApplicationUpload,
	removeJobAppliedFromSeeker,
	retrieveCurrentApplicants,
	getFieldNumbers,
	updateFieldNumbers,
};

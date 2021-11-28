import { firebaseApp, db } from "./Firebase";
import {
	getAuth,
	signInWithEmailAndPassword,
	signOut,
	GoogleAuthProvider,
	FacebookAuthProvider,
	signInWithPopup,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	EmailAuthProvider,
	updatePassword,
	updateProfile,
	reauthenticateWithCredential,
} from "firebase/auth";
import { setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
const auth = getAuth(firebaseApp);
// let currentUser;
// onAuthStateChanged(auth, (user) => {
//     currentUser = user
//    });

async function doCreateUserWithEmailAndPassword(
	email,
	password,
	role,
	displayName
) {
	await createUserWithEmailAndPassword(auth, email, password).then(
		async (user) => {
			if (role === "seeker") {
				await setDoc(doc(db, "seekers", user.user.uid), {
					uid: user.user.uid,
					email: email,
					role: role,
					displayName: displayName,
					resume: null,
					imageUrl: "",
				});
			}
			if (role === "employer") {
				await setDoc(doc(db, "employer", user.user.uid), {
					uid: user.user.uid,
					email: email,
					role: role,
					displayName: displayName,
					imageUrl: "",
				});
			}
			updateProfile(auth.currentUser, { displayName: displayName });
		}
	);
}

async function doChangePassword(email, oldPassword, newPassword) {
	let credential = EmailAuthProvider.credential(email, oldPassword);
	await reauthenticateWithCredential(auth.currentUser, credential);
	await updatePassword(auth.currentUser, newPassword);
	await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
	await signInWithEmailAndPassword(auth, email, password);
}

async function doSocialSignIn(provider) {
	let socialProvider = null;
	if (provider === "google") {
		socialProvider = new GoogleAuthProvider(auth);
	} else if (provider === "facebook") {
		socialProvider = new FacebookAuthProvider(auth);
	}
	await signInWithPopup(auth, socialProvider);
}

async function doPasswordReset(email) {
	await sendPasswordResetEmail(auth, email);
}

async function doPasswordUpdate(password) {
	await updatePassword(auth, password);
}

async function doSignOut() {
	await signOut(auth);
}

async function checkEmployer(uid) {
	const docRef = doc(db, "employer", uid);
	const docSnap = await getDoc(docRef);
	if (docSnap.exists()) {
		return true;
	} else {
		return false;
	}
}

async function checkForImage(uid) {
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
}

async function imageUpload(uid, url) {
	const storage = getStorage();
	let downloadUrl = await getDownloadURL(
		ref(storage, `profileImages/${uid}.jpg`)
	);
	console.log(downloadUrl);
	const userRef = doc(db, "seekers", uid);
	await updateDoc(userRef, {
		imageUrl: downloadUrl,
	});
	return downloadUrl;
}

export {
	doCreateUserWithEmailAndPassword,
	doSocialSignIn,
	doSignInWithEmailAndPassword,
	doPasswordReset,
	doPasswordUpdate,
	doSignOut,
	doChangePassword,
	checkEmployer,
	checkForImage,
	imageUpload,
};

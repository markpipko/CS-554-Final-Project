import firebase from "firebase/compat/app";
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
import { collection, setDoc, doc } from "firebase/firestore";

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
	await createUserWithEmailAndPassword(auth, email, password);
	if (role == "seeker") {
		await setDoc(doc(db, "seekers", email), {
			email: email,
			role: role,
			displayName: displayName,
			resume: null,
			applied: [],
		});
	}
	if (role == "employer") {
		await setDoc(doc(db, "employer", email), {
			email: email,
			role: role,
			displayName: displayName,
		});
	}
	updateProfile(auth.currentUser, { displayName: displayName });
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

export {
	doCreateUserWithEmailAndPassword,
	doSocialSignIn,
	doSignInWithEmailAndPassword,
	doPasswordReset,
	doPasswordUpdate,
	doSignOut,
	doChangePassword,
};

import React, { useContext, useEffect, useRef, useState } from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import { firebaseApp, db } from "../firebase/Firebase";
import { getDoc, doc } from "@firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import { checkSeekers } from "../firebase/FirebaseFunctions";
import UploadResume from "./UploadResume";
import UploadImage from "./UploadImage";
function Account() {
	const { currentUser } = useContext(AuthContext);
	const [seeker, setSeeker] = useState(false);

	useEffect(() => {
		async function fetchData() {
			console.log("useEffect fired");

            let isSeeker = await checkSeekers(currentUser.uid);
            if (isSeeker) {
                setSeeker(true);
            }
		}
		fetchData();
	}, []);

	return (
		<div>
			<h2>Account Page</h2>
			<UploadImage />
            <br />
			{seeker && <UploadResume />}
            <br />
			<ChangePassword />
			<SignOutButton />
		</div>
	);
}

export default Account;

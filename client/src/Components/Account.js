import React, { useContext, useEffect, useState } from "react";
import SignOutButton from "./SignOut";
import "../App.css";
import ChangePassword from "./ChangePassword";
import { AuthContext } from "../firebase/Auth";
import { checkSeekers } from "../firebase/FirebaseFunctions";
import UploadResume from "./UploadResume";
import UploadImage from "./UploadImage";
function Account() {
	const { currentUser } = useContext(AuthContext);
	const [seeker, setSeeker] = useState(false);

	useEffect(() => {
		async function fetchData() {
			let isSeeker = await checkSeekers(currentUser.uid);
			if (isSeeker) {
				setSeeker(true);
			}
		}
		fetchData();
	}, [currentUser]);

	return (
		<div>
			<h1>Account Page</h1>
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

import React, { useContext } from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import { Redirect } from "react-router";
import { AuthContext } from "../firebase/Auth";
const SignOutButton = () => {
	const { currentUser } = useContext(AuthContext);
	const handleSignout = async () => {
		try {
			await doSignOut();
			<Redirect to="/signin" />;
		} catch (e) {
			alert(e);
		}
	};

	return (
		<Button onClick={handleSignout}>
			Sign Out <br />
			{currentUser.displayName}
		</Button>
	);
};

export default SignOutButton;

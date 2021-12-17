import React, { useContext } from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import { Redirect } from "react-router";
import { AuthContext } from "../firebase/Auth";
const SignOutButton = () => {
	const { currentUser } = useContext(AuthContext);
	const handleSignout = () => {
		doSignOut();
		<Redirect to="/signin" />;
	};

	return (
		<Button onClick={handleSignout}>
			Sign Out <br />
			{currentUser.displayName}
		</Button>
	);
};

export default SignOutButton;

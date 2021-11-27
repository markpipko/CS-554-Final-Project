import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
import { Redirect } from "react-router";
const SignOutButton = () => {
	const handleSignout = () => {
		doSignOut();
		<Redirect to="/signin" />;
	};

	return <Button onClick={handleSignout}>Sign Out</Button>;
};

export default SignOutButton;

import React from "react";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { Button } from "@mui/material";
const SignOutButton = () => {
	return <Button onClick={doSignOut}>Sign Out</Button>;
	// return (<button type="button" onClick={doSignOut}>Sign Out</button>);
};

export default SignOutButton;

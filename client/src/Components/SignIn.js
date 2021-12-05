import React, { useContext, useState } from "react";
import SocialSignIn from "./SocialSignIn";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { doSignInWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import {
	FormControl,
	FormGroup,
	Button,
	TextField,
	CircularProgress,
} from "@mui/material";
function SignIn() {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const [loading, setLoading] = useState(false);
	const [loginError, setLoginError] = useState(false);
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const { currentUser } = useContext(AuthContext);
	const handleLogin = async (event) => {
		event.preventDefault();
		setLoading(true);
		setLoginError(false);
		if (!formData.email || !formData.email.trim()) {
			setEmailError(true);
			setEmailErrorMessage("Email must be provided");
			setLoading(false);
			return;
		}
		setEmailError(false);
		setEmailErrorMessage("");
		if (!formData.password) {
			setPasswordError(true);
			setPasswordErrorMessage("Password must be provided");
			setLoading(false);
			return;
		}
		setPasswordError(false);
		setPasswordErrorMessage("");

		try {
			await doSignInWithEmailAndPassword(formData.email, formData.password);
		} catch (error) {
			setLoginError(true);
			setEmailError(true);
			setPasswordError(true);
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	if (currentUser) {
		return <Redirect to="/home" />;
	}
	return (
		<div>
			<h1>Log in</h1>
			{loading ? <CircularProgress /> : <div></div>}
			{loginError ? (
				<div className="loginError">Email and/or password is incorrect</div>
			) : (
				<div></div>
			)}
			<br />
			<br />
			<FormControl>
				<FormGroup>
					<TextField
						id="email"
						variant="outlined"
						label="Email"
						onChange={(e) => handleChange(e)}
						name="email"
						error={!!emailError}
						helperText={emailErrorMessage}
						required
					/>
				</FormGroup>
				<br />
				<FormGroup>
					<TextField
						id="password"
						variant="outlined"
						type="password"
						label="Password"
						onChange={(e) => handleChange(e)}
						name="password"
						error={!!passwordError}
						helperText={passwordErrorMessage}
						required
					/>
				</FormGroup>
				<br />
				<Button
					type="submit"
					variant="contained"
					onClick={(e) => handleLogin(e)}
					disabled={loading}
				>
					Log in
				</Button>
				<br />
				<Button
					className="forgotPassword"
					variant="contained"
					color="error"
					component={Link}
					to="/forgotpassword"
				>
					Forgot Password
				</Button>
				<br />
			</FormControl>
			<br />
			<SocialSignIn />
		</div>
	);
}

export default SignIn;

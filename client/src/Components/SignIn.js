import React, { useContext, useState } from "react";
import SocialSignIn from "./SocialSignIn";
import { Redirect, Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { doSignInWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import {
	Container,
	Button,
	TextField,
	CircularProgress,
	Box,
	Typography,
	Grid,
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
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h5">
					Sign In
				</Typography>
				{loading ? <CircularProgress /> : <div></div>}
				{loginError ? (
					<div className="loginError">Email and/or password is incorrect.</div>
				) : (
					<div></div>
				)}
				<Box component="form" onSubmit={handleLogin} noValidate sx={{ mt: 1 }}>
					<TextField
						id="email"
						margin="normal"
						fullWidth
						variant="outlined"
						label="Email Address"
						onChange={(e) => handleChange(e)}
						name="email"
						error={!!emailError}
						helperText={emailErrorMessage}
						required
						autoFocus
					/>
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
						fullWidth
					/>
					<Button
						type="submit"
						variant="contained"
						fullWidth
						disabled={loading}
						sx={{ mt: 3, mb: 2 }}
					>
						Log in
					</Button>
					<Grid container>
						<Grid item xs>
							<Link
								to="/forgotpassword"
								variant="body2"
								className="signInLinks"
							>
								Forgot Password
							</Link>
						</Grid>
						<Grid item>
							<Link to="/signup" variant="body2" className="signInLinks">
								Don't have an account? Sign Up
							</Link>
						</Grid>
						<br />
						<br />
					</Grid>
					<SocialSignIn />
				</Box>
				<br />
			</Box>
		</Container>
	);
}

export default SignIn;

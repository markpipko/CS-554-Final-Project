import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import SocialSignIn from "./SocialSignIn";
import {
	Container,
	Box,
	Typography,
	Grid,
	TextField,
	Button,
	RadioGroup,
	FormControlLabel,
	Radio,
	FormControl,
	FormLabel,
	CircularProgress,
	FormHelperText,
	IconButton,
	Collapse,
	Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
function SignUp() {
	const { currentUser } = useContext(AuthContext);
	const [formData, setFormData] = useState({
		displayName: "",
		email: "",
		role: null,
		passwordOne: "",
		passwordTwo: "",
	});
	const [loading, setLoading] = useState(false);
	const [nameError, setNameError] = useState(false);
	const [nameErrorMessage, setNameErrorMessage] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [roleError, setRoleError] = useState(false);
	const [roleErrorMessage, setRoleErrorMessage] = useState("");
	const [passwordError, setPasswordError] = useState(false);
	const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!formData.displayName || !formData.displayName.trim()) {
			setNameError(true);
			setNameErrorMessage("Name must be provided");
			setLoading(false);
			return;
		}
		setNameError(false);
		setNameErrorMessage("");

		if (!formData.email || !formData.email.trim()) {
			setEmailError(true);
			setEmailErrorMessage("Email must be provided");
			setLoading(false);
			return;
		}
		setEmailError(false);
		setEmailErrorMessage("");

		let pattern =
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (!pattern.test(formData.email)) {
			setEmailError(true);
			setEmailErrorMessage("Email is not valid");
			setLoading(false);
			return;
		}
		setEmailError(false);
		setEmailErrorMessage("");

		if (!formData.role) {
			setRoleError(true);
			setRoleErrorMessage(`\u00A0\u00A0Error: A role must be selected.`);
			setLoading(false);
			return;
		}
		setRoleError(false);
		setRoleErrorMessage("");

		if (!formData.passwordOne || !formData.passwordTwo) {
			setPasswordError(true);
			setPasswordErrorMessage("Password must be provided");
			setLoading(false);
			return;
		}
		setPasswordError(false);
		setPasswordErrorMessage("");

		if (formData.passwordOne !== formData.passwordTwo) {
			setPasswordError(true);
			setPasswordErrorMessage("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			await doCreateUserWithEmailAndPassword(
				formData.email,
				formData.passwordOne,
				formData.role,
				formData.displayName
			);
		} catch (error) {
			console.log(error);
			setError(true);
			if (error.message === "Firebase: Error (auth/email-already-in-use).") {
				setErrorMessage("Please choose a different email.");
			} else {
				setErrorMessage(error.message);
			}
			setLoading(false);
		}
	};

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	return (
		<Container component="main" maxWidth="xs">
			{error ? (
				<Collapse in={error}>
					<Alert
						severity="error"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setError(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						{errorMessage}
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			<Box
				sx={{
					marginTop: 4,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<Typography component="h1" variant="h5">
					Sign Up
				</Typography>
				{loading ? <CircularProgress /> : <div></div>}
				<Box component="form" noValidate onSubmit={handleSignUp} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								name="displayName"
								required
								fullWidth
								id="displayName"
								autoFocus
								label="Name/Company Name"
								onChange={(e) => handleChange(e)}
								error={!!nameError}
								helperText={nameErrorMessage}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="email"
								required
								fullWidth
								id="email"
								label="Email"
								onChange={(e) => handleChange(e)}
								error={!!emailError}
								helperText={emailErrorMessage}
							/>
						</Grid>
						<Grid item xs={12}>
							<FormControl component="fieldset" error={roleError}>
								<FormLabel component="p">Role</FormLabel>
								<RadioGroup
									row
									aria-label="role"
									name="role"
									onChange={(e) => handleChange(e)}
								>
									<FormControlLabel
										value="seeker"
										control={<Radio />}
										label="Job Seeker"
									/>
									<FormControlLabel
										value="employer"
										control={<Radio />}
										label="Employer"
									/>
								</RadioGroup>
								<FormHelperText sx={{ fontWeight: "bold", fontSize: 14 }}>
									{roleErrorMessage}
								</FormHelperText>
							</FormControl>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="passwordOne"
								required
								fullWidth
								type="password"
								id="passwordOne"
								label="Password"
								onChange={(e) => handleChange(e)}
								error={!!passwordError}
								helperText={passwordErrorMessage}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								name="passwordTwo"
								required
								fullWidth
								type="password"
								id="passwordTwo"
								label="Confirm Password"
								onChange={(e) => handleChange(e)}
								error={!!passwordError}
								helperText={passwordErrorMessage}
							/>
						</Grid>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							sx={{ mt: 3, mb: 2 }}
							disabled={loading}
						>
							Sign Up
						</Button>
					</Grid>
				</Box>
				<SocialSignIn />
			</Box>
		</Container>
	);
}

export default SignUp;

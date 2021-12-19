import React, { useState, useContext } from "react";
import {
	FormControl,
	FormGroup,
	Button,
	TextField,
	Alert,
	Collapse,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { doPasswordReset } from "../firebase/FirebaseFunctions";
import { Redirect } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import { Link } from "react-router-dom";
const ForgotPassword = () => {
	const [formData, setFormData] = useState({
		email: "",
	});
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [status, setStatus] = useState(false);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [infoOpen, setInfoOpen] = useState(false);
	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const passwordReset = async (e) => {
		e.preventDefault();
		if (!formData.email || !formData.email.trim()) {
			setEmailError(true);
			setEmailErrorMessage("Email must be provided");
			return;
		}
		setEmailError(false);
		setEmailErrorMessage("");
		try {
			await doPasswordReset(formData.email.trim());
			setInfoOpen(true);
			setStatus(true);
		} catch (e) {
			if (e.message === "Firebase: Error (auth/user-not-found).") {
				setInfoOpen(true);
				setStatus(true);
			} else {
				setErrorMessage(e.message);
				setError(true);
			}
		}
	};
	return (
		<div>
			<br />
			<Link to="/signin" className="signInLinks">
				Back to Sign In
			</Link>
			{status ? (
				<Collapse in={infoOpen}>
					<Alert
						severity="info"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setInfoOpen(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						If the email is registered, you will be sent a link to reset your
						password.
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
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
			<br />
			<br />
			<h1>Forgot Password</h1>
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
				<Button
					className="forgotPassword"
					variant="contained"
					onClick={(e) => passwordReset(e)}
				>
					Forgot Password
				</Button>
			</FormControl>
		</div>
	);
};

export default ForgotPassword;

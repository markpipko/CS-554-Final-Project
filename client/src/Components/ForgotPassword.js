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

const ForgotPassword = () => {
	const [formData, setFormData] = useState({
		email: "",
	});
	const [emailError, setEmailError] = useState(false);
	const [emailErrorMessage, setEmailErrorMessage] = useState("");
	const [status, setStatus] = useState(false);
	const [error, setError] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const [infoOpen, setInfoOpen] = useState(false);
	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const passwordReset = (e) => {
		e.preventDefault();
		if (!formData.email || !formData.email.trim()) {
			setEmailError(true);
			setEmailErrorMessage("Email must be provided");
			return;
		}
		setEmailError(false);
		setEmailErrorMessage("");
		try {
			doPasswordReset(formData.email);
			setInfoOpen(true);
			setStatus(true);
		} catch (e) {
			setErrorOpen(true);
			setError(true);
		}
	};
	return (
		<div>
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
				<Collapse in={errorOpen}>
					<Alert
						severity="error"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setErrorOpen(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						Could not process your request. Please try again.
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

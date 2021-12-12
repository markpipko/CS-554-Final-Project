import React, { useState } from "react";
import {
	FormControl,
	InputLabel,
	TextField,
	MenuItem,
	Button,
	FormGroup,
	Alert,
	Collapse,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { Redirect } from "react-router-dom";

const PostJob = (props) => {
	const [formData, setFormData] = useState({
		title: "",
		description: "",
		zip: "",
		jobType: "entry_level",
	});
	const { currentUser } = getAuth();
	const [status, setStatus] = useState(false);
	const [error, setError] = useState(false);
	const [infoOpen, setInfoOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);
	const [titleError, setTitleError] = useState(false);
	const [titleErrorMessage, setTitleErrorMessage] = useState("");
	const [zipError, setZipError] = useState(false);
	const [zipErrorMessage, setZipErrorMessage] = useState("");
	const [descriptionError, setDescriptionError] = useState(false);
	const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
	const [typeError, setTypeError] = useState(false);
	const [typeErrorMessage, setTypeErrorMessage] = useState("");

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	if (!props.employer) {
		<Redirect to="/home" />;
	}

	const post = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.title.trim()) {
			setTitleError(true);
			setTitleErrorMessage("Title must be provided");
			return;
		}
		setTitleError(false);
		setTitleError("");
		if (!formData.description) {
			setDescriptionError(true);
			setDescriptionErrorMessage("Job description must be provided");
			return;
		}
		setDescriptionError(false);
		setDescriptionErrorMessage("");
		if (!formData.zip || !formData.zip.trim()) {
			setZipError(true);
			setZipErrorMessage("Zip code must be provided");
			return;
		} else if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(formData.zip.trim())) {
			setZipError(true);
			setZipErrorMessage("Zip code is not of proper format");
			return;
		}
		setZipError(false);
		setZipErrorMessage("");
		if (!formData.jobType) {
			setTypeError(true);
			setTypeErrorMessage("Job type must be provided");
			return;
		}
		setTypeError(false);
		setTypeErrorMessage("");
		try {
			await addDoc(collection(db, "posts"), {
				company: currentUser.displayName,
				email: currentUser.email,
				title: formData.title,
				summary: formData.description,
				zip: formData.zip,
				jobType: formData.jobType,
				applicants: [],
			});
			setError(false);
			setInfoOpen(true);
			setStatus(true);
		} catch (e) {
			console.log(e);
			setErrorOpen(true);
			setError(true);
		}
	};
	return (
		<div>
			{status ? (
				<Collapse in={infoOpen}>
					<Alert
						severity="success"
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
						Job has been successfully posted. Please check the Posts tab to see
						your new job post.
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
						Job could not be posted. Please try again.
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			<h1>Post a Job</h1>
			<FormControl>
				<FormGroup>
					<InputLabel id="title" htmlFor="title"></InputLabel>
					<TextField
						id="title"
						variant="outlined"
						label="Title"
						onChange={(e) => handleChange(e)}
						name="title"
						error={!!titleError}
						helperText={titleErrorMessage}
						required
					/>
				</FormGroup>
				<br />
				<FormGroup>
					<InputLabel id="description" htmlFor="description"></InputLabel>
					<TextField
						id="description"
						variant="outlined"
						label="Description"
						onChange={(e) => handleChange(e)}
						name="description"
						error={!!descriptionError}
						helperText={descriptionErrorMessage}
						required
					/>
				</FormGroup>
				<br />
				<FormGroup>
					<InputLabel id="zip" htmlFor="zip"></InputLabel>
					<TextField
						id="outlined-basic"
						label="Zip Code"
						name="zip"
						onChange={(e) => handleChange(e)}
						pattern="[0-9]{5}"
						required
						error={!!zipError}
						helperText={zipErrorMessage}
					/>
				</FormGroup>
				<br />
				<FormGroup>
					<TextField
						select
						value={formData.jobType}
						label="Job Type"
						onChange={(e) => handleChange(e)}
						name="jobType"
						id="jobType"
						error={!!typeError}
						helperText={typeErrorMessage}
					>
						<MenuItem value="entry_level">Entry Level</MenuItem>
						<MenuItem value="mid_level">Mid Level</MenuItem>
						<MenuItem value="senior_level">Senior Level</MenuItem>
					</TextField>
				</FormGroup>
				<br />
				<Button type="submit" onClick={(e) => post(e)}>
					Submit
				</Button>
			</FormControl>
		</div>
	);
};
export default PostJob;

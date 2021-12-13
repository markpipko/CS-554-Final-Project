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
	CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { getAuth } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/Firebase";
import { Redirect } from "react-router-dom";
import { updateFieldNumbers } from "../firebase/FirebaseFunctions";
const PostJob = (props) => {
	const [formData, setFormData] = useState({
		title: "",
		field: "Architecture, Planning & Environmental Design",
		summary: "",
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
	const [fieldError, setFieldError] = useState(false);
	const [fieldErrorMessage, setFieldErrorMessage] = useState("");
	const [zipError, setZipError] = useState(false);
	const [zipErrorMessage, setZipErrorMessage] = useState("");
	const [descriptionError, setDescriptionError] = useState(false);
	const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
	const [typeError, setTypeError] = useState(false);
	const [typeErrorMessage, setTypeErrorMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	if (!props.employer) {
		<Redirect to="/home" />;
	}

	const post = async (e) => {
		e.preventDefault();
		setLoading(true);
		if (!formData.title || !formData.title.trim()) {
			setTitleError(true);
			setTitleErrorMessage("Title must be provided");
			setLoading(false);
			return;
		}
		setTitleError(false);
		setTitleErrorMessage("");

		if (!formData.field) {
			setFieldError(true);
			setFieldErrorMessage("Field must be provided");
			setLoading(false);
			return;
		}
		setFieldError(false);
		setFieldErrorMessage("");
		if (!formData.summary) {
			setDescriptionError(true);
			setDescriptionErrorMessage("Job summary must be provided");
			setLoading(false);
			return;
		}
		setDescriptionError(false);
		setDescriptionErrorMessage("");
		if (!formData.zip || !formData.zip.trim()) {
			setZipError(true);
			setZipErrorMessage("Zip code must be provided");
			setLoading(false);
			return;
		} else if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(formData.zip.trim())) {
			setZipError(true);
			setZipErrorMessage("Zip code is not of proper format");
			setLoading(false);
			return;
		}
		setZipError(false);
		setZipErrorMessage("");
		if (!formData.jobType) {
			setTypeError(true);
			setTypeErrorMessage("Job type must be provided");
			setLoading(false);
			return;
		}
		setTypeError(false);
		setTypeErrorMessage("");
		try {
			await addDoc(collection(db, "posts"), {
				company: currentUser.displayName,
				email: currentUser.email,
				title: formData.title,
				field: formData.field,
				summary: formData.summary,
				zip: formData.zip,
				jobType: formData.jobType,
				// applicants: []
			});
			await updateFieldNumbers(formData.field);

			setError(false);
			setInfoOpen(true);
			setStatus(true);
			setLoading(false);
		} catch (e) {
			console.log(e);
			setErrorOpen(true);
			setError(true);
			setLoading(false);
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
			<FormControl id="mainForm">
				<FormGroup>
					<InputLabel id="title" htmlFor="title"></InputLabel>
					<TextField
						id="title"
						variant="outlined"
						label="Title"
						onChange={(e) => handleChange(e)}
						name="title"
						error={!!fieldError}
						helperText={titleErrorMessage}
						required
					/>
				</FormGroup>
				<br />
				<FormGroup>
					<InputLabel id="field" htmlFor="field"></InputLabel>
					<TextField
						select
						id="field"
						variant="outlined"
						label="Field"
						onChange={(e) => handleChange(e)}
						name="field"
						value={formData.field}
						error={!!titleError}
						helperText={fieldErrorMessage}
						required
						style={{ width: 400 }}
					>
						<MenuItem value="Architecture, Planning & Environmental Design">
							Architecture, Planning & Environmental Design
						</MenuItem>
						<MenuItem value="Arts & Entertainment">
							Arts & Entertainment
						</MenuItem>
						<MenuItem value="Business">Business</MenuItem>
						<MenuItem value="Communications">Communications</MenuItem>
						<MenuItem value="Education">Education</MenuItem>
						<MenuItem value="Engineering & Computer Science">
							Engineering & Computer Science
						</MenuItem>
						<MenuItem value="Environment">Environment</MenuItem>
						<MenuItem value="Government">Government</MenuItem>
						<MenuItem value="Health & Medicine">Health & Medicine</MenuItem>
						<MenuItem value="International">International</MenuItem>
						<MenuItem value="Law & Public Policy">Law & Public Policy</MenuItem>
						<MenuItem value="Sciences - Biological & Physical">
							Sciences - Biological & Physical
						</MenuItem>
						<MenuItem value="Social Impact">Social Impact</MenuItem>
						<MenuItem value="Other">Other</MenuItem>
					</TextField>
				</FormGroup>
				<br />
				<FormGroup>
					<InputLabel id="summary" htmlFor="summary"></InputLabel>
					<TextField
						id="summary"
						variant="outlined"
						label="Summary"
						onChange={(e) => handleChange(e)}
						name="summary"
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
				{loading ? <CircularProgress /> : <div></div>}
				<br />
				<Button type="submit" disabled={loading} onClick={(e) => post(e)}>
					Submit
				</Button>
			</FormControl>
		</div>
	);
};

export default PostJob;

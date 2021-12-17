import React, { useContext, useEffect, useState } from "react";
import { resumeUpload } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import "../App.css";
import { getSeeker } from "../firebase/FirebaseFunctions";
import {
	FormControl,
	FormGroup,
	Button,
	CircularProgress,
} from "@mui/material";

function UploadResume(props) {
	const [loading, setLoading] = useState(false);
	const { currentUser } = useContext(AuthContext);
	const [resumeLink, setResumeLink] = useState("");
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	useEffect(() => {
		async function fetchData() {
			let user = await getSeeker(currentUser.uid);
			setResumeLink(user.resume);
		}
		fetchData();
	}, [currentUser]);

	const handleChange = async (e) => {
		let resumeUrl = e.target.files[0];
		if (!resumeUrl) {
			setError(true);
			setErrorMessage("No resume was attached. Please attach a resume.");
			setLoading(false);
			return;
		}
		if (resumeUrl.size / 1024 / 1024 > 5) {
			setError(true);
			setErrorMessage(
				"The size of your resume is too big. Resumes must be < 5 MB."
			);
			setLoading(false);
			return;
		}
		setError(false);
		setErrorMessage("");
		try {
			setLoading(true);
			let postedUrl = await resumeUpload(currentUser.uid, resumeUrl);
			setResumeLink(postedUrl);
			setLoading(false);
		} catch (e) {
			console.log(e);
			setError(true);
			setErrorMessage(e);
			setLoading(false);
		}
	};

	return (
		<div>
			<h2>Upload Resume</h2>
			<div>
				{error ? errorMessage : <div></div>}
				{resumeLink ? (
					<div>
						<br />
						<a href={resumeLink} target="_blank" rel="noreferrer">
							Link to Resume
						</a>
					</div>
				) : (
					<div></div>
				)}
			</div>
			<br />
			{loading ? <CircularProgress /> : <div></div>}
			<br />
			<FormControl>
				<FormGroup>
					<label htmlFor="uploadResume">
						<input
							accept="application/msword, application/pdf, .docx"
							id="uploadResume"
							name="uploadResume"
							type="file"
							onChange={(e) => handleChange(e)}
							hidden
						/>
						<Button variant="contained" disabled={loading} component="span">
							{resumeLink ? "Upload a different resume" : "Upload your resume"}
						</Button>
					</label>
				</FormGroup>
			</FormControl>
		</div>
	);
}

export default UploadResume;

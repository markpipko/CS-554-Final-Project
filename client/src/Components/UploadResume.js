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

	useEffect(() => {
		async function fetchData() {
			let user = await getSeeker(currentUser.uid);
			setResumeLink(user.resume);
		}
		fetchData();
	}, [currentUser]);

	const handleChange = async (e) => {
		let resumeUrl = e.target.files[0];
		try {
			setLoading(true);
			let postedUrl = await resumeUpload(currentUser.uid, resumeUrl);
			setResumeLink(postedUrl);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.log(e);
		}
	};

	return (
		<div>
			<h3>Upload Resume</h3>
			<h5>
				Current Resume:{" "}
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
			</h5>
			<br />
			{loading ? <CircularProgress /> : <div></div>}
			<br />
			<FormControl>
				<FormGroup>
					<Button variant="contained" component="label" disabled={loading}>
						{resumeLink ? "Upload a different resume" : "Upload your resume"}
						<input
							type="file"
							id="file"
							name="resumeUrl"
							hidden
							accept="application/msword, application/pdf"
							onChange={(e) => handleChange(e)}
						/>
					</Button>
				</FormGroup>
			</FormControl>
		</div>
	);
}

export default UploadResume;

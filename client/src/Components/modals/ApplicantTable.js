import React, { useState, useContext } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../firebase/Auth";

const ApplicantTable = (props) => {
	const [loading, setLoading] = useState(false);
	const [decision, setDecision] = useState(props.applicant.decision);
	const [token, setToken] = useState(null);

	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		currentUser.getIdToken().then((t) => {
			setToken(t);
		});
	}
	const statusUpdate = async (userUid, jobUid, decision) => {
		setLoading(true);
		if (!userUid || typeof userUid !== "string" || !userUid.trim()) {
			props.setError(true);
			setLoading(false);
			return;
		}
		if (!jobUid || typeof jobUid !== "string" || !jobUid.trim()) {
			props.setError(true);
			setLoading(false);
			return;
		}
		if (!decision || typeof decision !== "string" || !decision.trim()) {
			props.setError(true);
			setLoading(false);
			return;
		}
		if (decision !== "accept" && decision !== "deny") {
			props.setError(true);
			setLoading(false);
			return;
		}

		props.setError(false);
		try {
			let body = {
				userUid: userUid.trim(),
				jobUid: jobUid.trim(),
				decision: decision.trim(),
			};

			const { data } = await axios.post("/jobs/changeStatus", body, {
				headers: {
					token: token,
				},
			});

			if (!data) {
				props.setError(true);
				setLoading(false);
			}
			setDecision(decision === "accept" ? "Accepted" : "Rejected");
			setLoading(false);
		} catch (e) {
			console.log(e);
			props.setError(true);
			setLoading(false);
		}
	};

	return (
		<tr key={props.index}>
			<td>{props.applicant.name}</td>
			<td>{props.applicant.email}</td>
			<td>
				{props.applicant.resume ? (
					<a
						href={props.applicant.resume}
						className="resumeLink"
						target="_blank"
						rel="noreferrer"
					>
						Resume
					</a>
				) : (
					<div>None provided</div>
				)}
			</td>
			<td>
				{decision === "Undecided" ? (
					<div>
						<Button
							className="statusButtons acceptButton"
							onClick={() =>
								statusUpdate(
									props.applicant.uid,
									props.applicant.jobuid,
									"accept"
								)
							}
							disabled={loading}
						>
							Accept
						</Button>
						<Button
							className="statusButtons"
							variant="danger"
							onClick={() =>
								statusUpdate(
									props.applicant.uid,
									props.applicant.jobuid,
									"deny"
								)
							}
							disabled={loading}
						>
							Reject
						</Button>
					</div>
				) : (
					<div className={decision.toLowerCase()}>{decision}</div>
				)}
			</td>
		</tr>
	);
};

export default ApplicantTable;

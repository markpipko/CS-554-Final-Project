import React, { useState, useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import {
	FormControl,
	InputLabel,
	TextField,
	CircularProgress,
	FormGroup,
} from "@mui/material";
import { db } from "../firebase/Firebase";
import {
	collection,
	query,
	where,
	getDocs,
	getDoc,
	doc,
} from "firebase/firestore";
import "../App.css";
import JobPost from "./JobPost";
import { Alert, Collapse, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function HomeSeeker() {
	const [formData, setFormData] = useState({});
	const [queryError, setQueryError] = useState(false);
	const [queryErrorMessage, setQueryErrorMessage] = useState("");
	const [isSeeker, setIsSeeker] = useState(false);
	const { currentUser } = useContext(AuthContext);
	const [loading, setLoading] = useState(false);
	const [searchError, setSearchError] = useState(false);
	const [data, setData] = useState(undefined);
	const [status, setStatus] = useState(false);
	const [error, setError] = useState(false);
	const [infoOpen, setInfoOpen] = useState(false);
	const [errorOpen, setErrorOpen] = useState(false);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const checkApplied = async (jobId) => {
		// const docRef =  doc(db, 'posts', jobId)
		const docRef = doc(doc(db, "posts", jobId), "applicants", currentUser.uid);
		const docSnap = await getDoc(docRef);

		return docSnap.exists();
	};

	const search = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (!formData.query || !formData.query.trim()) {
			setQueryError(true);
			setQueryErrorMessage("Search term must be provided");
			setLoading(false);
			return;
		}
		setQueryError(false);
		setQueryErrorMessage("");

		try {
			const q = query(
				collection(db, "posts"),
				where("company", "==", formData.query)
			);

			const querySnapshot = await getDocs(q);
			setData(querySnapshot);

			setLoading(false);
		} catch (e) {
			console.log(e);
			setSearchError(true);
			setLoading(false);
		}
	};

	let form = null;

	form = (
		<FormControl>
			<FormGroup>
				<InputLabel id="query" htmlFor="query"></InputLabel>
				<TextField
					id="query"
					variant="outlined"
					label="Company"
					onChange={(e) => handleChange(e)}
					name="query"
					error={!!queryError}
					helperText={queryErrorMessage}
					required
				/>
			</FormGroup>
			<br />
			<Button type="submit" onClick={(e) => search(e)}>
				Submit
			</Button>
		</FormControl>
	);

	if (loading) {
		return <CircularProgress />;
	}

	if (searchError) {
		return <div>No search results found</div>;
	}

	const buildCard = (id, job, index) => {
		return (
			<JobPost
				id={id}
				job={job}
				index={index}
				setInfoOpen={setInfoOpen}
				setErrorOpen={setErrorOpen}
				setStatus={setStatus}
				setError={setError}
			/>
		);
	};

	let card = null;
	if (data) {
		let dataArr = [];
		data &&
			data.forEach((doc) => {
				dataArr.push(doc);
			});

		card = dataArr.map((doc, index) => {
			return buildCard(doc.id, doc.data(), index);
		});
	}

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
						Application has been successfully submitted!
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
						Application could not be submitted. Please try again.
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			<h1>Search for Jobs on Jobaroo</h1>
			{!data ? form : card}
		</div>
	);
}

export default HomeSeeker;

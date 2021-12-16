import React, { useState, useContext, useEffect } from "react";
import {
	FormControl,
	InputLabel,
	TextField,
	CircularProgress,
	FormGroup,
	Checkbox,
	FormControlLabel,
	Collapse,
	Alert,
	IconButton,
	Grid,
	Button,
	Card,
	CardContent,
	Typography,
} from "@mui/material";
import { db } from "../firebase/Firebase";
import {
	collection,
	query,
	where,
	getDocs,
	getDoc,
	doc,
	setDoc,
} from "firebase/firestore";

function HomeEmployer() {
	const [formData, setFormData] = useState({});
	const [queryError, setQueryError] = useState(false);
	const [queryErrorMessage, setQueryErrorMessage] = useState("");
	const [searchError, setSearchError] = useState(false);
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState(undefined);

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
				collection(db, "seekers"),
				where("displayName", "==", formData.query)
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

	const backToSearch = () => {
		setData(undefined);
	};

	let form = (
		<FormControl>
			<FormGroup>
				<InputLabel id="query" htmlFor="query"></InputLabel>
				<TextField
					id="query"
					variant="outlined"
					label="Name"
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

	const buildCard = (id, seeker, index) => {
		return (
			<Grid
				item
				xs={10}
				sm={5}
				md={5}
				lg={4}
				xl={3}
				key={index}
				style={{ display: "flex" }}
			>
				<Card variant="outlined">
					<CardContent>
						<Typography gutterBottom variant="body1" component="p">
							{seeker.displayName}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							{seeker.email}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							<a
								href={`${seeker.resume}`}
								target="_blank"
								rel="noreferrer"
								className="resumeLink"
							>
								Resume
							</a>
						</Typography>
					</CardContent>
				</Card>
			</Grid>
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
			{!data ? (
				<div>
					<h1>Look for Job Seekers on Jobaroo</h1>
					{form}
				</div>
			) : (
				<div>
					<Button onClick={backToSearch}>Back to search</Button>
					{card}
				</div>
			)}
		</div>
	);
}

export default HomeEmployer;

import React, { useState, useContext, useEffect } from "react";
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
	setDoc,
} from "firebase/firestore";
import "../App.css";
import JobPost from "./JobPost";
import { Alert, Collapse, Button, IconButton, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { getFieldNumbers } from "../firebase/FirebaseFunctions";

const useStyles = makeStyles({
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
});

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
	const [fields, setFields] = useState({
		"Architecture, Planning & Environmental Design": 0,
		"Arts & Entertainment": 0,
		Business: 0,
		Communications: 0,
		Education: 0,
		"Engineering & Computer Science": 0,
		Environment: 0,
		Government: 0,
		"Health & Medicine": 0,
		International: 0,
		"Law & Public Policy": 0,
		"Sciences - Biological & Physical": 0,
		"Social Impact": 0,
		Other: 0,
	});
	let jobTypes = [];
	const classes = useStyles();

	useEffect(() => {
		async function load() {
			let tempFields = await getFieldNumbers();
			setFields(tempFields);
		}
		load();
	}, []);

	for (var key in fields) {
		jobTypes.push({ name: key, "Number of Postings": fields[key] });
	}

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
			{!data ? (
				form
			) : (
				<Grid
					container
					className={classes.grid}
					spacing={5}
					alignItems="stretch"
					style={{ marginBottom: "15px", padding: "10px" }}
				>
					{card}
				</Grid>
			)}
			<br />
			<br />
			<BarChart
				width={1000}
				height={500}
				data={jobTypes}
				// margin={{
				// 	top: 5,
				// 	right: 30,
				// 	left: 20,
				// 	bottom: 5,
				// }}
				margin={{
					top: 0,
					right: 15,
					left: 15,
					bottom: 50,
				}}
				barSize={20}
				className="fieldChart"
			>
				<XAxis dataKey="name" scale="point" padding={{ left: 10, right: 10 }} />
				<YAxis />
				<Tooltip />
				<Legend />
				<CartesianGrid strokeDasharray="3 3" />
				<Bar
					dataKey="Number of Postings"
					fill="#8884d8"
					background={{ fill: "#eee" }}
				/>
			</BarChart>
		</div>
	);
}

export default HomeSeeker;

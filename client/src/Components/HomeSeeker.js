import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
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
import JobPost from "./JobPost";
import "../App.css";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
// import { Link } from "react-router-dom";
const useStyles = makeStyles({
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
});

function HomeSeeker() {
	const [formData, setFormData] = useState({
		query: "",
	});
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
	const classes = useStyles();

	// const [jobTypes, setJobtypes] = useState([{}])

	let jobTypes = [];

	let checkedFields = [];

	useEffect(() => {
		async function load() {
			let tempFields = await getFieldNumbers();
			setFields(tempFields);
		}
		load();
	}, []);

	for (var key in fields) {
		jobTypes.push({ name: key, "Number of Postings": fields[key] });
		// setJobtypes([...jobTypes, {name: key, 'Number of Postings': fields[key]}])
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

	const backToSearch = () => {
		setData(undefined);
	};

	const search = async (e) => {
		setLoading(true);
		e.preventDefault();
		// if (!formData.query || !formData.query.trim()) {
		// 	setQueryError(true);
		// 	setQueryErrorMessage("Search term must be provided");
		// 	setLoading(false);
		// 	return;
		// }
		// setQueryError(false);
		// setQueryErrorMessage("");

		// try {
		if (formData.query && checkedFields.length > 0) {
			try {
				const q = query(
					collection(db, "posts"),
					where("company", "==", formData.query),
					where("field", "in", checkedFields)
				);

				const querySnapshot = await getDocs(q);
				setData(querySnapshot);

				setLoading(false);
			} catch (e) {
				console.log(e);
				setSearchError(true);
				setLoading(false);
			}
		} else if (formData.query) {
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
		} else if (checkedFields.length > 0) {
			try {
				const q = query(
					collection(db, "posts"),
					where("field", "in", checkedFields)
				);

				const querySnapshot = await getDocs(q);
				setData(querySnapshot);

				setLoading(false);
			} catch (e) {
				console.log(e);
				setSearchError(true);
				setLoading(false);
			}
		} else {
			setQueryError(true);
			setQueryErrorMessage("Must give search input");
			setLoading(false);
		}
		setFormData({ query: "" });
	};

	function handleCheckChange(e) {
		if (e.target.checked) {
			checkedFields.push(e.target.value);
		} else {
			checkedFields.splice(checkedFields.indexOf(5), 1);
		}

		console.log(checkedFields);
	}

	let form = null;

	let fieldsForm = [];
	for (var x in fields) {
		fieldsForm.push(
			<FormControlLabel
				id={`${x}`}
				value={`${x}`}
				control={<Checkbox />}
				label={`${x}`}
				labelPlacement="end"
				onChange={(e) => handleCheckChange(e)}
				key={x}
			/>
		);
	}

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
				/>
			</FormGroup>
			<FormGroup>
				{fieldsForm.map((element) => {
					return element;
				})}
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
				key={index}
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

		card = dataArr.map((doc) => {
			return buildCard(doc.id, doc.data());
		});
	}

	return <div>{!data ? form : card}</div>;

	let card = null;
	if (data) {
		let dataArr = [];
		data &&
			data.forEach((doc) => {
				dataArr.push(doc);
			});

		if (dataArr.length === 0) {
			return (
				<>
					<Button onClick={backToSearch}>Back to search</Button>
					<div>No listings found</div>
				</>
			);
		}

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
			{!data ? (
				<div></div>
			) : (
				<Button onClick={backToSearch}>Back to search</Button>
			)}
			{!data ? (
				<div>
					<h1>Search for Jobs on Jobaroo</h1>
					{form}
					<BarChart
						width={1000}
						height={300}
						data={jobTypes}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
						barSize={20}
					>
						<XAxis
							dataKey="name"
							scale="point"
							padding={{ left: 10, right: 10 }}
						/>
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
			) : (
				<div>
					<Grid
						container
						className={classes.grid}
						spacing={5}
						alignItems="stretch"
						style={{ marginBottom: "15px", padding: "10px" }}
					>
						{card}
					</Grid>
				</div>
			)}
		</div>
	);
}

export default HomeSeeker;

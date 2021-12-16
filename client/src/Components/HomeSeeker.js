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
	Autocomplete,
	Stack,
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
const useStyles = makeStyles({
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
});

const options = [
	{
		value: "Architecture, Planning & Environmental Design",
		label: "Architecture, Planning & Environmental Design",
	},
	{ value: "Arts & Entertainment", label: "Arts & Entertainment" },
	{ value: "Business", label: "Business" },
	{ value: "Communications", label: "Communications" },
	{ value: "Education", label: "Education" },
	{
		value: "Engineering & Computer Science",
		label: "Engineering & Computer Science",
	},
	{ value: "Environment", label: "Environment" },
	{ value: "Government", label: "Government" },
	{ value: "Health & Medicine", label: "Health & Medicine" },
	{ value: "International", label: "International" },
	{ value: "Law & Public Policy", label: "Law & Public Policy" },
	{
		value: "Sciences - Biological & Physical",
		label: "Sciences - Biological & Physical",
	},
	{ value: "Social Impact", label: "Social Impact" },
	{ value: "Other", label: "Other" },
];

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
	const [checkedFields, setCheckedFields] = useState([]);
	const [graphData, setGraphData] = useState(undefined);
	const classes = useStyles();

	useEffect(() => {
		async function load() {
			let tempFields = await getFieldNumbers();

			let jobTypes = [];

			for (var key in tempFields) {
				jobTypes.push({ name: key, "Number of Postings": tempFields[key] });
			}
			setGraphData(jobTypes);
			// console.log(graphData);
		}
		load();
	}, [currentUser]);

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
		setCheckedFields([]);
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

		setFormData({ query: formData.query.trim() });
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

	const handleCheckChange = (e, values) => {
		setCheckedFields(values.map((x) => x.value));
	};
	let form = null;

	form = (
		<FormControl>
			<Stack spacing={2} sx={{ width: 500 }}>
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
					<Autocomplete
						multiple
						limitTags={2}
						id="tags-outlined"
						options={options}
						getOptionLabel={(option) => option.label}
						renderInput={(params) => (
							<TextField {...params} variant="standard" label="Fields" />
						)}
						onChange={handleCheckChange}
					/>
				</FormGroup>
				<br />
				<Button type="submit" onClick={(e) => search(e)}>
					Search
				</Button>
			</Stack>
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
				<div>
					<h1>Search for Jobs on Jobaroo</h1>
					{form}
					<h2>Current Job Posts Available</h2>
					{graphData && (
						<BarChart
							width={1000}
							height={300}
							data={graphData}
							// margin={{
							// 	top: 5,
							// 	right: 30,
							// 	left: 20,
							// 	bottom: 5,
							// }}
							barSize={20}
							className="fieldChart"
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
								fill="#706bcc"
								background={{ fill: "#eee" }}
							/>
						</BarChart>
					)}
				</div>
			) : (
				<div>
					<h1>Results</h1>
					<Button onClick={backToSearch}>Back to search</Button>

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

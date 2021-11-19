import React, { useState } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	makeStyles,
	FormHelperText,
} from "@material-ui/core";
import {
	FormControl,
	InputLabel,
	TextField,
	Select,
	MenuItem,
	Button,
} from "@mui/material";
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto",
		borderRadius: 5,
		border: "1px solid #1e8678",
		boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
	},
	titleHead: {
		borderBottom: "1px solid #1e8678",
		fontWeight: "bold",
		fontSize: "15px	",
	},
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
	media: {
		height: "100%",
		width: "100%",
	},
	button: {
		color: "#1e8678",
		fontWeight: "bold",
		fontSize: 12,
	},
});

const Jobs = (props) => {
	const [formData, setFormData] = useState({
		query: "",
		zip: "",
		jobType: "entry_level",
	});
	const [jobsData, setJobsData] = useState(undefined);
	const [loading, setLoading] = useState(false);
	const [queryError, setQueryError] = useState(false);
	const [queryErrorMessage, setQueryErrorMessage] = useState("");
	const [zipError, setZipError] = useState(false);
	const [zipErrorMessage, setZipErrorMessage] = useState("");
	const [typeError, setTypeError] = useState(false);
	const [typeErrorMessage, setTypeErrorMessage] = useState("");
	const classes = useStyles();
	let jobsList = [];

	const handleChange = (e) => {
		console.log(e);
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const search = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (!formData.query || !formData.query.trim()) {
			setQueryError(true);
			setQueryErrorMessage("Query must be provided");
			setLoading(false);
			return;
		}
		setQueryError(false);
		setQueryErrorMessage("");
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
		const { data } = await axios.post("/jobs/page/1", formData);
		setJobsData(data);
		setLoading(false);
		console.log(data);
	};

	const handleApply = (url) => {
		window.open(url);
	};

	const buildCards = (job, index) => {
		return (
			<Grid item xs={10} sm={5} md={5} lg={3} xl={2} key={index}>
				<Card className={classes.card} variant="outlined">
					<CardContent>
						<Typography
							className={classes.titleHead}
							gutterBottom
							variant="h6"
							component="h2"
						>
							{job.title}
						</Typography>
						<Typography
							style={{ wordWrap: "break-word" }}
							gutterBottom
							variant="body1"
							component="p"
						>
							Summary: {job.summary}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							Company: {job.company}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							Location: {job.location}
						</Typography>
						<div>
							<button onClick={() => handleApply(job.url)}>Apply</button>
						</div>
					</CardContent>
				</Card>
			</Grid>
		);
	};

	jobsList =
		jobsData &&
		jobsData.map((job, index) => {
			return buildCards(job, index);
		});

	return (
		<div>
			<h2>Search for Jobs</h2>
			<FormControl>
				<InputLabel id="query" htmlFor="query"></InputLabel>
				<TextField
					id="query"
					variant="outlined"
					label="Query"
					onChange={(e) => handleChange(e)}
					name="query"
					error={!!queryError}
					helperText={queryErrorMessage}
					required
				/>
				<br />
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
				<br />
				<InputLabel id="job-type-label"></InputLabel>
				<Select
					labelId="job-type-label"
					error={!!typeError}
					id="jobType"
					value={formData.jobType}
					name="jobType"
					onChange={(e) => handleChange(e)}
				>
					<MenuItem value="entry_level">Entry Level</MenuItem>
					<MenuItem value="mid_level">Mid Level</MenuItem>
					<MenuItem value="senior_level">Senior Level</MenuItem>
				</Select>
				<FormHelperText>{typeErrorMessage}</FormHelperText>
				<br />
				<Button type="submit" onClick={(e) => search(e)}>
					Submit
				</Button>
			</FormControl>
			<br />
			<br />
			{loading ? (
				<div>Loading...</div>
			) : (
				<Grid
					container
					className={classes.grid}
					spacing={5}
					alignItems="stretch"
				>
					{jobsList}
				</Grid>
			)}
		</div>
	);
};

export default Jobs;

import React, { useState } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	makeStyles,
} from "@material-ui/core";
import { FormControl, InputLabel, Input, TextField } from "@material-ui/core";
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
	const classes = useStyles();
	let jobsList = [];

	const handleChange = (e) => {
		console.log(e);
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const search = async (e) => {
		setLoading(true);
		e.preventDefault();
		const { data } = await axios.post("/jobs/page/1", formData);
		setJobsData(data);
		setLoading(false);
		console.log(data);
	};
	console.log(formData);

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
			<br />
			<form>
				Search for Jobs
				<br />
				<label>
					Query:{" "}
					<input
						type="text"
						name="query"
						id="query"
						placeholder="Query..."
						onChange={(e) => handleChange(e)}
					/>
				</label>
				<br />
				<label>
					Zip Code:{" "}
					<input
						type="text"
						pattern="[0-9]{5}"
						name="zip"
						id="zip"
						placeholder="Zip code"
						onChange={(e) => handleChange(e)}
					/>
				</label>
				<br />
				<label>
					Job Type:{" "}
					<select id="jobType" name="jobType" onChange={(e) => handleChange(e)}>
						<option value="entry_level">Entry Level</option>
						<option value="mid_level">Mid Level</option>
						<option value="senior_level">Senior Level</option>
					</select>
				</label>
				<br />
				<button onClick={(e) => search(e)}>Search</button>
			</form>
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

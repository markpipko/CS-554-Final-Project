import React, { useState, useContext, useEffect } from "react";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "../firebase/Auth";
import {
	getSeeker,
	removeJobAppliedFromSeeker,
} from "../firebase/FirebaseFunctions";

const useStyles = makeStyles({
	chart: {
		width: 1500,
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto",
	},
	card: {
		// maxWidth: 500,
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
		fontSize: "16px",
	},
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
	button: {
		color: "#1e8678",
		fontWeight: "bold",
		fontSize: 12,
	},
	paginator: {
		justifyContent: "center",
		padding: "10px",
	},
});

function Applications() {
	const { currentUser } = useContext(AuthContext);
	const [jobsData, setJobsData] = useState(undefined);
	const [applicationData, setApplicationData] = useState(undefined);

	let jobsList = [];
	let colors = {
		Pending: "",
		Accepted: "success",
		Rejected: "error",
	};
	const classes = useStyles();

	useEffect(() => {
		async function fetchData() {
			let currentUserData = await getSeeker(currentUser.uid);
			let applicationObj = {
				pending: 0,
				rejected: 0,
				accepted: 0,
			};
			console.log(currentUserData)
			for (let i = 0; i < currentUserData.applications.length; i++) {
				switch (currentUserData.applications[i].status) {
					case "Pending":
						applicationObj.pending++;
						break;
					case "Rejected":
						applicationObj.rejected++;
						break;
					case "Accepted":
						applicationObj.accepted++;
						break;
					default:
						break;
				}
			}
			setJobsData(currentUserData.applications);
			setApplicationData(applicationObj);
		}
		fetchData();
	}, [currentUser]);

	async function removeJob(job) {
		let jobsApplied = await removeJobAppliedFromSeeker(
			currentUser.uid,
			job._id
		);
		setJobsData(jobsApplied);
	}

	const buildCards = (job, index) => {
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
							// style={{ whiteSpace: "pre-wrap" }}
							gutterBottom
							variant="body1"
							component="p"
						>
							{job.summary}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							Company: {job.company}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							Location: {job.location}
						</Typography>
						<Button variant="contained" color={colors[job.status]}>
							{job.status}
						</Button>
					</CardContent>
					<CardContent style={{ marginTop: "auto" }}>
						<button
							className="button"
							onClick={() => {
								removeJob(job);
							}}
						>
							Remove
						</button>
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
	let data = [];
	if (applicationData) {
		data = [
			{
				name: "Pending",
				"Number of Applications": applicationData.pending,
			},
			{
				name: "Accepted",
				"Number of Applications": applicationData.accepted,
			},
			{
				name: "Rejected",
				"Number of Applications": applicationData.rejected,
			},
		];
	}
	return (
		<div>
			<h3>Jobs Applied:</h3>

			<Grid
				container
				className={classes.grid}
				spacing={5}
				alignItems="stretch"
				style={{ marginBottom: "15px", padding: "10px" }}
			>
				{jobsList}
			</Grid>
			<br />
			<h3>Chart:</h3>
			<BarChart
				className={classes.chart}
				width={500}
				height={300}
				data={data}
				margin={{
					top: 5,
					right: 30,
					left: 20,
					bottom: 5,
				}}
				barSize={30}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="name" />
				<YAxis type="number" domain={[0, 4]} />
				<Tooltip />
				<Legend />
				<Bar dataKey="Number of Applications" fill="#8884d8" />
			</BarChart>
		</div>
	);
}

export default Applications;

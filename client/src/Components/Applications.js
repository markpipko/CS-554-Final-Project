import React, { useState, useContext, useEffect } from "react";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	Collapse,
	IconButton,
	Alert,
	CircularProgress,
} from "@mui/material";
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
import { makeStyles } from "@mui/styles";
import { AuthContext } from "../firebase/Auth";
import {
	getSeeker,
	removeJobAppliedFromSeeker,
	checkSeekers
} from "../firebase/FirebaseFunctions";
import { Redirect } from "react-router";

const useStyles = makeStyles({
	chart: {
		width: 1500,
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto",
	},
	card: {
		minWidth: 350,
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
});

function Applications() {
	const { currentUser } = useContext(AuthContext);
	const [isSeeker, setIsSeeker] = useState(undefined);
	const [jobsData, setJobsData] = useState(undefined);
	const [applicationData, setApplicationData] = useState(undefined);
	const [graphError, setGraphError] = useState(false);
	const [removeError, setRemoveError] = useState(false);
	const [removeErrorOpen, setRemoveErrorOpen] = useState(false);

	let jobsList = [];
	let colors = {
		Pending: "",
		Accepted: "success",
		Rejected: "error",
	};
	const classes = useStyles();

	useEffect(() => {
		async function fetchData() {
			if (!currentUser.uid) {
				setGraphError(true);
				return;
			}

			let seeker = await checkSeekers(currentUser.uid);
			if (!seeker) {
				setIsSeeker(false);
				return;
			}
			else {
				setIsSeeker(true);
			}

			try {
				let currentUserData = await getSeeker(currentUser.uid);
				if (!currentUserData) {
					setGraphError(true);
					return;
				}
				setGraphError(false);
				let applicationObj = {
					pending: 0,
					rejected: 0,
					accepted: 0,
				};
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
			} catch (e) {
				console.log(e);
				alert(e.message);
			}
		}
		fetchData();
	}, [currentUser]);


	if (isSeeker === undefined) {
		return <CircularProgress />;
	}
	else if (!isSeeker) {
		return <Redirect to="/home" />;
	}

	async function removeJob(job) {
		if (!job._id || !currentUser.uid) {
			setRemoveError(true);
			setRemoveErrorOpen(true);
			return;
		}
		setRemoveError(false);
		try {
			let jobsApplied = await removeJobAppliedFromSeeker(
				currentUser.uid,
				job._id
			);
			setJobsData(jobsApplied);
		} catch (e) {
			setRemoveError(true);
			setRemoveErrorOpen(true);
			return;
		}
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
				<Card
					className={classes.card}
					variant="outlined"
					style={{ display: "flex", flexDirection: "column" }}
				>
					<CardContent>
						<Typography
							className={classes.titleHead}
							gutterBottom
							variant="h6"
							component="h2"
						>
							{job.title}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							{job.summary}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							Company: {job.company}
						</Typography>
						<Typography gutterBottom variant="body1" component="p">
							Location: {job.location}
						</Typography>
					</CardContent>
					<CardContent style={{ marginTop: "auto" }}>
						<Button variant="contained" color={colors[job.status]}>
							{job.status}
						</Button>
						<br />
						<br />
						<Button
							className="button"
							onClick={() => {
								removeJob(job);
							}}
						>
							Remove
						</Button>
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
			{removeError ? (
				<Collapse in={removeErrorOpen}>
					<Alert
						severity="error"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setRemoveErrorOpen(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						Could not remove application. Please try again.
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			<h1>Jobs Applied:</h1>
			{jobsData && jobsData.length > 0 ? (
				<Grid
					container
					className={classes.grid}
					spacing={5}
					alignItems="stretch"
					style={{ marginBottom: "15px", padding: "10px" }}
				>
					{jobsList}
				</Grid>
			) : (
				<div>No applications found. </div>
			)}

			<br />
			<h3>Chart:</h3>
			{graphError ? (
				<div>Graph could not be generated</div>
			) : (
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
					<Legend
						payload={[
							{
								id: "Number of Applications",
								value: "Number of Applications",
								color: "#706bcc",
							},
						]}
					/>
					<Bar dataKey="Number of Applications" fill="#706bcc" />
				</BarChart>
			)}
		</div>
	);
}

export default Applications;

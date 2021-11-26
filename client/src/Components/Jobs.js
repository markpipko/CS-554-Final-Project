import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	FormControl,
	InputLabel,
	TextField,
	MenuItem,
	Button,
	CircularProgress,
	Pagination,
	FormGroup,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { AuthContext } from "../firebase/Auth";
import { checkEmployer } from "../firebase/FirebaseFunctions";
import IndeedApplyModal from "./modals/IndeedApplyModal"

const useStyles = makeStyles({
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

const Jobs = (props) => {
	const [formData, setFormData] = useState({
		query: "",
		zip: "",
		jobType: "entry_level",
	});
	const [jobsData, setJobsData] = useState(undefined);
	const [loading, setLoading] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(0);
	const [searchError, setSearchError] = useState(false);
	const [isEmployer, setIsEmployer] = useState(false);
	// Client side validation
	const [queryError, setQueryError] = useState(false);
	const [queryErrorMessage, setQueryErrorMessage] = useState("");
	const [zipError, setZipError] = useState(false);
	const [zipErrorMessage, setZipErrorMessage] = useState("");
	const [typeError, setTypeError] = useState(false);
	const [typeErrorMessage, setTypeErrorMessage] = useState("");

	const [showIndeedApplyModal, setShowIndeedApplyModal] = useState(false);
	const [modalJob, setModalJob] = useState({title:undefined, location:undefined, company:undefined, uri:undefined, description:undefined});

	const classes = useStyles();
	let jobsList = [];

	const handleOpenIndeedApplyModal = (job) => {
		setShowIndeedApplyModal(true);
		setModalJob(job)
	  };

	  const handleCloseIndeedApplyModal = () => {
		setShowIndeedApplyModal(false);
	  };


	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		async function check() {
			let res = await checkEmp(currentUser.uid);
			if (res) {
				console.log("I am a employer");
			} else {
				console.log("I am a seeker");
			}
			setIsEmployer(res);
		}
		check();
	}, [currentUser]);

	const checkEmp = async (uid) => {
		let res = await checkEmployer(uid);
		return res;
	};

	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handlePageChange = (e, value) => {
		setCurrentPage(value);
	};

	if (isEmployer) {
		window.location.replace("/home");
	}

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
		try {
			const { data } = await axios.post("/jobs/search", formData);
			setJobsData(data);
			setTotalPages(Math.ceil(Number(data.length) / 20));
			setLoading(false);
		} catch (e) {
			console.log(e);
			setSearchError(true);
			setLoading(false);
		}
	};

	// const handleApply = (url) => {
	// 	if (
	// 		window.confirm(
	// 			"This will take you to the job listing on Indeed. Do you wish to proceed?"
	// 		)
	// 	) {
	// 		window.open(url);
	// 	}
	// };

	const buildCards = (job, index) => {
		console.log(job)
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
					</CardContent>
					<CardContent style={{ marginTop: "auto" }}>
						<button
						className="button"
						onClick={() => {
							handleOpenIndeedApplyModal(job);
						}}
						>
							See More
						</button>
					</CardContent>
				</Card>
			</Grid>
		);
	};

	jobsList =
		jobsData &&
		jobsData
			.slice((currentPage - 1) * 20, currentPage * 20)
			.map((job, index) => {
				return buildCards(job, index);
			})

	return (
		<div>
			<h1>Search for Jobs</h1>
			<FormControl>
				<FormGroup>
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
				</FormGroup>
				<br />
				<FormGroup>
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
				</FormGroup>
				<br />
				<FormGroup>
					<TextField
						select
						value={formData.jobType}
						label="Job Type"
						onChange={(e) => handleChange(e)}
						name="jobType"
						id="jobType"
						error={!!typeError}
						helperText={typeErrorMessage}
					>
						<MenuItem value="entry_level">Entry Level</MenuItem>
						<MenuItem value="mid_level">Mid Level</MenuItem>
						<MenuItem value="senior_level">Senior Level</MenuItem>
					</TextField>
				</FormGroup>
				<br />
				<Button type="submit" onClick={(e) => search(e)}>
					Submit
				</Button>
			</FormControl>
			<br />
			<br />
			{loading ? (
				<CircularProgress />
			) : searchError ? (
				<div>No search results found</div>
			) : jobsData ? (
				<div>
					<Pagination
						count={totalPages}
						page={currentPage}
						onChange={handlePageChange}
						defaultPage={1}
						color="primary"
						size="large"
						showFirstButton
						showLastButton
						classes={{ ul: classes.paginator }}
					/>
					<br />
					<Grid
						container
						className={classes.grid}
						spacing={5}
						alignItems="stretch"
					>
						{jobsList}
					</Grid>

					<IndeedApplyModal 
						 show={showIndeedApplyModal}
						 onHide={handleCloseIndeedApplyModal}
						 modaljob = {modalJob}
						//  apply = {handleApply}
						 />
				</div>
			) : (
				<div></div>
			)}
		</div>
	);
};

export default Jobs;

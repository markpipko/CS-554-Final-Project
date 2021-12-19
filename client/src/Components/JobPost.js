import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../firebase/Auth";
// import { Card, Button, Col } from "react-bootstrap";
import zipcodes from "zipcodes";
import {
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
	CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
const useStyles = makeStyles({
	card: {
		width: 250,
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
		"&:disabled": {
			color: "white",
			backgroundColor: "#767676",
		},
	},
});

const JobPost = (props) => {
	const { currentUser } = useContext(AuthContext);
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState(false);
	const [applied, setApplied] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		if (
			props.job.applicants &&
			props.job.applicants.findIndex((x) => x.email === currentUser.email) >= 0
		) {
			setApplied(true);
		}
	}, [props.job, currentUser]);

	if (currentUser) {
		currentUser.getIdToken().then((t) => {
			setToken(t);
		});
	}

	const apply = async (jobId) => {
		setLoading(true);
		if (!jobId) {
			props.setErrorOpen(true);
			props.setError(true);
			setLoading(false);
			return;
		}
		try {
			let body = {
				jobUid: jobId,
			};
			const { data } = await axios.post("/jobs/apply", body, {
				headers: {
					token: token,
				},
			});

			if (!data) {
				props.setErrorOpen(true);
				props.setError(true);
				setLoading(false);
			}
			props.setError(false);
			props.setInfoOpen(true);
			props.setStatus(true);
			setApplied(true);
			setLoading(false);
		} catch (e) {
			console.log(e);
			props.setErrorOpen(true);
			props.setError(true);
			setLoading(false);
		}
	};

	function findLoc(zip) {
		if (!zip) {
			return ``;
		}
		try {
			let loc = zipcodes.lookup(zip);
			return `${loc.city}, ${loc.state}`;
		} catch (e) {
			return ``;
		}
	}
	return (
		<Grid
			item
			xs={10}
			sm={5}
			md={5}
			lg={4}
			xl={3}
			key={props.id + props.index}
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
						{props.job.title}
					</Typography>
					<Typography gutterBottom variant="body1" component="p">
						{findLoc(props.job.zip)}
					</Typography>
					<Typography gutterBottom variant="body1" component="p">
						{props.job.summary}
					</Typography>
					<Typography gutterBottom variant="body1" component="p">
						Company: {props.job.company}
					</Typography>
					<Typography gutterBottom variant="body1" component="p">
						Field: {props.job.field}
					</Typography>
				</CardContent>
				<CardContent style={{ marginTop: "auto" }}>
					{loading ? <CircularProgress /> : <div></div>}
					<br />
					<Button
						className={classes.button}
						variant="contained"
						disabled={loading || applied}
						onClick={() => apply(props.id)}
					>
						Apply
					</Button>
				</CardContent>
			</Card>
		</Grid>
	);
};

export default JobPost;

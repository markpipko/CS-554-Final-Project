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
import { getSeeker } from "../firebase/FirebaseFunctions";
import ApplicantChart from "./ApplicantChart";

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


function Applications() {
    const { currentUser } = useContext(AuthContext);
    const [jobsData, setJobsData] = useState(undefined);

    let jobsList = [];
    const classes = useStyles();

    useEffect(() => {
        async function fetchData() {
            let currentUserData = await getSeeker(currentUser.uid);
            setJobsData(currentUserData.applications);
        }
        fetchData();
    }, [currentUser]);

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
						</CardContent>
					</Card>
				</Grid>
		);
	};

    jobsList =
		jobsData &&
		jobsData
			.map((job, index) => {
				return buildCards(job, index);
			});

    return (
        <div>
            <h3>Jobs Applied:</h3>
            <Grid
                container
                className={classes.grid}
                spacing={5}
                alignItems="stretch"
                style={{marginBottom:"15px", padding:"10px"}}
            >
                {jobsList}
            </Grid>
            <br />
            <h3>Chart:</h3>
            <ApplicantChart />
        </div>
    )
}

export default Applications;
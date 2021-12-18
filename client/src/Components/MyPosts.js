import React, { useState, useContext, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import ApplicantsModal from "./modals/ApplicantsModal";
import { retrieveCurrentApplicants } from "../firebase/FirebaseFunctions";
import {
	Collapse,
	Alert,
	IconButton,
	Card,
	CardContent,
	Typography,
	Grid,
	Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";

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

function MyPosts() {
	const { currentUser } = useContext(AuthContext);
	const [posts, setPosts] = useState(undefined);
	const [showModal, setShowModal] = useState(false);
	const [modalApplicants, setModalApplicants] = useState([]);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const classes = useStyles();

	useEffect(() => {
		async function postings() {
			const q = query(
				collection(db, "posts"),
				where("email", "==", currentUser.email)
			);

			const querySnapshot = await getDocs(q);
			setPosts(querySnapshot);
		}

		postings();
	}, [currentUser]);
	const handleOpenModal = async (id) => {
		if (!id) {
			return;
		}
		try {
			let applicantsArr = await retrieveCurrentApplicants(id);

			setModalApplicants(applicantsArr);
			setShowModal(true);
		} catch (e) {
			setError(true);
			setErrorMessage(e.message);
		}
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const buildCard = (id, job) => {
		return (
			<Grid
				item
				xs={10}
				sm={5}
				md={5}
				lg={4}
				xl={3}
				key={id}
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
					</CardContent>
					<CardContent style={{ marginTop: "auto" }}>
						<Button onClick={() => handleOpenModal(id)}>See Applicants</Button>
					</CardContent>
				</Card>
				<ApplicantsModal
					id={id}
					show={showModal}
					onHide={handleCloseModal}
					modalapplicants={modalApplicants}
				/>
			</Grid>
		);
	};

	let card = null;
	if (posts) {
		let postsArr = [];
		posts &&
			posts.forEach((doc) => {
				postsArr.push(doc);
			});

		card = postsArr.map((doc) => {
			return buildCard(doc.id, doc.data());
		});
	}

	return (
		<div>
			{error ? (
				<Collapse in={error}>
					<Alert
						severity="error"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setError(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						{errorMessage}
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			<h1>My Posts</h1>
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
	);
}

export default MyPosts;

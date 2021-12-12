import React, { useState, useContext, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import { Card, Button, Row, Col } from "react-bootstrap";
import ApplicantsModal from "./modals/ApplicantsModal";
import { retrieveCurrentApplicants } from "../firebase/FirebaseFunctions";
function MyPosts() {
	const { currentUser } = useContext(AuthContext);
	const [posts, setPosts] = useState(undefined);
	const [showModal, setShowModal] = useState(false);
	const [modalApplicants, setModalApplicants] = useState([]);

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

		let applicantsArr = await retrieveCurrentApplicants(id);

		setModalApplicants(applicantsArr);
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

	const buildCard = (id, job) => {
		return (
			<Col key={id}>
				<Card className="card" style={{ width: "18rem", height: "25rem" }}>
					<Card.Body>
						<Card.Title className="titleHead">{job.title}</Card.Title>
						<Card.Text>{job.summary}</Card.Text>
						<Button onClick={() => handleOpenModal(id)}>See Applicants</Button>
					</Card.Body>
				</Card>
				<ApplicantsModal
					show={showModal}
					onHide={handleCloseModal}
					modalapplicants={modalApplicants}
				/>
			</Col>
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
			<Row sm={1} md={2} lg={4}>
				{card}
			</Row>
		</div>
	);
}

export default MyPosts;

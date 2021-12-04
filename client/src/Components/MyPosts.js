import React, { useState, useContext, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import { Card, Button, Row, Col} from 'react-bootstrap';
import ApplicantsModal from './modals/ApplicantsModal'

function MyPosts(){
    const { currentUser } = useContext(AuthContext);
    const [posts, setPosts] = useState(undefined);
    const [showModal, setShowModal] = useState(false);
	const [modalApplicants, setModalApplicants] = useState([{
        id: undefined,
		name: undefined,
		email: undefined,
		resume: undefined
	}]);

    useEffect(() => {
        async function postings(){
            const q = query(collection(db, "posts"), where("email", "==", currentUser.email));

            const querySnapshot = await getDocs(q);
            setPosts(querySnapshot)
        }
    
        postings()
    },[])

    const handleOpenModal = async (id) => {
        const querySnapshot = await getDocs(collection(doc(db, 'posts', id), "applicants"));

        let applicantsArr = []
        querySnapshot.forEach((doc) => {
            applicantsArr.push({
                id: doc.id,
                name: doc.data().name,
                email: doc.data().email,
                resume: doc.data().resume
            });
        });  

        setModalApplicants(applicantsArr)
		setShowModal(true);
	};

	const handleCloseModal = () => {
		setShowModal(false);
	};

    const buildCard = (id, job) => {
		return (
            
            <Col key={id}>
                <Card className='card' style={{ width: '18rem', height: '25rem' }}>
                    <Card.Body>
                        <Card.Title className='titleHead'>{ job.title}</Card.Title>
                        <Card.Text>
                        {job.description}
                        </Card.Text>
                        <Button onClick={() => handleOpenModal(id)}>See Applicants</Button>
                    </Card.Body>
                </Card>
                <ApplicantsModal
                    show={showModal}
                    onHide={handleCloseModal}
                    modalApplicants={modalApplicants}
                />
            </Col>

		);
	};

    let card = null
    if (posts){
        console.log(posts)
        let postsArr = []
        posts &&
            posts.forEach((doc) => {
                postsArr.push(doc);
            });  
            
        card = postsArr.map((doc) => {return buildCard(doc.id, doc.data())})
    }

    return (
        <div>
        <Row sm={1} md={2} lg={4}>
                {card}
            </Row>
        </div>
    )
}

export default MyPosts
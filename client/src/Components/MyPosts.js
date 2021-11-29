import React, { useState, useContext, useEffect } from "react";
import { db } from "../firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import { Card, Button, Row, Col} from 'react-bootstrap';

function MyPosts(){
    const { currentUser } = useContext(AuthContext);
    const [posts, setPosts] = useState(undefined);

    useEffect(() => {
        async function postings(){
            const q = query(collection(db, "posts"), where("email", "==", currentUser.email));

            const querySnapshot = await getDocs(q);
            setPosts(querySnapshot)
        }
    
        postings()
    },[])

    const buildCard = (id, job) => {
		return (
            
            <Col key={id}>
                <Card className='card' style={{ width: '18rem', height: '25rem' }}>
                    <Card.Body>
                        <Card.Title className='titleHead'>{ job.title}</Card.Title>
                        <Card.Text>
                        {job.description}
                        </Card.Text>
                        <Button>See Applicants</Button>
                    </Card.Body>
                </Card>
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
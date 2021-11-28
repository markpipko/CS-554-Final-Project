import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../firebase/Auth";
import {
	FormControl,
	InputLabel,
	TextField,
	CircularProgress,
	FormGroup,
} from "@mui/material";
import { db } from "../firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, Button, Row, Col} from 'react-bootstrap';
import zipcodes from 'zipcodes'

import '../App.css';

function HomeSeeker() {
  const [formData, setFormData] = useState({});
  const [queryError, setQueryError] = useState(false);
  const [queryErrorMessage, setQueryErrorMessage] = useState("");
  const [isSeeker, setIsSeeker] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [data, setData] = useState(undefined);


  const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

  const apply = async (jobId, job) => {
    const ref = await db.collection('posts').doc(jobId).collection('applied').doc(currentUser.uid).set({
        name: currentUser.displayName,
        email: currentUser.email,
        resume: currentUser.resume
    })
    };

  const checkApplied = async (jobId) => {
    const red = db.collection('posts').doc(jobId).collection('applied').doc(currentUser.uid);
    const doc = await red.get();

    return doc.exists()
  }

  const search = async (e) => {
		setLoading(true);
		e.preventDefault();
		if (!formData.query || !formData.query.trim()) {
			setQueryError(true);
			setQueryErrorMessage("Search term must be provided");
			setLoading(false);
			return;
		}
		setQueryError(false);
		setQueryErrorMessage("");

    try {
        const q = query(collection(db, "posts"), where("company", "==", formData.query));

        const querySnapshot = await getDocs(q);
        setData(querySnapshot)

        setLoading(false);
        } catch (e) {
            console.log(e);
            setSearchError(true);
            setLoading(false);
        }
  }

  let form = null

    form = 
    <FormControl>
				<FormGroup>
					<InputLabel id="query" htmlFor="query"></InputLabel>
					<TextField
						id="query"
						variant="outlined"
						label="Company"
						onChange={(e) => handleChange(e)}
						name="query"
						error={!!queryError}
						helperText={queryErrorMessage}
						required
					/>
				</FormGroup>
        <Button type="submit" onClick={(e) => search(e)}>
					Submit
				</Button>
    </FormControl>

  if (loading){
    return <CircularProgress />
  }

  if(searchError){
      return <div>No search results found</div>
  }

  const buildCard = (id, job) => {
		return (
            
      <Col key={id}>
          <Card className='card' style={{ width: '18rem', height: '25rem' }}>
              <Card.Body>
                  <Card.Title className='titleHead'>{ job.title}</Card.Title>
                  <Card.Text>
                  {
                    () => {let loc = zipcodes.lookup(job.zip);
                    return `${loc.city},${loc.state}`}
                  }
                  <br />
                  {job.description}
                  </Card.Text>
                  {!checkApplied && <Button onClick={apply(id, job)}>Apply</Button>}
              </Card.Body>
          </Card>
      </Col>

		);
	};

    let card = null
  if (data){
    console.log(data)
    let dataArr = []
    data &&
    data.forEach((doc) => {
      dataArr.push(doc);
        });  
        
    card = dataArr.map((doc) => {return buildCard(doc.id, doc.data())})
  }

  return (

    <div>
      {!data ? form: card}
    </div>
  );
}

export default HomeSeeker;
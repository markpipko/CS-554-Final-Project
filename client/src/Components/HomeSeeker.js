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
import { collection, query, where, getDocs, getDoc, doc, setDoc } from "firebase/firestore";
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
    const docRef = doc(db, "seekers", currentUser.uid);
    const docSnap = await getDoc(docRef);

    await setDoc(doc(doc(db,'posts',jobId), "applicants", currentUser.uid), {
        name: currentUser.displayName,
        email: currentUser.email,
        resume: docSnap.data().resume
    })
    };

  const checkApplied = async (jobId) => {
    // const docRef =  doc(db, 'posts', jobId)
    const docRef =  doc(doc(db, 'posts', jobId), "applicants", currentUser.uid);
    const docSnap = await getDoc(docRef);

    return docSnap.exists()
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
        <br/>
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

  function findLoc(zip){
    try{
        let loc = zipcodes.lookup(zip);
        return `${loc.city},${loc.state}`
    }
    catch(e){
        return ``
    }
  }

  const buildCard = (id, job) => {
		return (
            
      <Col key={id}>
          <Card className='card' style={{ width: '18rem', height: '25rem' }}>
              <Card.Body>
                  <Card.Title className='titleHead'>{ job.title}</Card.Title>
                  <Card.Text>
                  {findLoc(job.zip)}
                  <br />
                  {job.description}
                  </Card.Text>
                  <Button variant="contained" onClick={apply(id, job)}>Apply</Button>
              </Card.Body>
          </Card>
      </Col>

		);
	};

<<<<<<< Updated upstream
    let card = null
  if (data){
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
=======
	let card = null;
	if (data) {
		let dataArr = [];
		data &&
			data.forEach((doc) => {
				dataArr.push(doc);
			});
		
			if(dataArr.length === 0){
				return (<><Button onClick={backToSearch}>Back to search</Button><div>No listings found</div></>);
			}

		card = dataArr.map((doc, index) => {
			return buildCard(doc.id, doc.data(), index);
		});
	}

	return (
		<div>
			{status ? (
				<Collapse in={infoOpen}>
					<Alert
						severity="success"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setInfoOpen(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						Application has been successfully submitted!
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			{error ? (
				<Collapse in={errorOpen}>
					<Alert
						severity="error"
						action={
							<IconButton
								aria-label="close"
								color="inherit"
								size="small"
								onClick={() => {
									setErrorOpen(false);
								}}
							>
								<CloseIcon fontSize="inherit" />
							</IconButton>
						}
						sx={{ mb: 2 }}
					>
						Application could not be submitted. Please try again.
					</Alert>
				</Collapse>
			) : (
				<div></div>
			)}
			{!data ? (
				<div></div>
			) : (
				<Button onClick={backToSearch}>Back to search</Button>
			)}
			{!data ? (
				<div>
					<h1>Search for Jobs on Jobaroo</h1>
					{form}
					<BarChart
						width={1000}
						height={300}
						data={jobTypes}
						margin={{
							top: 5,
							right: 30,
							left: 20,
							bottom: 5,
						}}
						barSize={20}
					>
						<XAxis
							dataKey="name"
							scale="point"
							padding={{ left: 10, right: 10 }}
						/>
						<YAxis />
						<Tooltip />
						<Legend />
						<CartesianGrid strokeDasharray="3 3" />
						<Bar
							dataKey="Number of Postings"
							fill="#8884d8"
							background={{ fill: "#eee" }}
						/>
					</BarChart>
				</div>
			) : (
				<div>
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
			)}
		</div>
	);
>>>>>>> Stashed changes
}

export default HomeSeeker;
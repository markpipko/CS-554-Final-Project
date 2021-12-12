import React, { useState } from "react";
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
import { getAuth} from "firebase/auth";
import { collection, addDoc, getDoc } from "firebase/firestore";
import {  db } from "../firebase/Firebase";
import  { Redirect } from 'react-router-dom'


const PostJob = (props) => {
    const [formData, setFormData] = useState({
		title: "",
        field: "",
		description: "",
        zip: "",
		jobType: "entry_level",
	});
    const {currentUser} = getAuth();
    const [titleError, setTitleError] = useState(false);
	const [titleErrorMessage, setTitleErrorMessage] = useState("");
    const [fieldError, setFieldError] = useState(false);
	const [fieldErrorMessage, setFieldErrorMessage] = useState("");
	const [zipError, setZipError] = useState(false);
	const [zipErrorMessage, setZipErrorMessage] = useState("");
	const [descriptionError, setDescriptionError] = useState(false);
	const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
    const [typeError, setTypeError] = useState(false);
	const [typeErrorMessage, setTypeErrorMessage] = useState("");
    const [submitted, setSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    };

    if(!props.employer){
		<Redirect to="/somewhere/else" />
	}

    const post = async (e) => {
		e.preventDefault();
		if (!formData.title || !formData.title.trim()) {
			setTitleError(true);
			setTitleErrorMessage("Title must be provided");
			return;
		}
		setTitleError(false);
		setTitleError("");
        if (!formData.field ) {
			setTitleError(true);
			setTitleErrorMessage("Field must be provided");
			return;
		}
		setFieldError(false);
		setFieldError("");
        if (!formData.description) {
			setDescriptionError(true);
			setDescriptionErrorMessage("Job description must be provided");
			return;
		}
		setDescriptionError(false);
		setDescriptionErrorMessage("");
		if (!formData.zip || !formData.zip.trim()) {
			setZipError(true);
			setZipErrorMessage("Zip code must be provided");
			return;
		} else if (!/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(formData.zip.trim())) {
			setZipError(true);
			setZipErrorMessage("Zip code is not of proper format");
			return;
		}
		setZipError(false);
		setZipErrorMessage("");
		if (!formData.jobType) {
			setTypeError(true);
			setTypeErrorMessage("Job type must be provided");
			return;
		}
		setTypeError(false);
		setTypeErrorMessage("");
		try {
            await addDoc(collection(db, "posts"), {
                company: currentUser.displayName,
                email: currentUser.email,
                title: formData.title,
                field: formData.field,
                description: formData.description,
                zip: formData.zip,
                jobType: formData.jobType,
                // applicants: []
              });
            setSubmitted(true)
		} catch (e) {
			console.log(e);
		}
	};
    return(
    <div>
        <h1>Post a Job</h1>
        <FormControl id="mainForm">
            <FormGroup>
                <InputLabel id="title" htmlFor="title"></InputLabel>
                <TextField
                    id="title"
                    variant="outlined"
                    label="Title"
                    onChange={(e) => handleChange(e)}
                    name="title"
                    error={!!fieldError}
                    helperText={titleErrorMessage}
                    required
                />
            </FormGroup>
            <br />
            <FormGroup>
                <InputLabel id="field" htmlFor="field"></InputLabel>
                <TextField
                    select
                    id="field"
                    variant="outlined"
                    label="Field"
                    onChange={(e) => handleChange(e)}
                    name="field"
                    error={!!titleError}
                    helperText={fieldErrorMessage}
                    required
                >  
                    <MenuItem value="Architecture, Planning & Environmental Design">Architecture, Planning & Environmental Design</MenuItem>
                    <MenuItem value="mid_level">Arts & Entertainment</MenuItem>
                    <MenuItem value="Business">Business</MenuItem>
                    <MenuItem value="Communications">Communications</MenuItem>
                    <MenuItem value="Education">Education</MenuItem>
                    <MenuItem value="Engineering & Computer Science">Engineering & Computer Science</MenuItem>
                    <MenuItem value="Environment">Environment</MenuItem>
                    <MenuItem value="Government">Government</MenuItem>
                    <MenuItem value="Health & Medicine">Health & Medicine</MenuItem>
                    <MenuItem value="International">International</MenuItem>
                    <MenuItem value="Law & Public Policy">Law & Public Policy</MenuItem>
                    <MenuItem value="Sciences - Biological & Physical">Sciences - Biological & Physical</MenuItem>
                    <MenuItem value="Social Impact">Social Impact</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>

                </TextField>     
            </FormGroup>
            <br />
            <FormGroup>
                <InputLabel id="description" htmlFor="description"></InputLabel>
                <TextField
                    id="description"
                    variant="outlined"
                    label="Description"
                    onChange={(e) => handleChange(e)}
                    name="description"
                    error={!!descriptionError}
                    helperText={descriptionErrorMessage}
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
            <Button type="submit" onClick={(e) => post(e)}>
                Submit
            </Button>
        </FormControl>
        {submitted && <p>Job Posted</p>}
    </div>)
}
export default PostJob;

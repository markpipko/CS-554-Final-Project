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
    const {currentUser} = getAuth();
    const [formData, setFormData] = useState({});
    const [titleError, setTitleError] = useState(false);
	const [titleErrorMessage, setTitleErrorMessage] = useState("");
	const [zipError, setZipError] = useState(false);
	const [zipErrorMessage, setZipErrorMessage] = useState("");
	const [descriptionError, setDescriptionError] = useState(false);
	const [descriptionErrorMessage, setDescriptionErrorMessage] = useState("");
    const [typeError, setTypeError] = useState(false);
	const [typeErrorMessage, setTypeErrorMessage] = useState("");

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
                email: currentUser.email,
                title: formData.title,
                description: formData.description,
                zipcode: formData.zipcode,
                type: formData.type,
              });
		} catch (e) {
			console.log(e);
		}
	};
    return(
    <div>
        <h1>Post a Job</h1>
        <FormControl>
            <FormGroup>
                <InputLabel id="title" htmlFor="title"></InputLabel>
                <TextField
                    id="title"
                    variant="outlined"
                    label="title"
                    onChange={(e) => handleChange(e)}
                    name="title"
                    error={!!titleError}
                    helperText={titleErrorMessage}
                    required
                />
            </FormGroup>
            <br />
            <FormGroup>
                <InputLabel id="description" htmlFor="description"></InputLabel>
                <TextField
                    id="description"
                    variant="outlined"
                    label="description"
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
    </div>)
}
export default PostJob;

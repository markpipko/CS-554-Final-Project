import React, { useState, useContext, useEffect } from "react";
import {
	FormControl,
	FormGroup,
	Button,
	CircularProgress,
} from "@mui/material";
import { imageUpload } from "../firebase/FirebaseFunctions";
import { checkForImage } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
const UploadImage = () => {
	const { currentUser } = useContext(AuthContext);
	const [image, setImage] = useState("");
	const [loading, setLoading] = useState(false);
	const [token, setToken] = useState(null);
	const [error, setError] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	if (currentUser) {
		currentUser.getIdToken().then((t) => {
			setToken(t);
		});
	}
	const handleChange = async (e) => {
		let imageUrl = e.target.files[0];
		if (!imageUrl) {
			setError(true);
			setErrorMessage("No image was attached. Please attach an image.");
			setLoading(false);
			return;
		}
		if (imageUrl.size / 1024 / 1024 > 5) {
			setError(true);
			setErrorMessage(
				"The size of your profile image is too big. Images must be < 5 MB"
			);
			setLoading(false);
			return;
		}
		setError(false);
		setErrorMessage("");
		try {
			setLoading(true);
			let fData = new FormData();
			fData.append("photo", imageUrl, imageUrl.name);
			let { data } = await axios.post("/image/uploadImage", fData, {
				headers: {
					token: token,
					"Content-Type": `multipart/form-data; boundary=${fData._boundary}`,
				},
			});
			setImage(data.img);
			await imageUpload(currentUser.uid, data.img);
			setLoading(false);
		} catch (e) {
			console.log(e);
			setError(true);
			setErrorMessage(e);
			setLoading(false);
		}
	};

	useEffect(() => {
		async function check() {
			let res = await checkForImage(currentUser.uid);
			setImage(res);
		}
		check();
	}, [currentUser]);

	return (
		<div>
			{image ? (
				<div>
					<img src={image} alt="Profile" className="profileImage" />
				</div>
			) : (
				<img
					src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
					alt="Default Profile"
					className="defaultImage"
				/>
			)}
			<br />
			{error ? errorMessage : <div></div>}
			<br />
			{loading ? <CircularProgress /> : <div></div>}
			<br />
			<FormControl>
				<FormGroup>
					<label htmlFor="uploadImage">
						<input
							accept="image/*"
							id="uploadImage"
							type="file"
							onChange={(e) => handleChange(e)}
							name="uploadImage"
							hidden
						/>
						<Button variant="contained" disabled={loading} component="span">
							{!image ? "Upload Profile Image" : "Change Profile Image"}
						</Button>
					</label>
				</FormGroup>
			</FormControl>
		</div>
	);
};

export default UploadImage;

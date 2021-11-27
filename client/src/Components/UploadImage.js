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

	if (currentUser) {
		currentUser.getIdToken().then((t) => {
			setToken(t);
		});
	}
	const handleChange = async (e) => {
		let imageUrl = e.target.files[0];
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
			console.log(data);
			setImage(data.img);
			await imageUpload(currentUser.uid, data.img);
			setLoading(false);
		} catch (e) {
			setLoading(false);
			console.log(e);
		}
	};

	useEffect(() => {
		async function check() {
			let res = await checkForImage(currentUser.uid);
			console.log(res);
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
					className="profileImage"
				/>
			)}
			<br />
			<br />
			{loading ? <CircularProgress /> : <div></div>}
			<br />
			<FormControl>
				<FormGroup>
					<Button variant="contained" component="label">
						{!image ? "Upload Profile Image" : "Change Profile Image"}
						<input
							type="file"
							name="imageUrl"
							hidden
							accept="image/*"
							onChange={(e) => handleChange(e)}
						/>
					</Button>
				</FormGroup>
			</FormControl>
		</div>
	);
};

export default UploadImage;

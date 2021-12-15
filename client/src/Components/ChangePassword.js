import React, { useContext, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import { doChangePassword } from "../firebase/FirebaseFunctions";
import "../App.css";
import { Button } from "@mui/material";
function ChangePassword() {
	const { currentUser } = useContext(AuthContext);
	const [pwMatch, setPwMatch] = useState("");

	const submitForm = async (event) => {
		event.preventDefault();
		const { currentPassword, newPasswordOne, newPasswordTwo } =
			event.target.elements;

		if (newPasswordOne.value !== newPasswordTwo.value) {
			setPwMatch("New Passwords do not match, please try again");
			return false;
		}

		try {
			await doChangePassword(
				currentUser.email,
				currentPassword.value,
				newPasswordOne.value
			);
			alert("Password has been changed, you will now be logged out");
		} catch (error) {
			alert(error);
		}
	};
	if (currentUser.providerData[0].providerId === "password") {
		return (
			<div>
				{pwMatch && <h4 className="error">{pwMatch}</h4>}
				<h3>Change Password</h3>
				<form onSubmit={submitForm}>
					<div className="form-group">
						<label>
							Current Password:
							<input
								className="form-control"
								name="currentPassword"
								id="currentPassword"
								type="password"
								placeholder="Current Password"
								required
							/>
						</label>
					</div>

					<div className="form-group">
						<label>
							New Password:
							<input
								className="form-control"
								name="newPasswordOne"
								id="newPasswordOne"
								type="password"
								placeholder="Password"
								required
							/>
						</label>
					</div>
					<div className="form-group">
						<label>
							Confirm New Password:
							<input
								className="form-control"
								name="newPasswordTwo"
								id="newPasswordTwo"
								type="password"
								placeholder="Confirm Password"
								required
							/>
						</label>
					</div>
					<Button type="submit" variant="contained">
						Change Password
					</Button>
				</form>
				<br />
			</div>
		);
	} else {
		return (
			<div>
				<h2>
					You are signed in using a Social Media Provider, You cannot change
					your password
				</h2>
			</div>
		);
	}
}

export default ChangePassword;

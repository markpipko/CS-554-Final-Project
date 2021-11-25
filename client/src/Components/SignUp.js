import React, { useContext, useState } from "react";
import { Redirect } from "react-router-dom";
import { doCreateUserWithEmailAndPassword } from "../firebase/FirebaseFunctions";
import { AuthContext } from "../firebase/Auth";
import SocialSignIn from "./SocialSignIn";

function SignUp() {
	const { currentUser } = useContext(AuthContext);
	const [pwMatch, setPwMatch] = useState("");
	const [formData, setFormData] = useState({
		displayName: "",
		email: "",
        role: null,
		passwordOne: "",
		passwordTwo: "",
	});
	const handleChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const handleSignUp = async (e) => {
		e.preventDefault();
		// const { displayName, email, passwordOne, passwordTwo } = e.target.elements;
		if (formData.passwordOne !== formData.passwordTwo) {
			setPwMatch("Passwords do not match");
			return false;
		}

		try {
			// await doCreateUserWithEmailAndPassword(
			// 	email.value,
			// 	passwordOne.value,
			// 	displayName
			// );
			await doCreateUserWithEmailAndPassword(
				formData.email,
				formData.passwordOne,
                formData.role,
				formData.displayName
			);
		} catch (error) {
			alert(error);
		}
	};

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	return (
		<div>
			<h1>Sign up</h1>
			{pwMatch && <h4 className="error">{pwMatch}</h4>}
			<div>
				<div className="form-group">
					<label>
						Name:
						<input
							className="form-control"
							required
							name="displayName"
							type="text"
							placeholder="Name"
							onChange={(e) => handleChange(e)}
						/>
					</label>
				</div>
				<div className="form-group">
					<label>
						Email:
						<input
							className="form-control"
							required
							name="email"
							type="email"
							placeholder="Email"
							onChange={(e) => handleChange(e)}
						/>
					</label>
				</div>
                <div className="form-group">
					Role: <br />
                    <input type="radio" id="seeker" name="role" value="seeker" onChange={(e) => handleChange(e)}/>
                    <label htmlFor="seeker">Job Seeker</label><br/>
                    <input type="radio" id="employer" name="role" value="employer" onChange={(e) => handleChange(e)}/>
                    <label htmlFor="employer">Employer</label>
				</div>
				<div className="form-group">
					<label>
						Password:
						<input
							className="form-control"
							id="passwordOne"
							name="passwordOne"
							type="password"
							placeholder="Password"
							required
							onChange={(e) => handleChange(e)}
						/>
					</label>
				</div>
				<div className="form-group">
					<label>
						Confirm Password:
						<input
							className="form-control"
							name="passwordTwo"
							type="password"
							placeholder="Confirm Password"
							required
							onChange={(e) => handleChange(e)}
						/>
					</label>
				</div>
				<button
					id="submitButton"
					name="submitButton"
					type="submit"
					onClick={(e) => handleSignUp(e)}
				>
					Sign Up
				</button>
			</div>
			<br />
			<SocialSignIn />
		</div>
	);
}

export default SignUp;
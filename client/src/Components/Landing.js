import React, { useContext } from "react";
import "../App.css";
import { AuthContext } from "../firebase/Auth";
import { Redirect } from "react-router-dom";

function Landing() {
	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	return (
		<div>
			<h1>Welcome to Jobaroo!</h1>
			<p>
				Jobaroo is a job search site where applicants can query positions and
				companies to find the job that is perfect for them.
			</p>
			<p>
				Click on Sign Up to get started or click on Sign In if you have already
				registered.
			</p>
			<img src="/imgs/Jobaroo2.png" alt="Jobaroo" className="jobarooImage" />
		</div>
	);
}

export default Landing;

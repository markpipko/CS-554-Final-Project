import React, { useContext } from "react";
import "../App.css";
import { AuthContext } from "../firebase/Auth";
import { Redirect } from "react-router-dom";
import { Typography } from "@mui/material";

function Landing() {
	const { currentUser } = useContext(AuthContext);

	if (currentUser) {
		return <Redirect to="/home" />;
	}

	return (
		<div>
			<h1>Welcome to Jobaroo!</h1>
			<Typography variant="h5" component="h2">
				For Applicants:
			</Typography>
			<Typography variant="body1" component="p">
				Jobaroo is a job search site where applicants can query companies or job
				fields to find jobs that have been posted by employers on our site.
				Applicants can also search for jobs using our Indeed Job Search, which
				will display data from Indeed.
			</Typography>
			<Typography variant="body1" component="p">
				When you find a job that you like, you can directly apply to the job
				listing, but make sure you upload your resume in Account tab before
				applying.
			</Typography>
			<br />
			<Typography variant="h5" component="h2">
				For Employers:
			</Typography>
			<Typography variant="body1" component="p">
				Employers can directly search for applicants that are on our site as
				well as post job listings to find applicants. When an applicant applies
				to your job listing, you will receive an email and when you go to the
				Posts tab, you can see the applicant that has applied. From there, you
				can see information about the applicant and either accept or reject the
				applicant.
			</Typography>
			<br />
			<Typography variant="h5" component="h3">
				Click on Sign Up to get started or click on Sign In if you have already
				registered.
			</Typography>
			<img src="/imgs/Jobaroo2.png" alt="Jobaroo" className="jobarooImage" />
		</div>
	);
}

export default Landing;

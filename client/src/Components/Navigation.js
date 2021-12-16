import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";
import "../App.css";
import { AppBar, Toolbar, Grid, Tabs, Tab } from "@mui/material";
import { checkEmployer } from "../firebase/FirebaseFunctions";
import { useLocation } from "react-router-dom";
const Navigation = () => {
	const { currentUser } = useContext(AuthContext);
	return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
	const location = useLocation();
	const [isEmployer, setIsEmployer] = useState(false);
	const { currentUser } = useContext(AuthContext);
	useEffect(() => {
		async function check() {
			let res = await checkEmp(currentUser.uid);
			setIsEmployer(res);
		}
		check();
	}, [currentUser]);

	const checkEmp = async (uid) => {
		let res = await checkEmployer(uid);
		return res;
	};

	const [value, setValue] = useState(0);
	useEffect(() => {
		const paths = isEmployer
			? ["/home", "/postjob", "/posts", "/account"]
			: ["/home", "/jobs", "/applications", "/account"];
		setValue(
			paths.indexOf(location.pathname.toLowerCase()) >= 0
				? paths.indexOf(location.pathname.toLowerCase())
				: 0
		);
	}, [location.pathname, isEmployer]);
	return (
		<div>
			<AppBar style={{ backgroundColor: "white", color: "black" }}>
				<Toolbar>
					<Grid container>
						<Grid
							xs={1}
							item
							style={{
								textAlign: "left",
								transform: "translateY(5%)",
							}}
						>
							<span>Jobaroo</span>
						</Grid>
						<Grid xs={5} item>
							<Tabs
								onChange={(e, v) => setValue(v)}
								value={value}
								aria-label="Navigation Tabs"
							>
								<Tab label={"Home"} component={Link} to="/home" />
								{isEmployer ? (
									<Tab label={"Post a Job"} component={Link} to="/postjob" />
								) : (
									<Tab
										label={"Indeed Job Search"}
										component={Link}
										to="/jobs"
									/>
								)}
								{isEmployer ? (
									<Tab label={"Posts"} component={Link} to="/posts" />
								) : (
									<Tab
										label={"My Applications"}
										component={Link}
										to="/applications"
									/>
								)}
								<Tab label={"Account"} component={Link} to="/account" />
							</Tabs>
						</Grid>
						<Grid item xs={1} />
					</Grid>
					<SignOutButton />
				</Toolbar>
			</AppBar>
			<Toolbar />
		</div>
	);
};

const NavigationNonAuth = () => {
	const location = useLocation();
	const [value, setValue] = useState(0);
	useEffect(() => {
		const paths = ["/", "/signup", "/signin"];
		if (location.pathname.toLowerCase() === "/forgotpassword") {
			setValue(2);
		} else {
			setValue(
				paths.indexOf(location.pathname.toLowerCase()) >= 0
					? paths.indexOf(location.pathname.toLowerCase())
					: 0
			);
		}
	}, [location.pathname]);
	return (
		<div>
			<AppBar style={{ backgroundColor: "white", color: "black" }}>
				<Toolbar>
					<Grid container>
						<Grid
							xs={1}
							item
							style={{
								textAlign: "left",
								transform: "translateY(5%)",
							}}
						>
							<span>Jobaroo</span>
						</Grid>
						<Grid xs={5} item>
							<Tabs
								onChange={(e, v) => setValue(v)}
								value={value}
								aria-label="Navigation Tabs"
							>
								<Tab label={"Landing"} component={Link} to="/" />
								<Tab label={"Sign Up"} component={Link} to="/signup" />
								<Tab label={"Sign In"} component={Link} to="/signin" />
							</Tabs>
						</Grid>
						<Grid item xs={1} />
					</Grid>
				</Toolbar>
			</AppBar>
			<Toolbar />
		</div>
	);
};

export default Navigation;

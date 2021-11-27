import React, { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";
import "../App.css";
import { AppBar, Toolbar, Grid, Tabs, Tab } from "@mui/material";
import { checkEmployer } from "../firebase/FirebaseFunctions";
const Navigation = () => {
	const { currentUser } = useContext(AuthContext);
	return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
	const [isEmployer, setIsEmployer] = useState(false);
	const { currentUser } = useContext(AuthContext);

	useEffect(() => {
		async function check() {
			let res = await checkEmp(currentUser.uid);
			if (res) {
				console.log("I am a employer");
			} else {
				console.log("I am a seeker");
			}
			setIsEmployer(res);
		}
		check();
	}, [currentUser]);

	const checkEmp = async (uid) => {
		let res = await checkEmployer(uid);
		return res;
	};

	const paths = isEmployer
		? ["/", "/home", "/postJob", "/posts", "/account"]
		: ["/", "/home", "/jobs", "/account"];
	const [value, setValue] = useState(
		paths.indexOf(window.location.pathname.toLowerCase()) > 0
			? paths.indexOf(window.location.pathname.toLowerCase())
			: 1
	);

	return (
		<div>
			<AppBar
				postion="fixed"
				style={{ backgroundColor: "white", color: "black" }}
			>
				<Toolbar>
					<Grid justify={"space-between"} container>
						<Grid
							xs={1}
							item
							style={{ textAlign: "left", transform: "translateY(5%)" }}
						>
							<span>Jobaroo</span>
						</Grid>
						<Grid xs={5} item>
							<Tabs
								onChange={(e, v) => setValue(v)}
								value={value}
								aria-label="Navigation Tabs"
							>
								<Tab
									label={"Landing"}
									component={NavLink}
									exact
									to="/"
									activeClassName="active"
								/>
								<Tab
									label={"Home"}
									component={NavLink}
									to="/home"
									activeClassName="active"
								/>
								{isEmployer ? (
									<div>
									<Tab
										label={"Post a Job"}
										component={NavLink}
										to="/postJob"
										activeClassName="active"
									/>
									<Tab
										label={"Posts"}
										component={NavLink}
										to="/posts"
										activeClassName="active"
									/>
									</div>
								) : (
									<Tab
										label={"Job Search"}
										component={NavLink}
										to="/jobs"
										activeClassName="active"
									/>
								)}

								<Tab
									label={"Account"}
									component={NavLink}
									to="/account"
									activeClassName="active"
								/>
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
	const paths = ["/", "/signup", "/signin"];
	const [value, setValue] = useState(
		paths.indexOf(window.location.pathname.toLowerCase()) > 0
			? paths.indexOf(window.location.pathname.toLowerCase())
			: 0
	);
	return (
		<div>
			<AppBar
				postion="fixed"
				style={{ backgroundColor: "white", color: "black" }}
			>
				<Toolbar>
					<Grid justify={"space-between"} container>
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
								<Tab
									label={"Landing"}
									component={NavLink}
									exact
									to="/"
									activeClassName="active"
								/>
								<Tab
									label={"Sign Up"}
									component={NavLink}
									to="/signup"
									activeClassName="active"
								/>
								<Tab
									label={"Sign In"}
									component={NavLink}
									to="/signin"
									activeClassName="active"
								/>
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

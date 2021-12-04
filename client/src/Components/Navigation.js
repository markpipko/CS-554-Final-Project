import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";
import "../App.css";
import { AppBar, Toolbar, Grid, Tabs, Tab, Avatar } from "@mui/material";
import { checkEmployer } from "../firebase/FirebaseFunctions";
import { borderRight } from "@mui/system";
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
			setIsEmployer(res);
		}
		check();
	}, [currentUser]);

	const checkEmp = async (uid) => {
		let res = await checkEmployer(uid);
		return res;
	};

	const paths = isEmployer
		? ["/home", "/postJob", "/posts", "/account"]
		: ["/home", "/jobs", "/applicantChart", "/account"];
	const [value, setValue] = useState(
		paths.indexOf(window.location.pathname.toLowerCase()) >= 0
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

						<div style={{display:"flex"}}>
						<Avatar alt="Jobaroo Icon" src="../imgs/Jobaroo2.png" style={{ height:"auto"}}/>

						</div>
						
							
						</Grid>
						<Grid xs={5} item>
							<Tabs
								onChange={(e, v) => setValue(v)}
								value={value}
								aria-label="Navigation Tabs"
							>
								<Tab label={"Jobaroo"} component={Link} to="/home" />
								{isEmployer ? (
									<div>
									<Tab
										label={"Post a Job"}
										component={Link}
										to="/postJob"
										activeClassName="active"
									/>
									<Tab
										label={"Posts"}
										component={Link}
										to="/posts"
										activeClassName="active"
									/>
									</div>
								) : (
									
										<>
										<Tab
											label={"Job Search"}
											component={Link}
											to="/jobs" 
										/>
										<Tab
											label={"My Applications"}
											component={Link}
											to="/applicantChart" 
										/></>
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
	const paths = ["/", "/signup", "/signin"];
	const [value, setValue] = useState(
		paths.indexOf(window.location.pathname.toLowerCase()) >= 0
			? paths.indexOf(window.location.pathname.toLowerCase())
			: 2
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

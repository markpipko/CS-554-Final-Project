import React, { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../firebase/Auth";
import SignOutButton from "./SignOut";
import "../App.css";
import { AppBar, Toolbar, Grid, Tabs, Tab } from "@mui/material";

const Navigation = () => {
	const { currentUser } = useContext(AuthContext);
	return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
	const paths = ["/", "/home", "/jobs", "/account"];
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
								<Tab
									label={"PostJob"}
									component={NavLink}
									to="/PostJob"
									activeClassName="active"
								/>
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

		// <nav className="navigation">

		//     <NavLink className="navlink" exact to="/" activeClassName="active">
		//         Landing
		//     </NavLink>

		//     <NavLink className="navlink" exact to="/home" activeClassName="active">
		//         Home
		//     </NavLink>

		//     <NavLink className="navlink" exact to="/jobs" activeClassName="active">
		// 		Indeed Job Search
		// 	</NavLink>

		//     <NavLink className="navlink" exact to="/account" activeClassName="active">
		//         Account
		//     </NavLink>

		//     <SignOutButton />

		// </nav>
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

	// return (
	// 	<nav className="navigation">
	// 		<NavLink className="navlink" exact to="/" activeClassName="active">
	// 			Landing
	// 		</NavLink>

	// 		<NavLink className="navlink" exact to="/signup" activeClassName="active">
	// 			Sign-up
	// 		</NavLink>

	// 		<NavLink className="navlink" exact to="/signin" activeClassName="active">
	// 			Sign-In
	// 		</NavLink>
	// 	</nav>
	// );
};

export default Navigation;

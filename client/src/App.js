import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Switch } from "react-router";
import Jobs from "./Components/Jobs";
import Account from "./Components/Account";
import Landing from "./Components/Landing";
import Home from "./Components/Home";
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import { AuthProvider } from "./firebase/Auth";
import PrivateRoute from "./Components/PrivateRoute";
import Navigation from "./Components/Navigation";
import NotFound from "./Components/NotFound";
import React from "react";
import PostJob from "./Components/PostJob";
import MyPosts from "./Components/MyPosts";
import ApplicantChart from "./Components/ApplicantChart";
import ForgotPassword from "./Components/ForgotPassword";
import Applications from "./Components/Applications";
function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App" id="page-container">
					<header className="App-header">
						<Navigation />
					</header>
					<div className="App-body" id="content-wrap">
						<Switch>
							<Route exact path="/" component={Landing} />
							<PrivateRoute exact path="/home" component={Home} />
							<PrivateRoute exact path="/jobs" component={Jobs} />
							<PrivateRoute exact path="/postJob" component={PostJob} />
							<PrivateRoute exact path="/posts" component={MyPosts} />
							<PrivateRoute
								exact
								path="/applications"
								component={Applications}
							/>
							<PrivateRoute exact path="/account" component={Account} />
							<Route exact path="/signin" component={SignIn} />
							<Route exact path="/signup" component={SignUp} />
							<Route exact path="/forgotpassword" component={ForgotPassword} />
							<Route component={NotFound} />
						</Switch>
					</div>
					<footer>
						<hr />
						<span>
							Jobaroo © 2021 - Made by Matt Evanego, Matt Koerner, Mark Pipko,
							Edward Yaroslavsky, Christopher Moon
						</span>
						<hr />
					</footer>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;

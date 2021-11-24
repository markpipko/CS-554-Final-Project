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
import NavigationEmployer from "./Components/NavigationEmployer";
import NavigationSeeker from "./Components/NavigationSeeker";
import NotFound from "./Components/NotFound";
import React, { useContext, useState, useEffect } from 'react';
import { getAuth} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import {  db } from "./firebase/Firebase";
import PostJob from "./Components/PostJob"

 function App() {
	const [ employer, setEmployer ] = useState(false);

	useEffect(() => {
		async function fetchUser() {
			const {currentUser} = getAuth();

			if(currentUser){
				const docRef = doc(db, "employer", currentUser.email);
				const docSnap = await getDoc(docRef);
		
				if (docSnap.exists()){
					setEmployer(true)
				}
			}
		}
		fetchUser()
	}, [])


	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<header className="App-header">
						{/* <h1>Jobaroo</h1> */}
						{employer? <NavigationEmployer />: <NavigationSeeker />}
					</header>
					<div className="App-body">
						<Switch>
							<Route exact path="/" component={Landing} />
							<PrivateRoute exact path="/home" component={Home} />
							<PrivateRoute exact path="/jobs" component={Jobs} employer={employer}/> 
							<PrivateRoute exact path="/postJob" component={PostJob} employer={employer}/>
							<PrivateRoute exact path="/account" component={Account} />
							<Route exact path="/signin" component={SignIn} />
							<Route exact path="/signup" component={SignUp} />
							<Route component={NotFound} />
						</Switch>
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;

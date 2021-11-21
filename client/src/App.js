import "./App.css";
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import Jobs from "./Components/Jobs";
import Account from './Components/Account';
import Landing from './Components/Landing';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import SignUp from './Components/SignUp';
import { AuthProvider } from './firebase/Auth';
import PrivateRoute from "./Components/PrivateRoute";
import Navigation from "./Components/Navigation";

function App() {
	return (
		<AuthProvider>
			<Router>
				<div className="App">
					<header className="App-header">
						<h1>Jobaroo</h1>
						<Navigation />
					</header>
					<div className="App-body">
						<Route exact path="/" component={Landing} />
						<PrivateRoute exact path="/home" component={Home} />
						<PrivateRoute exact path="/jobs" component={Jobs} />
						<PrivateRoute exact path="/account" component={Account} />
						<Route exact path="/signin" component={SignIn} />
						<Route exact path="/signup" component={SignUp} />
					</div>
				</div>
			</Router>
		</AuthProvider>
	);
}

export default App;

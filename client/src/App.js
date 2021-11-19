import "./App.css";
import { NavLink, BrowserRouter as Router, Route } from "react-router-dom";
import Jobs from "./Components/Jobs";
function App() {
	return (
		<Router>
			<div className="App">
				<header className="App-header">
					<h1>Jobaroo</h1>
					<nav className="nav">
						<NavLink className="navlink" exact to="/jobs">
							Search for Jobs
						</NavLink>
					</nav>
				</header>
				<div className="App-body">
					<Route exact path="/jobs" component={Jobs} />
				</div>
			</div>
		</Router>
	);
}

export default App;

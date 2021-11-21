import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../firebase/Auth';
import SignOutButton from './SignOut';
import '../App.css';

const Navigation = () => {
  const { currentUser } = useContext(AuthContext);
  return <div>{currentUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const NavigationAuth = () => {
  return (
    <nav className="navigation">

        <NavLink className="navlink" exact to="/" activeClassName="active">
            Landing
        </NavLink>

        <NavLink className="navlink" exact to="/home" activeClassName="active">
            Home
        </NavLink>

        <NavLink className="navlink" exact to="/jobs" activeClassName="active">
			Indeed Job Search
		</NavLink>

        <NavLink className="navlink" exact to="/account" activeClassName="active">
            Account
        </NavLink>

        <SignOutButton />

    </nav>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">

        <NavLink className="navlink" exact to="/" activeClassName="active">
            Landing
        </NavLink>

        <NavLink className="navlink" exact to="/signup" activeClassName="active">
            Sign-up
        </NavLink>

        <NavLink className="navlink" exact to="/signin" activeClassName="active">
            Sign-In
        </NavLink>

    </nav>
  );
};

export default Navigation;
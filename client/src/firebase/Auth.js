import React, { useState, useEffect } from "react";
import { firebaseApp } from "./Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export const AuthContext = React.createContext();
export const AuthProvider = ({ children }) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [loadingUser, setLoadingUser] = useState(true);

	const auth = getAuth(firebaseApp);
	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			setCurrentUser(user);
			setLoadingUser(false);
		});
	}, [auth]);

	if (loadingUser) {
		return (
			<div>
				<h1>Loading...</h1>
			</div>
		);
	}

	return (
		<AuthContext.Provider value={{ currentUser }}>
			{children}
		</AuthContext.Provider>
	);
};

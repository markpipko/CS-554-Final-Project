import React, { useState, useContext, useEffect } from "react";
import HomeSeeker from './HomeSeeker'
import HomeEmployer from './HomeEmployer'
import { AuthContext } from "../firebase/Auth";
import { checkEmployer } from "../firebase/FirebaseFunctions";

function Home(){
  const [isSeeker, setIsSeeker] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
		async function check() {
			let res = await checkEmp(currentUser.uid);
			setIsSeeker(!res);
		}
		check();
	}, [currentUser]);

	const checkEmp = async (uid) => {
		let res = await checkEmployer(uid);
		return res;
	};

  if(isSeeker){
    return (
      <HomeSeeker />
    );
  }
  else{
    return (
      <HomeEmployer />
    );
  }

}

export default Home;
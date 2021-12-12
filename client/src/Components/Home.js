import React, { useState, useContext, useEffect } from "react";
import HomeSeeker from './HomeSeeker'
import HomeEmployer from './HomeEmployer'
import { AuthContext } from "../firebase/Auth";
import { checkEmployer } from "../firebase/FirebaseFunctions";
// import { db } from "../firebase/Firebase";
// import { collection, getDocs } from "firebase/firestore";

function Home(){
  const [isSeeker, setIsSeeker] = useState(false);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
		async function load() {
			let res = await checkEmp(currentUser.uid);
			setIsSeeker(!res);
		}
		load();
	}, [currentUser]);

	const checkEmp = async (uid) => {
		let res = await checkEmployer(uid);
		return res;
	};

  let home = <HomeEmployer />

  if(isSeeker){
    home = <HomeSeeker />
  }
  
  return (
    <div>
      {home}
    </div>
  )

}

export default Home;
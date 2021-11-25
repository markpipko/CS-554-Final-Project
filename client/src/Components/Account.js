import React, { useContext, useEffect, useState } from "react";
import SignOutButton from "./SignOut";
import '../App.css';
import ChangePassword from './ChangePassword';
import { firebaseApp, db } from "../firebase/Firebase";
import { getDoc, doc } from "@firebase/firestore";
import { AuthContext } from "../firebase/Auth";
import UploadResume from "./UploadResume";

function Account() {
    const { currentUser } = useContext(AuthContext);
    const [ seeker, setSeeker ] = useState(false);
    const [ resumeData, setResumeData ] = useState(null);
    
    useEffect(() => {
        async function fetchData() {
            console.log("useEffect fired");
            /*let currentUserInfo = await getDoc(doc(db, "seekers", currentUser.email));
            if (currentUserInfo.exists) {
                setSeeker(true);
                if ("resume" in currentUserInfo.data().keys() && currentUserInfo.data().resume != null) {
                    console.log("Resume: ", currentUserInfo.data().resume)
                    setResumeData(currentUserInfo.data().resume);
                }
            }*/
            
            console.log("role: ", currentUser.role);
            console.log("resume: ", currentUser.resume);
            if (currentUser.role == "seeker" && currentUser.resume != null) {
                setResumeData(currentUser.resume);
            }
        }
        fetchData();
    }, []);

    return (
        <div>
            <h2>Account Page</h2>
            {seeker && <UploadResume resume={resumeData ? resumeData : "None"} />}
            <ChangePassword />
            <SignOutButton />
        </div>
    );
}

export default Account;
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "@mui/material";
import { resumeUpload } from '../firebase/FirebaseFunctions';
import { AuthContext } from '../firebase/Auth';
import "../App.css";
import { getSeeker } from "../firebase/FirebaseFunctions";

const path = require("path");

function UploadResume(props) {
    const { currentUser } = useContext(AuthContext);
    const [resumeName, setResumeName] = useState("None");

    useEffect(() => {
        async function fetchData() {
            let user = await getSeeker(currentUser.uid);
            setResumeName(user.resume);
        }
        fetchData();
    }, []);


    async function uploadResume() {
        try {
            const inputVal = document.getElementById("file").files[0].name;
            let fileName = path.basename(inputVal);
            await resumeUpload(currentUser.uid, fileName);
            setResumeName(fileName);
        }
        catch (e) {
            let error = document.getElementById("uploadError");
            error.innerHTML = "Please upload a proper file.";
        }
    }

    return (
        <div>
            <h3>Upload Resume</h3>
            <h5>
                Current Resume: {resumeName}
            </h5>
            <br />
            <form>
                <label>
                    <input type="file" id="file" accept="application/msword, application/pdf" />
                </label><br />
                <Button onClick={uploadResume}>Upload</Button>
                <p id="uploadError"></p>
            </form>
        </div>
    )
    
}

export default UploadResume;
import React from 'react';
import { Button } from "@mui/material";

const path = require("path");

function UploadResume(props) {

    function uploadResume() {
        try {
            const inputVal = document.getElementById("file").files[0].name;
            let fileName = path.basename(inputVal);
            console.log(fileName);
        }
        catch (e) {
            let error = document.getElementById("uploadError");
            error.innerHTML = "Please upload a proper file.";
        }
    }

    return (
        <div>
            <h3>Upload Resume</h3>
            <form>
                <label>
                    Upload Resume:{" "}
                    <input type="file" id="file" accept="application/msword, application/pdf" />
                </label><br />
                <p id="uploadError"></p>
                <Button onClick={uploadResume}>Upload</Button>
            </form>
        </div>
    )
    
}

export default UploadResume;
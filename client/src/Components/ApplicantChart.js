import React, { useState, useContext, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AuthContext } from "../firebase/Auth";
import { getApplicationsForSeeker } from "../firebase/FirebaseFunctions";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles({
	chart: {
		width: 1500,
		height: "auto",
		marginLeft: "auto",
		marginRight: "auto"
	},
	titleHead: {
		borderBottom: "1px solid #1e8678",
		fontWeight: "bold",
		fontSize: "16px",
	},
	grid: {
		flexGrow: 1,
		flexDirection: "row",
	},
	button: {
		color: "#1e8678",
		fontWeight: "bold",
		fontSize: 12,
	},
	paginator: {
		justifyContent: "center",
		padding: "10px",
	},
});

function ApplicantChart() {
  const { currentUser } = useContext(AuthContext);
  const [applicationData, setApplicationData] = useState(undefined);
  
  const applicationObj = {
    pending: 0,
    rejected: 0,
    accepted: 0
  }
  const classes = useStyles();

  useEffect(() => {
		async function load() {
      const applications = await getApplicationsForSeeker(currentUser.uid);
      
      for(let i = 0; i < applications.length; i++){
        switch(applications[i].status){
          case "Pending":
             applicationObj.pending++;
            break;
          case "Rejected":
            applicationObj.rejected++;
            break;
          case "Accepted":
            applicationObj.accepted++;
            break;
        }
      }
      setApplicationData(applicationObj);
		}
		load();
	}, [currentUser]);
    let data = [];
    if(applicationData){
     data = [
        {
          name: 'Pending',
          "Number of Applications": applicationData.pending
        },
        {
          name: 'Accepted',
          "Number of Applications": applicationData.accepted
        },
        {
          name: 'Rejected',
          "Number of Applications": applicationData.rejected
        }
      ];
    }
      

    return (
      <div>
        <BarChart className={classes.chart}
            width={500}
            height={300}
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            barSize={30}

          >
            
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"/>
            <YAxis type="number" domain={[0, 4]} />
            <Tooltip />
            <Legend />
            <Bar dataKey="Number of Applications" fill="#8884d8"/>
        </BarChart>
      </div>
    )
}

export default ApplicantChart;
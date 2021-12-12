import React, { useState, useContext, useEffect } from "react";
import HomeSeeker from './HomeSeeker'
import HomeEmployer from './HomeEmployer'
import { AuthContext } from "../firebase/Auth";
import { checkEmployer } from "../firebase/FirebaseFunctions";
import { db } from "../firebase/Firebase";
import { collection, getDocs } from "firebase/firestore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function Home(){
  const [isSeeker, setIsSeeker] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [fields, setFields] = useState({
    "Architecture, Planning & Environmental Design": 0,
    "Arts & Entertainment": 0,
    "Business": 0,
    "Communications": 0,
    "Education": 0,
    "Engineering & Computer Science": 0,
    "Environment": 0,
    "Government": 0,
    "Health & Medicine": 0,
    "International": 0,
    "Law & Public Policy": 0,
    "Sciences - Biological & Physical": 0,
    "Social Impact": 0,
    "Other": 0
  })

  let data = [];

  for(var key in fields) {
    data.push({name: key, 'Number of Postings': fields[key]})
  }
  
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#7e5bbe', '#9c6de8', '#ff6e64', '#7e8fa1', '#92d2aa', '#c7b532', '#c07d9d', '#efa07a', '#d1cb9e', '#67ab81'];
  
  // const RADIAN = Math.PI / 180;
  // const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  //   const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  //   const x = cx + radius * Math.cos(-midAngle * RADIAN);
  //   const y = cy + radius * Math.sin(-midAngle * RADIAN);
  
  //   return (
  //     <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
  //       {`${(percent * 100).toFixed(0)}%`}
  //     </text>
  //   );
  // };

  useEffect(() => {
		async function load() {
			let res = await checkEmp(currentUser.uid);
			setIsSeeker(!res);

      const querySnapshot = await getDocs(collection(db, "posts"));

      querySnapshot.forEach((doc) => {
        var temp = fields

        temp[doc.data().field] = temp[doc.data().field] + 1
        setFields(temp)
      })
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
          {/* <PieChart width={400} height={400}>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart> */}
              <BarChart
                width={1000}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5
                }}
                barSize={20}
              >
                <XAxis dataKey="name" scale="point" padding={{ left: 100, right: 10 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="Number of Postings" fill="#8884d8" background={{ fill: "#eee" }} />
            </BarChart>
    </div>
  )

}

export default Home;
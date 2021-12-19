import React, { useContext } from "react";
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from "../firebase/Auth";
import { useState } from "react";
import { checkSeekers, checkEmployer } from "../firebase/FirebaseFunctions";

const PrivateRoute = ({component: RouteComponent, ...rest}) => {
    const {currentUser} = useContext(AuthContext);
    //const isSeeker = !!currentUser ? checkSeekers(currentUser.uid).then((val) => {return val;}) : undefined;
    //const isEmployer = !!currentUser ? checkEmployer(currentUser.uid).then((val) => {return val;}) : undefined;
    //const [isSeeker, setIsSeeker] = useState(undefined);
    //const [isEmployer, setIsEmployer] = useState(undefined);

    /*function renderRoute(routeProps) {
        if (!!currentUser) {
            let isSeeker = checkSeekers(currentUser.uid).then((val) => {return val;}).catch((err) => {console.log(err)});
            let isEmployer = checkEmployer(currentUser.uid).then((val) => {return val;}).catch((err) => {console.log(err)});
            //setIsSeeker(seeker);
            //setIsEmployer(employer);
            //setIsSeeker(await checkSeekers(currentUser.uid));
            //setIsEmployer(await checkEmployer(currentUser.uid));
            console.log("Is Employer: ". isEmployer);
            console.log("Is Seeker: ", isSeeker);
            console.log(routeProps.match.path);

            if ((isSeeker == true && routeProps.match.path == "/postjob") || (isSeeker == true && routeProps.match.path == "/posts")) {
                console.log("HereSeeker");
                return <Redirect to={'home'} />;
            }
            else if ((isEmployer == true && routeProps.match.path == "/applications") || (isEmployer == true && routeProps.match.path == "/jobs")) {
                console.log("HereEmployer");
                console.log("Is Employer: ". isEmployer);
                return <Redirect to={'home'} />;
            }
            else {
                return <RouteComponent {...routeProps} />;
            }
        }
        else {
            return <Redirect to={'signin'} />;
        }
    }*/

    return (
        <Route
            {...rest}
            render={(routeProps) => (!!currentUser ? <RouteComponent {...routeProps} /> : <Redirect to={'signin'} />)}
        />
        /*<Route
            {...rest}
            render={(routeProps) => renderRoute(routeProps)}
        />*/
    );
}

export default PrivateRoute;
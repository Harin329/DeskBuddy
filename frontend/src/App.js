import React, {useEffect} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Dashboard from './screens/Dashboard';
import Reservation from './screens/Reservation';
import Mail from './screens/Mail';
import Social from './screens/Social';
import './App.css';
import "@fontsource/lato"
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal, useMsalAuthentication } from "@azure/msal-react";
import {InteractionType} from '@azure/msal-browser';
import NavBar from "./components/global/NavBar";
import MobileNavBar from "./components/global/MobileNavBar";
import {graphConfig, loginRequest} from "./authConfig";
import safeFetch, {graphFetch} from "./util/Util";
import Endpoint from "./config/Constants";
import {useDispatch, useSelector} from "react-redux";
import {SET_USER_ADDED_TO_DB} from "./actions/actionTypes";
import { isMobile } from "react-device-detect";

function App() {
    const {instance, accounts, inProgress} = useMsal();
    const dispatch = useDispatch();
    const addedToDB = useSelector(state => state.authentication.addedToDB);
    const {login, error} = useMsalAuthentication(InteractionType.Silent, loginRequest);
    let userInfo = {} // user info to send to DeskBuddy database after login

    useEffect(() => {
        if (error) {
            console.error(error);
            login(InteractionType.Redirect, loginRequest);
        }
    }, [error]);

    useEffect(() => {
        if (addedToDB === false && inProgress === "none" && accounts.length > 0) {
            userInfo.email = accounts[0].idTokenClaims.email;
            userInfo.family_name = accounts[0].idTokenClaims.family_name;
            userInfo.given_name = accounts[0].idTokenClaims.given_name;
            userInfo.oid = accounts[0].idTokenClaims.oid;
            fetchUserInfo()
        }
    }, [inProgress, accounts, instance]);

    // graph fetch to get user phone from DeskBuddy azure directory
    const fetchUserInfo = () => {
        const options = {
            method: "GET",
        };

        graphFetch(graphConfig.graphMeEndpoint, options)
            .then(response => response.json())
            .then(responseJson => {
                userInfo.mobilePhone = responseJson.mobilePhone;
                addUserToDeskBuddyDB(userInfo)
            })
            .catch(error => console.log(error));
    }

    // create or update logged in user in the DeskBuddy database using information from DeskBuddy azure directory (currently oid, firstname, lastname, phone, email)
    const addUserToDeskBuddyDB = (userInfo) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(userInfo),
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/user", requestOptions)
            .then(response => response.text())
            .then(result => {
                dispatch({ type: SET_USER_ADDED_TO_DB, payload: true });
            })
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            <UnauthenticatedTemplate>
                <p style={{color: 'white'}}> Redirecting to login... </p>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                {!addedToDB &&
                    <p style={{color: 'white'}}> Signed in! Loading... </p>
                }
                {addedToDB &&
                    <Router>
                        {!isMobile && <NavBar/>}
                        {isMobile && <MobileNavBar/>}
                        <Route exact path="/" component={Dashboard}/>
                        <Route exact path="/reservation" component={Reservation}/>
                        <Route exact path="/mail" component={Mail}/>
                        <Route exact path="/social" component={Social}/>
                    </Router>
                }
            </AuthenticatedTemplate>
        </div>
    );
}

export default App;
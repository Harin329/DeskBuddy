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
import safeFetch, {accountIsAdmin, graphFetch} from "./util/Util";
import Endpoint from "./config/Constants";
import {useDispatch, useSelector} from "react-redux";
import {SET_IS_ADMIN, SET_OID, SET_USER_ADDED_TO_DB, SET_USER_DISPLAY_NAME} from "./actions/actionTypes";
import { isMobile } from "react-device-detect";
import { setError } from "./actions/globalActions";
import spinner from "./components/reservation/map-popup/spinner/spinner";

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
            userInfo.email = accounts[0].idTokenClaims.preferred_username;
            userInfo.family_name = accounts[0].idTokenClaims.family_name;
            userInfo.given_name = accounts[0].idTokenClaims.given_name;
            userInfo.oid = accounts[0].idTokenClaims.oid;
            // console.log(JSON.stringify(accounts[0].idTokenClaims, null, 2))
            fetchUserInfo()
        }
    }, [inProgress, accounts, instance]);

    // graph fetch to get user phone from DeskBuddy azure directory
    const fetchUserInfo = () => {
        const options = {
            method: "GET",
        };

        graphFetch(graphConfig.graphMeEndpoint, options)
            .then(response => {
                if (response != null && response.ok) {
                    response.json()
                        .then(responseJson => {
                            userInfo.mobilePhone = responseJson.mobilePhone;
                            userInfo.displayName = responseJson.displayName;
                            addUserToDeskBuddyDB(userInfo);
                        })
                } else {
                    throw Error("Bad response from /me");
                }
            })
            .catch(error => {
                console.log(error);
                alert("error loading profile, please try again");
            });
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
            .then(response => {
                if (response != null && response.ok) {
                    response.json()
                        .then(responseJson => {
                            dispatch({type: SET_OID, payload: userInfo.oid});
                            dispatch({type: SET_IS_ADMIN, payload: accountIsAdmin(accounts[0])});
                            dispatch({type: SET_USER_DISPLAY_NAME, payload: userInfo.displayName});
                            dispatch({type: SET_USER_ADDED_TO_DB, payload: true});
                        })
                } else {throw Error("Bad response from /user");
                }
            })
            .catch(error => {
                console.log('error', error);
                alert("error loading profile, please try again");
                dispatch(setError(true));
            });
    }

    return (
        <div>
            <UnauthenticatedTemplate>
                <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                    {spinner()}
                    {inProgress === "login" &&
                        <p style={{color: 'white'}}> Redirecting to login... </p>
                    }
                    {inProgress === "handleRedirect" &&
                        <p style={{color: 'white'}}> Signing in... </p>
                    }
                </div>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                {!addedToDB &&
                    <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)'}}>
                        {spinner()}
                        <p style={{color: 'white'}}> Signed in! Loading... </p>
                    </div>
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
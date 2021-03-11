import React, {useEffect} from "react";
import {BrowserRouter as Router, Route} from "react-router-dom";
import Dashboard from './screens/Dashboard';
import Reservation from './screens/Reservation';
import Mail from './screens/Mail';
import Social from './screens/Social';
import './App.css';
import "@fontsource/lato"
import {AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication} from "@azure/msal-react";
import {InteractionType} from '@azure/msal-browser';
import NavBar from "./components/global/NavBar";
import {graphConfig, loginRequest} from "./authConfig";
import safeFetch, {graphFetch} from "./util/Util";
import Endpoint from "./config/Constants";

function App() {
    const {login, result, error} = useMsalAuthentication(InteractionType.Silent, loginRequest);

    useEffect(() => {
        if (error) {
            console.error(error);
            login(InteractionType.Redirect, loginRequest);
        }
    }, [error]);

    useEffect(() => {
        if (result) {
            fetchUserInfo()
        }
    }, [result]);

    // graph fetch to get user phone and email
    const fetchUserInfo = () => {
        let userInfo = result.account.idTokenClaims

        const options = {
            method: "GET",
        };

        graphFetch(graphConfig.graphMeEndpoint, options)
            .then(response => response.json())
            .then(responseJson => {
                userInfo.mobilePhone = responseJson.mobilePhone;
                userInfo.mail = responseJson.mail;
                createUser(userInfo)
            })
            .catch(error => console.log(error));
    }

    // create or update user info in deskbuddy db.
    const createUser = (userInfo) => {
        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        let requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(userInfo),
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/user/", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    }

    return (
        <div>
            <UnauthenticatedTemplate>
                <p style={{color: 'white'}}> Redirecting... </p>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <Router>
                    <NavBar/>
                    <Route exact path="/" component={Dashboard}/>
                    <Route exact path="/reservation" component={Reservation}/>
                    <Route exact path="/mail" component={Mail}/>
                    <Route exact path="/social" component={Social}/>
                </Router>
            </AuthenticatedTemplate>
        </div>
    );
}

export default App;

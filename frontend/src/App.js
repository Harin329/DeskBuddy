import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from './screens/Dashboard';
import Reservation from './screens/Reservation';
import Mail from './screens/Mail';
import Social from './screens/Social';
import './App.css';
import "@fontsource/lato"
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from '@azure/msal-browser';
import NavBar from "./components/global/NavBar";
import {loginRequest} from "./authConfig";

function App() {
    const { login, error } = useMsalAuthentication(InteractionType.Silent, loginRequest);

    useEffect(() => {
        if (error) {
            console.error(error);
            login(InteractionType.Redirect, loginRequest);
        }
    }, [error]);

    return (
        <div>
            <UnauthenticatedTemplate>
                <p style={{color: 'white'}} > Redirecting... </p>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <Router>
                <NavBar/>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/reservation" component={Reservation} />
                <Route exact path="/mail" component={Mail} />
                <Route exact path="/social" component={Social} />
            </Router>
            </AuthenticatedTemplate>
        </div>
    );
}

export default App;

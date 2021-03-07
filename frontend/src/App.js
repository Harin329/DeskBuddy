import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Dashboard from './screens/Dashboard';
import Reservation from './screens/Reservation';
import Mail from './screens/Mail';
import Social from './screens/Social';
import './App.css';
import "@fontsource/lato"
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from '@azure/msal-browser';

function App() {
    const request = {
        scopes: ["User.Read"]
    }
    const { login, result, error } = useMsalAuthentication(InteractionType.Silent, request);

    useEffect(() => {
        if (error) {
            console.log("error");
            login(InteractionType.Redirect, request);
        } else {
            console.log("somebody logged in");
            // User is logged in, cool, potentially do something here? set redux state?
        }
    }, [error]);

    const { accounts } = useMsal();

    return (
        <div>
            <UnauthenticatedTemplate>
                <p> 😎 </p>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
            <Router>
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

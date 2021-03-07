import React, { useEffect } from "react";
import { Link } from 'react-router-dom';
import {useMsal} from "@azure/msal-react";
import {apiConfig, loginRequest} from "../../authConfig";

function NavBar() {

    const { instance, accounts } = useMsal();
    console.log("account: " + JSON.stringify(accounts[0]));

    const userOID = accounts[0].idTokenClaims.oid;
    const isAdmin = (accounts[0].idTokenClaims.hasOwnProperty("roles") && accounts[0].idTokenClaims.roles.includes("admin"));
    const username = accounts[0].username;

    const callAuthenticatedEndpoint = () => {
        instance.acquireTokenSilent({
            ...loginRequest,
            account: accounts[0]
        }).then((response) => {
            const headers = new Headers();
            const bearer = `Bearer ${response.accessToken}`;

            headers.append("Authorization", bearer);

            const options = {
                method: "GET",
                headers: headers
            };

            fetch(apiConfig.resourceUri + "authenticationTest", options)
                .then(response => response.json())
                .catch(error => console.log(error));
        });
    }

    return (
        <div style={{background:'black'}}>

            <div style={{color: 'white', display: "flex"}} >

                <Link to="/"
                      className="App-link"
                >
                    Dashboard
                </Link>&nbsp;&nbsp;&nbsp;
                <Link to="/reservation"
                      className="App-link"
                >
                    Reserve Desk
                </Link>&nbsp;&nbsp;&nbsp;
                <Link to="/mail"
                      className="App-link"
                >
                    Mail Room
                </Link>&nbsp;&nbsp;&nbsp;
                <Link to="/social"
                      className="App-link"
                >
                    Social
                </Link>&nbsp;&nbsp;&nbsp;

                <button style={{ height: '25px' }} onClick={() => callAuthenticatedEndpoint()} > AUTHENTICATED API CALL </button>&nbsp;&nbsp;&nbsp;
                <button style={{ height: '25px' }} onClick={() => instance.logout()} > LOGOUT </button>
            </div>
            <div style={{color: 'white'}}> username: {username} </div>
            <div style={{color: 'white'}}> oid: {userOID} </div>
            <div style={{color: 'white'}}> isAdmin: {isAdmin.toString()} </div>

        </div>
    );
}

export default NavBar;
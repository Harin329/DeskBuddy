import React from "react";
import { Link } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { apiConfig, graphConfig } from "../../authConfig";
import safeFetch, { graphFetch, accountIsAdmin } from "../../util/Util";

function NavBar() {

    const { instance, accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const isAdmin = accountIsAdmin(accounts[0]);
    const username = accounts[0].username;

    const callDeskBuddyEndpoint = () => {
        const options = {
            method: "GET",
        };
        safeFetch(apiConfig.resourceUri + "", options)
            .then(response => response.text())
            .then(responseJson => {
                alert(JSON.stringify(responseJson, null, 2));
            })
            .catch(error => console.log(error));
    }

    const callGraphEndpoint = () => {
        const options = {
            method: "GET",
        };
        graphFetch(graphConfig.graphMeEndpoint + "", options)
            .then(response => response.json())
            .then(responseJson => {
                alert(JSON.stringify(responseJson, null, 2));
            })
            .catch(error => console.log(error));
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
                <button style={{ height: '25px' }} onClick={() => callDeskBuddyEndpoint()} > API CALL </button>&nbsp;&nbsp;&nbsp;
                <button style={{ height: '25px' }} onClick={() => callGraphEndpoint()} > MS GRAPH CALL </button>&nbsp;&nbsp;&nbsp;
                <button style={{ height: '25px' }} onClick={() => instance.logout()} > LOGOUT </button>
            </div>
            <div style={{color: 'white'}}> username: {username} </div>
            <div style={{color: 'white'}}> oid: {userOID} </div>
            <div style={{color: 'white'}}> isAdmin: {isAdmin.toString()} </div>

        </div>
    );
}

export default NavBar;
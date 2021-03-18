import React from "react";
import ICBC from "../../assets/ICBC.png";
import { Link, NavLink } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { makeStyles } from '@material-ui/core/styles';
import { apiConfig, graphConfig } from "../../authConfig";
import safeFetch, { graphFetch, accountIsAdmin } from "../../util/Util";

const useStyles = makeStyles({
    linkText: { 
        color: 'gray', 
        height: '30%', 
        alignSelf: 'center', 
        flex: 4, 
        textAlign: 'center', 
        textDecoration: 'none',
        fontFamily: 'Lato',
        fontWeight: 'bold'
    },
});

function NavBar() {
    const classes = useStyles();

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
        <div style={{ background: 'white', flexDirection: 'row', display: 'flex', padding: 20 }}>
            <div style={{ display: "flex", flex: 1 }} >
                <div style={{ flex: 1 }} />
                <img src={ICBC} style={{ width: 50, height: 50, marginRight: 30, flex: 1 }} />
                <NavLink to="/" exact={true} className={classes.linkText} activeStyle={{color: 'black'}}>
                    DASHBOARD
                </NavLink>
                <NavLink to="/reservation" className={classes.linkText} activeStyle={{color: 'black'}}>
                    RESERVE DESK
                </NavLink>
                <NavLink to="/mail" className={classes.linkText} activeStyle={{color: 'black'}}>
                    MAIL ROOM
                </NavLink>
                <NavLink to="/social" className={classes.linkText} activeStyle={{color: 'black'}}>
                    SOCIAL FEED
                </NavLink>
                <div style={{ flex: 15, alignSelf: 'center', justifyContent: 'center' }} >
                    {/* <button style={{ height: '25px' }} onClick={() => callDeskBuddyEndpoint()} > API CALL </button>
                    <button style={{ height: '25px' }} onClick={() => callGraphEndpoint()} > MS GRAPH CALL </button> */}
                </div>
                <div style={{ color: 'black', alignSelf: 'center', flex: 1, fontFamily: 'Lato' }}>
                    {username} {"\n"}
                    {userOID} {"\n"}
                    {isAdmin ? "Admin" : "User"}
                </div>
                <div style={{ flex: 1 }} />
                <img src={ICBC} style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: 'black', flex: 1 }} />
                <div style={{ flex: 1 }} />
                <button style={{ height: '25px', alignSelf: 'center', fontFamily: 'Lato' }} onClick={() => instance.logout()} > LOGOUT </button>
                <div style={{ flex: 1 }} />
            </div>

        </div>
    );
}

export default NavBar;
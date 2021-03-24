import React, {useEffect} from "react";
import ICBC from "../../assets/ICBC.png";
import { Link, NavLink } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { makeStyles } from '@material-ui/core/styles';
import { apiConfig, graphConfig } from "../../authConfig";
import safeFetch, { graphFetch, accountIsAdmin } from "../../util/Util";
import {useDispatch, useSelector} from "react-redux";
import {fetchReservations} from "../../actions/reservationActions";
import {getProfilePhoto} from "../../actions/authenticationActions";

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
    const displayName = useSelector(state => state.authentication.displayName);
    const dispatch = useDispatch();
    const profilePic = useSelector(state => state.authentication.profilePic);

    useEffect(() => {
        dispatch(getProfilePhoto());
    }, []);

    return (
        <div style={{ background: 'white', flexDirection: 'row', display: 'flex', padding: 20 }}>
            <div style={{ display: "flex", flex: 1 }} >
                <div style={{ flex: 1 }} />
                <img src={ICBC} style={{ width: 50, marginRight: 30, flex: 1, objectFit: 'contain' }} />
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
                </div>
                <div style={{ color: 'black', alignSelf: 'center', fontFamily: 'Lato' }}>
                    {displayName}
                </div>
                <div style={{ flex: 1 }} />
                <img src={profilePic} style={{ width: 50, borderRadius: 50, backgroundColor: 'black', flex: 1, objectFit: 'contain' }} />
                <div style={{ flex: 1 }} />
                <button style={{ height: '25px', alignSelf: 'center', fontFamily: 'Lato' }} onClick={() => instance.logout()} > LOGOUT </button>
                <div style={{ flex: 1 }} />
            </div>

        </div>
    );
}

export default NavBar;
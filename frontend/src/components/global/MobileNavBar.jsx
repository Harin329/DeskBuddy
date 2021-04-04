import React, {useEffect, useState} from "react";
import ICBC from "../../assets/ICBC.png";
import { Link, NavLink } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { SwipeableDrawer, List } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import { apiConfig, graphConfig } from "../../authConfig";
import IconButton from '@material-ui/core/IconButton';
import { graphFetch, accountIsAdmin } from "../../util/Util";
import {useDispatch, useSelector} from "react-redux";
import {getProfilePhoto} from "../../actions/authenticationActions";

const useStyles = makeStyles({
    linkText: {
        color: 'gray',
        display: 'flex', 
        width: 150, 
        fontFamily: 'Lato', 
        fontWeight: 'bold',
        fontSize: 20, 
        textDecoration: 'none', 
        marginBottom: 30,
        marginTop: 20,
        justifyContent: 'center'
    },
});

function MobileNavBar() {
    const classes = useStyles();

    const { instance, accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const isAdmin = accountIsAdmin(accounts[0]);
    const username = accounts[0].username;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const displayName = useSelector(state => state.authentication.displayName);
    const dispatch = useDispatch();
    const profilePic = useSelector(state => state.authentication.profilePic);

    useEffect(() => {
        dispatch(getProfilePhoto());
    }, []);

    const toggleDrawer = () => (event) => {
        if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setDrawerOpen(!drawerOpen);
    };

    return (
        <div style={{ background: 'white', flexDirection: 'row', display: 'flex', padding: 20 }}>
            <div style={{ display: "flex", flex: 1 }} >
                <img src={ICBC} style={{ width: 50, height: 50, flex: 1, objectFit: 'contain' }} />
                <div style={{ flex: 2 }}></div>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    style={{ flex: 0.5 }} onClick={toggleDrawer()}><MenuIcon /></IconButton>
                <SwipeableDrawer
                    style={{ zIndex: 10 }}
                    anchor={"right"}
                    open={drawerOpen}
                    onClose={toggleDrawer()}
                    onOpen={toggleDrawer()}
                >
                    <List>
                        {['Dashboard', 'Reserve Desk', 'Mail Room', 'Social Feed'].map((text) => (
                            <div key={text}>
                                {text === 'Dashboard' && <NavLink exact={true} to="/" onClick={toggleDrawer()} className={classes.linkText} activeStyle={{color: 'black'}}>{text}</NavLink>}
                                {text === 'Reserve Desk' && <NavLink to="/reservation" onClick={toggleDrawer()} className={classes.linkText} activeStyle={{color: 'black'}}>{text}</NavLink>}
                                {text === 'Mail Room' && <NavLink to="/mail" onClick={toggleDrawer()} className={classes.linkText} activeStyle={{color: 'black'}}>{text}</NavLink>}
                                {text === 'Social Feed' && <NavLink to="/social" onClick={toggleDrawer()} className={classes.linkText} activeStyle={{color: 'black'}}>{text}</NavLink>}
                            </div>
                        ))}
                    </List>
                </SwipeableDrawer>
            </div>
        </div>
    );
}

export default MobileNavBar;
import React, {useEffect, useState} from 'react';
import InfiniteScroll from "react-infinite-scroller";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Endpoint from "../../config/Constants";
import {Button, Modal} from '@material-ui/core';
import safeFetch, {accountIsAdmin} from "../../util/Util";
import { isMobile } from "react-device-detect";
import {useMsal} from "@azure/msal-react";
import { updatePopup } from '../social/UpdatePopup';

const useStyles = makeStyles((theme) => ({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center',
        fontSize: 24,
        marginLeft: isMobile? 10: 0,
        color: 'white'
    },
    titleBox: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    updateBox: {
        background: '#EEF0F2',
        borderRadius: 10,
        width: '90%',
        height: 82,
        margin: 'auto',
        marginTop: 2,
        marginBottom: 2,
    },
    backgroundBox: {
        background: 'transparent',
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: isMobile? 15 : 0,
    },
    announcementName: {
        fontSize: isMobile ? 19 : 26,
        paddingLeft: 15,
        paddingTop: 5
    },
    announcementText: {
        fontSize: isMobile ? 16 : 20,
        paddingLeft: 15
    },
    inputBoxes: {
        marginLeft: 20
    },
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: isMobile? 10: 0,
        marginLeft: isMobile? 0: 10,
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    },
    popup: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMobile? '85%' : '1100px',
        marginLeft: isMobile? '8%' : 0
    }

}));

function MailUpdates() {
    const classes = useStyles();

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

    const [mailList, setMailList] = useState([]);
    const [hasMoreMail, setHasMoreMail] = useState(true);

    const getMail = () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/mail/" + userOID, requestOptions)
            .then(response => response.text())
            .then(result => {
                const mail = JSON.parse(result).mails;
                console.log(mail);
                setMailList(mail);
                setHasMoreMail(false);
            })
            .catch(error => console.log('error', error))
    }

    let mail = [];
    mailList.map((update, i) => {
        mail.push(
            <div className={classes.updateBox} key={i}>
                <h2 className={classes.announcementName}>{mailList[i].mailID}</h2>
                <h3 className={classes.announcementText}>{mailList[i].sender}</h3>
            </div>
        );
    });

    return(
        <div className={classes.backgroundBox} style= {{height: 300, overflow: 'auto'}}>
            <div className={classes.titleBox}>
                <h1 className={classes.title}>MY MAIL</h1>
            </div>
            <InfiniteScroll
                loadMore={getMail}
                hasMore={hasMoreMail}
                useWindow={false}
            >
                {mail}
            </InfiniteScroll>
        </div>
    )
}
export default MailUpdates;
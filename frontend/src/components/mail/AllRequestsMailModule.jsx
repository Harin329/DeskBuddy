import React, {useEffect, useState} from 'react';
import {Typography, Grid, ListItem, Divider, Modal} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";
import MailRequestForm from "./MailRequestForm";
import safeFetch from "../../util/Util";
import Endpoint from "../../config/Constants";
import {useMsal} from "@azure/msal-react";


const useStyles = makeStyles({
    sectionText: {
        color: 'white',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20
    },
    deskSectionText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deskText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        display: 'inline'
    },
    officeText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 16,
        textAlign: 'center'
    },
    reservationCard: {
        backgroundColor: '#E5E5E5',
        height: '110px',
        marginBottom: '10px',
        '&:hover': {
          backgroundColor: '#C4C4C4'
        }
    }
  });


function MailModule(size, text) {
    const [open, setOpen] = useState(false);
    const [mailList, setMailList] = useState([]);

    const classes = useStyles();

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

    useEffect( () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/mail/" + userOID + "?filter=AWAITING_ADMIN_ACTION and modifiedBy", requestOptions)
            .then((response) => response.text())
            .then(result => {
                const mail = JSON.parse(result).mails;
                setMailList(mail);
            })
            .catch(error => console.log('error', error));
    });

    const handleMailRequest = () => {
        setOpen(true);
    }

    const closeMailRequest = () => {
        setOpen(false);
    }

    const mailRequestPopup = () => {
        return <MailRequestForm closeModal={closeMailRequest} whatToDoWhenClosed={(bool) => {setOpen(bool)}}/>
    }

    let mail = [];
    mailList.map((update, i) => {
        mail.push(
            <ListItem className={classes.reservationCard}>
                <div style={{ width: '25%', height: '100px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography className={classes.officeText}>
                        {mailList[i].type}
                    </Typography>
                </div>
                <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '90px', width: '3px' }} />
                <div style={{ width: '80%', height: '100px', alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 30 }}>
                    <div style={{ width: '40%', height: '100px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }} onClick={handleMailRequest}>
                        <Typography className={classes.deskSectionText}>
                            MAIL ID: <Typography className={classes.deskText}>
                            {mailList[i].mail_id}
                        </Typography>
                        </Typography>
                        <Typography className={classes.deskSectionText}>
                            DATE ARRIVED: <Typography className={classes.deskText}>
                            {mailList[i].approx_date}
                        </Typography>
                        </Typography>
                    </div>
                </div>
            </ListItem>
        );
    });

    return (
        <Grid item xs={size} style={{ height: 500, borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null }}>
            <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: '20%', height: 30, textAlign: 'center', marginTop: -10, fontSize: 20, position: 'absolute' }}>{text}</h1>
            <InfiniteScroll
                style={{ padding: 30, width: '90%' }}
                useWindow={false}
            >
                {mail}
            </InfiniteScroll>
            <Modal
                open={open}
                onClose={closeMailRequest}
            >
                {mailRequestPopup()}
            </Modal>
        </Grid>

    );
}

export default MailModule;
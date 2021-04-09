import React, { useEffect, useState } from 'react';
import { Typography, Grid, ListItem, Divider, Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";
import RequestMailNotification from './RequestMailNotification';
import { useMsal } from "@azure/msal-react";
import { isMobile } from "react-device-detect";
import { useDispatch, useSelector } from 'react-redux';
import { getNewMailReq } from '../../actions/mailActions';


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
        marginBottom: '10px'
    },
    reservationCardTruncated: {
        backgroundColor: '#E5E5E5',
        height: '110px',
        marginBottom: '10px',
        '&:hover': {
            backgroundColor: '#FFFCF7'
        }
    },
    reservationCardExpanded: {
        backgroundColor: '#E5E5E5',
        height: '180px',
        marginBottom: '10px',
        '&:hover': {
            backgroundColor: '#FFFCF7'
        }
    },
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    }
});


function NewlyCreatedRequestsMailModule(size, text, newMailRefresh, office) {
    const mailList = useSelector(state => state.mail.newMailRequests);
    const [hasMore, setHasMore] = useState(true);

    const classes = useStyles();
    const dispatch = useDispatch();

    const { accounts } = useMsal();

    const getMail = () => {
        dispatch(getNewMailReq(office));
        setHasMore(false);
    };

    return (
        <Grid item xs={size} style={{ height: '500px', borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null, overflowY: 'scroll' }}>
            <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: '20%', height: 30, textAlign: 'center', marginTop: -10, fontSize: 20, position: 'absolute' }}>{text}</h1>
            <InfiniteScroll
                loadMore={getMail}
                hasMore={hasMore}
                style={{ padding: 30, width: '90%' }}
                useWindow={false}
            >
                {mailList.map((update, i) => {
                    return (
                        <RequestMailNotification isAdminModule={true} data={JSON.stringify(update)}></RequestMailNotification>
                    )
                })}
            </InfiniteScroll>
        </Grid>

    );
}

export default NewlyCreatedRequestsMailModule;
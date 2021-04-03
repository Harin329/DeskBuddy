import React, { useEffect, useState } from 'react';
import InfiniteScroll from "react-infinite-scroller";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Endpoint from "../../config/Constants";
import { Button, Modal } from '@material-ui/core';
import safeFetch, { accountIsAdmin } from "../../util/Util";
import { isMobile } from "react-device-detect";
import { useMsal } from "@azure/msal-react";
import { updatePopup } from '../social/UpdatePopup';

const useStyles = makeStyles((theme) => ({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center',
        fontSize: 24,
        marginLeft: isMobile ? 10 : 0,
        color: 'white'
    },
    titleBox: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
      },
    updateBox: {
        // background: '#EEF0F2',
        // borderRadius: 10,
        width: '90%',
        height: 82,
        margin: 'auto',
        marginTop: 2,
        marginBottom: '10px',

        background: '#EEF0F2',
        border: '1px solid #000000',
        boxSizing: 'border-box',
        borderRadius: '5px',
    },
    backgroundBox: {
        background: 'transparent',
        borderRadius: 20,
        width: '100%',
        alignItems: 'center',
        marginBottom: isMobile ? 15 : 0
    },
    announcementName: {
        // fontSize: isMobile ? 19 : 26,
        paddingLeft: 15,
        paddingTop: 5,
    
        fontFamily: 'Lato',
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: isMobile ? '15px' : '20px',
        lineHeight: '18px',
        display: 'flex',
        alignItems: 'center',
        color: '#000000',
      },
      announcementText: {
        // fontSize: isMobile ? 16 : 20,
        paddingLeft: 15,
    
        fontStyle: 'normal',
        fontWeight: 'bold',
        fontSize: isMobile ? '12px' : '15px',
        lineHeight: '12px',
        display: 'flex',
        alignItems: 'center',
        color: 'rgba(0, 0, 0, 0.8)',
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
        marginRight: isMobile ? 10 : 0,
        marginLeft: isMobile ? 0 : 10,
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    },
    popup: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: isMobile ? '85%' : '1100px',
        marginLeft: isMobile ? '8%' : 0
    }

}));

function DashboardUpdates() {
    const classes = useStyles();

    const [announcementList, setAnnouncementList] = useState([]);
    const [hasMoreAnnouncements, setHasMoreAnnouncements] = useState(true);
    const [open, setOpen] = useState(false);
    const [currAnnouncement, setCurrAnnouncement] = useState(null);

    const handleUpdateOpen = (el) => {
        console.log("update is: " + el);
        setOpen(true);
        setCurrAnnouncement(el);
    }

    const handleClose = () => {
        setOpen(false);
        setCurrAnnouncement(null);
    }

    const getAnnouncements = (page) => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/announcement/getCompanyAnnouncements", requestOptions)
            .then(response => response.text())
            .then(result => {
                const announcements = JSON.parse(result);
                console.log(announcements);
                setAnnouncementList(announcements);
                setHasMoreAnnouncements(false);
            })
            .catch(error => console.log('error', error))
    }

    const popup = () => {
        if (open) {
            return (
                <Modal
                    open={open}
                    onClose={handleClose}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    {updatePopup(currAnnouncement)}
                </Modal>
            )
        } else
            return null;
    }

    let announcements = [];
    announcementList.slice(0, 3).map((update, i) => {
        announcements.push(
            <div className={classes.updateBox} key={i} onClick={() => handleUpdateOpen(update)}>
                <h2 className={classes.announcementName}>{announcementList[i].title}</h2>
                <h3 className={classes.announcementText}>{announcementList[i].sub_title}</h3>
            </div>
        );
    });

    return (
        <div className={classes.backgroundBox} style={{ height: 300, overflow: 'auto' }}>
            <div className={classes.titleBox}>
                <h1 className={classes.title}>RECENT COMPANY UPDATES</h1>
            </div>
            <InfiniteScroll
                loadMore={getAnnouncements}
                hasMore={hasMoreAnnouncements}
                useWindow={false}
            >
                {popup()}
                {announcements}
            </InfiniteScroll>
        </div>
    )
}
export default DashboardUpdates;
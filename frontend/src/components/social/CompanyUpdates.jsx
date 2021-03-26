import React, {useEffect, useState} from 'react';
import InfiniteScroll from "react-infinite-scroller";
import {makeStyles, withStyles} from "@material-ui/core/styles";
import Endpoint from "../../config/Constants";
import {updatePopup} from "./UpdatePopup";
import {Button, Modal} from '@material-ui/core';
import AddUpdateForm from "./AddUpdateForm";
import safeFetch, {accountIsAdmin} from "../../util/Util";
import { isMobile } from "react-device-detect";
import {useMsal} from "@azure/msal-react";

const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: 'Lato',
    textAlign: 'center',
    fontSize: 30,
    marginLeft: isMobile ? 10 : 0,
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
    background: '#FFFCF7',
    borderRadius: 20,
    width: isMobile ? '95%' : '85%',
    height: 500,
    alignItems: 'center',
    marginBottom: isMobile ? 15 : 0,
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
    marginLeft: 20,
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
    fontSize: 18,
  },
  popup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: isMobile ? '85%' : '1100px',
    marginLeft: isMobile ? '8%' : 0,
  },
}));

function CompanyUpdates() {
    const classes = useStyles();

    const [announcementList, setAnnouncementList] = useState([]);
    const [hasMoreAnnouncements, setHasMoreAnnouncements] = useState(true);
    const [open, setOpen] = useState(false);
    const [currAnnouncement, setCurrAnnouncement] = useState(null);
    const [addAnnouncement, setAddAnnouncement] = useState(false);

    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);


    const handleUpdateOpen = (el) => {
        console.log("update is: " + el);
        setOpen(true);
        setCurrAnnouncement(el);
    }

    const handleClose = () => {
        setOpen(false);
        setCurrAnnouncement(null);
    }

    const handleAddUpdateClose = () => {
        setAddAnnouncement(false);
    }

    const addUpdateBody = () => {
        return <AddUpdateForm closeModal={handleAddUpdateClose} whatToDoWhenClosed={(bool) => {setAddAnnouncement(bool)}}/>
    }

    const handleAddUpdateOpen = () => {
        setAddAnnouncement(true);
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
                    className={classes.popup}
                >
                    {updatePopup(currAnnouncement)}
                </Modal>
            )
        } else
            return null;
    }

    let announcements = [];
    announcementList.map((update, i) => {
        announcements.push(
            <div className={classes.updateBox} key={i} onClick={() => handleUpdateOpen(update)}>
                <h2 className={classes.announcementName}>{announcementList[i].title}</h2>
                <h3 className={classes.announcementText}>{announcementList[i].sub_title}</h3>
            </div>
        );
    });

    return(
        <div className={classes.backgroundBox} style= {{height: '500px', overflow: 'auto'}}>
            <div className={classes.titleBox}>
                <h1 className={classes.title}>COMPANY UPDATES</h1>
                {isAdmin && <Button className={classes.actionButton} onClick={handleAddUpdateOpen}>Add</Button>}
                <Modal
                    open={addAnnouncement}
                    onClose={handleAddUpdateClose}
                >
                    {addUpdateBody()}
                </Modal>

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
export default CompanyUpdates;
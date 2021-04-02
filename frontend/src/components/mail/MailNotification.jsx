import React, { useState, useEffect } from 'react';
import {Typography, Grid, ListItem, Divider, Button, Modal, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";
import { useSelector, useDispatch } from 'react-redux'
import MailRequestForm from "./MailRequestForm";
import safeFetch from "../../util/Util";
import Endpoint from "../../config/Constants";
import { fetchOffices } from '../../actions/reservationActions';
import CancelIcon from "@material-ui/icons/Cancel";
import {isMobile} from "react-device-detect";


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
    reservationCardTruncated: {
        backgroundColor: '#E5E5E5',
        height: '110px',
        marginBottom: '10px',
        '&:hover': {
          backgroundColor: '#FFFCC7'
        }
    },
    reservationCardExpanded: {
        backgroundColor: '#FFFCF7',
        height: '250px',
        marginBottom: '10px',
        // Need help figuring out the right hover-over colour when expanded; using this colour for now
        '&:hover': {
          backgroundColor: '#FFFCC7'
        }
    },
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '40px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 12,
        margin: 'auto'
    },
    requestActionButton: {
      background: '#00ADFF',
      borderRadius: 20,
      color: 'white',
      height: '40px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 12,
      margin: 'auto'
  },
    cancelButton: {
        background: '#ba0000',
        borderRadius: 30,
        color: 'white',
        height: '30px',
        padding: '0 15px',
        marginTop: '5px',
        marginBottom: '5px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    popup: {
        position: 'fixed',
        top: '30%',
        left: isMobile ? '3%' : '35%',
        width: isMobile ? '80%' : '20%',
        height: 'auto',
        backgroundColor: 'white',
        padding: '30px',
        alignItems: 'center'
    }
});


function MailNotification(props) {
    const data = JSON.parse(props.children);
    const isAdminModule = props.isAdminModule;
    const [requestOpen, setRequestOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);
    const [officeName, setOfficeName] = useState('');

    const dispatch = useDispatch();
    const officeList = useSelector(state => state.reservations.offices);

    useEffect(() => {
        dispatch(fetchOffices());
    }, []);

    // useEffect(() => {
    //     let tempOfficeName = officeList && officeList.length ? officeList.find(existingOffice => existingOffice.office_location == JSON.parse(data).officeLocation && existingOffice.office_id == JSON.parse(data).officeID).name : 'Retrieving...';
    //     setOfficeName(tempOfficeName);
    // }, []);

    const getNotifClass = () => {
        return isExpanded ? classes.reservationCardExpanded : classes.reservationCardTruncated;
    }

    const handleMailRequest = () => {
        setRequestOpen(true);
    }

    const closeMailRequest = () => {
        setRequestOpen(false);
    }

    const handleMailDelete = () => {
        setDeleteOpen(true);
    }

    const closeMailDelete = () => {
        setDeleteOpen(false);
    }

    const mailRequestPopup = () => {
        return <MailRequestForm closeModal={closeMailRequest} whatToDoWhenClosed={(bool) => {setRequestOpen(bool)}}>{props}</MailRequestForm>
    }

    const mailDeletePopup = () => {
        return (
            <div className={classes.popup} style={{
                width: '40%',
                height: '140px',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column'
            }}>
               <Typography className={classes.officeText}>Are you sure you want to delete this mail?</Typography>
               <Typography className={classes.officeText}>Mail ID: {data.mailID}</Typography>
                <div style={{ width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                    <Button className={classes.cancelButton} onClick={() => {deleteMail()}}>DELETE</Button>
                </div>
            </div>
        )
    };

    const deleteMail = () => {
        let headers = new Headers();
        headers.append("Content-Type", "application/json");
        const requestOptions = {
            method: 'DELETE',
            headers: headers,
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/mail/" + data.mailID, requestOptions)
            .then((response) => response.text())
            .then(result => {
            })
            .catch(error => console.log('error', error));
        closeMailDelete();
    }

    let expandedNotifText;
    let expandedNotifButtons;
    if (isExpanded) {
        console.log('`````````` data: ' + data);
        let officeName = officeList.find(existingOffice => existingOffice.office_location == data.officeLocation && existingOffice.office_id == data.officeID).name;
        expandedNotifText = 
        <div>
            <Typography className={classes.deskSectionText}>LOCATION: <Typography className={classes.deskText}>
                {officeName}
          </Typography></Typography>
          <Typography className={classes.deskSectionText}> COMMENTS:
            <Typography className={classes.deskText}>
                {data.comments}
            </Typography>
          </Typography>
          <Typography className={classes.deskSectionText}>MAIL ID: <Typography className={classes.deskText}>
              {data.mailID}
            </Typography>
          </Typography>
        </div>
        expandedNotifButtons = !isAdminModule ?
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginRight: 30}}>
            <Button className={classes.requestActionButton} onClick={handleMailRequest}>Request Assistance</Button>
            <Button className={classes.actionButton} onClick={handleMailDelete}>Delete Mail</Button>
        </div> :
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginRight: 30}}>
            <Button className={classes.actionButton} onClick={handleMailDelete}>Delete Mail</Button>
        </div>
    }

    return (
      <ListItem className={getNotifClass()} onClick={() => {setIsExpanded(!isExpanded)}}>
      <div style={{ width: '20%', height: '100px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
          <Typography className={classes.officeText}>
              {data.type}
          </Typography>
      </div>
      <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '90px', width: '3px' }} />
      <div style={{ width: '80%', height: '100px', alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 30 }}>
          <div >
              <Typography className={classes.deskSectionText}>
                  FROM: <Typography className={classes.deskText}>
                      {data.sender}
                  </Typography>
              </Typography>
              {expandedNotifText}
          </div>
          {expandedNotifButtons}
      </div>
          <Modal
              open={deleteOpen}
              onClose={closeMailDelete}
          >
              {mailDeletePopup()}
          </Modal>
          <Modal
              open={requestOpen}
              onClose={closeMailRequest}
          >
              {mailRequestPopup()}
          </Modal>
  </ListItem>
    );
}

export default MailNotification;
import React, { useState, useEffect } from 'react';
import { Typography, ListItem, Divider, Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import InfiniteScroll from "react-infinite-scroller";
import { fetchOffices } from '../../actions/reservationActions';
import MailResponseForm from "./MailResponseForm";
import MailRequestForm from "./MailRequestForm";
import {isMobile} from "react-device-detect";
import safeFetch, {accountIsAdmin} from "../../util/Util";
import Endpoint from "../../config/Constants";
import {setError} from "../../actions/globalActions";
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
        fontSize: !isMobile ? 14 : 11,
        fontWeight: 'bold',
    },
    deskText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: !isMobile ? 14 : 11,
        display: 'inline'
    },
    officeText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: !isMobile ? 16 : 14,
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
        height: !isMobile ? '40px' : '25px',
        width: !isMobile ? '' : '140px',
        padding: '0 30px',
        marginTop: !isMobile ? '10px' : '2px',
        marginBottom: !isMobile ? '10px' : '2px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: !isMobile ? 14 : 8,
        margin: 'auto'
    },
    requestActionButton: {
        background: '#00ADFF',
        borderRadius: 20,
        color: 'white',
        height: !isMobile ? '40px' : '25px',
        width: !isMobile ? '' : '140px',
        lineHeight: !isMobile ? '' : '10px',
        padding: '10px 30px',
        marginTop: !isMobile ? '10px' : '2px',
        marginBottom: !isMobile ? '10px' : '2px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: !isMobile ? 14 : 8,
        margin: 'auto'
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
});


function RequestMailNotification(props) {
  // [{"mailID":263,"officeID":1,"officeLocation":"NV","recipient_first":"Peter","recipient_last":"Parker","recipient_email":"admin@deskbuddy.onmicrosoft.com","type":"Letter","approx_date":"0000-00-00","sender":"From TD","dimensions":"7 inches x 8 inches","comments":"Billing statement","adminID":"3c43b7d8-06f0-44ab-bc03-70f8b36c2ea1"}]
    const data = props.data;
    const isAdminModule = props.isAdminModule;
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);
    const [responseOpen, setResponseOpen] = useState(false);
    const [requestOpen, setRequestOpen] = useState(false);
    const [officeName, setOfficeName] = useState('');
    const [reportOpen, setReportOpen] = useState(false);
    const [closeOpen, setCloseOpen] = useState(false);

    const dispatch = useDispatch();
    const officeList = useSelector(state => state.reservations.offices);

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

    useEffect(() => {
        dispatch(fetchOffices());
    }, []);

    useEffect(() => {
        let tempOfficeName = officeList && officeList.length ? officeList.find(existingOffice => existingOffice.office_location == JSON.parse(data).officeLocation && existingOffice.office_id == JSON.parse(data).officeID).name : 'Retrieving...';
        setOfficeName(tempOfficeName);
    }, []);

    const handleRequestPopup = () => {
        setIsExpanded(true);
        setRequestOpen(true);
      };
  
      const closeRequestPopup = () => {
        setRequestOpen(false);
      };
  
      const mailRequestPopup = () => {
        return <MailResponseForm closeModal={closeMailResponse} whatToDoWhenClosed={(bool) => {setRequestOpen(bool)}}>{props}</MailResponseForm>
      };

      const closeRequest = () => {
          let jsonBody = {
              mail_id: JSON.parse(data).mailID,
              employee_id: userOID
          }

          let headers = new Headers();
          headers.append("Content-Type", "application/json");
          const requestOptions = {
              method: 'PUT',
              headers: headers,
              redirect: 'follow',
              body: JSON.stringify(jsonBody)
          };

          safeFetch(Endpoint + "/request/close", requestOptions)
              .then((response) => response.text())
              .then(result => {
              })
              .catch(error => {
                  console.log('error', error);
                  dispatch(setError(true));
              });
          handleClose();
      }
    
    const handleMailResponse = () => {
      setIsExpanded(true);
      setResponseOpen(true);
    };

    const closeMailResponse = () => {
      setResponseOpen(false);
    };

    const mailResponsePopup = () => {
      return <MailResponseForm closeModal={closeMailResponse} whatToDoWhenClosed={(bool) => {setResponseOpen(bool)}}>{props}</MailResponseForm>
    };

    const getNotifClass = () => {
        return isExpanded ? classes.reservationCardExpanded : classes.reservationCardTruncated;
    };

    const handleReportOpen = () => {
        setReportOpen(true);
    }

    const handleReportClose = () => {
        setReportOpen(false);
    }

    const reportPopup = () => {
        return (
            <div className={classes.popup} style={{
                width: '40%',
                height: '140px',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography className={classes.officeText}>Mail ID: {JSON.parse(data).mailID}</Typography>
                <Typography className={classes.deskSectionText}>LOCATION: <Typography className={classes.deskText}>
                    {officeName}
                </Typography></Typography>
                <Typography className={classes.deskSectionText}>STATUS: <Typography className={classes.deskText}>
                    {JSON.parse(data).status}
                </Typography>
                </Typography>
                <Typography className={classes.deskSectionText}>REQUEST TYPE: <Typography className={classes.deskText}>
                    {JSON.parse(data).request_type}
                </Typography>
                </Typography>
                <Typography className={classes.deskSectionText}>FORWARDING LOCATION: <Typography className={classes.deskText}>
                    {JSON.parse(data).forward_location || "N/A"}
                </Typography>
                </Typography>
                <Typography className={classes.deskSectionText}>ADMIN RESPONSE: <Typography className={classes.deskText}>
                    {JSON.parse(data).response || "None"}
                </Typography>
                </Typography>
            </div>
        )
    };

    const handleClosePopup = () => {
        setCloseOpen(true);
    }

    const handleClose = () => {
        setCloseOpen(false);
    }

    const closePopup = () => {
        return (
            <div className={classes.popup} style={{
                width: '40%',
                height: '140px',
                justifyContent: 'center',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography className={classes.officeText}>Are you sure you want to close this request?</Typography>
                <Typography className={classes.officeText}>Mail ID: {JSON.parse(data).mailID}</Typography>
                <div style={{ width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                    <Button className={classes.cancelButton} onClick={() => {closeRequest()}}>CLOSE</Button>
                </div>
            </div>
        )
    };

    let expandedNotifText;
    let expandedNotifButtons;
    if (isExpanded) {
        let matchingOffice = officeList.find(existingOffice => existingOffice.office_location == JSON.parse(data).officeLocation && existingOffice.office_id == JSON.parse(data).officeID);
      let officeName = matchingOffice ? matchingOffice.name : 'Retrieving...';
        expandedNotifText = 
        <div style={{ width: '80%', height: '100px', alignItems: 'flex-start', display: 'flex', flexDirection: 'column', }}>
            <Typography className={classes.deskSectionText}>LOCATION: <Typography className={classes.deskText}>
            {officeName}
          </Typography></Typography>
          <Typography className={classes.deskSectionText}>ADDITIONAL COMMENTS: <Typography className={classes.deskText}>
            {JSON.parse(data).comments}
            </Typography>
          </Typography>
          <Typography className={classes.deskSectionText}>MAIL ID: <Typography className={classes.deskText}>
            {JSON.parse(data).mailID}
            </Typography>
          </Typography> 
        </div>
        expandedNotifButtons = !isAdminModule ?
        <div style={{ display: 'flex', flexDirection: !isMobile ? 'row' : 'column', justifyContent: 'space-evenly', marginRight: 30, marginBottom: '-20px', width: '80%'}}>
            <Button className={classes.actionButton} onClick={handleClosePopup}>Close</Button>
            <Button className={classes.requestActionButton} onClick={handleRequestPopup}>Request Assistance</Button>
            <Button className={classes.actionButton} onClick={handleReportOpen}>See Report</Button>
        </div> : JSON.parse(data).status === 'Admin Has Responded' ? 
        <div style={{ display: 'flex', flexDirection: !isMobile ? 'row' : 'column', justifyContent: 'space-evenly', marginRight: 30, width: '80%'}}>
        <Button className={classes.actionButton}>Close</Button>
        <Button className={classes.actionButton}>See Report</Button>            
    </div> :  <div style={{ display: 'flex', flexDirection: !isMobile ? 'row' : 'column', justifyContent: 'space-evenly', marginRight: 30, width: '80%'}}>
        <Button className={classes.actionButton} onClick={handleClosePopup}>Close</Button>
        <Button className={classes.requestActionButton} onClick={handleMailResponse}>Respond</Button>
        <Button className={classes.actionButton} onClick={handleReportOpen}>See Report</Button>
    </div>
    }

    return (
      <ListItem className={getNotifClass()} onClick={() => {
          if (!responseOpen && !requestOpen && !reportOpen && !closeOpen){
              setIsExpanded(!isExpanded)
          }}}>
      <div style={{ width: '25%', height: '100px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
          <Typography className={classes.officeText}>
              {JSON.parse(data).type}
          </Typography>
      </div>
      <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '90px', width: '3px' }} />
      <div style={{ width: '80%', height: '100px', alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 30 }}>
          <div >
              <Typography className={classes.deskSectionText}>
                  FROM: <Typography className={classes.deskText}>
                      {JSON.parse(data).sender}
                  </Typography>
              </Typography>
              <Typography className={classes.deskSectionText}>
                STATUS:  <Typography className={classes.deskText}>
                  {JSON.parse(data).status}
                 </Typography>
              </Typography>
              {expandedNotifText}
              {expandedNotifButtons}
          </div>
      </div>
      <Modal
              open={responseOpen}
              onClose={closeMailResponse}
          >
              {mailResponsePopup()}
          </Modal>
          <Modal
              open={requestOpen}
              onClose={closeRequestPopup}
          >
              {mailRequestPopup()}
          </Modal>
          <Modal
              open={reportOpen}
              onClose={handleReportClose}
          >
              {reportPopup()}
          </Modal>
          <Modal
              open={closeOpen}
              onClose={handleClose}
          >
              {closePopup()}
          </Modal>
  </ListItem>
    );
}

export default RequestMailNotification;
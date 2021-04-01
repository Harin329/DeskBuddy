import React, { useState, useEffect } from 'react';
import { Typography, ListItem, Divider, Button, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux'
import InfiniteScroll from "react-infinite-scroller";
import { fetchOffices } from '../../actions/reservationActions';
import MailResponseForm from "./MailResponseForm";
import MailRequestForm from "./MailRequestForm";

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
      padding: '10px 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 12,
      margin: 'auto'
  }
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

    const dispatch = useDispatch();
    const officeList = useSelector(state => state.reservations.offices);

    useEffect(() => {
        dispatch(fetchOffices());
    }, []);

    useEffect(() => {
        let tempOfficeName = officeList && officeList.length ? officeList.find(existingOffice => existingOffice.office_location == JSON.parse(data).officeLocation && existingOffice.office_id == JSON.parse(data).officeID).name : 'Retrieving...';
        setOfficeName(tempOfficeName);
    }, []);

    const handleMailRequest = () => {
        setIsExpanded(true);
        setRequestOpen(true);
      };
  
      const closeMailRequest = () => {
        setRequestOpen(false);
      };
  
      const mailRequestPopup = () => {
        return <MailRequestForm closeModal={closeMailResponse} whatToDoWhenClosed={(bool) => {setResponseOpen(bool)}}>{props}</MailRequestForm>
      };
    
    
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

    let expandedNotifText;
    let expandedNotifButtons;
    if (isExpanded) {
      let officeName = officeList.find(existingOffice => existingOffice.office_location == JSON.parse(data).officeLocation && existingOffice.office_id == JSON.parse(data).officeID).name;
        expandedNotifText = 
        <div style={{ width: '80%', height: '100px', alignItems: 'flex-start', display: 'flex', flexDirection: 'column', }}>
            <Typography className={classes.deskSectionText}>LOCATION: <Typography className={classes.deskText}>
            {officeName}
          </Typography></Typography>
          <Typography className={classes.deskSectionText}>ADDITIONAL COMMENTS: <Typography className={classes.deskText}>
            {JSON.parse(data).comments}
            </Typography>
          </Typography>
          {/* <Typography className={classes.deskSectionText}>
            APPROXIMATE ARRIVAL DATE: <Typography className={classes.deskText}>
            {JSON.parse(data).approx_date}
             </Typography>
          </Typography>*/}
          <Typography className={classes.deskSectionText}>MAIL ID: <Typography className={classes.deskText}>
            {JSON.parse(data).mailID}
            </Typography>
          </Typography> 
        </div>
        expandedNotifButtons = !isAdminModule ?
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginRight: 30, marginBottom: '-20px', width: '80%'}}>
            <Button className={classes.actionButton}>Close</Button>
            <Button className={classes.requestActionButton} onClick={handleMailRequest}>Request Assistance</Button>
            <Button className={classes.actionButton}>See Report</Button>            
        </div> : JSON.parse(data).status === 'Admin Has Responded' ? 
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginRight: 30, width: '80%'}}>
        <Button className={classes.actionButton}>Close</Button>
        <Button className={classes.actionButton}>See Report</Button>            
    </div> :  <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', marginRight: 30, width: '80%'}}>
        <Button className={classes.actionButton}>Close</Button>
        <Button className={classes.requestActionButton} onClick={handleMailResponse}>Respond</Button>
        <Button className={classes.actionButton}>See Report</Button>            
    </div>
    }

    return (
      <ListItem className={getNotifClass()} onClick={() => {setIsExpanded(!isExpanded)}}>
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
              onClose={closeMailRequest}
          >
              {mailRequestPopup()}
          </Modal>
  </ListItem>
    );
}

export default RequestMailNotification;
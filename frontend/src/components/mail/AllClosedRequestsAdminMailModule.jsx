import React, { useEffect, useState } from 'react';
import { Typography, Grid, Button, Modal, TextField, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";
import MailRequestForm from "./MailRequestForm";
import safeFetch from "../../util/Util";
import Endpoint from "../../config/Constants";
import RequestMailNotification from './RequestMailNotification';
import { useMsal } from "@azure/msal-react";
import { useSelector, useDispatch } from 'react-redux'
import { fetchOffices } from '../../actions/reservationActions';
import { ConsoleView } from 'react-device-detect';
import { setError } from '../../actions/globalActions';
import { getNewMailClosed } from '../../actions/mailActions';
import { isMobile } from 'react-device-detect';


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
  },
  inputBoxes: {
    width: '40%',
    height: '10%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: '20px',
    marginLeft: '20px',
    marginBottom: '10px'
  }
});


function AllClosedRequestsAdminMailModule(size, text) {
  const classes = useStyles();

  const [statusChoice, setStatusChoice] = useState('Admin has Responded');
  const [open, setOpen] = useState(false);
  const mailList = useSelector(state => state.mail.allClosedMail);
  const [officeName, setOfficeName] = useState('');

  const dispatch = useDispatch();
  const officeList = useSelector(state => state.reservations.offices);
  const { accounts } = useMsal();

  const userOID = accounts[0].idTokenClaims.oid;

  const mockData = ["ABC", "DEFG", "HIJ", "KLM", "NOP", "QRS", "TUV"];
  const statusChoices = ['Admin has Responded', 'Waiting for Admin', 'Cannot Complete', 'Closed']

  useEffect(() => {
    // TODO: use get all mail request endpoint
    // fetchFilteredMail('Admin has Responded', false);
    // fetchFilteredMail('Waiting for Admin', false);
    // fetchFilteredMail('Cannot Complete', false);
    fetchFilteredMail('Closed', false);
  }, []);

  const handleMailRequest = () => {
    setOpen(true);
  }

  const closeMailRequest = () => {
    setOpen(false);
  }

  const mailRequestPopup = () => {
    return <MailRequestForm closeModal={closeMailRequest} whatToDoWhenClosed={(bool) => { setOpen(bool) }} />
  }

  const fetchFilteredMail = async (filter, isReplacingRetrievedMail) => {
    dispatch(getNewMailClosed(mailList));
  }

  const handleStatusChoiceChange = (event) => {
    setStatusChoice(event.target.value);
    // set loading status
    fetchFilteredMail(event.target.value, true);
  };

  let mail = [];
  mailList.map((update, i) => {
    mail.push(
      <RequestMailNotification data={JSON.stringify(update)}></RequestMailNotification>
    );
  });

  return (
    <Grid item xs={size} style={{ height: 500, borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null, overflowY: 'scroll', width: '100%'}}>
      <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: !isMobile ? '20%' : '60%', height: 30, textAlign: 'center', marginTop: -10, fontSize: !isMobile ? 20 : 15, position: 'absolute' }}>{text}</h1>
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

export default AllClosedRequestsAdminMailModule;

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
import { setError } from '../../actions/globalActions';
import { getNewMailAll } from '../../actions/mailActions';
import {isMobile} from 'react-device-detect'
import { SET_NEW_FILTER } from '../../actions/actionTypes';


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
  },
  outlineBox: {
    width: !isMobile ? '40%' : '90%',
    height: '15%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: '20px',
    marginLeft: '20px',
    marginBottom: '10px'
  },
  selector: {
    marginTop: 10,
    marginLeft: 10,
    width: !isMobile ? '90%' : '250px',
  }
});


function AllRequestsMailModule(size, text) {
  const classes = useStyles();

  const [statusChoice, setStatusChoice] = useState('Admin has Responded');
  const [open, setOpen] = useState(false);
  const mailList = useSelector(state => state.mail.allMail);
  const [officeName, setOfficeName] = useState('');

  const dispatch = useDispatch();
  const officeList = useSelector(state => state.reservations.offices);
  const { accounts } = useMsal();

  const userOID = accounts[0].idTokenClaims.oid;

  const statusChoices = ['Admin has Responded', 'Waiting for Admin', 'Closed']

  useEffect(async () => {
    // TODO: use get all mail request endpoint
    await fetchFilteredMail('Admin has Responded', false);
    // await fetchFilteredMail('Waiting for Admin', false);
    // await fetchFilteredMail('Cannot Complete', false);
    // await fetchFilteredMail('Closed', false);
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
      dispatch({ type: SET_NEW_FILTER, payload: filter });
      dispatch(getNewMailAll(userOID, filter));
  }

  const handleStatusChoiceChange = (event) => {
    setStatusChoice(event.target.value);
    // set loading status
    fetchFilteredMail(event.target.value, true);
  };

  let mail = [];
  mailList.map((update, i) => {
    mail.push(
      <RequestMailNotification isAdminModule={false} data={JSON.stringify(update)}></RequestMailNotification>
    );
  });
  return (
    <Grid item xs={size} style={{ height: 500, borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null, width: '100%' }}>
      <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: !isMobile ? '20%' : '60%', height: 30, textAlign: 'center', marginTop: -10, fontSize: !isMobile ? 20 : 15, position: 'absolute' }}>{text}</h1>
      <Grid container direction='row' justify='flex-start' alignItems='baseline'>
        <div className={classes.outlineBox}>
          <TextField id="outlined-basic" label="Status" variant="outlined" select onChange={handleStatusChoiceChange} value={statusChoice} className={classes.selector}>
            {statusChoices.map((option) => {
              return <MenuItem key={option} value={option}>{option}</MenuItem>
            })
            }
          </TextField>
        </div>
        <Grid item xs={12} style={{ height: 400, border: 3, borderRadius: 20, display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null, overflowY: 'scroll' }}>
          <InfiniteScroll
            style={{ padding: 30, width: '90%' }}
            useWindow={false}
          >
            {mail}
          </InfiniteScroll>
        </Grid>
      </Grid>


      <Modal
        open={open}
        onClose={closeMailRequest}
      >
        {mailRequestPopup()}
      </Modal>
    </Grid>
  );
}

export default AllRequestsMailModule;

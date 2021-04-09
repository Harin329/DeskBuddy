import React, { useEffect, useState } from 'react';
import { Grid, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";
import MailRequestForm from "./MailRequestForm";
import RequestMailNotification from './RequestMailNotification';
import { useMsal } from "@azure/msal-react";
import { useSelector, useDispatch } from 'react-redux';
import { setError } from '../../actions/globalActions';
import { getNewMailAdmin } from '../../actions/mailActions';


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


function AllRequestsAdminMailModule(size, text, office) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const mailList = useSelector(state => state.mail.allAdminMail);

  const dispatch = useDispatch();
  const { accounts } = useMsal();

  useEffect(() => {
    fetchFilteredMail();
  }, []);

  const closeMailRequest = () => {
    setOpen(false);
  }

  const mailRequestPopup = () => {
    return <MailRequestForm closeModal={closeMailRequest} whatToDoWhenClosed={(bool) => { setOpen(bool) }} />
  }

  const fetchFilteredMail = async () => {
      dispatch(getNewMailAdmin(office));
  }

  let mail = [];
  mailList.map((update, i) => {
    mail.push(
      <RequestMailNotification isAdminModule={true} data={JSON.stringify(update)}></RequestMailNotification>
    );
  });

  return (
    <Grid item xs={size} style={{ height: 500, borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null, overflowY: 'scroll' }}>
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

export default AllRequestsAdminMailModule;

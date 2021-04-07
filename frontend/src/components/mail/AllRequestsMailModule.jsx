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
    width: '40%',
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
    width: '90%'
  }
});


function AllRequestsMailModule(size, text) {
  const classes = useStyles();

  const [statusChoice, setStatusChoice] = useState('Admin has Responded');
  const [open, setOpen] = useState(false);
  const [mailList, setMailList] = useState([]);
  const [officeName, setOfficeName] = useState('');

  const dispatch = useDispatch();
  const officeList = useSelector(state => state.reservations.offices);
  const { accounts } = useMsal();

  const userOID = accounts[0].idTokenClaims.oid;

  const mockData = ["ABC", "DEFG", "HIJ", "KLM", "NOP", "QRS", "TUV"];
  const statusChoices = ['Admin has Responded', 'Waiting for Admin', 'Cannot Complete', 'Closed']

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
    const requestOptions = {
      method: 'GET',
      redirect: 'follow'
    };
    switch (filter) {
      case 'Admin has Responded':
        safeFetch(Endpoint + "/mail/" + userOID + "?filter=awaiting_employee_confirmation&sort=-modified_at", requestOptions)
        .then(response => {
          if (!response.ok) {
              dispatch(setError(true));
          }
          return response.text();
      })
          .then(result => {
            const mail = JSON.parse(result).mails;
            mail.map((mailObj) => {
              mailObj.status = 'Admin has Responded';
              });
            setMailList([...mail]);
          })
          .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
          });
        break;
      case 'Waiting for Admin':
        safeFetch(Endpoint + "/mail/" + userOID + "?filter=awaiting_admin_action&sort=-modified_at", requestOptions)
        .then(response => {
          if (!response.ok) {
              dispatch(setError(true));
          }
          return response.text();
      })
          .then(result => {
            const mail = JSON.parse(result).mails;
            mail.map((mailObj) => mailObj.status = 'Waiting for Admin');
            setMailList([...mail]);
          })
          .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
          });
        break;
      case 'Cannot Complete':
        safeFetch(Endpoint + "/mail/" + userOID + "?filter=cannot_complete&sort=-modified_at", requestOptions)
        .then(response => {
          if (!response.ok) {
              dispatch(setError(true));
          }
          return response.text();
      })
          .then(result => {
            const mail = JSON.parse(result).mails;
            mail.map((mailObj) => mailObj.status = 'Cannot Complete');
            setMailList([...mail]);
          })
          .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
          });
        break;
      case 'Closed':
        safeFetch(Endpoint + "/mail/" + userOID + "?filter=closed&sort=-modified_at", requestOptions)
        .then(response => {
          if (!response.ok) {
              dispatch(setError(true));
          }
          return response.text();
      })
          .then(result => {
            const mail = JSON.parse(result).mails;
            mail.map((mailObj) => mailObj.status = 'Closed');
            setMailList([...mail]);
          })
          .catch(error => {
            console.log('error', error);
            dispatch(setError(true));
          });
        break;
      default:
        break;
    }
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
    <Grid item xs={size} style={{ height: 500, borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null }}>
      <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: '20%', height: 30, textAlign: 'center', marginTop: -10, fontSize: 20, position: 'absolute' }}>{text}</h1>
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

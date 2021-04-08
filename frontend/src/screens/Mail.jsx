import '../App.css';
import { Button, Grid, Modal, TextField, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../components/global/Title';
import Subheader from '../components/global/Subheader';
import MailModule from '../components/mail/MailModule';
import AllRequestsMailModule from '../components/mail/AllRequestsMailModule';
import NewlyCreatedRequestsMailModule from '../components/mail/NewlyCreatedRequestsMailModule';
import AllRequestsAdminMailModule from '../components/mail/AllRequestsAdminMailModule';
import AllClosedRequestsAdminMailModule from '../components/mail/AllClosedRequestsAdminMailModule';
import React, { useState } from "react";
import NewMailForm from "../components/mail/NewMailForm";
import { useMsal } from "@azure/msal-react";
import { accountIsAdmin } from "../util/Util";
import MailRequestForm from "../components/mail/MailRequestForm";
import RequestModule from "../components/mail/RequestModule";
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../actions/globalActions';
import ErrorPopup from '../components/global/error-popup';

const useStyles = makeStyles((theme) => ({
  background: {
    background: '#1E1E24',
    flexGrow: 1,
  },
  inputBoxes: {
    width: '20%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: '10px',
  },
  sectionSpacing: {
    marginBottom: '29px',
  },
  actionButtonCenter: {
    background: '#00ADEF',
    borderRadius: 20,
    color: 'white',
    height: '50px',
    padding: '0 30px',
    marginTop: '15px',
    marginBottom: '10px',
    fontFamily: 'Lato',
    fontWeight: 'bolder',
    fontSize: 18,
    justifyContent: "center",
    alignItems: "center"
  }

}));

function Mail() {
  const dispatch = useDispatch()
  const error = useSelector(state => state.global.error);
  const officeList = useSelector(state => state.reservations.offices);
  const [open, setOpen] = useState(false);
  const [newMailRefresh, setNewMailRefresh] = useState(0);
  const [office, setOffice] = useState();

  const { accounts } = useMsal();
  const isAdmin = accountIsAdmin(accounts[0]);

  const classes = useStyles();

  const handleNewMail = () => {
    setOpen(true);
  }

  const closeNewMail = () => {
    setOpen(false);
  }

  const handleNewMailRefresh = () => {
    setNewMailRefresh(newMailRefresh + 1);
  }

  const handleOfficeChange = (event) => {
    setOffice(event.target.value);
  };

  const newMailPopup = () => {
    return <NewMailForm closeModal={closeNewMail} whatToDoWhenClosed={(bool) => { setOpen(bool) }} handleNewMailRefresh={handleNewMailRefresh}/>
  }

  return (
    <div className={classes.background}>
      <Modal
        open={error}
        onClose={() =>
          dispatch(setError(false))
        }
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ErrorPopup />
      </Modal>
      <Grid container direction='column' justify='center' alignItems='center'>
        {Title('MAIL MANAGER', 1, 8, 1)}
        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
          {MailModule(4, "NEW MAIL")}
          <Grid item xs={2}></Grid>
          {AllRequestsMailModule(4, "ALL REQUESTS")}
        </Grid>

        {window.innerWidth > 1500 && Subheader('MANAGE REQUESTS', 4, 2, 4)}
        {window.innerWidth <= 1500 && Subheader('MANAGE REQUESTS', 0, 12, 0)}


        {isAdmin && <Grid container justify='flex-start' alignItems='center' style={{width: '80%'}}><TextField id="outlined-basic" label="Location" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
                        {officeList.map((option) => (
                          <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                            {option.name}
                          </MenuItem>
                        ))}
        </TextField></Grid>}
        {isAdmin && <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
        {/* TODO: Use the newMailRefresh prop to trigger a refresh after the admin submits a new mail notification via the NewMailForm.jsx */}
        {/* TODO: Use the office prop to filter which mail notifications to show */}
          {NewlyCreatedRequestsMailModule(3, "NEWLY SUBMITTED REQUESTS", newMailRefresh, office)}
          <Grid item xs={'auto'}>
          {/* <NewlyCreatedRequestsMailModule size={3} text={"NEWLY SUBMITTED MAIL"} newMailRefresh={newMailRefresh}></NewlyCreatedRequestsMailModule> */}
          </Grid>
          {AllRequestsAdminMailModule(3, "ALL ACTIVE REQUESTS", newMailRefresh, office)}
          <Grid item xs={'auto'}></Grid>
          {AllClosedRequestsAdminMailModule(3, "ALL CLOSED REQUESTS", newMailRefresh, office)}
        </Grid>}
        {isAdmin && <Button className={classes.actionButtonCenter} onClick={handleNewMail}>
          Submit New Mail
          </Button>}
        <Modal
          open={open}
          onClose={closeNewMail}
        >
          {newMailPopup()}
        </Modal>
      </Grid>
    </div>
  );
}

export default Mail;
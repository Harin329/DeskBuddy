import '../App.css';
import { Button, Grid, Modal, TextField, MenuItem, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Title from '../components/global/Title';
import Subheader from '../components/global/Subheader';
import MailModule from '../components/mail/MailModule';
import AllRequestsMailModule from '../components/mail/AllRequestsMailModule';
import NewlyCreatedRequestsMailModule from '../components/mail/NewlyCreatedRequestsMailModule';
import AllRequestsAdminMailModule from '../components/mail/AllRequestsAdminMailModule';
import AllClosedRequestsAdminMailModule from '../components/mail/AllClosedRequestsAdminMailModule';
import React, { useState, useEffect } from "react";
import {fetchEmployeesFromAD} from "../actions/authenticationActions";
import NewMailForm from "../components/mail/NewMailForm";
import { useMsal } from "@azure/msal-react";
import { accountIsAdmin } from "../util/Util";
import { useDispatch, useSelector } from 'react-redux';
import { setError } from '../actions/globalActions';
import ErrorPopup from '../components/global/error-popup';
import { isMobile } from 'react-device-detect';
import { getNewMailAdmin, getNewMailReq, getNewMailClosed } from '../actions/mailActions';
import Select from "react-select";

const useStyles = makeStyles((theme) => ({
  background: {
    background: '#1E1E24',
    flexGrow: 1,
  },
  inputBoxes: {
    width: isMobile ? '200px' : '20%',
    height: '10%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: '20px',
    marginLeft: '10px',
    marginRight: '10px',
    marginBottom: isMobile ? '20px' : '10px',
  },
  outlineBox: {
    width: isMobile ? '200px' : '20%',
    height: '20%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginTop: '20px',
    marginLeft: '20px',
    marginBottom: isMobile ? '20px' : '10px'
  },
  sectionSpacing: {
    marginBottom: !isMobile ? '80px' : '100px',
    display: isMobile ? 'flex' : '',
    flexDirection: isMobile ? 'column' : '',
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
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

function Mail() {
  const { accounts } = useMsal();
  const isAdmin = accountIsAdmin(accounts[0]);

  const classes = useStyles();

  const userOID = accounts[0].idTokenClaims.oid;
  const dispatch = useDispatch()
  const [employee, setEmployee] = useState("");
  const [recipientFN, setRecipientFN] = useState("");
  const [recipientLN, setRecipientLN] = useState("");
  const error = useSelector(state => state.global.error);
  const officeList = useSelector(state => state.reservations.offices);
  const employeeList = useSelector(state => state.authentication.users);
  const [open, setOpen] = useState(false);
  const [newMailRefresh, setNewMailRefresh] = useState(0);
  const [office, setOffice] = useState('All Locations');

  const allMail = useSelector(state => state.mail.allAdminMail);
  const closedMailList = useSelector(state => state.mail.allClosedMail);



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

  const handleEmployeeChange = (event) => {
    setEmployee(event.value.email);
}

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchEmployeesFromAD());
      dispatch(getNewMailReq(office, employee));
      dispatch(getNewMailAdmin(office, employee));
      dispatch(getNewMailClosed(office, employee));
    }
  }, [office, employee]);

  const newMailPopup = () => {
    return <NewMailForm closeModal={closeNewMail} whatToDoWhenClosed={(bool) => { setOpen(bool) }} handleNewMailRefresh={handleNewMailRefresh} />
  }

  const employees = employeeList.map((option) => { return {value: {oid: option.id, first: option.givenName, last:option.surname, email: option.userPrincipalName}, label: option.givenName + " " + option.surname + " (" + (option.mail != null ? option.mail : option.userPrincipalName + ")")} })
  employees.unshift({label: "All Employees", value: {oid: "", first: "", last: "", email: ""}});
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
          {MailModule(!isMobile ? 4 : 11, "NEW MAIL")}
          <Grid item xs={2}></Grid>
          {AllRequestsMailModule(!isMobile ? 4 : 11, "ALL REQUESTS")}
        </Grid>

        {isAdmin && window.innerWidth > 1500 && Subheader('MANAGE REQUESTS', 4, 2, 4)}
        {isAdmin && window.innerWidth <= 1500 && Subheader('MANAGE REQUESTS', 0, 12, 0)}


        {isAdmin && <Grid container justify={isMobile ? 'center' : 'flex-start'} alignItems='center' style={{ width: isMobile ? '100%' : '80%' }}>
          <TextField id="outlined-basic" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
          <MenuItem key={'All Locations'} value={'All Locations'}>
            All Locations
                                </MenuItem>
          {officeList.map((option) => (
            <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
              {option.name}
            </MenuItem>
          ))}
        </TextField>
        <Typography className={classes.titles}>
                    Recipient
                </Typography>
                <Select
                    defaultValue={employee}
                    onChange={handleEmployeeChange}
                    options={employees}
                    className={classes.inputBoxes}
                /></Grid>}
        {isAdmin && <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
          {NewlyCreatedRequestsMailModule(!isMobile ? 3 : 11, "NEWLY SUBMITTED REQUESTS", newMailRefresh, office)}
          <Grid item xs={'auto'}>
          </Grid>
          {AllRequestsAdminMailModule(!isMobile ? 3 : 11, "ALL ACTIVE REQUESTS", office)}
          <Grid item xs={'auto'}></Grid>
          {AllClosedRequestsAdminMailModule(!isMobile ? 3 : 11, "ALL CLOSED REQUESTS", office)}
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
import React, { useState, useEffect } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { Button, Grid, Typography, TextField, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import UpdateLocationFloorContainer from '../../components/reservation/UpdateLocationFloorContainer';
import { fetchOffices } from '../../actions/reservationActions';

const useStyles = makeStyles({
  background: {
      background: '#1E1E24',
      flexGrow: 1,
  },
  actionButton: {
      background: '#00ADEF',
      borderRadius: 20,
      color: 'white',
      height: '50px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 18
  },
  reserveButton: {
      background: '#00ADEF',
      borderRadius: 20,
      color: 'white',
      height: '50px',
      padding: '0 20px',
      marginTop: '5px',
      marginBottom: '5px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 14,
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  attachmentButton: {
      background: '#C4C4C4',
      borderRadius: '20px',
      color: 'white',
      height: '50px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 12,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      '&:hover': {
        backgroundColor: '#C8C8C8',
        color: '#FFF'
    }
  },
  selectedAttachmentButton: {
    background: '#00ADEF',
    borderRadius: '20px',
    color: 'white',
    height: '50px',
    padding: '0 30px',
    marginTop: '10px',
    marginBottom: '10px',
    fontFamily: 'Lato',
    fontWeight: 'bolder',
    fontSize: 12,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '&:hover': {
        backgroundColor: '#00ADEF',
        color: '#FFF'
    }
},
  titleText: {
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Lato',
      fontWeight: 'bold',
      fontSize: 25
  },
  sectionText: {
      color: 'white',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 20
  },
  titleLines: {
      backgroundColor: 'white',
      height: '3px',
  },
  sectionSpacing: {
      marginBottom: '29px'
  },
  inputBoxes: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      marginTop: '10px',
  },
  officeText: {
      color: 'black',
      fontFamily: 'Lato',
      fontSize: 16,
      textAlign: 'center'
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
  dialogLineContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'stretch'
  },
  dialogLineLabel: {
      paddingTop: '20px'
  },
  pictureUploadContainer: {padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px'}
});

function UpdateLocationPopup (props) {
  const classes = useStyles();
  let isUpdateLocationClosed = props.isOpen;
  const [office, setOffice] = useState();

  const dispatch = useDispatch()
  const officeList = useSelector(state => state.offices);


  const handleUpdateLocationClose = () => {
    props.whatToDoWhenClosed();
  }
  

  useEffect(() => {
    dispatch(fetchOffices());
  }, []);

  const handleOfficeChange = (event) => {
    setOffice(event.target.value);
  };
  return (
    <Dialog open={isUpdateLocationClosed} onClose={handleUpdateLocationClose} fullWidth={true} maxWidth={"md"}>
      <DialogTitle>UPDATE LOCATION</DialogTitle>
      <DialogContent>
          <Grid container justify='center' className={classes.dialogLineContainer}>
              <Grid item xs={2} className={classes.dialogLineLabel}>
                  <Typography>
                      Location
                  </Typography>
              </Grid>
              <Grid item xs={9}>
              <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
                      {officeList.map((option) => (
                          <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                          {option.name}
                          </MenuItem>
                      ))}
                  </TextField>
              </Grid>
          </Grid>
          <DialogContentText>
              Please choose one or more of the following to update for the selected location
          </DialogContentText>
          <Grid container justify='center' className={classes.dialogLineContainer}>
              <Grid item xs={2} className={classes.dialogLineLabel}>
                  <Typography>
                      New Town/City
                  </Typography>
              </Grid>
              <Grid item xs={9}>
                  <TextField id="outlined-basic" variant="outlined" className={classes.inputBoxes}>
                  </TextField>
              </Grid>
          </Grid>
          <Grid container justify='center' className={classes.dialogLineContainer}>
              <Grid item xs={2} className={classes.dialogLineLabel}>
                  <Typography>
                      Address
                  </Typography>
              </Grid>
              <Grid item xs={9}>
                  <TextField id="outlined-basic" variant="outlined" className={classes.inputBoxes}>
                  </TextField>
              </Grid>
          </Grid>
          <Grid container justify='center' className={classes.dialogLineContainer}>
              <Grid item xs={2} className={classes.dialogLineLabel}>
                  <Typography>
                  Photo of Location
                  </Typography>
              </Grid>
              <Grid item xs={9}>
                  <Button className={classes.attachmentButton} onClick={() => {}}>
                  Update Location Photo
                  </Button>
              </Grid>
          </Grid>
          <UpdateLocationFloorContainer></UpdateLocationFloorContainer>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateLocationPopup;

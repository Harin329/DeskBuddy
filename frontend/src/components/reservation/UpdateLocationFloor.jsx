import React, { useState, useEffect } from 'react';
import ImageUploader from 'react-images-upload';
import { Grid, Typography, TextField, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect';
import {useDispatch, useSelector} from "react-redux";
import {SET_CONFIRM_UPDATE_POPUP, SET_FLOOR_IN_UPDATE, SET_FLOORS_IN_UPDATE} from "../../actions/actionTypes";

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
      width: '250px',
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
    width: '250px',
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
      width: !isMobile ? '30%' : '150px',
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
      flexDirection: !isMobile ? 'row' : 'column',
      alignItems: !isMobile ? 'stretch' : 'center',
      marginTop: isMobile ? '20px' : '',
      marginBottom: '-150px'
  },
  dialogLineLabel: {
      paddingTop: '20px'
  },
  pictureUploadContainer: {padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px'}
});

function UpdateLocationFloor (props) {
    const classes = useStyles();
    let handleFormChange = props.handleFormChange;
    //const [updateLocationFloor, setUpdateLocationFloor] = useState(null);
    const dispatch = useDispatch();
    const updateLocationFloorRedux = useSelector(state => state.reservations.updateLocationFloorRedux);
    const updateLocationDeskIDsRedux = useSelector(state => state.reservations.updateLocationDeskIDsRedux);
    const [pictures, setPictures] = useState([]);
    const [isExistingFloorPlanRemoved, setIsExistingFloorPlanRemoved] = useState(false);
    let floors = [...props.floorsRetrieved];

    const handleUpdateLocationFloorChange = (event) => {
        //setUpdateLocationFloor(event.target.value);
        dispatch({type: SET_FLOOR_IN_UPDATE, payload: event.target.value})
        handleFormChange('floors', { level: event.target.value, deskIds: null, photo: null });
    };

    const onDrop = (newPic) => {
        setPictures(pictures[0] = newPic);
    };

    useEffect(() => {
        setTimeout(async () => {
            if (pictures) {
                handleFormChange('floors', { level: updateLocationFloorRedux, deskIds: updateLocationDeskIDsRedux, photo: pictures[0] });
            } else {
                handleFormChange('floors', { level: updateLocationFloorRedux, deskIds: updateLocationDeskIDsRedux, photo: '' });
            }
        }, 500);
    }, [pictures]);

    return (<Grid container justify='center' className={classes.dialogLineContainer}>
        
    <Grid item xs={!isMobile ? 5 : 12}>
        <TextField id="outlined-basic" data-testid='update-location-floor-dropdown' label="Floor #" variant="outlined" select onChange={handleUpdateLocationFloorChange} value={updateLocationFloorRedux} className={classes.inputBoxes}>
            {floors.map((floor) => {
                return <MenuItem key={floor.floor_num} value={floor.floor_num}>
                    {floor.floor_num}
                </MenuItem>
            })}
        </TextField>
    </Grid>
    <Grid item xs={7}>
        <ImageUploader
                buttonStyles={{
                    background: '#00ADEF',
                    borderRadius: 20,
                    color: 'white',
                    height: '50px',
                    width: '250px',
                    padding: '0 30px',
                    marginTop: '10px',
                    marginBottom: '10px',
                    fontFamily: 'Lato',
                    fontWeight: 'bolder',
                    fontSize: 18
                }}
                withIcon={false}
                buttonText='Update Currently Existing Floor Plan'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                withPreview={true}
                withLabel={false}
                singleImage={true}
                fileContainerStyle={{padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px', backgroundColor: '#FFFCF7'}}
            />
    </Grid>
    <Grid item xs={12}>
        <TextField
            id="desks_id"
            label={!isMobile ? "Semicolon-separated desk ID's with capacities (Ex. Single person desk with ID 032: 032-1)" : "DeskID-Capacity;"}
            style={{ margin: 8, height: '250px' }}
            placeholder="01-1;02-4;03-11"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
            onChange={(event) => {handleFormChange('floors', { level: updateLocationFloorRedux, deskIds: event.target.value, photo: null });}}
        />
    </Grid>
    
</Grid>);
}

export default UpdateLocationFloor;

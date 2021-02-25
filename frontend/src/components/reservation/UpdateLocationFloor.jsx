import React, { useState, useEffect } from 'react';
import ImageUploader from 'react-images-upload';
import { Button, List, ListItem, ListItemIcon, Grid, Typography, TextField, MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

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


const floors = [
  {
      value: 1,
      label: '1',
  },
  {
      value: 2,
      label: '2',
  },
  {
      value: 3,
      label: '3',
  },
  {
      value: 4,
      label: '4',
  },
];

function UpdateLocationFloor (props) {
    const classes = useStyles();
    const {updateLocationFloorAddition} = props;
    const [updateLocationFloor, setUpdateLocationFloor] = useState('');
    const [pictures, setPictures] = useState({pictures: []});
    const [isExistingFloorPlanRemoved, setIsExistingFloorPlanRemoved] = useState(false);

    const handleUpdateLocationFloorChange = (event) => {
        setUpdateLocationFloor(event.target.value);
    }

    const onDrop = (newPic) => {
        setPictures({pictures: [...newPic]});
    };

    return (<Grid container justify='center' className={classes.dialogLineContainer}>
    <Grid item xs={2} className={classes.dialogLineLabel}>
        <Typography>
        Floor Number
        </Typography>
    </Grid>
    <Grid item xs={20}>
        <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleUpdateLocationFloorChange} value={updateLocationFloor} className={classes.inputBoxes}>
            {floors.map((floor) => {
                return <MenuItem key={floor.label} value={floor.label}>
                    {floor.label}
                </MenuItem>
            })}
        </TextField>
    </Grid>
    <Grid item xs={20}>
        <ImageUploader
                buttonClassName={classes.attachmentButton}
                withIcon={false}
                buttonText='Update Currently Existing Floor Plan'
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                withPreview={true}
                withLabel={false}
                singleImage={true}
                fileContainerStyle={{padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px'}}
            />
    </Grid>
    <Grid item xs={20}>
        <Button className={isExistingFloorPlanRemoved ? classes.selectedAttachmentButton : classes.attachmentButton} onClick={() => {setIsExistingFloorPlanRemoved(!isExistingFloorPlanRemoved)}}>
            Remove Currently Existing Floor Plan
        </Button>
    </Grid>
    
</Grid>);
}

export default UpdateLocationFloor;

import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, Grid, Typography, TextField, MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import UpdateLocationFloor from './UpdateLocationFloor';

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
      radius: '5px',
      color: 'white',
      height: '50px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 12,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)'
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
  }
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

function UpdateLocationFloorContainer () {
    const classes = useStyles();
    const [updateLocationFloor, setUpdateLocationFloor] = useState('');
    const [updateLocationFloorAddition, setUpdateLocationFloorAddition] = useState([0]);

    const handleUpdateLocationFloorChange = (event) => {
        setUpdateLocationFloor(event.target.value);
    }
    
    const handleUpdateLocationFloorAddition = () => {
        updateLocationFloorAddition.push(0);
        console.log('~~~~~~~~~ ' + updateLocationFloorAddition);
        setUpdateLocationFloorAddition([...updateLocationFloorAddition]);
    }

    return (<div>
        {updateLocationFloorAddition.map(() => <UpdateLocationFloor></UpdateLocationFloor>)}
        <Button className={classes.attachmentButton} onClick={handleUpdateLocationFloorAddition}>
            +
        </Button>
        
    </div>
);
}

export default UpdateLocationFloorContainer;

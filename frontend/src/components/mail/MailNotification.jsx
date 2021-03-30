import React, { useState } from 'react';
import { Typography, Grid, ListItem, Divider, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";


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
    reservationCardTruncated: {
        backgroundColor: '#E5E5E5',
        height: '110px',
        marginBottom: '10px',
        '&:hover': {
          backgroundColor: '#FFFCC7'
        }
    },
    reservationCardExpanded: {
        backgroundColor: '#FFFCF7',
        height: '250px',
        marginBottom: '10px',
        // Need help figuring out the right hover-over colour when expanded; using this colour for now
        '&:hover': {
          backgroundColor: '#FFFCC7'
        }
    },
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '40px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 12,
        margin: 'auto'
    },
    requestActionButton: {
      background: '#00ADFF',
      borderRadius: 20,
      color: 'white',
      height: '40px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 12,
      margin: 'auto'
  }
});


function MailNotification(props) {
    const data = props.data;
    const classes = useStyles();
    const [isExpanded, setIsExpanded] = useState(false);

    const getNotifClass = () => {
        return isExpanded ? classes.reservationCardExpanded : classes.reservationCardTruncated;
    }

    let expandedNotifText;
    let expandedNotifButtons;
    if (isExpanded) {
        expandedNotifText = 
        <div>
            <Typography className={classes.deskSectionText}>LOCATION: <Typography className={classes.deskText}>
            filler location
          </Typography></Typography>
          <Typography className={classes.deskSectionText}>ADDITIONAL COMMENTS: 
            <Typography className={classes.deskText}>
            filler description
            </Typography>
          </Typography>
          <Typography className={classes.deskSectionText}>MAIL ID: <Typography className={classes.deskText}>
            filler id
            </Typography>
          </Typography>
        </div>
        expandedNotifButtons = 
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginRight: 30}}>
            <Button className={classes.actionButton}>Close</Button>
            <Button className={classes.requestActionButton}>Request Assistance</Button>            
        </div>
    }

    let statusText;
    if (true) {
      statusText = 
      <div>
        <Typography className={classes.deskSectionText}>
          STATUS:  <Typography className={classes.deskText}>
            filler status
          </Typography>
        </Typography>
      </div>
    } else {
      <Typography className={classes.deskSectionText}>
          APPROXIMATE ARRIVAL DATE: 
          <Typography className={classes.deskText}>
            filler date
          </Typography>
        </Typography>
    }

    return (
      <ListItem className={getNotifClass()} onClick={() => {setIsExpanded(!isExpanded)}}>
      <div style={{ width: '25%', height: '100px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
          <Typography className={classes.officeText}>
              PARCEL
          </Typography>
      </div>
      <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '90px', width: '3px' }} />
      <div style={{ width: '80%', height: '100px', alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 30 }}>
          <div >
              <Typography className={classes.deskSectionText}>
                  FROM: <Typography className={classes.deskText}>
                      {data}
                  </Typography>
              </Typography>
              {statusText}
              {expandedNotifText}
          </div>
          {expandedNotifButtons}
      </div>
  </ListItem>
    );
}

export default MailNotification;
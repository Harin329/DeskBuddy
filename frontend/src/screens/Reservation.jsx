import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, ListItemText, Grid, Typography, TextField, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SearchIcon from '@material-ui/icons/Search';

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
    },
    sectionText: {
        color: 'white'
    }
});

const offices = [
    {
      value: 'NV-1',
      label: 'North Vancouver HQ',
    },
    {
      value: 'BURN-1',
      label: 'Burnaby',
    },
    {
      value: 'NV-2',
      label: 'North Vanouver Licensing',
    },
  ];

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

function Reservation() {
    const classes = useStyles();
    const [office, setOffice] = useState();
    const [floor, setFloor] = useState();


    const handleOfficeChange = (event) => {
        setOffice(event.target.value);
    };

    const handleFloorChange = (event) => {
        setFloor(event.target.value);
    }

    return (
        <div className={classes.background}>
            <Grid container direction='column' justify='center' alignItems='center' spacing={8}>
                <Grid item xs={4}>
                    <Typography variant="h5" className={classes.sectionText}>
                        RESERVE
                    </Typography>
                </Grid>
                <Grid item xs={12} style={{ backgroundColor: 'red' }}>
                    <Grid container item xs={12} spacing={3} style={{ backgroundColor: 'green' }}>
                        <Typography variant="h5" className={classes.sectionText}>
                            OFFICE
                        </Typography>
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" select onChange={handleOfficeChange} value={office} >
                            {offices.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Typography variant="h5" className={classes.sectionText}>
                            DESK NUMBER
                        </Typography>
                        <TextField id="outlined-basic" label="Outlined" variant="outlined" select onChange={handleFloorChange} value={floor} >
                            {floors.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                </Grid>
                <Grid item xs={4} style={{ backgroundColor: 'red' }}>
                    <Button className={classes.actionButton} onClick={() => {
                        console.log("Loading More!");
                    }}>Floorplan</Button>
                </Grid>
                <Grid item xs={12} style={{ backgroundColor: 'red' }}>
                    <Grid container item xs={12} spacing={3} style={{ backgroundColor: 'green' }}>
                        <Typography variant="h5" className={classes.sectionText}>
                            FROM
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" />
                        <Typography variant="h5" className={classes.sectionText}>
                            TO
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" />
                        <ListItem button>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                        </ListItem>
                    </Grid>
                </Grid>
                <Grid item xs={4} style={{ backgroundColor: 'blue' }}>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem button>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="NV1 Desk 2" />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <DraftsIcon />
                            </ListItemIcon>
                            <ListItemText primary="NV1 Desk 40" />
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={4} style={{ backgroundColor: 'blue' }}>
                    <Button className={classes.actionButton} onClick={() => {
                        console.log("Loading More!");
                    }}>Load More</Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default Reservation;
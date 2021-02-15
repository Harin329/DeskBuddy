import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, ListItemText, Grid, Typography, TextField, MenuItem, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SearchIcon from '@material-ui/icons/Search';
import Search from '../assets/search.png';

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
            <Grid container direction='column' justify='center' alignItems='center'>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={3} className={classes.titleLines} />
                    <Grid item xs={1}>
                        <Typography className={classes.titleText}>
                            RESERVE
                    </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.titleLines} />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            OFFICE
                        </Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
                            {offices.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            DESK NUMBER
                        </Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleFloorChange} value={floor} className={classes.inputBoxes}>
                            {floors.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={1} />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={7}>
                        <Button className={classes.actionButton} onClick={() => {
                            console.log("Loading More!");
                        }}>Floorplan</Button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='flex-end' className={classes.sectionSpacing}>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            FROM
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            TO
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} />
                    </Grid>
                    <Grid item xs={1}>
                        <button onClick={() => { console.log('search') }} style={{ backgroundColor: 'transparent', border: 'none' }}><img src={Search} alt="Search" style={{ height: '50px' }} /></button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={7}>
                        <List>
                            {offices.map((option) => (
                                <ListItem style={{ backgroundColor: '#E5E5E5', height: '150px' }}>
                                    <ListItemIcon>
                                        <InboxIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={option.label} />
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Button className={classes.actionButton} onClick={() => {
                        console.log("Loading More!");
                    }}>Load More</Button>
                </Grid>
            </Grid>
        </div>
    );
}

export default Reservation;
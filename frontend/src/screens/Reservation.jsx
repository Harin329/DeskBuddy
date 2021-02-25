import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, Grid, Typography, TextField, MenuItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InboxIcon from '@material-ui/icons/Inbox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import UpdateLocationFloorContainer from '../components/reservation/UpdateLocationFloorContainer';
import Search from '../assets/search.png';
import Endpoint from '../config/Constants'
import { light } from '@material-ui/core/styles/createPalette';

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

function Reservation() {
    const classes = useStyles();
    const [officeList, setOfficeList] = useState([]);
    const [office, setOffice] = useState();
    const [deskList, setDeskList] = useState([]);
    const [desk, setDesk] = useState();
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [deskResults, setDeskResults] = useState([]);
    const [isUpdateLocationClosed, setIsUpdateLocationClosed] = useState(false);
    const [updateLocationFloor, setUpdateLocationFloor] = useState('');
    const [updateLocationFloorAddition, setUpdateLocationFloorAddition] = useState([0]);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(Endpoint + "/office/getAllOffices", requestOptions)
            .then((response) => response.text())
            .then(result => {
                setOfficeList(JSON.parse(result));
                // console.log(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    }, []);


    const handleOfficeChange = (event) => {
        setOffice(event.target.value);

        const params = event.target.value.split(['-']);

        console.log(params[0])
        console.log(params[1])

        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
          };
          
          fetch(Endpoint + "/desk/getDesksByOffice/" + params[0] + "/" + params[1], requestOptions)
            .then((response) => response.text())
            .then(result => {
                setDeskList(JSON.parse(result));
                // console.log(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    };

    const handleDeskChange = (event) => {
        setDesk(event.target.value);
    }

    const handleFromChange = (event) => {
        setFrom(event.target.value);
    }

    const handleToChange = (event) => {
        setTo(event.target.value);
    }

    //TODO: remove enclosing function

    const handleUpdateLocationClosed = () => {
        setIsUpdateLocationClosed(true);
    }

    const handleUpdateLocationClose = () => {
        setIsUpdateLocationClosed(false);
    }

    const handleUpdateLocationFloorChange = (event) => {
        setUpdateLocationFloor(event.target.value);
    }

    // const handleUpdateLocationFloorAddition = () => {
    //     updateLocationFloorAddition.push(1);
    //     console.log('~~~~~~~~~ ' + updateLocationFloorAddition);
    //     let newArray = updateLocationFloorAddition
    //     setUpdateLocationFloorAddition(newArray);
    // }

    const search = () => {
        console.log(office);
        console.log(desk)
        console.log(from);
        console.log(to);
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
                            {officeList.map((option) => (
                                <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                                    {option.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            DESK NUMBER
                        </Typography>
                        <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleDeskChange} value={desk} className={classes.inputBoxes}>
                            {deskList.map((option) => (
                                <MenuItem key={option.fk_floor_num + "-" + option.desk_id} value={option.fk_floor_num + "-" + option.desk_id}>
                                    {option.fk_floor_num + "-" + option.desk_id}
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
                        }}>Floorplan
                        </Button>
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
                    </Grid>
                    <Grid item xs={7}>
                        <Button className={classes.actionButton} onClick={handleUpdateLocationClosed}>Update Location</Button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='flex-end' className={classes.sectionSpacing}>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            FROM
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleFromChange} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            TO
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleToChange} />
                    </Grid>
                    <Grid item xs={1}>
                        <button onClick={search} style={{ backgroundColor: 'transparent', border: 'none' }}><img src={Search} alt="Search" style={{ height: '50px' }} /></button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={7}>
                        <List>
                            {deskResults.map((option) => (
                                <ListItem style={{ backgroundColor: '#E5E5E5', height: '150px', marginBottom: '10px' }}>
                                    <div style={{ width: '25%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <ListItemIcon style={{ width: '100px', height: '100px', backgroundColor: 'green', alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                                            <InboxIcon />
                                        </ListItemIcon>
                                        <Typography className={classes.officeText}>
                                            North Vancouver HQ
                                    </Typography>
                                    </div>
                                    <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '129px', width: '3px' }} />
                                    <div style={{ width: '55%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '40%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                            <Typography className={classes.deskSectionText}>
                                                FLOOR: <Typography className={classes.deskText}>
                                                    1
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                TYPE: <Typography className={classes.deskText}>
                                                    Desk
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                CAPACITY: <Typography className={classes.deskText}>
                                                    1
                                                </Typography>
                                            </Typography>
                                        </div>
                                        <div style={{ width: '40%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                            <Typography className={classes.deskSectionText}>
                                                ADDRESS: <Typography className={classes.deskText}>
                                                    North Vancouver HQ
                                                </Typography>
                                            </Typography>
                                        </div>
                                    </div>
                                    <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '129px', width: '3px' }} />
                                    <div style={{ width: '20%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <Button className={classes.reserveButton} onClick={() => {
                                            console.log("Loading More!");
                                        }}>Reserve Now</Button>
                                    </div>
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
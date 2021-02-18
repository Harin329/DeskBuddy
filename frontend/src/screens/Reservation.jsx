import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, Grid, Typography, TextField, MenuItem, Divider, Modal, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import CancelIcon from '@material-ui/icons/Cancel';
import Search from '../assets/search.png';
import Endpoint from '../config/Constants'

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
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
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
    confirmationModalText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    deskText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        display: 'inline'
    },
    paper: {
        position: 'fixed',
        top: '30%',
        left: '35%',
        width: '20%',
        height: '30%',
        backgroundColor: 'white',
        padding: '30px',
    },
});

function Reservation() {
    const date = new Date();
    const formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());

    const classes = useStyles();
    const [officeList, setOfficeList] = useState([]);
    const [office, setOffice] = useState('All');
    const [deskList, setDeskList] = useState([]);
    const [desk, setDesk] = useState('All');
    const [from, setFrom] = useState(formattedDate);
    const [to, setTo] = useState(formattedDate);
    const [deskResults, setDeskResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [employeeCount, setEmployeeCount] = useState(0);

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

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

        search();

    }, []);


    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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

    const search = () => {

        var deskParam = ['0', '0']
        var officeParam = ['0', '0']

        if (desk.includes('-')) {
            deskParam = desk.split(['-']);
        }
        if (office.includes('-')) {
            officeParam = office.split(['-']);
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "desk_id": String(deskParam[1]), "floor_num": Number(deskParam[0]), "office_id": Number(officeParam[1]), "office_location": String(officeParam[0]), "start_date": from, "end_date": to });

        console.log(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(Endpoint + "/desk/getOpenDesks", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result)
                console.log(res)
                setDeskResults(res)
            })
            .catch(error => console.log('error', error));
    }

    // TODO GET EMPLOYEE ID
    const makeReservation = (deskObj) => {
        var day = new Date(from)
        var toDay = new Date(to)
        while (day <= toDay) {
            const newDay = day.setDate(day.getDate() + 1);
            day = new Date(newDay)

            const thisDate = day.getFullYear() + "-" + appendLeadingZeroes(day.getMonth() + 1) + "-" + appendLeadingZeroes(day.getDate());
            console.log(thisDate);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "employee_id": 329, "desk_id": String(deskObj.desk_id), "floor_num": Number(deskObj.fk_floor_num), "office_id": Number(deskObj.fk_office_id), "office_location": String(deskObj.fk_office_location), "date": thisDate});

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .catch(error => console.log('error', error));
        }
        handleClose();
        search();
    }

    const getEmployeeCount = (deskObj) => {
        console.log(from);
        console.log(to);
        //var startDate = new Date(from);
        //var endDate = new Date(to);
        //console.log(startDate);
        //console.log(endDate);
        if (to >= from) {
            //const startFullDate = startDate.getFullYear() + "-" + appendLeadingZeroes(startDate.getMonth() + 1) + "-" + appendLeadingZeroes(startDate.getDay());
            //const endFullDate = endDate.getFullYear() + "-" + appendLeadingZeroes(endDate.getMonth() + 1) + "-" + appendLeadingZeroes(endDate.getDay());
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation/getCount/" + deskObj.office_id + "/" + from + "/" + to, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result)
                    console.log(res[0].avg)
                    setEmployeeCount(res[0].avg)
                    if (res[0].avg == null) {
                        setEmployeeCount(0);
                    }
                }).catch(error => console.log('error', error));
        }
        else setEmployeeCount(0); // just a placeholder else statement to account for to being earlier than from date
    };


    const confirmationBody = (option) => {
        return (
            <div className={classes.paper}>
                <div style={{ width: '105%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex' }}>
                    <IconButton size='small' onClick={handleClose}>
                        <CancelIcon size="small" />
                    </IconButton>
                </div>
                <Typography className={classes.sectionTextModal}>
                    {from} TO {to} RESERVATION
                        </Typography>
                <div style={{ width: '100%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography className={classes.deskSectionText}>
                        Office: <Typography className={classes.deskText}>
                            {option.name}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Floor Number: <Typography className={classes.deskText}> {option.fk_floor_num}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Desk Number: <Typography className={classes.deskText}> {option.desk_id}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Estimated Number of People: <Typography className={classes.deskText}>
                        {employeeCount}
                                                </Typography>
                    </Typography>
                </div>
                <Typography className={classes.confirmationModalText}>
                    Do you want to confirm this reservation?
                                            </Typography>
                <div style={{ width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                    <Button className={classes.reserveButton} onClick={() => {
                        makeReservation(option);
                    }}>Confirm</Button>
                </div>
            </div>)
    };

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
                        }}>Floorplan</Button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='flex-end' className={classes.sectionSpacing}>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            FROM
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleFromChange} defaultValue={formattedDate} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            TO
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleToChange} defaultValue={formattedDate} />
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
                                        <ListItemIcon style={{ width: '100px', height: '100px', backgroundColor: '#00ADEF', alignItems: 'center', justifyContent: 'center', borderRadius: 100 }}>
                                            <DesktopMacIcon />
                                        </ListItemIcon>
                                        <Typography className={classes.officeText}>
                                            {option.fk_office_location + option.fk_office_id + "-" + option.fk_floor_num + option.desk_id}
                                        </Typography>
                                    </div>
                                    <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '129px', width: '3px' }} />
                                    <div style={{ width: '55%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '40%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                            <Typography className={classes.deskSectionText}>
                                                FLOOR: <Typography className={classes.deskText}>
                                                    {option.fk_floor_num}
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                TYPE: <Typography className={classes.deskText}>
                                                    Desk
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                CAPACITY: <Typography className={classes.deskText}>
                                                    {option.capacity}
                                                </Typography>
                                            </Typography>
                                        </div>
                                        <div style={{ width: '40%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                            <Typography className={classes.deskSectionText}>
                                                ADDRESS: <Typography className={classes.deskText}>
                                                    {option.address}
                                                </Typography>
                                            </Typography>
                                        </div>
                                    </div>
                                    <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '129px', width: '3px' }} />
                                    <div style={{ width: '20%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <Button className={classes.reserveButton} onClick={() => {getEmployeeCount(option); handleOpen();}}>Reserve Now</Button>
                                    </div>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        {confirmationBody(option)}
                                    </Modal>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
                {/* <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Button className={classes.actionButton} onClick={() => {
                        console.log("Loading More!");
                    }}>Load More</Button>
                </Grid> */}
            </Grid>
        </div>
    );
}

export default Reservation;
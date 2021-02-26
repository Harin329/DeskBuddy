import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Grid, Typography, TextField, MenuItem, Divider, Modal, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from 'react-redux'
import { fetchReservations } from '../actions/reservationActions';
import UpdateLocationPopup from './UpdateLocationPopup';
import CancelIcon from '@material-ui/icons/Cancel';
import Search from '../assets/search.png';
import Endpoint from '../config/Constants';
import BookingsCalendar from '../components/reservation/BookingsCalendar';
import MapPopup from './map-popup/index';
import AddLocationForm from '../components/reservation/AddLocationForm';
import Title from '../components/global/Title';
import Subheader from '../components/reservation/Subheader';
import UpcomingReservations from '../components/reservation/UpcomingReservations';

const useStyles = makeStyles((theme) => ({
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
    actionButtonCenter: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
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
        marginBottom: '29px',
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
    FloorText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 18,
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
        height: 'auto',
        backgroundColor: 'white',
        padding: '30px',
    },
    floorplan: {
        position: 'fixed',
        top: '20%',
        left: '30%',
        width: '40%',
        height: '50%',
        backgroundColor: 'white',
        padding: '30px',
    },
}));

function Reservation() {
    const date = new Date();
    const formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());

    const resultOnPage = 25;

    const classes = useStyles();
    const [officeList, setOfficeList] = useState([]);
    const [office, setOffice] = useState('All');
    const [deskList, setDeskList] = useState([]);
    const [desk, setDesk] = useState('All');
    const [from, setFrom] = useState(formattedDate);
    const [to, setTo] = useState(formattedDate);
    const [deskResults, setDeskResults] = useState([]);
    const [isUpdateLocationClosed, setIsUpdateLocationClosed] = useState(false);
    const [open, setOpen] = useState(false);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [floorplan, setFloorplan] = useState(false);
    const [addLocation, setAddLocation] = useState(false);
    const [officeDisabled, setOfficeDisabled] = useState(true);
    const [confirmationDesk, setConfirmationDesk] = useState();
    const [page, setPage] = useState(0);
    const [more, setMore] = useState(true);

    const dispatch = useDispatch()

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

        search(false, 0);

    }, []);

    const handleOpen = (option) => {
        setConfirmationDesk(option);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleFloorplanOpen = () => {
        setFloorplan(true);
    };

    const handleAddLocationOpen = () => {
        setAddLocation(true);
    }

    const handleFloorplanClose = () => {
        setFloorplan(false);
    };

    const handleAddLocationClose = () => {
        setAddLocation(false)
    }

    const addLocationBody = () => {
        return <AddLocationForm closeModal={handleAddLocationClose} />
    }

    const handleOfficeChange = (event) => {

        setOffice(event.target.value);

        if (event.target.value !== 'All') {
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

            fetch(Endpoint + "/floor/getFloorsByOffice/" + params[0] + "/" + params[1], requestOptions)
                .then((response) => response.text())
                .then(result => {
                    const res = JSON.parse(result)
                    // console.log(res);
                    if (res.length > 0) {
                        setOfficeDisabled(false);
                    } else {
                        setOfficeDisabled(true);
                    }
                })
                .catch(error => console.log('error', error));
        } else {
            setOfficeDisabled(true);
            setDeskList([]);
        }
    };

    const handleDeskChange = (event) => {
        setDesk(event.target.value);
    }

    const handleFromChange = (event) => {
        setFrom(event.target.value);

        const day = new Date(event.target.value)
        const toDay = new Date(to)
        if (day > toDay) {
            setTo(event.target.value)
        }
    }

    const handleToChange = (event) => {
        setTo(event.target.value);

        const day = new Date(from)
        const toDay = new Date(event.target.value)
        if (day > toDay) {
            setFrom(event.target.value)
        }
    }

    const search = (append, pageStart) => {
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

        var raw = JSON.stringify({
            "desk_id": String(deskParam[1]),
            "floor_num": Number(deskParam[0]),
            "office_id": Number(officeParam[1]),
            "office_location": String(officeParam[0]),
            "start_date": from,
            "end_date": to,
            "startIndex": pageStart,
            "numOnPage": resultOnPage
        });

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
                if (deskResults.length === 0 || !append) {
                    setDeskResults(res);
                } else {
                    if (res[0] !== undefined) {
                        setDeskResults((prev) => [...prev, ...res])
                    }
                }
                setMore(((deskResults.length + res.length) % resultOnPage === 0 && res[0] !== undefined) || !append)
                setPage(pageStart + resultOnPage);
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

            var raw = JSON.stringify({ "employee_id": 329, "desk_id": String(deskObj.desk_id), "floor_num": Number(deskObj.fk_floor_num), "office_id": Number(deskObj.fk_office_id), "office_location": String(deskObj.fk_office_location), "date": thisDate });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .then(() => {
                    dispatch(fetchReservations())
                })
                .catch(error => console.log('error', error));
        }
        handleClose();
        // Replace this with promises followed by then one day... :)
        setTimeout(() => search(false, 0), 3000);
    }

    const handleUpdateLocationClosed = () => {
        setIsUpdateLocationClosed(true);
    }

    const getEmployeeCount = (deskObj) => {
        console.log(from);
        console.log(to);
        //var startDate = new Date(from);
        //var endDate = new Date(to);
        //console.log(startDate);
        //console.log(endDate);
        if (to >= from) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation/getCount/" + deskObj.office_id + "/" + from + "/" + to, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result)
                    //console.log(res[0].avg)
                    setEmployeeCount(Math.ceil(res[0].avg))
                    if (res[0].avg == null) {
                        setEmployeeCount(0);
                    }
                }).catch(error => console.log('error', error));
        }
        else setEmployeeCount(0); // just a placeholder else statement to account for to being earlier than from date
    };

    const confirmationBody = () => {
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
                            {confirmationDesk.name}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Floor Number: <Typography className={classes.deskText}> {confirmationDesk.fk_floor_num}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Desk Number: <Typography className={classes.deskText}> {confirmationDesk.desk_id}
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
                        makeReservation(confirmationDesk);
                    }}>Confirm</Button>
                </div>
            </div>)
    };


    return (
        <div className={classes.background}>
            <Grid container direction='column' justify='center' alignItems='center'>
                {Title('RESERVATION')}

                {window.innerWidth > 1500 && <Grid container>
                    <Grid item xs={2} />
                    <Grid item xs={3} >
                        <BookingsCalendar />
                    </Grid>
                    <Grid item xs={5}>
                        {Subheader('UPCOMING RESERVATIONS', 3, 6, 3)}
                        {UpcomingReservations()}
                    </Grid>
                    <Grid item xs={2} />
                </Grid>}

                {window.innerWidth <= 1500 && <Grid container justify='center'>
                    <Grid item xs={11} >
                        <BookingsCalendar />
                    </Grid>
                </Grid>}
                {window.innerWidth <= 1500 && <Grid container>
                    <Grid item xs={2}/>
                    <Grid item xs={5}>
                        {Subheader('UPCOMING RESERVATIONS', 0, 12, 0)}
                        {UpcomingReservations()}
                    </Grid>
                    <Grid item xs={2}/>
                </Grid>}


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
                            <MenuItem key={'All'} value={'All'}>
                                All
                                </MenuItem>
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
                            <MenuItem key={'All'} value={'All'}>
                                All
                                </MenuItem>
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

                    <UpdateLocationPopup isOpen={isUpdateLocationClosed} whatToDoWhenClosed={(bool) => { setIsUpdateLocationClosed(bool) }}></UpdateLocationPopup>

                    <Grid item xs={3}>
                        <Button className={classes.actionButton} onClick={handleUpdateLocationClosed}>Update Location</Button>
                        <Grid item xs={8}>
                            <Button className={classes.actionButton} onClick={handleAddLocationOpen}>Add Location</Button>
                            <Modal
                                open={addLocation}
                                onClose={handleAddLocationClose}
                            >
                                {addLocationBody()}
                            </Modal>
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        <Button className={classes.actionButton} onClick={handleFloorplanOpen} disabled={officeDisabled}>Floorplan</Button>
                        <Modal
                            open={floorplan}
                            onClose={handleFloorplanClose}
                        >
                            <MapPopup
                                locationID={office}
                                closeHandler={handleFloorplanClose}
                                officeName={officeList.find((item) => (item.office_location + "-" + item.office_id) === office)}
                            />
                            {/* {floorplanBody()} */}
                        </Modal>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='flex-end' className={classes.sectionSpacing}>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            FROM
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleFromChange} value={from} defaultValue={from} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            TO
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleToChange} value={to} defaultValue={to} />
                    </Grid>
                    <Grid item xs={1}>
                        <button onClick={() => {
                            search(false, 0);
                        }} style={{ backgroundColor: 'transparent', border: 'none' }}><img src={Search} alt="Search" style={{ height: '50px' }} /></button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={7}>
                        <List>
                            {deskResults.map((option) => (
                                <ListItem style={{ backgroundColor: '#E5E5E5', height: '150px', marginBottom: '10px' }}>
                                    <div style={{ width: '25%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <img src={'data:image/png;base64,' + new Buffer(option.office_photo, 'binary').toString('base64')} alt="OfficePicture" style={{ height: '100px', width: '100px', borderRadius: 100 }} />
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
                                        <Button className={classes.reserveButton} onClick={() => {
                                            getEmployeeCount(option);
                                            handleOpen(option)
                                        }}>Reserve Now</Button>
                                    </div>
                                </ListItem>
                            ))}
                            <Modal
                                open={open}
                                onClose={handleClose}>
                                {confirmationDesk !== undefined ? confirmationBody() : null}
                            </Modal>
                            <div style={{ justifyContent: 'center', display: 'flex', marginTop: '50px' }}>
                                {deskResults.length <= 0 && <Typography className={classes.sectionText}>No Results Found</Typography>}
                            </div>
                        </List>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    {deskResults.length > 0 && more && <Button className={classes.actionButton} onClick={() => {
                        search(true, page);
                    }}>Load More</Button>}
                </Grid>
            </Grid>
        </div>
    );
}

export default Reservation;
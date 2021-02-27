import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Grid, Typography, TextField, MenuItem, Divider, Modal, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from 'react-redux'
import { fetchDesks, fetchReservations } from '../actions/reservationActions';
import CancelIcon from '@material-ui/icons/Cancel';
import Endpoint from '../config/Constants';
import BookingsCalendar from '../components/reservation/BookingsCalendar';

import Title from '../components/global/Title';
import Subheader from '../components/reservation/Subheader';
import UpcomingReservations from '../components/reservation/UpcomingReservations';
import DeskFilter from '../components/reservation/DeskFilter';

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
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [confirmationDesk, setConfirmationDesk] = useState();

    const dispatch = useDispatch()
    const filter = useSelector(state => state.searchFilter);
    const deskResults = useSelector(state => state.deskResults);
    const more = useSelector(state => state.hasMore);

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

    useEffect(() => {
        dispatch(fetchDesks(filter, false, 0, deskResults));
    }, []);

    const handleOpen = (option) => {
        setConfirmationDesk(option);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // TODO GET EMPLOYEE ID
    const makeReservation = (deskObj) => {
        var day = new Date(filter.from)
        var toDay = new Date(filter.to)
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
        // setTimeout(() => search(false, 0), 3000);
    }

    const getEmployeeCount = (deskObj) => {
        if (filter.to >= filter.from) {
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation/getCount/" + deskObj.office_id + "/" + filter.from + "/" + filter.to, requestOptions)
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
                    {filter.from} TO {filter.to} RESERVATION
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
                    <Grid item xs={2} />
                    <Grid item xs={5}>
                        {Subheader('UPCOMING RESERVATIONS', 0, 12, 0)}
                        {UpcomingReservations()}
                    </Grid>
                    <Grid item xs={2} />
                </Grid>}

                {Subheader('RESERVE', 3, 2, 3)}

                {DeskFilter()}

                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={8}>
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
                        // search(true, page);
                    }}>Load More</Button>}
                </Grid>
            </Grid>
        </div>
    );
}

export default Reservation;
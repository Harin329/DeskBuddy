import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Grid, Typography, Divider, Modal, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from 'react-redux'
import { fetchDesks, makeReservation, getEmployeeCount } from '../actions/reservationActions';
import CancelIcon from '@material-ui/icons/Cancel';
import BookingsCalendar from '../components/reservation/BookingsCalendar';
import { useMsal } from "@azure/msal-react";

import Title from '../components/global/Title';
import Subheader from '../components/reservation/Subheader';
import UpcomingReservations from '../components/reservation/UpcomingReservations';
import DeskFilter from '../components/reservation/DeskFilter';
import { SET_EMPLOYEE_COUNT } from '../actions/actionTypes';

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
    sectionSpacing: {
        marginBottom: '29px',
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
        left: isMobile ? '3%' : '35%',
        width: isMobile ? '80%' : '20%',
        height: 'auto',
        backgroundColor: 'white',
        padding: '30px',
    },
    reservationCard: { backgroundColor: '#E5E5E5', height: '150px', marginBottom: '10px' },
    reservationCardMobile: { backgroundColor: '#E5E5E5', height: '350px', marginBottom: '10px', flexDirection: 'column' }
}));

function Reservation() {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [confirmationDesk, setConfirmationDesk] = useState();

    const dispatch = useDispatch()
    const filter = useSelector(state => state.reservations.searchFilter);
    const deskResults = useSelector(state => state.reservations.deskResults);
    const more = useSelector(state => state.reservations.hasMore);
    const page = useSelector(state => state.reservations.pageCount);
    const employeeCount = useSelector(state => state.reservations.deskEmployeeCount);

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

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

    const reserve = (deskObj) => {
        dispatch(makeReservation(userOID, deskObj, filter))
        handleClose();
        // Replace this with promises followed by then one day... :)
        setTimeout(() => dispatch(fetchDesks(filter, false, 0, deskResults)), 3000);
    }

    const count = (deskObj) => {
        if (filter.to >= filter.from) {
            dispatch(getEmployeeCount(deskObj, filter));
        } else {
            dispatch({ type: SET_EMPLOYEE_COUNT, payload: 0 }) // just a placeholder else statement to account for to being earlier than from date
        }
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
                        reserve(confirmationDesk);
                    }}>Confirm</Button>
                </div>
            </div>)
    };

    return (
        <div className={classes.background}>
            <Grid container direction='column' justify='center' alignItems='center'>
                {Title('RESERVATION', 2, 8, 2)}

                {window.innerWidth > 1500 && <Grid container>
                    <Grid item xs={2} />
                    <Grid item xs={3} >
                        {BookingsCalendar(userOID)}
                    </Grid>
                    <Grid item xs={5}>
                        {Subheader('UPCOMING RESERVATIONS', 3, 6, 3)}
                        {UpcomingReservations()}
                    </Grid>
                    <Grid item xs={2} />
                </Grid>}
                {window.innerWidth <= 1500 && <Grid container justify='center'>
                    <Grid item xs={11} >
                        {BookingsCalendar(userOID)}
                    </Grid>
                </Grid>}
                {window.innerWidth <= 1500 && <Grid container>
                    <Grid item xs={1} />
                    <Grid item xs={10} style={{ marginTop: 20 }}>
                        {Subheader('UPCOMING RESERVATIONS', 0, 12, 0)}
                        {UpcomingReservations()}
                    </Grid>
                    <Grid item xs={1} />
                </Grid>}

                {window.innerWidth > 1500 && Subheader('RESERVE', 3, 2, 3)}
                {window.innerWidth <= 1500 && Subheader('RESERVE', 0, 12, 0)}

                {DeskFilter()}

                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={isMobile ? 10 : 8}>
                        <List>
                            {deskResults.map((option) => {
                                if (!isMobile) {
                                    return (
                                        <ListItem className={classes.reservationCard}>
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
                                                    count(option);
                                                    handleOpen(option)
                                                }}>Reserve Now</Button>
                                            </div>
                                        </ListItem>
                                    )
                                } else {
                                    return (
                                        <ListItem className={classes.reservationCardMobile}>
                                            <div style={{ width: isMobile ? '100%' : '25%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                                <img src={'data:image/png;base64,' + new Buffer(option.office_photo, 'binary').toString('base64')} alt="OfficePicture" style={{ height: '100px', width: '100px', borderRadius: 100 }} />
                                                <Typography className={classes.officeText}>
                                                    {option.fk_office_location + option.fk_office_id + "-" + option.fk_floor_num + option.desk_id}
                                                </Typography>
                                            </div>
                                            <div style={{ width: isMobile ? '100%' : '55%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
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
                                            <div style={{ width: isMobile ? '100%' : '20%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                                <Button className={classes.reserveButton} onClick={() => {
                                                    count(option);
                                                    handleOpen(option)
                                                }}>Reserve Now</Button>
                                            </div>
                                        </ListItem>

                                    )
                                }
                            })}
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
                        dispatch(fetchDesks(filter, true, page, deskResults));
                    }}>Load More</Button>}
                </Grid>
            </Grid>
        </div>
    );
}

export default Reservation;
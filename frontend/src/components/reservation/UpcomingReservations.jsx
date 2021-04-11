import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, Grid, Typography, Divider, Modal, IconButton } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { fetchReservations, cancelReservations, getEmployeeCountUpcomingRes } from '../../actions/reservationActions'
import { SET_EMPLOYEE_COUNT } from "../../actions/actionTypes";
import { makeStyles } from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import { isMobile } from 'react-device-detect';
import { useMsal } from "@azure/msal-react";


const useStyles = makeStyles((theme) => ({
    cancelButton: {
        background: '#ba0000',
        borderRadius: 30,
        color: 'white',
        height: '30px',
        padding: '0 15px',
        marginTop: '5px',
        marginBottom: '5px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    sectionSpacing: {
        marginBottom: '29px',
    },
    dateText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 20,
        fontWeight: 'bold',
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
    upcomingResBox: {
        backgroundColor: '#E5E5E5',
        height: '80px',
        marginBottom: '10px',
        borderRadius: '10px'
    },
    upcomingResBoxMobile: {
        backgroundColor: '#E5E5E5',
        height: '200px',
        marginBottom: '10px',
        borderRadius: '10px',
        flexDirection: 'column'
    },
    upcomingResBoxDate: {
        width: '25%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    upcomingResBoxOffice: {
        width: '60%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'left',
        display: 'flex',
        flexDirection: 'row'
    },
    upcomingResBoxOfficeMobile: {
        width: '90%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'left',
        display: 'flex',
        flexDirection: 'row'
    },
    upcomingResBoxCancel: {
        width: '30%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    upcomingResBoxCenterSection: {
        padding: '7px',
        height: '80px',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
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
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
    },
    confirmationModalText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
}));


function UpcomingReservations() {
    const classes = useStyles();
    const [reservationToCancel, setReservationToCancel] = useState();
    const [openCancelRes, setOpenCancelRes] = useState(false);

    const dispatch = useDispatch();
    const filter = useSelector(state => state.reservations.searchFilter);
    const upcomingReservation = useSelector(state => state.reservations.upcomingReservations);
    const employeeCountUpcomingRes = useSelector(state => state.reservations.deskEmployeeCount);

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

    useEffect(() => {
        dispatch(fetchReservations(userOID));
        console.log(upcomingReservation);
    }, []);

    const cancelReservation = (reservation) => {
        const rawBody = JSON.stringify({ "reservation_id": Number(reservation.reservation_id) });
        dispatch(cancelReservations(userOID, rawBody, filter));
        handleCloseUpcomingRes();
    }

    // Converts MySQL date format to day and month
    const convertStartDate = (sqlStartDate) => {
        const date = new Date(sqlStartDate + "T00:00:00-07:00");
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        return (day + " " + month);
    };

    const handleOpenUpcomingRes = (option) => {
        setReservationToCancel(option);
        setOpenCancelRes(true);
    };

    const handleCloseUpcomingRes = () => {
        dispatch({ type: SET_EMPLOYEE_COUNT, payload: "" })
        setOpenCancelRes(false);
    };

    const confirmCancelResBody = () => {
        return (
            <div className={classes.paper}>
                <div style={{ width: '105%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex' }}>
                    <IconButton size='small' onClick={handleCloseUpcomingRes}>
                        <CancelIcon size="small" />
                    </IconButton>
                </div>
                <Typography className={classes.sectionTextModal}>
                    {reservationToCancel.start_date.split("T")[0]} RESERVATION
                </Typography>
                <div style={{
                    width: '100%',
                    height: '140px',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography className={classes.deskSectionText}>
                        Office: <Typography className={classes.deskText}>
                            {reservationToCancel.name}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Floor Number: <Typography className={classes.deskText}> {reservationToCancel.fk_floor_num}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Desk Number: <Typography className={classes.deskText}> {reservationToCancel.fk_desk_id}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Estimated Number of People: <Typography className={classes.deskText}>
                            {employeeCountUpcomingRes}
                        </Typography>
                    </Typography>
                </div>
                <Typography className={classes.confirmationModalText}>
                    Are you sure you want to cancel this reservation?
                </Typography>
                <div style={{ width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                    <Button className={classes.cancelButton} onClick={() => {
                        cancelReservation(reservationToCancel);
                    }}>CANCEL</Button>
                </div>
            </div>)
    };

    return (
        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            <Grid item xs={12}>
                <List>
                    {/* {Show most recent 3} */}
                    {upcomingReservation.slice(0,3).map((option) => {
                        if (!isMobile) {
                            return (
                                <ListItem className={classes.upcomingResBox}>
                                    <div className={classes.upcomingResBoxDate}>
                                        <Typography className={classes.dateText}>
                                            {convertStartDate(option.start_date)}
                                        </Typography>
                                    </div>
                                    <Divider orientation='vertical'
                                        style={{ backgroundColor: 'black', height: '80px', width: '1px' }} />
                                    <div className={classes.upcomingResBoxOffice}>
                                        <div className={classes.upcomingResBoxCenterSection}>
                                            <Typography className={classes.deskSectionText}>
                                                OFFICE: <Typography className={classes.deskText}>
                                                    {option.name}
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                DESK ID: <Typography className={classes.deskText}>
                                                    {option.fk_office_location + option.fk_office_id + ": " + option.fk_floor_num + "-" + option.fk_desk_id}
                                                </Typography>
                                            </Typography>
                                        </div>
                                    </div>
                                    <Divider orientation='vertical'
                                        style={{ backgroundColor: 'black', height: '80px', width: '1px' }} />
                                    <div className={classes.upcomingResBoxCancel}>
                                        <Button className={classes.cancelButton} onClick={() => {
                                            dispatch(getEmployeeCountUpcomingRes(option));
                                            handleOpenUpcomingRes(option)
                                        }}>Cancel</Button>
                                    </div>
                                </ListItem>
                            )
                        } else {
                            return (
                                <ListItem className={classes.upcomingResBoxMobile}>
                                    <div className={classes.upcomingResBoxDate}>
                                        <Typography className={classes.dateText}>
                                            {convertStartDate(option.start_date)}
                                        </Typography>
                                    </div>
                                    <div className={classes.upcomingResBoxOfficeMobile}>
                                        <div className={classes.upcomingResBoxCenterSection}>
                                            <Typography className={classes.deskSectionText}>
                                                OFFICE: <Typography className={classes.deskText}>
                                                    {option.name}
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                DESK ID: <Typography className={classes.deskText}>
                                                {option.fk_office_location + option.fk_office_id + ": " + option.fk_floor_num + "-" + option.fk_desk_id}
                                                </Typography>
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className={classes.upcomingResBoxCancel}>
                                        <Button className={classes.cancelButton} onClick={() => {
                                            dispatch(getEmployeeCountUpcomingRes(option));
                                            handleOpenUpcomingRes(option)
                                        }}>Cancel</Button>
                                    </div>
                                </ListItem>
                            )
                        }
                    })}
                    <Modal
                        open={openCancelRes}
                        onClose={handleCloseUpcomingRes}>
                        {reservationToCancel !== undefined ? confirmCancelResBody() : null}
                    </Modal>
                </List>
            </Grid>
        </Grid>

    );
}

export default UpcomingReservations;
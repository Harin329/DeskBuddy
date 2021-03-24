import React, { useState, useEffect } from 'react';
import "./BookingsCalendar.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import { Modal, IconButton } from '@material-ui/core';
import Endpoint from '../../config/Constants';
import { makeStyles } from '@material-ui/core/styles';
import safeFetch from "../../util/Util";
import { isMobile } from 'react-device-detect';
import SpecificReservations from './SpecificReservations';
import CancelIcon from '@material-ui/icons/Cancel';

const bookedDays = [];
const today = new Date();
const maxDate = new Date(today.setMonth(today.getMonth() + 6));
const formattedMaxDate = {
    year: maxDate.getFullYear(),
    month: maxDate.getMonth(),
    day: maxDate.getDate()
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'fixed',
        top: '30%',
        left: isMobile ? '3%' : '25%',
        width: isMobile ? '80%' : '40%',
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

function formatReservations(res) {
    let i;
    for (i = 0; i < res.length; i++) {
        let year = res[i].start_date.substring(0, 4);
        let month;
        if (res[i].start_date.substring(5, 6) === "0") {
            month = res[i].start_date.substring(6, 7);
        } else {
            month = res[i].start_date.substring(5, 7);
        } let day;
        if (res[i].start_date.substring(8, 10) === "0") {
            day = res[i].start_date.substring(9, 10);
        } else {
            day = res[i].start_date.substring(8, 10);
        }
        bookedDays.push({
            year: Number(year),
            month: Number(month),
            day: Number(day),
            className: 'bookedDay'
        })

    }
}

function BookingsCalendar(UID) {
    const [selectedDay, setSelectedDay] = useState(utils().getToday());
    const [selectedDayFormatted, setSelectedDayFormatted] = useState(null);
    const [userID, setUserID] = useState(UID);
    const [openDate, setOpenDate] = useState(false);
    const classes = useStyles();


    useEffect(() => {
        setUserID(UID);
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/reservation/upcomingByUID/" + userID, requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result)
                formatReservations(res);
            })
            .catch(error => console.log('error', error))

    }, []);


    const handleDatePickerChange = (newValue) => {
        setSelectedDay(newValue);
        setOpenDate(true);
        let selectedYear = newValue.year;
        let selectedMonth = newValue.month;
        let selectedDayz = newValue.day;
        const selectedDate = selectedYear.toString() + "-" + selectedMonth.toString() + "-" + selectedDayz.toString();
        setSelectedDayFormatted(new Date(selectedDate).toUTCString());
    }



    return (
        <div>
            <Calendar
                value={selectedDay}
                onChange={handleDatePickerChange}
                minimumDate={utils().getToday()}
                maximumDate={formattedMaxDate}
                customDaysClassName={bookedDays}
            />
            <Modal
                open={openDate}
                onClose={() => setOpenDate(false)}>
                {<div className={classes.paper}>
                    <div style={{ width: '100%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex' }}>
                        <IconButton size='small' onClick={() => setOpenDate(false)}>
                            <CancelIcon size="small" />
                        </IconButton>
                    </div>
                    {SpecificReservations(selectedDayFormatted)}
                </div>}
            </Modal>
        </div>

    );
}

export default BookingsCalendar;

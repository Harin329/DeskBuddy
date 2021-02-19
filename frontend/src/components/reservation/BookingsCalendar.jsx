import React,  {useState, useEffect} from 'react';
import "./BookingsCalendar.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import Endpoint from '../../config/Constants';

const bookedDays = [];

function formatReservations(res) {
    let i;
    for (i = 0; i < res.length; i++){
        let year = res[i].start_date.substring(0, 4);
        let month;
        if (res[i].start_date.substring(5, 6) === "0"){
           month =  res[i].start_date.substring(6, 7);
        } else {
            month = res[i].start_date.substring(5, 7);
        } let day;
        if (res[i].start_date.substring(8, 10) === "0"){
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

function BookingsCalendar() {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(utils().getToday());
    const maxDate = new Date(today.setMonth(today.getMonth() + 6));
    const formattedMaxDate = {
        year: maxDate.getFullYear(),
        month: maxDate.getMonth(),
        day: maxDate.getDate()
    }

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/reservation/getAllReservations", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result)
                console.log(res)
                formatReservations(res);
            })
            .catch(error => console.log('error', error))
    }, [])
    console.log(bookedDays);

    return (
        <Calendar
            value={selectedDay}
            // update upcoming reservation view on selected day
            onChange={setSelectedDay}
            minimumDate={utils().getToday()}
            maximumDate={formattedMaxDate}
            // update this array onChange
            customDaysClassName={bookedDays}
        />
    );
}

export default BookingsCalendar;

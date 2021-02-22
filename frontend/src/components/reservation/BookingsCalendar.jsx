import React,  {useState, useEffect, Component} from 'react';
import "./BookingsCalendar.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import Endpoint from '../../config/Constants';

let selectedDate = null;
const bookedDays = [];
const today = new Date();
const maxDate = new Date(today.setMonth(today.getMonth() + 6));
const formattedMaxDate = {
    year: maxDate.getFullYear(),
    month: maxDate.getMonth(),
    day: maxDate.getDate()
}

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

class BookingsCalendar extends React.Component {
    constructor() {
        super();
        this.state = {selectedDay : utils().getToday()}
    }

    componentDidMount() {
        {const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

            fetch(Endpoint + "/reservation/getAllReservations", requestOptions)
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result)
                    formatReservations(res);
                })
                .catch(error => console.log('error', error))
        }
    }

    handleDatePickerChange = newValue => {
        this.setState({ selectedDay: newValue });
        let selectedYear = this.state.selectedDay.year;
        let selectedMonth = this.state.selectedDay.month;
        let selectedDay = this.state.selectedDay.day;
        // Method for updating reservation details should be called with this date
        selectedDate = selectedYear.toString() + "-" + selectedMonth.toString() + "-" + selectedDay.toString();

    }

    render() {
        return (
            <Calendar
                value={this.state.selectedDay}
                onChange = {this.handleDatePickerChange}
                minimumDate={utils().getToday()}
                maximumDate={formattedMaxDate}
                customDaysClassName={bookedDays}
            />
        );
    }
}

export default BookingsCalendar;

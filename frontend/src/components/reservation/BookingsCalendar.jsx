import React,  {useState} from 'react';
import "./BookingsCalendar.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";

function BookingsCalendar() {
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(utils().getToday());
    const maxDate = new Date(today.setMonth(today.getMonth() + 6));
    const formattedMaxDate = {
        year: maxDate.getFullYear(),
        month: maxDate.getMonth(),
        day: maxDate.getDate()
    }
    return (
        <Calendar
            value={selectedDay}
            // update upcoming reservation view on selected day
            onChange={setSelectedDay}
            minimumDate={utils().getToday()}
            maximumDate={formattedMaxDate}
            // update this array onChange
            customDaysClassName={[{year: 2021, month: 2, day: 21, className: 'bookedDay'},
            {year: 2021, month: 2, day: 24, className: 'bookedDay'},
            {year: 2021, month: 2, day: 25, className: 'bookedDay'}]}
        />
    );
}

export default BookingsCalendar;

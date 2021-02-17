import React, { useState } from 'react';
import Calendar from 'react-calendar';
import './BookingsCalendar.css';
import { differenceInCalendarDays } from 'date-fns';

const bookedDates = [new Date(), new Date('2021-02-17T03:24:00'),  new Date('2021-02-21T03:24:00')];

function isSameDay(a, b) {
    return differenceInCalendarDays(a, b) === 0;
}

function tileClassName({ date, view }) {
    if (view === 'month') {
        if (bookedDates.find(dDate => isSameDay(dDate, date))) {
            return 'myClassName';
        }
    }
}


function BookingsCalendar() {
    const [defaultView] = "month";
    const today = new Date();
    const maxDate = today.setMonth(today.getMonth() + 6);
    return (
        <div>
            <Calendar className="bookings-calendar">
                defaultView = {defaultView}
                minDate = {today}
                maxDate = {maxDate}
                tileClassName={tileClassName}
            </Calendar>
        </div>
    );
}

export default BookingsCalendar;
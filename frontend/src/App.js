import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Dashboard from './screens/Dashboard';
import Reservation from './screens/Reservation';
import Mail from './screens/Mail';
import Social from './screens/Social';
import BookingsCalendar from "./components/reservation/BookingsCalendar";
import './App.css';

function App() {
    return (
        <div>
            <Router>
                <Route exact path="/" component={Dashboard} />
                <Route exact path="/reservation" component={Reservation} />
                <Route exact path="/mail" component={Mail} />
                <Route exact path="/social" component={Social} />
            </Router>
            <BookingsCalendar/>
        </div>
    );
}

export default App;
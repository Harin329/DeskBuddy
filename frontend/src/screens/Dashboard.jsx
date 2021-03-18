import '../App.css';
import { Button, List, ListItem, Grid, Typography, Divider, Modal, IconButton } from '@material-ui/core';
import Title from '../components/global/Title';
import Subheader from '../components/reservation/Subheader';
import UpcomingReservations from '../components/reservation/UpcomingReservations';

function Dashboard() {
  return (
    <div className="App">
      {Title('DASHBOARD', 1, 10, 1)}
      <Grid container direction='row' justify='center' alignItems='center'>
        <Grid item xs={1} />
        <Grid item xs={4} style={{ backgroundColor: '#353B3C', height: '70vh' }} >
          {Subheader('TODAY (TODO)', 3, 6, 3)}
          {Subheader('UPCOMING RESERVATIONS', 2, 8, 2)}
          {UpcomingReservations()}
        </Grid>
        <Grid item xs={1} />
        <Grid container item direction='row' xs={5}  style={{ height: '70vh' }}>
          <Grid item xs={12} style={{ backgroundColor: '#353B3C' }}>
            {Subheader('COVID-19 UPDATES (TODO)', 3, 6, 3)}
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={12} style={{ backgroundColor: '#353B3C' }}>
            {Subheader('MY MAIL (TODO)', 3, 6, 3)}
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </div>
  );
}

export default Dashboard;
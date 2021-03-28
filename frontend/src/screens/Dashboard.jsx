import '../App.css';
import { Grid } from '@material-ui/core';
import Title from '../components/global/Title';
import Subheader from '../components/global/Subheader';
import UpcomingReservations from '../components/reservation/UpcomingReservations';
import { isMobile } from 'react-device-detect';
import Today from '../components/dashboard/Today';
import DashboardUpdates from '../components/dashboard/DashboardUpdates';
import MailUpdates from '../components/dashboard/MailUpdates';

function Dashboard() {
  return (
    <div className="App">
      {Title('DASHBOARD', 1, 10, 1)}
      <Grid container direction={isMobile ? 'column' : 'row'} justify='center' alignItems='center'>
        <Grid item xs={1} />
        <Grid item xs={isMobile ? 10 : 4} style={{ backgroundColor: '#353B3C', height: '70vh', padding: 20 }} >
          {Today()}
          {Subheader('UPCOMING RESERVATIONS', 2, 8, 2)}
          {UpcomingReservations()}
        </Grid>
        <Grid item xs={1} />
        <Grid container item direction='row' xs={isMobile ? 10 : 5} style={{ height: '70vh' }}>
          <Grid item xs={12} style={{ backgroundColor: '#353B3C', padding: 20, paddingTop: isMobile ? 50 : 20 }}>
            <DashboardUpdates>
            </DashboardUpdates>
          </Grid>
          <Grid item xs={1} />
          <Grid item xs={12} style={{ backgroundColor: '#353B3C', padding: 20 }}>
          <MailUpdates>
            </MailUpdates>
          </Grid>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </div>
  );
}

export default Dashboard;
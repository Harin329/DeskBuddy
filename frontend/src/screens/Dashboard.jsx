import '../App.css';
import { Grid, Modal } from '@material-ui/core';
import Title from '../components/global/Title';
import Subheader from '../components/global/Subheader';
import UpcomingReservations from '../components/reservation/UpcomingReservations';
import { isMobile } from 'react-device-detect';
import { useSelector, useDispatch } from 'react-redux'
import Today from '../components/dashboard/Today';
import DashboardUpdates from '../components/dashboard/DashboardUpdates';
import MailUpdates from '../components/dashboard/MailUpdates';
import ErrorPopup from '../components/global/error-popup';
import { setError } from '../actions/globalActions';
import {useEffect} from "react";
import {fetchOffices} from "../actions/reservationActions";

function Dashboard() {
  const dispatch = useDispatch()
  const error = useSelector(state => state.global.error);

  useEffect(() => {
    dispatch(fetchOffices());
  }, []);

  return (
    <div className="App">
      <Modal
        open={error}
        onClose={() => 
          dispatch(setError(false))
        }
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ErrorPopup />
      </Modal>
      {Title('DASHBOARD', 1, 10, 1)}
      <Grid container direction={isMobile ? 'column' : 'row'} justify='center' alignItems='center' style={{paddingBottom: '50px'}}>
        <Grid item xs={1} />
        <Grid item xs={isMobile ? 10 : 4} style={{ backgroundColor: '#353B3C', height: '720px', padding: 20 }} >
          {Today()}
          {Subheader('UPCOMING RESERVATIONS', 2, 8, 2)}
          {UpcomingReservations()}
        </Grid>
        <Grid item xs={1} />
        <Grid container item direction='row' xs={isMobile ? 10 : 5} style={{ height: '720px' }}>
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
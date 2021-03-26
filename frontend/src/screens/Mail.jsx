import '../App.css';
import { Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import Title from '../components/global/Title';
import Subheader from '../components/global/Subheader';
import MailModule from '../components/mail/MailModule';

const useStyles = makeStyles((theme) => ({
  background: {
    background: '#1E1E24',
    flexGrow: 1,
  },
  sectionSpacing: {
    marginBottom: '29px',
  },

}));

function Mail() {
  const classes = useStyles();

  return (
      <div className={classes.background}>
        <Grid container direction='column' justify='center' alignItems='center'>
          {Title('MAIL MANAGER', 1, 8, 1)}

          <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            {MailModule(4, "NEW MAIL")}
            <Grid item xs={2}></Grid>
            {MailModule(4, "ALL REQUESTS")}
          </Grid>

          {window.innerWidth > 1500 && Subheader('MANAGE REQUESTS', 4, 2, 4)}
          {window.innerWidth <= 1500 && Subheader('MANAGE REQUESTS', 0, 12, 0)}


          <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            {MailModule(3, "ACTIVE REQUESTS")}
            <Grid item xs={'auto'}></Grid>
            {MailModule(3, "ALL REQUESTS")}
            <Grid item xs={'auto'}></Grid>
            {MailModule(3, "CLOSED REQUESTS")}
          </Grid>


        </Grid>
      </div>
  );
}

export default Mail;
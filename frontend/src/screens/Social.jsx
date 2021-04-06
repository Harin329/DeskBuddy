import '../App.css';
import GroupChannel from "../components/social/group-channel/GroupChannel";
import React from 'react';
import CompanyUpdates from "../components/social/CompanyUpdates";
import BranchUpdates from "../components/social/BranchUpdates";
import {makeStyles} from "@material-ui/core/styles";
import { isMobile } from "react-device-detect";
import Subheader from '../components/global/Subheader';
import { useMsal } from '@azure/msal-react';
import { accountIsAdmin } from '../util/Util';

const useStyles = makeStyles((theme) => ({
    updatesSection: {
        width: '85%',
        alignItems: 'center',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignContent: 'center',
        marginLeft: isMobile? '28px' : '100px',
        marginTop: '20px',
        marginBottom: '50px'
    }
}));

function Social() {
    const classes = useStyles();

    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className={classes.updatesSection}>
        <CompanyUpdates>
        </CompanyUpdates>
        <BranchUpdates isAdmin={isAdmin}>
        </BranchUpdates>
       </div>
        {window.innerWidth > 1500 && Subheader('FEED', 4, 2, 4)}
        {window.innerWidth <= 1500 && Subheader('FEED', 0, 12, 0)}
       <GroupChannel/>
    </div>
  );
}

export default Social;
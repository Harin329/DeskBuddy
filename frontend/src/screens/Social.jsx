import '../App.css';
import GroupChannel from "../components/social/group-channel/GroupChannel";
import React from 'react';
import { subtitle } from '../components/global/subtitle-line/index';
import CompanyUpdates from "../components/social/CompanyUpdates";
import BranchUpdates from "../components/social/BranchUpdates";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    updatesSection: {
        width: '80%',
        alignItems: 'center',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        marginLeft: '140px',
        marginTop: '20px'
    }
}));

function Social() {
    const classes = useStyles();

  return (
    <div className="App">
      <header className="App-header">
      </header>
      <div className={classes.updatesSection}>
        <CompanyUpdates>
        </CompanyUpdates>
        <BranchUpdates>
        </BranchUpdates>
       </div>
       {subtitle("FEED")}
      <GroupChannel isAdmin={true} />
    </div>
  );
}

export default Social;
import '../App.css';
import GroupChannel from "../components/social/GroupChannel";
import React from 'react';
import { subtitle } from '../components/global/subtitle-line/index';

function Social() {
  return (
    <React.Fragment>
      {subtitle("FEED")}
      <GroupChannel isAdmin={true} />
    </React.Fragment>
  );
}

export default Social;
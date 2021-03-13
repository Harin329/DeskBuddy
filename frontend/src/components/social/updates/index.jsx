import React from 'react';
import CompanyUpdates from './company-updates/index';
import BranchUpdates from './branch-updates/index';

//styles
import { UpdatesComponentContainer } from './styles';

class Updates extends React.Component { 
  render() {
    return (
      <UpdatesComponentContainer>
        <CompanyUpdates />
        <BranchUpdates />
      </UpdatesComponentContainer>
    );
  }
}

export default Updates;
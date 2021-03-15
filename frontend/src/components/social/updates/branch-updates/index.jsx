import React from 'react';
import { updatePopup } from '../update-popup/index';

// styles
import {
  MainContainer,
  ContainerTitle,
  UpdateContainer,
  UpdateTitle,
  UpdateDescription,
  ListOfUpdatesContainer
} from '../company-updates/styles';

import { Modal } from '@material-ui/core';

// stub data import
import { STUB_UPDATES } from '../company-updates/data';

class BranchUpdates extends React.Component {
  state = {
    open: false,
    curr_update: null
  }

  handleUpdateOpen = (el) => {
    this.setState({ open: true, curr_update: el});
  }

  handleClose = () => {
    this.setState({ open: false, curr_update: null });
  }

  render() {

    const update_body = STUB_UPDATES.map((el, i) => {
      return (
        <UpdateContainer
          onClick={() => this.handleUpdateOpen(el)}
          key={i}
        >
          <UpdateTitle>{el.title}</UpdateTitle>
          <UpdateDescription>{el.description}</UpdateDescription>
        </UpdateContainer>
      );
    })

    const popup = () => {
      if (this.state.open) {
        return (
          <Modal
            open={this.state.open}
            onClose={this.handleClose}
            style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {updatePopup(this.state.curr_update)}
          </Modal>
        )
      } else
        return null;
    }

    return (
      <MainContainer>
        <ContainerTitle>BRANCH UPDATES</ContainerTitle>
        <ListOfUpdatesContainer>{update_body}</ListOfUpdatesContainer>
        {popup()}
      </MainContainer>
    );
  }
}

export default BranchUpdates;

import React from 'react';

import { PopupContainer, PopupTitle, PopupSubtitle, PopupContent } from './styles';

const updatePopup = (props) => {
  return (
    <PopupContainer>
      <PopupTitle>{props.title ? props.title : 'NO TITLE'}</PopupTitle>
      <PopupSubtitle>{props.subtitle ? props.subtitle : ''}</PopupSubtitle>
      <PopupContent>{props.description ? props.description : 'No description'}</PopupContent>
    </PopupContainer>
  );
}

export { updatePopup };
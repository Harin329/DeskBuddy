import React from 'react';

import { PopupContainer, PopupTitle, PopupSubtitle, PopupContent } from './PopupStyle';

const updatePopup = (props) => {

    return (
        <PopupContainer>
            <PopupTitle>{props.title}</PopupTitle>
            <PopupSubtitle>{props.sub_title}</PopupSubtitle>
            <PopupSubtitle>{props.date.substring(0, 10)}</PopupSubtitle>
            <PopupContent>{props.content}</PopupContent>
        </PopupContainer>
    );
}

export { updatePopup };
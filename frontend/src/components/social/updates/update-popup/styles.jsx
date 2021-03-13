import styled from 'styled-components';

const PopupContainer = styled.div`
  width: 1220px;
  height: 700px;
  background: #fffcf7;
  font-family: Lato;
  font-style: normal;
  color: #000000;
  font-weight: bold;
  overflow: scroll;
`;

const PopupTitle = styled.h1`
  font-size: 50px;
  line-height: 60px;
  text-align: center;
`;

const PopupSubtitle = styled.h3`
  font-size: 40px;
  line-height: 48px;
  text-align: center;
  color: rgba(0, 0, 0, 0.5);
`;

const PopupContent = styled.p`
  font-weight: normal;
  font-size: 30px;
  line-height: 36px;
  margin: 20px 40px;
`;

export { PopupContainer, PopupTitle, PopupSubtitle, PopupContent };
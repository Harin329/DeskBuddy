import styled from 'styled-components';

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 80px 0px;
  width: 90%;
`;

const Line = styled.div`
  height: 0px;
  left: 104px;
  top: 815px;
  border: 3px solid #e5e5e5;
  width: 42%;
`;

const Subtitle = styled.h2`
  width: 16%;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 25px;
  line-height: 30px;
  text-align: center;
  color: #e5e5e5;
`;

export { MainContainer, Line, Subtitle };
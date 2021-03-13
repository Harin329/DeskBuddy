import styled from 'styled-components';

const MainContainer = styled.div`
  background-color: #fffcf7;
  border-radius: 30px;
  width: 574px;
  height: 526px;
  font-family: Lato;
  font-style: normal;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ContainerTitle = styled.h1`
  font-weight: bold;
  font-size: 25px;
  align-items: center;
  text-align: center;
  line-height: 30px;
`;

const UpdateContainer = styled.div`
  background: #eef0f2;
  border: 1px solid #000000;
  box-sizing: border-box;
  border-radius: 5px;
  width: 530px;
  height: 81px;
  margin: 20px;
  overflow: hidden;
  cursor: pointer;
`;

const UpdateTitle = styled.h2`
  font-weight: bold;
  font-size: 15px;
  line-height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UpdateDescription = styled.p`
  font-weight: bold;
  font-size: 10px;
  line-height: 12px;
  display: flex;
  align-items: center;
  margin: 7px;
`;

const ListOfUpdatesContainer = styled.div`
  width: 574px;
  height: 430px;
  background-color: #fffcf7;
  overflow: scroll;
`;

export {
  MainContainer,
  ContainerTitle,
  UpdateContainer,
  UpdateTitle,
  UpdateDescription,
  ListOfUpdatesContainer,
};

import styled from 'styled-components';

const MapContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -350px;
  margin-left: -550px;
  width: 1129px;
  height: 729px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const LevelContainer = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 250px;
`;

const LevelButton = styled.a`
  text-decoration: none;
  margin: 15px;
  font-size: 30px;
  border: none;
  background-color: #fff;
  padding: 10px;
  color: #353b3c;
  font-weight: 900px;
  opacity: 60%;
  transition: font-size 0.2s, opacity 0.2s;

  &.active,
  &:hover {
    opacity: 100%;
    cursor: pointer;
    font-size: 35px;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 880px;
`;

const MapImage = styled.img`
  width: 800px;
  height: 600px;
`;

const MapTitle = styled.h1`
  text-align: center;
  color: #353b3c;
  font-size: 35px;
  flex: 1;
`;

const HeaderContainer = styled.div`
  display: flex;
  width: 90%;
`;

export {
  MapContainer,
  LevelButton,
  LevelContainer,
  MapImage,
  MapTitle,
  ImageContainer,
  HeaderContainer,
};
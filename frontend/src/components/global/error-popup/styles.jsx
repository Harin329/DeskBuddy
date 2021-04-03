import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #eef0f2;
  height: 450px;
  width: 270px;
  padding: 20px;

  @media (min-width: 700px) {
    height: 350px;
    width: 400px;
  }

  @media (min-width: 1000px) {
    height: 350px;
    width: 500px;
  }
`;

const Header = styled.h1`
  color: #00ADEF;
`;

const ErrorMessage = styled.p`
  margin: 0 10px 20px 5px;

`;

export {Container, Header, ErrorMessage}
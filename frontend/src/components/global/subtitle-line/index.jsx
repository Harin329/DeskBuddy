// styles
import { MainContainer, Line, Subtitle } from './styles'


const subtitle = (arg) => {
  return (
    <MainContainer>
      <Line />
      <Subtitle>{arg}</Subtitle>
      <Line/>
    </MainContainer>
  );
}

export { subtitle };
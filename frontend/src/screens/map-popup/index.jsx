import React from 'react';
import Endpoint from '../../config/Constants'

// styles
import { MapContainer, LevelButton, LevelContainer, MapImage, MapTitle, ImageContainer, HeaderContainer } from './styles';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Spinner from './spinner/spinner';

// stub data
// import { FLOOR_INFORMATION } from './data';

class MapPopup extends React.Component {
  state = {
    curr_level: 1,
    loaded: false,
  };

  constructor(props) {
    super();
    this.wrapper = React.createRef();
    this.FLOOR_INFORMATION = null;
    this.loadFloors(props.locationID);
  }

  loadFloors = (id) => {
    const params = id.split('-');

    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      `${Endpoint}/floor/getFloorsByOffice/${params[0]}/${params[1]}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        this.FLOOR_INFORMATION = JSON.parse(result);
        this.setState({ loaded: true });
      })
      .catch((error) => console.log('ERROR:', error));
  };

  /**
   * Event handlers
   */

  levelHandler = (id) => {
    this.setState({ curr_level: id });
  };

  /**
   * JSX elements to be rendered
   */

  all_levels = () => {
    return this.FLOOR_INFORMATION.map((el) => {
      return (
        <LevelButton
          key={el.floor_num}
          onClick={() => this.levelHandler(el.floor_num)}
          ref={this.wrapper}
          className={this.state.curr_level === el.floor_num ? 'active' : ''}
        >
          {`Level ${el.floor_num}`}
        </LevelButton>
      );
    });
  };

  curr_map = () => {
    return (
      <MapImage
        src={this.FLOOR_INFORMATION[this.state.curr_level - 1].floor_plan}
        alt={`Floormap for ${this.props.locationID} floor ${this.state.curr_level}`}
      />
    );
  };

  render() {

    let body = null;

    if (!this.state.loaded)
      body = <Spinner />
    else {
      body = (
        <React.Fragment>
          <LevelContainer>{this.all_levels()}</LevelContainer>
          <ImageContainer>
            <HeaderContainer>
              <MapTitle>{this.props.locationID}</MapTitle>
              <IconButton size="small" onClick={this.props.closeHandler}>
                <CancelIcon size="small" />
              </IconButton>
            </HeaderContainer>
            {this.curr_map()}
          </ImageContainer>
        </React.Fragment>
      );
    }

    return <MapContainer>
      {body}
    </MapContainer>;
  }
}

export default MapPopup;
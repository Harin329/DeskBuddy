import React from 'react';
import Endpoint from '../../../config/Constants'
import PinchZoomPan from "react-responsive-pinch-zoom-pan";

// styles
import { MapContainer, LevelButton, LevelContainer, MapImage, MapTitle, ImageContainer, HeaderContainer } from './styles';
import { IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import Spinner from './spinner/spinner';
import safeFetch from '../../../util/Util';

class MapPopup extends React.Component {
  state = {
    curr_index: 0,
    curr_level: 0,
    loaded: false,
    error: false
  };

  constructor(props) {
    super();
    this.wrapper = React.createRef();
    this.FLOOR_INFORMATION = null;
    this.getFloors(props.locationID);
  }

  getFloors = (id) => {
    const params = id.split('-');

    let requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    safeFetch(
      `${Endpoint}/floor/getFloorsByOffice/${params[0]}/${params[1]}`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        // console.log(JSON.parse(result));
        this.FLOOR_INFORMATION = JSON.parse(result);
        this.initFloor();
      })
      .catch((error) => this.setState({ error: true }));
  };

  initFloor = () => {
    if (this.FLOOR_INFORMATION.length > 0)
      this.setState({
        loaded: true,
        curr_level: this.FLOOR_INFORMATION[0].floor_num
      });
    else
      this.setState({ loaded: true });
  }

  /**
   * Event handlers
   */

  levelHandler = (level, index) => {
    console.log(level);
    this.setState({
      curr_level: level,
      curr_index: index
    });
  };

  /**
   * JSX elements to be rendered
   */

  all_levels = () => {
    return this.FLOOR_INFORMATION.map((el, index) => {
      return (
        <LevelButton
          key={el.floor_num}
          onClick={() => this.levelHandler(el.floor_num, index)}
          ref={this.wrapper}
          className={this.state.curr_index === index ? 'active' : ''}
        >
          {`Level ${el.floor_num}`}
        </LevelButton>
      );
    });
  };

  curr_map = () => {

    return (
      <div style={{ width: this.props.mobile ? '50%' : '100%', height: this.props.mobile ? '50%' : '100%' }}>
      <PinchZoomPan
      initialScale={1}
      maxScale={4}>
          <MapImage
            src={'data:image/png;base64,' + new Buffer(this.FLOOR_INFORMATION[this.state.curr_index].floor_plan, 'binary').toString('base64')}
            alt={`Floormap for ${this.props.locationID} floor ${this.state.curr_level}`}
          />
      </PinchZoomPan>
      </div>
    );
  };

  render() {

    let body = null;

    if (!this.state.loaded && !this.state.error)
      body = <Spinner />
    else if (this.state.loaded && !this.state.error) {
      if (this.props.mobile) {
        body = (
          <React.Fragment>
            <ImageContainer>
              <HeaderContainer>
                <MapTitle>{this.props.officeName.name}</MapTitle>
                <IconButton size="small" onClick={this.props.closeHandler}>
                  <CancelIcon size="small" />
                </IconButton>
              </HeaderContainer>
              <LevelContainer>
                  <select value={[this.state.curr_level, this.state.curr_index]} onChange={(e) => this.levelHandler(e.target.value[0], e.target.value[2])}>
                  {this.FLOOR_INFORMATION.map((el, i) => {
                    return (
                      <option key={i} value={[el.floor_num, i]}>{`Level ${el.floor_num}`}</option>
                      )
                    })}
                  </select>
              </LevelContainer>
              {this.curr_map()}
            </ImageContainer>
          </React.Fragment>
        );
      } else {
        body = (
          <React.Fragment>
            <LevelContainer>{this.all_levels()}</LevelContainer>
            <ImageContainer>
              <HeaderContainer>
                <MapTitle>{this.props.officeName.name}</MapTitle>
                <IconButton size="small" onClick={this.props.closeHandler}>
                  <CancelIcon size="small" />
                </IconButton>
              </HeaderContainer>
              {this.curr_map()}
            </ImageContainer>
          </React.Fragment>
        );
      }
    } else if (this.state.error) {
      body = (
        <h2>Couldn't load the floorplan...</h2>
      )
    }

    return <MapContainer>
      {body}
    </MapContainer>;
  }
}

export default MapPopup;
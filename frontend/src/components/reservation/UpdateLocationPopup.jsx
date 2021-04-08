import React, { useState, useEffect } from 'react';
import ImageUploader from 'react-images-upload';
import { Button, Typography, TextField, MenuItem } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import UpdateLocationFloorContainer from '../../components/reservation/UpdateLocationFloorContainer';
import { fetchOffices, fetchFloorsByOffice } from '../../actions/reservationActions';
import Endpoint from '../../config/Constants';
import safeFetch from "../../util/Util";
import { isMobile } from 'react-device-detect';
import ICBC from "../../assets/ICBC.png";
import {SET_PROFILE_PHOTO} from "../../actions/actionTypes";

const useStyles = makeStyles({
  background: {
      background: '#1E1E24',
      flexGrow: 1,
  },
  actionButton: {
      background: '#00ADEF',
      borderRadius: 20,
      color: 'white',
      height: '50px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 18
  },
  reserveButton: {
      background: '#00ADEF',
      borderRadius: 20,
      color: 'white',
      height: '50px',
      padding: '0 20px',
      marginTop: '5px',
      marginBottom: '5px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 14,
      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
  },
  attachmentButton: {
      background: '#C4C4C4',
      borderRadius: '20px',
      color: 'white',
      height: '50px',
      padding: '0 30px',
      marginTop: '10px',
      marginBottom: '10px',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 12,
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      '&:hover': {
        backgroundColor: '#C8C8C8',
        color: '#FFF'
    }
  },
  selectedAttachmentButton: {
    background: '#00ADEF',
    borderRadius: '20px',
    color: 'white',
    height: '50px',
    padding: '0 30px',
    marginTop: '10px',
    marginBottom: '10px',
    fontFamily: 'Lato',
    fontWeight: 'bolder',
    fontSize: 12,
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
    '&:hover': {
        backgroundColor: '#00ADEF',
        color: '#FFF'
    }
},
  titleText: {
      color: 'white',
      textAlign: 'center',
      fontFamily: 'Lato',
      fontWeight: 'bold',
      fontSize: 25
  },
  sectionText: {
      color: 'white',
      fontFamily: 'Lato',
      fontWeight: 'bolder',
      fontSize: 20
  },
  titleLines: {
      backgroundColor: 'white',
      height: '3px',
  },
  sectionSpacing: {
      marginBottom: '29px'
  },
  inputBoxes: {
      width: '90%',
      backgroundColor: 'white',
      borderRadius: 20,
      marginTop: '10px',
  },
  officeText: {
      color: 'black',
      fontFamily: 'Lato',
      fontSize: 16,
      textAlign: 'center'
  },
  deskSectionText: {
      color: 'black',
      fontFamily: 'Lato',
      fontSize: 14,
      fontWeight: 'bold',
  },
  deskText: {
      color: 'black',
      fontFamily: 'Lato',
      fontSize: 14,
      display: 'inline'
  },
  dialogLineContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'stretch'
  },
  dialogLineLabel: {
      paddingTop: '20px'
  },
  pictureUploadContainer: {
      padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px'
    },
updateLocation: {
    position: 'fixed',
    top: !isMobile ? '20%' : '15%',
    left: !isMobile ? '25%': '',
    width: !isMobile ? '45%' : '230px',
    height: '60%',
    background: '#FFFCF7',
    padding: '30px',
    overflow: 'auto'
},
sectionTextModal: {
    color: 'black',
    fontFamily: 'Lato',
    fontWeight: 'bolder',
    fontSize: 20,
    textAlign: 'center',
},
});

function UpdateLocationPopup (props) {
  const classes = useStyles();
  const [office, setOffice] = useState();

  const dispatch = useDispatch()
  const officeList = useSelector(state => state.reservations.offices);
  const floorList = useSelector(state => state.reservations.floorsPerOfficeInUpdate);

  const initialLocationEditsObj = {
    name: null,
    address: null,
    cityOrTown: '',
    locationPhoto: null,
    floor: {
        level: null,
        photo: null,
        deskIds: null
    }
  };

  let currLocationEdits = {...initialLocationEditsObj};

  const handleFormChange = (field, input) => {
      switch (field) {
        case 'name':
            currLocationEdits.name = input.target.value;
            break;
        case 'address':
            currLocationEdits.address = input.target.value;
            break;
        case 'cityOrTown':
            currLocationEdits.cityOrTown = input.target.value;
            break; 
        case 'locationPhoto':
            currLocationEdits.locationPhoto = input[0];
            break;
        case 'floors':
            currLocationEdits.floor.level = input.level;
            if (input.photo !== null)
                currLocationEdits.floor.photo = input.photo;
            if (input.deskIds !== null && input.deskIds !== '')
                currLocationEdits.floor.deskIds = input.deskIds;
            break;
        default:
            break;
      }
  }
  

  useEffect(() => {
    dispatch(fetchOffices());
  }, []);

    const handleSubmit = (event) => {
        if (!office) {
            alert("No city identifier has been provided");
        } else {
            const originalCity = office.split(/-(?=[^-]+$)/)[0];
            const id = office.split(/-(?=[^-]+$)/)[1];
            const originalOffice = officeList.find(existingOffice => existingOffice.office_location == originalCity && existingOffice.office_id == id);
            const originalOfficePhoto = originalOffice.office_photo;
            originalOffice.office_photo = null;
            const formData = new FormData();

            const dispatchPutlocation = (formData) => {
                const requestOptions = {
                    method: 'PUT',
                    body: formData
                };
                safeFetch(Endpoint + `/location`, requestOptions)
                    .then((response) => {
                        response.text();
                    })
                    .then(() => {
                        props.whatToDoWhenClosed();
                    })
                    .catch(error => {
                        alert(error);
                    })
            }

            let parsedDesks;
            if (currLocationEdits.floor.deskIds) {
                parsedDesks = parseDesksFromString(currLocationEdits.floor.deskIds);
            }
            const floors = [{
                floor_num: currLocationEdits.floor.level,
                desks: parsedDesks
            }]
            const jsonBody = {
                edits: {
                    city: currLocationEdits.cityOrTown,
                    name: currLocationEdits.name,
                    address: currLocationEdits.address,
                    floors: floors
                },
                originalOffice
            }
            formData.append("body", JSON.stringify(jsonBody));

            formData.append("floor_image", currLocationEdits.floor.photo);

            if (currLocationEdits.locationPhoto != null) {
                formData.append("image", currLocationEdits.locationPhoto);
                dispatchPutlocation(formData);

            } else {
                // perhaps we want to return nil instead?
                fetch('data:image/png;base64,' + Buffer.from(originalOfficePhoto, 'base64').toString('base64'))
                    .then(res => res.blob()
                        .then(data => {
                            formData.append("image", data);
                            dispatchPutlocation(formData);
                        }))
            }
        }
    };

    const parseDesksFromString = (input) => {
        const parsedDesks = [];
        const tokens = input.split(";");
        for (const token of tokens) {
            const parts = token.split("-");
            const ID = parts[0];
            const capacity = parts[1];
            parsedDesks.push({
                ID: ID,
                capacity: capacity
            });
        }
        return parsedDesks;
    };

  const handleOfficeChange = (event) => {
    setOffice(event.target.value);
    if (event.target.value !== 'All') {
        const params = event.target.value.split(/-(?=[^-]+$)/);
        dispatch(fetchFloorsByOffice(params));
    }
  };
  return (
    <div className={classes.updateLocation}>
      <Typography className={classes.sectionTextModal}>
        Update Location
      </Typography>
      <form>
        <div style={isMobile ? { marginBottom: '20px' } : null}>
          <TextField
            id="outlined-basic"
            label="Location"
            variant="outlined"
            select
            onChange={handleOfficeChange}
            value={office}
            className={classes.inputBoxes}
          >
            {officeList.map((option) => (
              <MenuItem
                key={option.office_location + '-' + String(option.office_id)}
                value={option.office_location + '-' + String(option.office_id)}
              >
                {option.name}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div style={isMobile ? { marginBottom: '20px' } : null}>
          Please choose one or more of the following to update for the selected
          location
        </div>
        <div>
          <TextField
            id="name"
            label="Name"
            style={{ margin: 8 }}
            placeholder="Ex. ICBC Surrey 78 Ave"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => handleFormChange('name', event)}
          />
        </div>
        <div>
          <TextField
            id="address"
            label="Address"
            style={{ margin: 8 }}
            placeholder="Ex. 13426 78 Ave"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => handleFormChange('address', event)}
          />
        </div>
        <div>
          <TextField
            id="cityOrTown"
            label="City or Town"
            style={{ margin: 8 }}
            placeholder="Ex. Surrey"
            variant="outlined"
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(event) => handleFormChange('cityOrTown', event)}
          />
        </div>
        <div>
          <Typography>Photo of Location</Typography>
          <ImageUploader
            buttonStyles={{
              background: '#00ADEF',
              borderRadius: 20,
              color: 'white',
              height: '50px',
              padding: '0 30px',
              marginTop: '10px',
              marginBottom: '10px',
              fontFamily: 'Lato',
              fontWeight: 'bolder',
              fontSize: 18,
              alignSelf: 'flex-start',
            }}
            withIcon={false}
            buttonText="Update Location Photo"
            onChange={(event) => handleFormChange('locationPhoto', event)}
            imgExtension={['.jpg', '.gif', '.png', '.gif']}
            maxFileSize={5242880}
            withPreview={true}
            withLabel={false}
            singleImage={true}
            fileContainerStyle={{
              padding: '0px',
              margin: '0px',
              boxShadow: '0px 0px 0px 0px',
              backgroundColor: '#FFFCF7',
            }}
          />
        </div>
        <div>
          <UpdateLocationFloorContainer
            handleFormChange={handleFormChange}
            floorsRetrieved={floorList}
          ></UpdateLocationFloorContainer>
        </div>
        <div>
          <Button
            className={classes.actionButton}
            onClick={(event) => handleSubmit(event)}
          >
            Publish
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdateLocationPopup;

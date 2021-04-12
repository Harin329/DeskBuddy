import React, { useState, useEffect } from 'react';
import ImageUploader from 'react-images-upload';
import {Button, Typography, TextField, MenuItem, Modal} from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles';
import UpdateLocationFloorContainer from '../../components/reservation/UpdateLocationFloorContainer';
import { fetchOffices, fetchFloorsByOffice } from '../../actions/reservationActions';
import Endpoint from '../../config/Constants';
import safeFetch from "../../util/Util";
import { isMobile } from 'react-device-detect';
import ICBC from "../../assets/ICBC.png";
import {
    SET_CONFIRM_DELETE_POPUP,
    SET_CONFIRM_UPDATE_POPUP,
    SET_OID,
    SET_PROFILE_PHOTO
} from "../../actions/actionTypes";
import {Btn, ConfirmPopup, ReportPopup} from "../social/feed/styles";

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
confirmPopup: {
    fontFamily: 'Lato',
    fontStyle: 'normal',
    fontWeight: 300,
    fontSize: '20px',
    height: '100px',
    width: '350px',
    backgroundColor: 'white',
    fontColor: 'black',
    padding: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
},
});

function UpdateLocationPopup (props) {
  const classes = useStyles();
  const [office, setOffice] = useState();

  const dispatch = useDispatch()
  const officeList = useSelector(state => state.reservations.offices);
  const floorList = useSelector(state => state.reservations.floorsPerOfficeInUpdate);
  const confirmDeletePopupIsOpen = useSelector(state => state.reservations.confirmDeletePopup);
  const confirmUpdatePopupIsOpen = useSelector(state => state.reservations.confirmUpdatePopup);

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

  console.log("SETTING CURREDLOCATIONEDITS TO NULL LOL");
  let currLocationEdits = {...initialLocationEditsObj};

  const handleFormChange = (field, input) => {
      console.log("HANDLE FORM CHANGE: " + field + " " + JSON.stringify(input))
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

    const handleSubmit = () => {
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

    const handleDelete = (event) => {
        if (!office) {
            alert("No city identifier has been provided");
        } else {
            const originalCity = office.split(/-(?=[^-]+$)/)[0];
            const id = office.split(/-(?=[^-]+$)/)[1];

            const requestOptions = {
                method: 'DELETE'
            }
            safeFetch(Endpoint + `/location/${originalCity}/${id}`, requestOptions)
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

    let confirmDeletePopup = (
        <Modal
            open={confirmDeletePopupIsOpen}
            onClose={() =>
                dispatch({type: SET_CONFIRM_DELETE_POPUP, payload: false})
            }
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ConfirmPopup>
                <div>Are you sure you want to delete this office? All mail, reservations, and announcements associated with this office will also be deleted. This action cannot be undone.</div>
                <Btn
                    type="button"
                    value="Yes"
                    onClick={() => handleDelete()}
                />
            </ConfirmPopup>
        </Modal>
    );

    let confirmUpdatePopup = (
        <Modal
            open={confirmUpdatePopupIsOpen}
            onClose={() =>
                dispatch({type: SET_CONFIRM_UPDATE_POPUP, payload: false})
            }
            onRendered={() => {
                console.log("IN CONFIRM SUBMIT POPUP")
                console.log(JSON.stringify(currLocationEdits, null, 2))
            }}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ConfirmPopup>
                <div>Are you sure you want to update this floor? All existing reservations on this floor will be
                    deleted. This action cannot be undone
                </div>
                <Btn
                    type="button"
                    value="Yes"
                    onClick={() => {handleSubmit()}}
                />
            </ConfirmPopup>
        </Modal>
    );

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
                  onClick={(event) => {
                      console.log("IN PROCEED ON CLICK")
                      console.log(JSON.stringify(currLocationEdits, null, 2))
                      if (currLocationEdits.floor.level != null){
                          dispatch({type: SET_CONFIRM_UPDATE_POPUP, payload: true})
                      } else {
                          handleSubmit()
                      }
                  }}
              >
                  Publish
              </Button>
              <Button
                  style={isMobile ? { background: "#ba0000" } : { background: "red", marginLeft: "50px" }}
                  className={classes.actionButton}
                  onClick={(event) => dispatch({type: SET_CONFIRM_DELETE_POPUP, payload: true})}
              >
                  Delete Location
              </Button>
          </div>
      </form>
        {confirmDeletePopup}
        {confirmUpdatePopup}
    </div>
  );
}

export default UpdateLocationPopup;

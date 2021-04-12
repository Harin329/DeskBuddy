import React from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import { isMobile } from 'react-device-detect';
import Endpoint from '../../config/Constants';
import safeFetch from "../../util/Util";
import ImageUploader from 'react-images-upload';

const styles = theme => ({
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    },
    actionButtonCenter: {
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
        justifyContent: "center",
        alignItems: "center"
    },
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
    },
    addLocation: {
        position: 'fixed',
        top: '20%',
        width: !isMobile ? '45%' : '230px',
        height: '60%',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto'
    }
});

class AddLocationForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            city: "",
            name: "",
            address: "",
            image: null,
            visible: false,
            inputFloors: []
        }
    }

    getLowestID() {
        const floor_ids = [];
        for (let floor of this.state.inputFloors) {
            floor_ids.push(floor.floor_id);
        }
        for (let i = 1; i < 500; i++) {
            if (!floor_ids.includes(i)) {
                return i;
            }
        }
        return 0;
    }

    addFloor() {
        const floor = { floor_id: this.getLowestID.bind(this), floor_num: 0, floor_desks: "", floor_image: null }
        this.setState(prevState => ({
            inputFloors: [...prevState.inputFloors, floor]
        }));
    }

    deleteFloor(id) {
        this.setState(prevState => ({
            inputFloors: prevState.inputFloors.filter((floor) => {
                return floor.floor_id !== id;
            })
        }));
    }

    handleSubmit(event) {
        let valid = true;
        const floorList = []

        if (this.state.city === "") {
            alert("No city identifier has been provided");
        } else if (JSON.stringify(this.state.inputFloors) === "[]") {
            alert("No floors have been added");
        } else {
            const floors = [];
            for (const floor of this.state.inputFloors) {
                floors.push(this.parseFloorFromInputFloor(floor));
            }
            const jsonBody = {
                city: this.state.city,
                name: this.state.name,
                address: this.state.address,
                floors: floors
            }
            const jsonData = JSON.stringify(jsonBody);

            const formData = new FormData();
            formData.append("image", this.state.image);
            formData.append("body", jsonData);
            for (const floor of this.state.inputFloors) {
                const deskList = []
                const floorNum = Number(floor.floor_num)
                if (floorList.includes(floorNum)) {
                    valid = "Duplicate Floors"
                    break;
                }
                formData.append("floor_" + floor.floor_num.toString() + "_image", floor.floor_image);
                floorList.push(floorNum)



                for (const desk of floor.floor_desks.split(';')) {
                    const deskID = Number(desk.split('-')[0]);
                    const capacity = Number(desk.split('-')[1]);
                    if (deskList.some(e => e.ID === deskID)) {
                        valid = "Duplicate DeskID " + deskID.toString() + " on floor " + floor.floor_num.toString()
                        break;
                    }
                    let deskObj = {
                        ID: deskID,
                        capacity: capacity
                    }
                    deskList.push(deskObj)
                }
            }

            if (valid === true) {
                const requestOptions = {
                    method: 'POST',
                    body: formData
                };
                safeFetch(Endpoint + "/location", requestOptions, formData)
                    .then((response) => response.text())
                    .then(result => {
                        this.props.closeModal();
                    })
                    .catch(error => alert(error));
            } else {
                alert(valid)
            }
        }
    }

    parseFloorFromInputFloor(input) {
        const floor = {
            floor_num: input.floor_num,
            image: null,
            desks: this.parseDesksFromString(input.floor_desks)
        }
        return floor
    }

    parseDesksFromString(input) {
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
    }

    handleFloorNumberInput(id, input) {
        this.setState(prevState => ({
            inputFloors: prevState.inputFloors.map((floor) => {
                if (floor.floor_id === id) {
                    floor.floor_num = input.target.value;
                }
                return floor;
            })
        }));
    }

    handleDeskInput(id, input) {
        this.setState(prevState => ({
            inputFloors: prevState.inputFloors.map((floor) => {
                if (floor.floor_id === id) {
                    floor.floor_desks = input.target.value;
                }
                return floor;
            })
        }));
    }

    handleFloorImageInput(id, input) {
        this.setState(prevState => ({
            inputFloors: prevState.inputFloors.map((floor) => {
                if (floor.floor_id === id) {
                    floor.floor_image = input[0];
                }
                return floor;
            })
        }));
    }


    handleCityInput(input) {
        this.setState({
            city: input.target.value
        });
    }

    handleNameInput(input) {
        this.setState({
            name: input.target.value
        })
    }

    handleAddressInput(input) {
        this.setState({
            address: input.target.value
        });
    }

    handleOfficeImageInput(input) {
        this.setState({
            image: input[0]
        });
    }

    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }


    renderFloors() {
        const { classes } = this.props;

        let content = this.state.inputFloors.map((floor) =>
            <div>
                <div>
                    <TextField
                        id="floor_num"
                        label="Floor Number"
                        style={{ margin: 8 }}
                        placeholder="2"
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleFloorNumberInput.bind(this, floor.floor_id)}
                    />
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
                            alignSelf: 'flex-start'
                        }}
                        withIcon={false}
                        buttonText='ATTACH FLOOR PLAN IMAGE'
                        onChange={this.handleFloorImageInput.bind(this, floor.floor_id)}
                        imgExtension={['.jpg', '.gif', '.png', '.gif']}
                        maxFileSize={5242880}
                        withPreview={true}
                        withLabel={false}
                        singleImage={true}
                        fileContainerStyle={{ padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px', backgroundColor: '#FFFCF7' }}
                    />
                    <Button className={classes.actionButton} onClick={this.deleteFloor.bind(this, floor.floor_id)}>
                        Remove Floor
                    </Button>
                </div>
                <div>
                    <TextField
                        id="desks_id"
                        label="DESKID-CAPACITY seperated with semicolon"
                        style={{ margin: 8 }}
                        placeholder="01-1;02-1;03-2"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleDeskInput.bind(this, floor.floor_id)}
                    /></div>
            </div>);

        return (<div>
            {content}
        </div>)
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.addLocation}>
                <Typography className={classes.sectionTextModal}>
                    Add Location
                </Typography>
                <form>
                    <div><TextField
                        id="city"
                        label="City or Town"
                        style={{ margin: 8 }}
                        placeholder="Ex. New Westminister"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleCityInput.bind(this)}
                    /></div>
                    <div><TextField
                        id="address"
                        label="Address"
                        style={{ margin: 8 }}
                        placeholder="Ex. 1320 3rd Ave"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleAddressInput.bind(this)}
                    /></div>
                    <div><TextField
                        id="name"
                        label="Branch Name"
                        style={{ margin: 8 }}
                        placeholder="Ex. New Westminster 3rd Ave"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleNameInput.bind(this)}
                    /></div>
                    <div>
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
                                alignSelf: 'flex-start'
                            }}
                            withIcon={false}
                            buttonText='ATTACH LOCATION IMAGE'
                            onChange={this.handleOfficeImageInput.bind(this)}
                            imgExtension={['.jpg', '.gif', '.png', '.gif']}
                            maxFileSize={5242880}
                            withPreview={true}
                            withLabel={false}
                            singleImage={true}
                            fileContainerStyle={{ padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px', backgroundColor: '#FFFCF7' }}
                        />
                        <Button className={classes.actionButton} onClick={this.addFloor.bind(this)}>
                            Add Floor
                        </Button>
                    </div>
                    {this.renderFloors.bind(this)()}
                    <div>
                        <Button className={classes.actionButtonCenter} onClick={this.handleSubmit.bind(this)}>
                            Publish
                        </Button>
                    </div>
                </form>
            </div>);
    }
}
export default withStyles(styles, { withTheme: true })(AddLocationForm);
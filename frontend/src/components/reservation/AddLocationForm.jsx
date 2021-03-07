import React from 'react';
import { Button, Typography, TextField } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";
import Endpoint from '../../config/Constants';

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
        left: '25%',
        width: '45%',
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
        const floor = { floor_id: this.getLowestID.bind(this), floor_num: 0, floor_desks: "" }
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
        if (this.state.city === null) {
            alert("city is still null");
        } else {
            const floors = [];
            for (const floor of this.state.inputFloors) {
                floors.push(this.parseFloorFromInputFloor(floor));
            }

            const jsonBody = {
                city: this.state.city,
                name: this.state.name,
                address: this.state.address,
                image: this.state.image,
                floors: floors
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonBody)
            };

            fetch(Endpoint + "/location", requestOptions)
                .then((response) => response.text())
                .then(result => {
                    this.props.closeModal();
                })
                .catch(error => console.log('error', error));
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
                    <Button className={classes.actionButton}>
                        Attach Image
                    </Button>
                    <Button className={classes.actionButton} onClick={this.deleteFloor.bind(this, floor.floor_id)}>
                        Remove Floor
                    </Button>
                </div>
                <div>
                    <TextField
                        id="desks_id"
                        label="Semicolon-separated desk ID's with capacities"
                        style={{ margin: 8 }}
                        placeholder="01-1;02-4;03-11"
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
                        label="City"
                        style={{ margin: 8 }}
                        placeholder="SUR"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleCityInput.bind(this)}
                    /></div>
                    <div><TextField
                        id="name"
                        label="Name"
                        style={{ margin: 8 }}
                        placeholder="ICBC Westminster"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleNameInput.bind(this)}
                    /></div>
                    <div><TextField
                        id="address"
                        label="Address"
                        style={{ margin: 8 }}
                        placeholder="10262 152A St"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleAddressInput.bind(this)}
                    /></div>
                    <div>
                        <Button className={classes.actionButton} onClick={this.addFloor.bind(this)}>
                            Add Floor
                        </Button>
                        <Button className={classes.actionButton}>
                            Attach Image
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
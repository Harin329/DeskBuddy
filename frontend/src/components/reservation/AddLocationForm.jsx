import React from 'react';
import { Button, FormControl, Input, List, ListItem, ListItemIcon, Grid, Typography, TextField, MenuItem, Divider, Modal, IconButton } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

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
                return floor.floor_id != id;
            })
        }));
    }

    handleSubmit(id) {

    }

    handleDeskInput(id) {
        this.setState(prevState => ({
            inputFloors: prevState.inputFloors.map((floor) => {
                if (floor.floor_id === id) {
                    
                }
                return floor;
            })
        }));
    }


    renderFloors() {
        const { classes } = this.props;

        let content = this.state.inputFloors.map((floor) =>
            <div>
                <div>
                    <TextField
                        id="num_id"
                        label="Floor Number"
                        style={{ margin: 8 }}
                        placeholder="1234 Test Road"
                        variant="outlined"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
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
                        onChange={this.handleDeskInput.bind(this)}
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
                        placeholder="NV"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    /></div>
                    <div><TextField
                        id="address"
                        label="Address"
                        style={{ margin: 8 }}
                        placeholder="1234 Test Road"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                    /></div>
                    <div>
                        <Button className={classes.actionButton} onClick={this.addFloor.bind(this)}>
                            Add Floor
                        </Button>
                    </div>
                    {this.renderFloors.bind(this)()}
                    <div>
                        <Button className={classes.actionButtonCenter}>
                            Publish
                        </Button>
                    </div>
                </form>
            </div>);
    }
}
export default withStyles(styles, { withTheme: true })(AddLocationForm);
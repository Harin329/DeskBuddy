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
        left: '30%',
        width: '40%',
        height: 'auto',
        background: '#FFFCF7',
        padding: '30px',
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

    addFloor() {
        const floor = []
        this.setState(prevState => ({
            inputFloors: [...prevState.inputFloors, floor]
        }));
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
                        <Button className={classes.actionButton} onClick={this.addFloor}>
                            Add Floor
                        </Button>
                    </div>
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
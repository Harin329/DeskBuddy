import {Button, MenuItem, TextField, Typography} from "@material-ui/core";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {isMobile} from "react-device-detect";

function MailResponseForm(props){

    const useStyles = makeStyles((theme) => ({
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
            marginTop: '15px',
            marginBottom: '10px',
            fontFamily: 'Lato',
            fontWeight: 'bolder',
            fontSize: 18,
            justifyContent: "center",
            alignItems: "center"
        },
        inputBoxes: {
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 20,
            marginTop: 10
        },
        sectionTextModal: {
            color: 'black',
            fontFamily: 'Lato',
            fontWeight: 'bolder',
            fontSize: 20,
            textAlign: 'center',
            marginBottom: 20
        },
        makeRequest: {
            position: 'fixed',
            top: '20%',
            left: isMobile? '5%' : '25%',
            width: isMobile? '75%' : '45%',
            height: '400',
            background: '#FFFCF7',
            padding: '30px',
            overflow: 'auto'
        },
        typeInput: {
            fontFamily: 'Lato',
            marginRight: 20,
            marginLeft: 8
        }

    }));

    const classes = useStyles();

    return (
        <div className={classes.makeRequest} onClose={handleUpdateLocationClose}>
            <Typography className={classes.sectionTextModal}>
                Request Response Form
            </Typography>
            <Typography className={classes.sectionTextModal}>
                Name
            </Typography>
            <Typography className={classes.sectionTextModal}>
                Request Type
            </Typography>
            <Typography className={classes.sectionTextModal}>
                Additional Instructions
            </Typography>
            <form>
                <div><TextField
                    id="location"
                    style={{ marginTop: 20 }}
                    placeholder="Administrator Response"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleForwardingInput}
                /></div>
                <TextField className={classes.inputBoxes} id="outlined-basic" variant="outlined" select onChange={handleTypeChange} value={mailType}>
                    {typeList.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <div>
                    <Button className={classes.actionButtonCenter} onClick={handleSubmit}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default MailResponseForm;
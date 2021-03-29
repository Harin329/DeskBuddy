import React, {useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, TextField, Typography} from "@material-ui/core";
import Endpoint from "../../config/Constants";
import safeFetch from "../../util/Util"
import {useMsal} from "@azure/msal-react";
import {isMobile} from "react-device-detect";


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


function MailRequestForm(props) {

    const [type, setType] = useState("");
    const [forwardingLocation, setForwardingLocation] = useState("");
    const [instructions, setInstructions] = useState("");
    const [requestedDate, setRequestedDate] = useState(new Date());

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();

    const handleTypeInput = (input) => {
        setType(input.target.value);
    }

    const handleForwardingInput = (input) => {
        setForwardingLocation(input.target.value);
    }

    const handleDateInput = (input) => {
        setRequestedDate(input.target.value);
    }

    const handleInstructionsInput = (input) => {
        setInstructions(input.target.value);
        console.log(requestedDate);
    }

    const handleRequestFormClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleSubmit = (event) => {

        let jsonBody = {
            mail_id: props.children.mailID,
            employee_id: userOID,
            employee_name: accounts[0].name,
            employee_phone: null,
            employee_email: accounts[0].idTokenClaims.email,
            request_type: type,
            forward_location: forwardingLocation,
            additional_instructions: instructions,
            req_completion_date: requestedDate
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(jsonBody)
        };
        safeFetch(Endpoint + "/request", requestOptions)
            .then((response) => response.text())
            .then(result => {
                props.closeModal();
            })
            .catch(error => console.log('error', error));
        handleRequestFormClose();
    }

    return (
        <div className={classes.makeRequest} onClose={handleRequestFormClose}>
            <Typography className={classes.sectionTextModal}>
                Mail Assistance Form
            </Typography>
            <form>
                <div>
                    <input type="radio" id="hold" name="type" value="hold" onChange={handleTypeInput}/>
                    <label  className={classes.typeInput}>Hold</label>
                    <input type="radio" id="forward" name="type" value="forward" onChange={handleTypeInput}/>
                    <label  className={classes.typeInput}>Forward</label>
                    <input type="radio" id="open" name="type" value="open" onChange={handleTypeInput}/>
                    <label  className={classes.typeInput}>Open</label>
                    <input type="radio" id="assist" name="type" value="assist" onChange={handleTypeInput}/>
                    <label  className={classes.typeInput}>Assist</label>
                </div>
                <div><TextField
                    id="location"
                    style={{ marginTop: 20 }}
                    placeholder="Forwarding Location (Optional)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleForwardingInput}
                /></div>
                <div><TextField
                    id="instructions"
                    style={{ marginTop: 20 }}
                    placeholder="Additional Instructions (500)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleInstructionsInput}
                /></div>
                    <Typography style={{ marginTop: 20, fontFamily: 'Lato'}}>
                        Requested Completion Date
                    </Typography>
                    <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleDateInput}/>
                <div>
                    <Button className={classes.actionButtonCenter} onClick={handleSubmit}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default MailRequestForm;
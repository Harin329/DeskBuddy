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
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
    },
    inputBoxes: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: '10px',
        margin: 8
    },
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
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
        marginTop: 10,
        marginBottom: 15
    }

}));


function MailRequestForm(props) {

    const [name, setName] = useState("");
    const [type, setType] = useState("");
    const [forwardingLocation, setForwardingLocation] = useState("");
    const [instructions, setInstructions] = useState(0);
    const [requestedDate, setRequestedDate] = useState(new Date());

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();


    const handleNameInput = (input) => {
        setName(input.target.value)
    }

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
    }

    const handleUpdateLocationClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleSubmit = (event) => {

        let jsonBody = {
            mail_id: 0,
            employee_id: userOID,
            employee_name: name,
            employee_email: "5",
            employee_phone: "604",
            request_type: type,
            forward_location: forwardingLocation,
            additional_instructions: instructions,
            req_completion_date: requestedDate,
            completion_date: new Date(),
            status: null,
            adminID: null
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify(jsonBody)
        };

        safeFetch(Endpoint + "/mail/CreateMailRequest", requestOptions)
            .then((response) => response.text())
            .then(result => {
                props.closeModal();
            })
            .catch(error => console.log('error', error));

    }

    return (
        <div className={classes.makeRequest} onClose={handleUpdateLocationClose}>
            <Typography className={classes.sectionTextModal}>
                Mail Assistance Form
            </Typography>
            <form>
                <div><TextField
                    id="name"
                    label="Name"
                    style={{ margin: 8 }}
                    placeholder="Name (50)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleNameInput}
                /></div>
                <div className={classes.typeInput}>
                    <input type="radio" id="hold" name="type" value="hold" onSelect={handleTypeInput}/>
                    <label>Hold</label>
                    <input type="radio" id="forward" name="type" value="forward" onSelect={handleTypeInput}/>
                    <label>Forward</label>
                    <input type="radio" id="open" name="type" value="open" onSelect={handleTypeInput}/>
                    <label>Open</label>
                    <input type="radio" id="assist" name="type" value="assist" onSelect={handleTypeInput}/>
                    <label>Assist</label>
                </div>
                <div><TextField
                    id="location"
                    label="Forwarding Location"
                    style={{ margin: 8 }}
                    placeholder="Optional (50)"
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
                    label="Additional Instructions"
                    style={{ margin: 8 }}
                    placeholder="Additional Instructions (500)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleInstructionsInput}
                /></div>
                    <Typography style={{ margin: 8 }}>
                        Requested Completion Date
                    </Typography>
                    <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onClick={handleDateInput}/>
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
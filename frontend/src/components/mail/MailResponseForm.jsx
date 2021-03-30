import {Button, MenuItem, TextField, Typography} from "@material-ui/core";
import React, {useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {isMobile} from "react-device-detect";
import safeFetch, {accountIsAdmin} from "../../util/Util";
import Endpoint from "../../config/Constants";
import {useMsal} from "@azure/msal-react";

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
        marginBottom: 20,
        textAlign: 'center'
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
    subheading: {
        fontFamily: 'Lato',
        marginRight: 20,
        marginLeft: 8,
        marginBottom: 5
    }

}));

function MailResponseForm(props){

    const [response, setResponse] = useState("");
    const [statusList, setStatusList] = useState(["Waiting for assistance", "Closed", "Cannot perform action", "Completed"]);
    const [status, setStatus]= useState("");

    const classes = useStyles();

    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);
    const userOID = accounts[0].idTokenClaims.oid;

    const handleResponseInput = (event) => {
        setResponse(event.target.value);
    }

    const handleStatusInput = (event) => {
        setStatus(event.target.value);
    }

    const handleAdminResponse = () => {
        let jsonBody = {
            mail_id: 135,
            employee_id: userOID,
        }
        const requestOptions = {
            method: 'PUT',
            redirect: 'follow',
            body: JSON.stringify(jsonBody)
        };

        safeFetch(Endpoint + "/requests", requestOptions)
            .then((response) => response.text())
            .then(result => {
            })
            .catch(error => console.log('error', error));

    }

    const handleUserResponse = () => {
        let jsonBody = {
            mail_id: 135,
            employee_id: 123,
        }
        const requestOptions = {
            method: 'PUT',
            redirect: 'follow',
            body: JSON.stringify(jsonBody)
        };

        safeFetch(Endpoint + "/requests", requestOptions)
            .then((response) => response.text())
            .then(result => {
            })
            .catch(error => console.log('error', error));

    }

    const deleteRequest = () => {
        let jsonBody = {
            mail_id: 135,
            employee_id: 123,
        }
        const requestOptions = {
            method: 'PUT',
            redirect: 'follow',
            body: JSON.stringify(jsonBody)
        };

        safeFetch(Endpoint + "/request/close", requestOptions)
            .then((response) => response.text())
            .then(result => {
            })
            .catch(error => console.log('error', error));

    }

    return (
        <div className={classes.makeRequest}>
            <Typography className={classes.sectionTextModal}>
                Request Response Form
            </Typography>
            <Typography className={classes.subheading}>
                Employee Name:
            </Typography>
            <Typography className={classes.subheading}>
                Request Type:
            </Typography>
            <Typography className={classes.subheading}>
                Additional Instructions:
            </Typography>
            {!isAdmin && <Typography className={classes.subheading}>
                Admin Response:
            </Typography>}
            <form>
                {isAdmin && <div><TextField
                    id="location"
                    style={{ marginTop: 20 }}
                    placeholder="Administrator Response"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleResponseInput}
                /></div>}
                <Typography className={classes.subheading}>
                    Status:
                </Typography>
                {isAdmin && <TextField className={classes.inputBoxes} id="outlined-basic" variant="outlined" select onChange={handleStatusInput} value={status}>
                    {statusList.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>}
                <div>
                    {isAdmin && <Button className={classes.actionButtonCenter} onClick={handleAdminResponse}>
                        Update
                    </Button>}
                </div>
                <div>
                    {!isAdmin && <Button className={classes.actionButtonCenter} onClick={handleUserResponse}>
                        Request More Assistance
                    </Button>}
                </div>
                <div>
                    <Button className={classes.actionButtonCenter} onClick={deleteRequest}>
                        Close Request
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default MailResponseForm;
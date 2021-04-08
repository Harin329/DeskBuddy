import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, MenuItem, TextField, Typography} from "@material-ui/core";
import Endpoint from "../../config/Constants";
import safeFetch from "../../util/Util"
import {useMsal} from "@azure/msal-react";
import {isMobile} from "react-device-detect";
import {fetchOffices} from "../../actions/reservationActions";
import {useDispatch, useSelector} from "react-redux";
import {fetchEmployees} from "../../actions/authenticationActions";
import { setError } from '../../actions/globalActions';
import Select from "react-select";
import { getNewMail } from '../../actions/mailActions';


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
        height: '450',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto',
    },
    titles: {
        marginLeft: 8,
        fontFamily: 'Lato'
    }
}));


function NewMailForm(props) {
    const [office, setOffice] = useState("");
    const [employee, setEmployee] = useState("");
    const [officeID, setOfficeID] = useState("");
    const [officeLocation, setOfficeLocation] = useState("");
    const [recipientFN, setRecipientFN] = useState("");
    const [recipientLN, setRecipientLN] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [arrivalDate, setArrivalDate] = useState(new Date());
    const [mailType, setMailType] = useState("");
    const [sender, setSender] = useState("");
    const [typeList, setTypeList] = useState(["Parcel", "Letter"]);
    const [comment, setComment] = useState("");
    const [dimensions, setDimensions] = useState("");

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();

    const dispatch = useDispatch();
    const officeList = useSelector(state => state.reservations.offices);
    const employeeList = useSelector(state => state.authentication.users);

    const today = new Date().toISOString().substring(0,10);

    useEffect(() => {
        dispatch(fetchOffices());
        dispatch(fetchEmployees());
    }, []);

    const handleOfficeChange = (event) => {
        setOffice(event.target.value);
        const params = event.target.value.split(/-(?=[^-]+$)/);
        setOfficeLocation(params[0]);
        setOfficeID(params[1]);
    };

    const handleFormClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleEmployeeChange = (event) => {
        setEmployee(event.value);
        const params = event.value.split(['-']);
        setRecipientFN(params[0]);
        setRecipientLN(params[1]);
        setRecipientEmail(params[2]);
    }

    const handleTypeChange = (event) => {
        setMailType(event.target.value);
        console.log(event.target.value);
    }

    const handleDateChange = (event) => {
        setArrivalDate(new Date(event.target.value));
    }

    const handleSenderInput = (input) => {
        setSender(input.target.value);
    }

    const handleCommentInput = (input) => {
        setComment(input.target.value);
        console.log(comment);
    }

    const handleDimensionsInput = (input) => {
        setDimensions(input.target.value);
        console.log(dimensions);
    }

    const handleSubmit = (event) => {
        let jsonBody = {
            officeID: officeID,
            officeLocation: officeLocation,
            recipient_first: recipientFN,
            recipient_last: recipientLN,
            recipient_email: recipientEmail,
            type: mailType,
            approx_date: arrivalDate,
            sender: sender,
            dimensions: dimensions,
            comments: comment,
            adminID: userOID
        }
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonBody)
        };
        safeFetch(Endpoint + "/mail", requestOptions)
            .then(response => {
                if (!response.ok) {
                    dispatch(setError(true));
                }
                return response.text();
            })
            .then(result => {
                dispatch(getNewMail(userOID));
                props.handleNewMailRefresh();
            })
            .catch(error => {
                console.log('error', error);
                dispatch(setError(true));
            });

        handleFormClose();
    }

    const employees = employeeList.map((option) => { return {value: option.first_name + "-" + option.last_name + "-" + option.email, label: option.first_name + " " + option.last_name } })

    return (
        <div className={classes.makeRequest}>
            <Typography className={classes.sectionTextModal}>
                New Mail Form
            </Typography>
            <form>
                <Typography className={classes.titles}>
                    Office
                </Typography>
                <TextField id="outlined-basic" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
                    {officeList.map((option) => (
                        <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography className={classes.titles}>
                    Recipient
                </Typography>
                <Select
                    defaultValue={employee}
                    onChange={handleEmployeeChange}
                    options={employees}
                    className={classes.inputBoxes}
                />
                <Typography className={classes.titles}>
                    Mail Type
                </Typography>
                <TextField className={classes.inputBoxes} id="outlined-basic" variant="outlined" select onChange={handleTypeChange} value={mailType}>
                    {typeList.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography className={classes.titles}>
                    Arrival Date
                </Typography>
                <TextField id="outlined-basic" variant="outlined" type="date" InputProps={{inputProps: { max: today} }} className={classes.inputBoxes} onChange={handleDateChange}/>
                <div><TextField
                    id="sender"
                    style={{ margin: 8, width: '90%' }}
                    placeholder="Sender Information (255)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleSenderInput}
                /></div>
                <div><TextField
                    id="dimensions"
                    style={{ margin: 8, width: '90%' }}
                    placeholder="Mail dimensions (LxWxH)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleDimensionsInput}
                /></div>
                <div><TextField
                    id="comments"
                    style={{ margin: 8, width: '90%' }}
                    placeholder="Additional Comments (255)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleCommentInput}
                /></div>
                <div>
                    <Button className={classes.actionButtonCenter} onClick={handleSubmit}>
                        Send
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default NewMailForm;
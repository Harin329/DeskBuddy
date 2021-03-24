import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, Grid, MenuItem, TextField, Typography} from "@material-ui/core";
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


function NewMailForm(props) {
    const [office, setOffice] = useState("");
    const [employee, setEmployee] = useState("");
    const [officeID, setOfficeID] = useState("");
    const [officeLocation, setOfficeLocation] = useState("");
    const [recipientFN, setRecipientFN] = useState("");
    const [recipientLN, setRecipientLN] = useState("");
    const [recipientEmail, setRecipientEmail] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [officeList, setOfficeList] = useState([]);
    const [arrivalDate, setArrivalDate] = useState(new Date());
    const [mailType, setMailType] = useState("");
    const [sender, setSender] = useState("");
    const [typeList, setTypeList] = useState(["Parcel", "Letter"]);
    const [comment, setComment] = useState("");
    const [dimensions, setDimensions] = useState("");

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();

    useEffect( () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/office/getAllOffices", requestOptions)
            .then((response) => response.text())
            .then(result => {
                setOfficeList(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    });

    const handleOfficeChange = (event) => {
        setEmployeeList([]);
        setOffice(event.target.value);
        const params = event.target.value.split(['-']);
        setOfficeLocation(params[0]);
        setOfficeID(params[1]);

        console.log(params[0])
        console.log(params[1])

        const requestOptions = {
            method: 'GET',
            redirect: 'follow',
        };

        safeFetch(Endpoint + "/user/GetUserNameByOffice/" + params[0] +  "/" + params[1], requestOptions)
            .then((response) => response.text())
            .then(result => {
                setEmployeeList(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    };

    const handleEmployeeChange = (event) => {
        setEmployee(event.target.value);
        const params = event.target.value.split(['-']);
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
        console.log(arrivalDate);
    }

    const handleSenderInput = (input) => {
        setSender(input.target.value);
        console.log(sender);
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
        let userName = accounts[0].name.split(" ");

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
            .then((response) => response.text())
            .then(result => {
            })
            .catch(error => alert(error));
    }

    return (
        <div className={classes.makeRequest}>
            <Typography className={classes.sectionTextModal}>
                New Mail Form
            </Typography>
            <form>
                <Typography>
                    Office
                </Typography>
                <TextField id="outlined-basic" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
                    {officeList.map((option) => (
                        <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography>
                    Recipient
                </Typography>
                <TextField id="outlined-basic" variant="outlined" select onChange={handleEmployeeChange} value={employee} className={classes.inputBoxes}>
                    {employeeList.map((option) => (
                        <MenuItem key={option.first_name + "-" + option.last_name} value={option.first_name + "-" + option.last_name + "-" + option.email}>
                            {option.first_name + " " + option.last_name}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography>
                    Mail Type
                </Typography>
                <TextField className={classes.inputBoxes} id="outlined-basic" variant="outlined" select onChange={handleTypeChange} value={mailType}>
                    {typeList.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <Typography>
                    Arrival Date
                </Typography>
                <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleDateChange}/>
                <div><TextField
                    id="sender"
                    style={{ margin: 8 }}
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
                    style={{ margin: 8 }}
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
                    style={{ margin: 8 }}
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
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
    const [recipient, setRecipient] = useState("");
    const [officeList, setOfficeList] = useState("");
    const [arrivalDate, setArrivalDate] = useState(0);
    const [mailType, setMailType] = useState("");
    const [sender, setSender] = useState("");
    const [typeList, setTypeList] = useState(["Parcel", "Letter"]);
    const [comment, setComment] = useState("");

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

    const handleSenderInput = (input) => {
        setSender(input.target.value);
    }

    const handleCommentInput = (input) => {
        setComment(input.target.value);
    }


    const handleUpdateLocationClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleSubmit = (event) => {

        let requestOptions;

        // TODO: Put endpoint
        safeFetch(Endpoint + "", requestOptions)
            .then((response) => response.text())
            .then(result => {
                props.closeModal();
            })
            .catch(error => console.log('error', error));

        handleUpdateLocationClose();
    }

    return (
        <div className={classes.makeRequest} onClose={handleUpdateLocationClose}>
            <Typography className={classes.sectionTextModal}>
                Mail Assistance Form
            </Typography>
            <form>
                {/*<TextField className={classes.officeSelector} id="outlined-basic" label="" variant="outlined">*/}
                {/*    {officeList.map((option) => (*/}
                {/*        <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>*/}
                {/*            {option.name}*/}
                {/*        </MenuItem>*/}
                {/*    ))}*/}
                {/*</TextField>*/}
                <TextField className={classes.officeSelector} id="outlined-basic" label="" variant="outlined">
                    <MenuItem>Parcel</MenuItem>
                    <MenuItem>Letter</MenuItem>
                </TextField>
                <div><TextField
                    id="sender"
                    label="Sender"
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
                <Typography style={{ margin: 8 }}>
                    Arrival Date
                </Typography>
                <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes}/>
                <div><TextField
                    id="comments"
                    label="Additional Comments"
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
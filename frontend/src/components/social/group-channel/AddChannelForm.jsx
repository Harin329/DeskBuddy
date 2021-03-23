import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Button, MenuItem, TextField, Typography} from "@material-ui/core";
import Endpoint from "../../../config/Constants";
import safeFetch from "../../../util/Util"
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
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
    },
    addChannel: {
        position: 'fixed',
        top: '20%',
        left: isMobile? '5%' : '25%',
        width: isMobile? '75%' : '45%',
        height: '400',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto'
    },
    officeSelector: {
        marginLeft : 8
    },
    iconTitle: {
        marginLeft: 8,
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14
    }
}));


function AddChannelForm(props) {

    const [title, setTitle] = useState("");
    const [icon, setChannelIcon] = useState("");
    const [channels, setChannel] = useState([]);

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();

    useEffect( () => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/channel", requestOptions)
            .then((response) => response.text())
            .then(result => {
                setChannel(JSON.parse(result));
            })
            .catch(error => console.log('error', error));
    });

    const handleTitleInput = (input) => {
        setTitle(input.target.value)
    }

    const handleAddChannelClose = () => {
        props.whatToDoWhenClosed();
    }

    const handleIconChange = (event) => {
        
    }

    const handleSubmit = (event) => {

        let jsonBody;
        let requestOptions;

            jsonBody = {
                user: userOID,
                channel_name: title,
                channel_icon: null
            }

        if (jsonBody.channel_name == "") {

        } else {

            console.log(jsonBody);
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonBody)
            };
            safeFetch(Endpoint + "/channel", requestOptions)
                .then((response) => response.text())
                .then(result => {
                    props.closeModal();
                })
                .catch(error => console.log('error', error));
            
                handleAddChannelClose();
            }
    }

    return (
        <div className={classes.addChannel} onClose={handleAddChannelClose}>
            <Typography className={classes.sectionTextModal}>
                Create New Channel
            </Typography>
            <form>
                <div><TextField
                    id="title"
                    label="Title"
                    style={{ margin: 8 }}
                    placeholder="Channel Title (25)"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    onChange={handleTitleInput}
                /></div>
                <h1 className={classes.iconTitle}>Attach Icon (Optional)</h1>
                <div>
                    <Button className={classes.actionButtonCenter} onClick={handleSubmit}>
                        Create
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default AddChannelForm;
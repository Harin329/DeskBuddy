import React, { useEffect, useState } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { Button, MenuItem, TextField, Typography } from "@material-ui/core";
import Endpoint from "../../../config/Constants";
import safeFetch from "../../../util/Util"
import { useMsal } from "@azure/msal-react";
import { isMobile } from "react-device-detect";
import ImageUploader from 'react-images-upload';


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
        left: isMobile ? '5%' : '25%',
        width: isMobile ? '75%' : '45%',
        height: '400',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto'
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
    const [channels, setChannels] = useState([]);
    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;
    const classes = useStyles();
    var dup_title = false;
    const [open, setOpen] = useState(false);

    const getChannels = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/channel", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result);
                setChannels(res);
            }).catch(error => console.log('error', error));
    }

    useEffect(() => {
        getChannels();
    }, []);

    const handleTitleInput = (input) => {
        setTitle(input.target.value);
    }

    const handleAddChannelClose = () => {
        props.whatToDoWhenClosed();
        setOpen(false);
    }

    const handleChannelIconInput = (input) => {
        setChannelIcon(input[0]);
    }

    const handleDuplicateTitle = () => {
        dup_title = false;

        channels.forEach(function (channel) {
            var channelName = channel.channel_name;
            if (title == channelName) {
                dup_title = true;
            }
        });
    }

    const handleSubmit = (event) => {


        let jsonBody;
        let requestOptions;

        const formData = new FormData();

        jsonBody = {
            user: userOID,
            channel_name: title
        }

        formData.append("body", JSON.stringify(jsonBody));
        formData.append("icon", icon);

        // TODO: Show screens for duplicate title
        handleDuplicateTitle();

        if (dup_title == false) {
            requestOptions = {
                method: 'POST',
                body: formData
            };
            safeFetch(Endpoint + "/channel", requestOptions)
                .then((response) => response.text())
                .then(result => {
                    props.closeModal();
                    getChannels();
                })
                .catch(error => console.log('error', error));

            handleAddChannelClose();
        } else {
            console.log("FAILED")
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
                <ImageUploader
                    buttonStyles={{
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
                        alignSelf: 'flex-start'
                    }}
                    withIcon={false}
                    buttonText='ATTACH IMAGE'
                    onChange={handleChannelIconInput}
                    imgExtension={['.jpg', '.gif', '.png', '.gif']}
                    maxFileSize={5242880}
                    withPreview={true}
                    withLabel={false}
                    singleImage={true}
                    fileContainerStyle={{ padding: '0px', margin: '0px', boxShadow: '0px 0px 0px 0px', backgroundColor: '#FFFCF7' }}
                />
                <div>
                    <Button className={classes.actionButtonCenter} onClick={handleSubmit} disabled={title == '' ? true : false}>
                        Create
                    </Button>
                </div>
            </form>
        </div>
    )

}

export default AddChannelForm;
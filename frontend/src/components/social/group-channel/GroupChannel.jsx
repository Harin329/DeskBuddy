import React, {useState, useEffect} from 'react';
import Endpoint from '../../../config/Constants';
import {Button, Divider, Grid, IconButton, List, ListItem, Modal, Typography,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Home from '../../../assets/home.png';
import LinedHeader from "./LinedHeader";
import Delete from "../../../assets/delete.png";
import Feed from '../feed';
import {useMsal} from "@azure/msal-react";
import safeFetch, {accountIsAdmin} from "../../../util/Util";
import CancelIcon from "@material-ui/icons/Cancel";
import { isMobile } from "react-device-detect";
import styled from 'styled-components';
import { setError } from '../../../actions/globalActions';
import { useDispatch } from 'react-redux';


const useStyles = makeStyles((theme) => ({
    channelText: {
        color: 'white',
        fontFamily: 'lato',
        fontSize: 14,
        textAlign: 'center',
    },
    addChannelButton: {
        color: 'black',
        fontFamily: 'lato',
        fontSize: 10,
        textAlign: "center",
        background: "white",
        borderRadius: "30px",
        marginBottom: 20,
        marginTop: 20
    },
    title: {
        color: 'white',
        fontFamily: 'lato',
        fontSize: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 35,
        margin: 20,
        padding: 0,
    },
    paper: {
        position: 'fixed',
        top: '30%',
        left: isMobile ? '3%' : '35%',
        width: isMobile ? '80%' : '20%',
        height: 'auto',
        backgroundColor: 'white',
        padding: '30px',
    },
    confirmButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '30px',
        padding: '0 20px',
        marginTop: '5px',
        marginBottom: '5px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    confirmationModalText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
}))

const Container = styled.div`
    display: flex;
    justify-content: space-evenly;
    flex-direction: column;
    align-items: center;

    @media (min-width: 1240px) {
        flex-direction: row;
        align-items: flex-start;
    }
`;

function GroupChannel() {
    const classes = useStyles();
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(1);
    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);
    const [open, setOpen] = useState(false);
    const [channel, setChannel] = useState();
    const dispatch = useDispatch();

    const getChannels = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/channel", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result);
                //console.log(res);
                setChannels(res);
            }).catch(error => {
                console.log('error', error);
                dispatch(setError(true));
            });
    };

    useEffect(() => {
        getChannels();
    },[]);

    const handleOpen = (option) => {
        setChannel(option);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const feedElement = React.createRef();

    const handleListItemClicked = (event, id) => {
        // console.log("You clicked " + id);
        feedElement.current.handleChannelChange(id);
        setSelectedChannel(id);
    };

    const handleDeleteChannelClicked = (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "employee_id": 319,
            "channel_id": id,
        })
        console.log(raw);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/channel", requestOptions)
            .then(response => response.text())
            .then(() => {
                getChannels();
            })
            .catch(error => {
                console.log('error', error);
                dispatch(setError(true));
            });
        //console.log("Channel will be deleted");
        handleClose();
    };
    const handleAddChannelClicked = (event) => {
        console.log("Clicked add channel");
    };


    const confirmationBody = () => {
        return (
            <div className={classes.paper}>
                <div style={{ width: '105%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex' }}>
                    <IconButton size='small' onClick={handleClose}>
                        <CancelIcon size="small" />
                    </IconButton>
                </div>
                <Typography className={classes.confirmationModalText}>
                    Do you want to delete the group channel?
                </Typography>
                <div style={{ width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                    <Button className={classes.confirmButton} onClick={() => {
                        handleDeleteChannelClicked(channel);
                    }}>Confirm</Button>
                </div>
            </div>)
    };



    return (
        <Container>
            <div style={{ justifyContent: 'center', alignItems: 'center', width: '350px', height: '500px', backgroundColor: '#353B3C', borderRadius: 25}}>
                <Typography className={classes.title}>GENERAL</Typography>
                {LinedHeader('YOUR GROUPS', 3, 3, 3)}
                <div>
                    <List style={{width: '95%', height: "200px", overflow: 'auto'}}>
                        {channels.map((option, index) => {
                            return (
                                <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{ width: '70%', height: '30px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <ListItem button={true} onClick={(event) => handleListItemClicked(event, option.channel_id)} selected={selectedChannel === option.channel_id} style={{overflow: 'hidden'}}>
                                            <div style={{width: '20%', height: '15px', alignItems: 'center'}}>
                                                {(option.channel_icon != null)
                                                    ? <img src={'data:image/png;base64,' + new Buffer(option.channel_icon, 'binary')
                                                        .toString('base64')}
                                                           alt={""} style={{height:'15px', width: '15px', borderRadius: 10, backgroundColor: 'transparent'}} />
                                                    : <img src={Home} alt={"home"} style={{ width: '15px', height: '15px', backgroundColor: 'transparent', borderRadius: 10}} />}
                                            </div>
                                            <div style={{ width: '80%', height: '15px',  alignItems: 'center'}}>
                                                <Typography className={classes.channelText}>
                                                    {option.channel_name}
                                                </Typography>
                                            </div>
                                        </ListItem>
                                    </div>
                                    {(isAdmin) && <div style={{width: '35px', height: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        {(option.channel_id !== 0 && option.channel_id !== 1) &&
                                        <Button onClick={() => handleOpen(option.channel_id)}
                                                style={{ width: 15, height: 15, border: 'none'}}>
                                            <img src={Delete} alt={"Delete"} style={{width: '15px', height: '15px', backgroundColor: 'transparent'}}/>
                                        </Button>}
                                    </div>}
                                </div>
                            )
                        })}
                        <Modal
                            open={open}
                            onClose={handleClose}>
                            {channel !== undefined ? confirmationBody() : null}
                        </Modal>
                    </List>
                </div>
            {/*{props.isAdmin && <Divider/>}*/}
            {isAdmin && <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <Button onClick={(event) => handleAddChannelClicked(event)} className={classes.addChannelButton}>Add Channel</Button>
            </div>}
            </div>
            <Feed ref={ feedElement } style={{ flex: '1' }}/>
        </Container>
    )
}
export default GroupChannel;


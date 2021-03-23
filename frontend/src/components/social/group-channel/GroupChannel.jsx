import React, {useState, useEffect} from 'react';
import Endpoint from '../../../config/Constants';
import {Button, Modal, Divider, Grid, List, ListItem, Typography,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Home from '../../../assets/home.png';
import LinedHeader from "./LinedHeader";
import Delete from "../../../assets/delete.png";
import Feed from '../feed';
import {useMsal} from "@azure/msal-react";
import safeFetch, {accountIsAdmin} from "../../../util/Util";

import AddChannelForm from "./AddChannelForm";


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
    }
}))


function GroupChannel() {
    const classes = useStyles();
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(1);
    const [addChannel, setAddChannel] = useState(false);
    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);

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
            }).catch(error => console.log('error', error));
    };

    useEffect(() => {
        getChannels();
    },[]);

    const feedElement = React.createRef();

    const handleListItemClicked = (event, id) => {
        // console.log("You clicked " + id);
        feedElement.current.handleChannelChange(id);
        setSelectedChannel(id);
    };

    const handleDeleteChannelClicked = (event, id) => {
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
                //getChannels();
            })
            .catch(error => console.log('error', error));
        //console.log("Channel will be deleted");
    };
    const handleAddChannelClose = () => {
        setAddChannel(false);
    };

    const addChannelBody = () => {
        return <AddChannelForm closeModal={handleAddChannelClose} whatToDoWhenClosed={(bool) => {setAddChannel(bool)}}/>
    }

    const handleAddChannelOpen = () => {
        setAddChannel(true);
    }

    return (
        <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <div style={{ justifyContent: 'center', alignItems: 'center', width: '350px', height: '500px', backgroundColor: '#353B3C', borderRadius: 25}}>
                <Typography className={classes.title}>GENERAL</Typography>
                {LinedHeader('YOUR GROUPS', 3, 3, 3)}
                <div>
                    <List style={{width: '95%', height: "200px", overflow: 'auto'}}>
                        {channels.map((option, index) => {
                            return (
                                <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{ width: '60%', height: '30px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <ListItem button={true} onClick={(event) => handleListItemClicked(event, option.channel_id)} selected={selectedChannel === option.channel_id} style={{overflow: 'hidden'}}>
                                            <div style={{width: '20%'}}>
                                                {(option.channel_icon != null)
                                                    ? <img src={'data:image/png;base64,' + new Buffer(option.channel_icon, 'binary')
                                                        .toString('base64')}
                                                           alt="channelLogo" style={{height:'20px', width: '20px', borderRadius: 20}} />
                                                    : <img src={Home} alt={"home"} style={{ height: '15px', backgroundColor: 'transparent', borderRadius: 10}} />}
                                            </div>
                                            <div style={{ width: '5%', height: '10px', alignItems: 'center', justifyContent: 'left', display: 'flex', flexDirection: 'row' }}>
                                                <Typography className={classes.channelText}>
                                                    {option.channel_name}
                                                </Typography>
                                            </div>
                                        </ListItem>
                                    </div>
                                    {(isAdmin) && <div style={{width: '50px', height: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        {(option.channel_id !== 0 && option.channel_id !== 1) &&
                                        <Button onClick={(event) => handleDeleteChannelClicked(event, option.channel_id)}
                                                                            style={{ width: 15, height: 15, border: 'none'}}>
                                            <img src={Delete} alt="Delete" style={{width: '15px', height: '15px', backgroundColor: 'transparent'}}/>
                                        </Button>}
                                    </div>}
                                </div>
                            )
                        })}
                    </List>
                </div>
            {/*{props.isAdmin && <Divider/>}*/}
            {isAdmin && <div style={{justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
                <Button onClick={(event) => handleAddChannelOpen(event)} className={classes.addChannelButton}>Add Channel</Button>
            </div>}
            <Modal
                    open={addChannel}
                    onClose={handleAddChannelClose}
                >
                    {addChannelBody()}
                </Modal>
            </div>
            <Feed ref={ feedElement } style={{ flex: '1' }}/>
        </div>
    )
}
export default GroupChannel;


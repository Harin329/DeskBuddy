import React, {useState, useEffect} from 'react';
import Endpoint from '../../config/Constants';
import {Button, Divider, Grid, List, ListItem, Typography,} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Home from '../../assets/home.png';
import Subheader from "../reservation/Subheader";
import Delete from "../../assets/delete.png";
import styled from 'styled-components';

import Feed from '../social/feed/index';

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
        margin: 30,
    },
    title: {
        color: 'white',
        fontFamily: 'lato',
        fontSize: 40,
        textAlign: 'center',
        fontWeight: 'bold',
        margin: 20,
        padding: 10,
    }


}))


function GroupChannel(props) {
    const classes = useStyles();
    const [channels, setChannels] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(1);


    const getChannels = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/channel/channels/" + 319, requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result);
                //console.log(res);
                setChannels(res);
            }).catch(error => console.log('error', error));
    };

    useEffect(() => {
        getChannels();
    });

    const feedElement = React.createRef();

    const handleListItemClicked = (event, id) => {
        // console.log("You clicked " + id);
        feedElement.current.handleChannelChange(id);
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

        fetch(Endpoint + "/channel/channels", requestOptions)
            .then(response => response.text())
            .then(() => {
                //getChannels();
            })
            .catch(error => console.log('error', error));
        //console.log("Channel will be deleted");
    };
    const handleAddChannelClicked = (event) => {
        console.log("Clicked add channel");
    };

    return (
        <Container>
            <Grid container justify='center' alignItems='center' style={{width: '350px', height: '500px', backgroundColor: 'red'}}>
                <Grid item xs={12}>
                    <Typography className={classes.title}>GENERAL</Typography>
                </Grid>
                {Subheader('YOUR GROUPS', 3, 4, 3)}
                <Grid item xs={12}>
                    <div>
                     <List>
                        {channels.map((option, index) => {
                            return (
                                <div style={{alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row'}}>
                                    <div style={{ width: '60%', height: '30px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <ListItem button={true} onClick={(event) => handleListItemClicked(event, option.channel_id)}>
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
                                    {props.isAdmin &&<div style={{height: '20px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <Button onClick={(event) => handleDeleteChannelClicked(event, option.channel_id)}
                                                style={{ backgroundColor: 'transparent', border: 'none'}}>
                                            <img src={Delete} alt="Delete" style={{ height: '15px', backgroundColor: 'transparent'}}/>
                                        </Button>
                                    </div>}
                                </div>
                            )
                        })}
                    </List>
                </div>
            </Grid>
            {props.isAdmin && <Divider/>}
            {props.isAdmin && <Button onClick={(event) => handleAddChannelClicked(event)} className={classes.addChannelButton}>Add Channel</Button>}
            </Grid>
            <Feed ref={ feedElement } style={{ flex: '1' }}/>
        </Container>
    )
}
export default GroupChannel;

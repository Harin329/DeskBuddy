import React from 'react';
import { Typography, Grid, ListItem, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import InfiniteScroll from "react-infinite-scroller";


const useStyles = makeStyles({
    sectionText: {
        color: 'white',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20
    },
    deskSectionText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
    },
    deskText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        display: 'inline'
    },
    officeText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 16,
        textAlign: 'center'
    },
    reservationCard: { backgroundColor: '#E5E5E5', height: '110px', marginBottom: '10px', },
});


function MailModule(size, text) {
    const classes = useStyles();

    const mockData = ["ABC", "DEF"];

    return (
        <Grid item xs={size} style={{ height: 500, borderRadius: 20, border: 3, borderStyle: 'solid', borderColor: 'white', display: 'flex', justifyContent: 'center', margin: size === 3 ? 30 : null }}>
            <h1 style={{ backgroundColor: '#1E1E24', color: 'white', width: '20%', height: 30, textAlign: 'center', marginTop: -10, fontSize: 20, position: 'absolute' }}>{text}</h1>
            <InfiniteScroll
                style={{ padding: 30, width: '90%' }}
                useWindow={false}
            >
                {mockData.map((option) => {
                    return (
                        <ListItem className={classes.reservationCard}>
                            <div style={{ width: '25%', height: '100px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                <Typography className={classes.officeText}>
                                    PARCEL
                      </Typography>
                            </div>
                            <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '90px', width: '3px' }} />
                            <div style={{ width: '80%', height: '100px', alignItems: 'center', display: 'flex', flexDirection: 'row', marginLeft: 30 }}>
                                <div style={{ width: '40%', height: '100px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                    <Typography className={classes.deskSectionText}>
                                        MAIL ID: <Typography className={classes.deskText}>
                                            {option}
                                        </Typography>
                                    </Typography>
                                    <Typography className={classes.deskSectionText}>
                                        DATE ARRIVED: <Typography className={classes.deskText}>
                                            Date
                                                </Typography>
                                    </Typography>
                                </div>
                            </div>
                        </ListItem>
                    )
                })}
            </InfiniteScroll>
        </Grid>

    );
}

export default MailModule;
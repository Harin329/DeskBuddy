import React, { useState, useEffect } from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from 'react-device-detect';
import { useSelector, useDispatch } from 'react-redux'
import { fetchReservations } from '../../actions/reservationActions'
import { useMsal } from "@azure/msal-react";
import { Chart } from "react-google-charts";

const useStyles = makeStyles({
    titleLines: {
        height: '100%',
    },
    titleText: {
        color: 'white',
        fontFamily: 'Lato',
        fontWeight: 'bold',
        fontSize: 25,
        margin: 15,
    },
    sectionSpacing: {
        height: '25%',
        marginBottom: '29px',
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
    upcomingResBox: {
        backgroundColor: '#E5E5E5',
        height: '100px',
        marginBottom: '10px',
        alignItems: 'center',
        paddingInline: 10,
        display: 'flex'
    },
    upcomingResBoxOffice: {
        height: '80px',
        alignItems: 'center',
        justifyContent: 'left',
        display: 'flex',
        flexDirection: 'row'
    },
    upcomingResBoxCenterSection: {
        padding: '7px',
        height: '80px',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
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
});


function Today() {
    const classes = useStyles();
    const dateToday = new Date();

    const dispatch = useDispatch();
    const upcomingReservation = useSelector(state => state.reservations.upcomingReservations);

    const { accounts } = useMsal();
    const userOID = accounts[0].idTokenClaims.oid;

    useEffect(() => {
        dispatch(fetchReservations(userOID));
    }, []);

    const convertDate = (date) => {
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return (month + " " + day + ", " + year);
    };

    const desk = (option) => {
        return option.fk_office_location + option.fk_office_id + "-" + option.fk_floor_num + option.fk_desk_id
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            <Grid item xs={6} className={classes.titleLines} >
                <Typography className={classes.titleText}>TODAY: {convertDate(dateToday)}</Typography>
                {upcomingReservation.filter((res) => convertDate(new Date(res.start_date)) === convertDate(dateToday)).length > 0 && <div className={classes.upcomingResBox}>
                    <div className={classes.upcomingResBoxOffice}>
                        <div className={classes.upcomingResBoxCenterSection}>
                            <Typography className={classes.deskSectionText}>
                                OFFICE: <Typography className={classes.deskText}>
                                    {upcomingReservation.filter((res) => convertDate(new Date(res.start_date)) === convertDate(dateToday))[0].name}
                                </Typography>
                            </Typography>
                            <Typography className={classes.deskSectionText}>
                                DESK ID: <Typography className={classes.deskText}>
                                    {desk(upcomingReservation.filter((res) => convertDate(new Date(res.start_date)) === convertDate(dateToday))[0])}
                                </Typography>
                            </Typography>
                        </div>
                    </div>
                </div>}
                {upcomingReservation.filter((res) => convertDate(new Date(res.start_date)) === convertDate(dateToday)).length <= 0 && <div className={classes.upcomingResBox}>
                    <div className={classes.upcomingResBoxOffice}>
                        <div className={classes.upcomingResBoxCenterSection}>
                            <Typography className={classes.deskSectionText}>
                                Working From Home!
                            </Typography>
                        </div>
                    </div>
                </div>}
            </Grid>
            <Grid item xs={6} className={classes.titleLines} >
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: 30, marginTop: 15}}>
                    <Chart
                        width={'100%'}
                        height={'100%'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Location', 'Days per Month'],
                            ['Office', 20],
                            ['Home', 10],
                        ]}
                        options={{
                            title: 'Days at Office',
                            backgroundColor: "transparent",
                            titleTextStyle: {
                                color: 'white',
                            },
                            legend: {
                                textStyle: {
                                    color: 'white'
                                }
                            }
                        }}
                        rootProps={{ 'data-testid': '1' }}
                    />
                </div>
            </Grid>
        </Grid>

    );
}

export default Today;
import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { isMobile } from "react-device-detect";


const useStyles = makeStyles({
    mainTitleText: {
        color: 'white',
        textAlign: isMobile ? 'center' : null,
        fontFamily: 'Lato',
        fontWeight: 'normal',
        fontSize: 35,
        textDecoration: 'underline',
        marginBottom: '50px',
        marginTop: '50px',
    },
});


function Title(text) {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={2}/>
            <Grid item xs={8}>
                <Typography className={classes.mainTitleText}>
                    {text}
                </Typography>
            </Grid>
            <Grid item xs={isMobile ? 2 : 6}/>
        </Grid>

    );
}

export default Title;
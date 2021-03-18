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


function Title(text, f1, f2, f3) {
    const classes = useStyles();

    return (
        <Grid container>
            <Grid item xs={f1}/>
            <Grid item xs={f2}>
                <Typography className={classes.mainTitleText}>
                    {text}
                </Typography>
            </Grid>
            <Grid item xs={isMobile ? f3 : 6}/>
        </Grid>

    );
}

export default Title;
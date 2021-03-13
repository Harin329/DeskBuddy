import React from 'react';
import { Typography, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles({
    titleLines: {
        backgroundColor: 'white',
        height: '3px',
    },
    titleText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Lato',
        fontWeight: 'bold',
        fontSize: 17
    },
    sectionSpacing: {
        marginBottom: 15,
    },
});


function LinedHeader(text, f1, f2, f3) {
    const classes = useStyles();

    return (
        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            <Grid item xs={f1} className={classes.titleLines} />
            <Grid item xs={f2}>
                <Typography className={classes.titleText}>
                    {text}
                </Typography>
            </Grid>
            <Grid item xs={f3} className={classes.titleLines} />
        </Grid>

    );
}

export default LinedHeader;
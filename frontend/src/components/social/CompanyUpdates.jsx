import React from 'react';
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center'
    },
    updateBox: {
        background: '#EEF0F2',
        borderRadius: 10,
        width: '90%',
        height: 82,
        margin: 'auto',
        marginTop: 2,
        marginBottom: 2
    },
    backgroundBox: {
        background: '#FFFCF7',
        borderRadius: 20,
        width: '50%',
        height: 500,
        marginRight: '75px'
    },
    announcementName: {
        paddingLeft: 15,
        paddingTop: 10
    },
    announcementText: {
        paddingLeft: 15
    }

});

function CompanyUpdates(){
    const classes = useStyles();

    return (
        <div className={classes.backgroundBox}>
            <h1 className={classes.title}>COMPANY UPDATES</h1>
            <div className={classes.updateBox}>
                <h2 className={classes.announcementName}>Update 1</h2>
                <h3 className={classes.announcementText}>Update Text</h3>
            </div>
            <div className={classes.updateBox}>
                <h2 className={classes.announcementName}>Update 2</h2>
                <h3 className={classes.announcementText}>Update Text</h3>
            </div>
            <div className={classes.updateBox}>
                <h2 className={classes.announcementName}>Update 3</h2>
                <h3 className={classes.announcementText}>Update Text</h3>
            </div>
            <div className={classes.updateBox}>
                <h2 className={classes.announcementName}>Update 4</h2>
                <h3 className={classes.announcementText}>Update Text</h3>
            </div>
        </div>
    );

}
export default CompanyUpdates;
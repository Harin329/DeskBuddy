import React, {useEffect, useState} from 'react';
import {makeStyles} from "@material-ui/core/styles";
import {Grid, MenuItem, TextField} from "@material-ui/core";
import Endpoint from "../../config/Constants";

const useStyles = makeStyles({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center'
    },
    titleBox: {
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row'
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
        alignItems: 'center'
    },
    announcementName: {
        paddingLeft: 15,
        paddingTop: 5
    },
    announcementText: {
        paddingLeft: 15
    },
    inputBoxes: {
        marginLeft: 20
    }

});

function handleOfficeChange(){

}

function BranchUpdates(){
    const classes = useStyles();
    const [officeList, setOfficeList] = useState([]);
    const [office, setOffice] = useState('All');

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/office/getAllOffices", requestOptions)
            .then((response) => response.text())
            .then(result => {
                setOfficeList(JSON.parse(result));
            })
            .catch(error => console.log('error', error));

    }, []);

    return (
        <div className={classes.backgroundBox}>
            <div className={classes.titleBox}>
                <h1 className={classes.title}>BRANCH UPDATES</h1>
                <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleOfficeChange} value={office} className={classes.inputBoxes}>
                    <MenuItem key={'All'} value={'All'}>
                        All
                    </MenuItem>
                    {officeList.map((option) => (
                        <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>

            </div>
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
export default BranchUpdates;
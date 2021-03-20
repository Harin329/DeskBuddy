import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, TextField, MenuItem, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MapPopup from './map-popup/index';
import AddLocationForm from '../../components/reservation/AddLocationForm';
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from 'react-redux'
import { fetchDesks, fetchOffices, fetchDesksByOffice, hasFloorplan } from '../../actions/reservationActions';
import UpdateLocationPopup from './UpdateLocationPopup';
import Search from '../../assets/search.png';
import { SET_FILTER, SET_DESKS, SET_FLOORPLAN_AVAILABLE } from '../../actions/actionTypes';
import {useMsal} from "@azure/msal-react";
import {accountIsAdmin} from "../../util/Util";


const useStyles = makeStyles((theme) => ({
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    },
    sectionText: {
        color: 'white',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20
    },
    sectionSpacing: {
        marginBottom: '29px',
    },
    inputBoxes: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        marginTop: '10px',
    },
    floorplan: {
        position: 'fixed',
        top: '20%',
        left: '30%',
        width: '40%',
        height: '50%',
        backgroundColor: 'white',
        padding: '30px',
    },
}));

function DeskFilter() {
    const classes = useStyles();
    const [floorplan, setFloorplan] = useState(false);
    const [isUpdateLocationOpen, setIsUpdateLocationOpen] = useState(false);
    const [addLocation, setAddLocation] = useState(false);

    const dispatch = useDispatch()
    const filter = useSelector(state => state.reservations.searchFilter);
    const deskResults = useSelector(state => state.reservations.deskResults);
    const officeList = useSelector(state => state.reservations.offices);
    const deskList = useSelector(state => state.reservations.desks);
    const officeDisabled = useSelector(state => state.reservations.hasFloorplan);

    const { accounts } = useMsal();
    const isAdmin = accountIsAdmin(accounts[0]);

    useEffect(() => {
        dispatch(fetchOffices());
    }, []);

    const handleFloorplanOpen = () => {
        setFloorplan(true);
    };

    const handleFloorplanClose = () => {
        setFloorplan(false);
    };

    const handleAddLocationOpen = () => {
        setAddLocation(true);
    }

    const handleAddLocationClose = () => {
        setAddLocation(false)
    }

    const handleUpdateLocationClosed = () => {
        setIsUpdateLocationOpen(true);
    }

    const addLocationBody = () => {
        return <AddLocationForm closeModal={handleAddLocationClose} />
    }

    const handleOfficeChange = (event) => {
        var newFilter = {
            desk: filter.desk,
            office: event.target.value,
            from: filter.from,
            to: filter.to,
        };
        dispatch({ type: SET_FILTER, payload: newFilter });

        if (event.target.value !== 'All') {
            const params = event.target.value.split(['-']);

            console.log(params[0])
            console.log(params[1])

            dispatch(fetchDesksByOffice(params));
            dispatch(hasFloorplan(params));
            
        } else {
            dispatch({ type: SET_FLOORPLAN_AVAILABLE, payload: true });
            dispatch({ type: SET_DESKS, payload: [] })
        }
    };

    const handleDeskChange = (event) => {
        var newFilter = {
            desk: event.target.value,
            office: filter.office,
            from: filter.from,
            to: filter.to,
        };
        dispatch({ type: SET_FILTER, payload: newFilter });
    }

    const handleFromChange = (event) => {
        var newFilter = {
            desk: filter.desk,
            office: filter.office,
            from: event.target.value,
            to: filter.to,
        };
        dispatch({ type: SET_FILTER, payload: newFilter });


        const day = new Date(event.target.value)
        const toDay = new Date(filter.to)
        if (day > toDay) {
            newFilter['to'] = event.target.value;
            dispatch({ type: SET_FILTER, payload: newFilter });
        }
    }

    const handleToChange = (event) => {
        var newFilter = {
            desk: filter.desk,
            office: filter.office,
            from: filter.to,
            to: event.target.value,
        };
        dispatch({ type: SET_FILTER, payload: newFilter });

        const day = new Date(filter.from)
        const toDay = new Date(event.target.value)
        if (day > toDay) {
            newFilter['from'] = event.target.value;
            dispatch({ type: SET_FILTER, payload: newFilter });
        }
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            <Grid container item justify='center' alignItems='center' direction={isMobile ? 'column' : 'row'} className={classes.sectionSpacing}>
                <Grid item xs={isMobile ? 'auto' : 3} style={{width: '90%'}}>
                    <Typography className={classes.sectionText}>
                        OFFICE
                        </Typography>
                    <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleOfficeChange} value={filter.office} className={classes.inputBoxes}>
                        <MenuItem key={'All'} value={'All'}>
                            All
                                </MenuItem>
                        {officeList.map((option) => (
                            <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={isMobile ? 'auto' : 3} style={{width: '90%'}}>
                    <Typography className={classes.sectionText}>
                        DESK NUMBER
                        </Typography>
                    <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleDeskChange} value={filter.desk} className={classes.inputBoxes}>
                        <MenuItem key={'All'} value={'All'}>
                            All
                                </MenuItem>
                        {deskList.map((option) => (
                            <MenuItem key={option.fk_floor_num + "-" + option.desk_id} value={option.fk_floor_num + "-" + option.desk_id}>
                                {option.fk_floor_num + "-" + option.desk_id}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={2} />
            </Grid>
            <Grid container item justify='center' alignItems='center' direction={isMobile ? 'column' : 'row'} className={classes.sectionSpacing}>

                <UpdateLocationPopup isOpen={isUpdateLocationOpen} whatToDoWhenClosed={(bool) => { setIsUpdateLocationOpen(bool) }}></UpdateLocationPopup>

                <Grid item xs={isMobile ? 'auto' : 3} style={{width: '90%'}}>
                    {isAdmin &&
                    <Button className={classes.actionButton} onClick={handleUpdateLocationClosed}>Update
                        Location</Button>
                    }
                    {isAdmin &&
                    <Grid item xs={8}>
                        <Button className={classes.actionButton} onClick={handleAddLocationOpen}>Add Location</Button>
                        <Modal
                            open={addLocation}
                            onClose={handleAddLocationClose}
                        >
                            {addLocationBody()}
                        </Modal>
                    </Grid>
                    }
                </Grid>
                <Grid item xs={isMobile ? 'auto' : 5} style={{width: '90%'}}>
                    <Button className={classes.actionButton} onClick={handleFloorplanOpen} disabled={officeDisabled}>Floorplan</Button>
                    <Modal
                        open={floorplan}
                        onClose={handleFloorplanClose}
                    >
                        <MapPopup
                            locationID={filter.office}
                            closeHandler={handleFloorplanClose}
                            officeName={officeList.find((item) => (item.office_location + "-" + item.office_id) === filter.office)}
                        />
                    </Modal>
                </Grid>
            </Grid>
            <Grid container item justify='center' alignItems={isMobile ? 'center' : 'flex-end'} direction={isMobile ? 'column' : 'row'} className={classes.sectionSpacing}>
                <Grid item xs={isMobile ? 'auto' : 3} style={{width: '90%'}}>
                    <Typography className={classes.sectionText}>
                        FROM
                        </Typography>
                    <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleFromChange} value={filter.from} defaultValue={filter.from} />
                </Grid>
                <Grid item xs={isMobile ? 'auto' : 3} style={{width: '90%'}}>
                    <Typography className={classes.sectionText}>
                        TO
                        </Typography>
                    <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleToChange} value={filter.to} defaultValue={filter.to} />
                </Grid>
                <Grid item xs={isMobile ? 'auto' : 2} style={{width: '90%', marginTop: isMobile ? 10 : 0}}>
                    <button onClick={() => {
                        dispatch(fetchDesks(filter, false, 0, deskResults));
                    }} style={{ backgroundColor: 'transparent', border: 'none' }}><img src={Search} alt="Search" style={{ height: '50px' }} /></button>
                </Grid>
            </Grid>
        </Grid>

    );
}

export default DeskFilter;
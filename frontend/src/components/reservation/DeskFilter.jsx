import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography, TextField, MenuItem, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MapPopup from './map-popup/index';
import AddLocationForm from '../../components/reservation/AddLocationForm';
import { isMobile } from "react-device-detect";
import { useSelector, useDispatch } from 'react-redux'
import { fetchReservations, fetchDesks } from '../../actions/reservationActions';
import UpdateLocationPopup from './UpdateLocationPopup';
import Search from '../../assets/search.png';
import Endpoint from '../../config/Constants';
import { GET_FILTER } from '../../actions/actionTypes';


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

function DeskFilter(title, f1, f2, f3) {
    const classes = useStyles();
    const [officeList, setOfficeList] = useState([]);
    const [office, setOffice] = useState('All');
    const [desk, setDesk] = useState('All');
    const [floorplan, setFloorplan] = useState(false);
    const [deskList, setDeskList] = useState([]);
    const [isUpdateLocationClosed, setIsUpdateLocationClosed] = useState(false);
    const [addLocation, setAddLocation] = useState(false);
    const [officeDisabled, setOfficeDisabled] = useState(true);

    const dispatch = useDispatch()
    const filter = useSelector(state => state.searchFilter);
    const deskResults = useSelector(state => state.deskResults);

    useEffect(() => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/office/getAllOffices", requestOptions)
            .then((response) => response.text())
            .then(result => {
                setOfficeList(JSON.parse(result));
                // console.log(JSON.parse(result));
            })
            .catch(error => console.log('error', error));

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
        setIsUpdateLocationClosed(true);
    }

    const addLocationBody = () => {
        return <AddLocationForm closeModal={handleAddLocationClose} />
    }

    const handleOfficeChange = (event) => {

        setOffice(event.target.value);

        if (event.target.value !== 'All') {
            const params = event.target.value.split(['-']);

            console.log(params[0])
            console.log(params[1])

            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(Endpoint + "/desk/getDesksByOffice/" + params[0] + "/" + params[1], requestOptions)
                .then((response) => response.text())
                .then(result => {
                    setDeskList(JSON.parse(result));
                    // console.log(JSON.parse(result));
                })
                .catch(error => console.log('error', error));

            fetch(Endpoint + "/floor/getFloorsByOffice/" + params[0] + "/" + params[1], requestOptions)
                .then((response) => response.text())
                .then(result => {
                    const res = JSON.parse(result)
                    // console.log(res);
                    if (res.length > 0) {
                        setOfficeDisabled(false);
                    } else {
                        setOfficeDisabled(true);
                    }
                })
                .catch(error => console.log('error', error));
        } else {
            setOfficeDisabled(true);
            setDeskList([]);
        }
    };

    const handleDeskChange = (event) => {
        setDesk(event.target.value);
    }

    const handleFromChange = (event) => {
        var oldFilter = filter;
        oldFilter['from'] = event.target.value;
        dispatch({ type: GET_FILTER, payload: oldFilter });


        const day = new Date(event.target.value)
        const toDay = new Date(filter.to)
        if (day > toDay) {
            oldFilter['to'] = event.target.value;
            dispatch({ type: GET_FILTER, payload: oldFilter });
        }
    }

    const handleToChange = (event) => {
        var oldFilter = filter;
        oldFilter['to'] = event.target.value;
        dispatch({ type: GET_FILTER, payload: oldFilter });

        const day = new Date(filter.from)
        const toDay = new Date(event.target.value)
        if (day > toDay) {
            oldFilter['from'] = event.target.value;
            dispatch({ type: GET_FILTER, payload: oldFilter });
        }
    }

    return (
        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
            <Grid container item justify='center' alignItems='center' className={classes.sectionSpacing}>
                <Grid item xs={3}>
                    <Typography className={classes.sectionText}>
                        OFFICE
                        </Typography>
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
                </Grid>
                <Grid item xs={3}>
                    <Typography className={classes.sectionText}>
                        DESK NUMBER
                        </Typography>
                    <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleDeskChange} value={desk} className={classes.inputBoxes}>
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
            <Grid container item justify='center' alignItems='center' className={classes.sectionSpacing}>

                <UpdateLocationPopup isOpen={isUpdateLocationClosed} whatToDoWhenClosed={(bool) => { setIsUpdateLocationClosed(bool) }}></UpdateLocationPopup>

                <Grid item xs={3}>
                    <Button className={classes.actionButton} onClick={handleUpdateLocationClosed}>Update Location</Button>
                    <Grid item xs={8}>
                        <Button className={classes.actionButton} onClick={handleAddLocationOpen}>Add Location</Button>
                        <Modal
                            open={addLocation}
                            onClose={handleAddLocationClose}
                        >
                            {addLocationBody()}
                        </Modal>
                    </Grid>
                </Grid>
                <Grid item xs={5}>
                    <Button className={classes.actionButton} onClick={handleFloorplanOpen} disabled={officeDisabled}>Floorplan</Button>
                    <Modal
                        open={floorplan}
                        onClose={handleFloorplanClose}
                    >
                        <MapPopup
                            locationID={office}
                            closeHandler={handleFloorplanClose}
                            officeName={officeList.find((item) => (item.office_location + "-" + item.office_id) === office)}
                        />
                        {/* {floorplanBody()} */}
                    </Modal>
                </Grid>
            </Grid>
            <Grid container item justify='center' alignItems='flex-end' className={classes.sectionSpacing}>
                <Grid item xs={3}>
                    <Typography className={classes.sectionText}>
                        FROM
                        </Typography>
                    <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleFromChange} value={filter.from} defaultValue={filter.from} />
                </Grid>
                <Grid item xs={3}>
                    <Typography className={classes.sectionText}>
                        TO
                        </Typography>
                    <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleToChange} value={filter.to} defaultValue={filter.to} />
                </Grid>
                <Grid item xs={2}>
                    <button onClick={() => {
                        dispatch(fetchDesks(filter, false, 0, deskResults));
                    }} style={{ backgroundColor: 'transparent', border: 'none' }}><img src={Search} alt="Search" style={{ height: '50px' }} /></button>
                </Grid>
            </Grid>
        </Grid>

    );
}

export default DeskFilter;
import React, { useState, useEffect } from 'react';
import { Button, List, ListItem, ListItemIcon, Grid, Typography, TextField, MenuItem, Divider, Modal, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DesktopMacIcon from '@material-ui/icons/DesktopMac';
import CancelIcon from '@material-ui/icons/Cancel';
import Search from '../assets/search.png';
import Endpoint from '../config/Constants';
import BookingsCalendar from '../components/reservation/BookingsCalendar';

const useStyles = makeStyles({
    background: {
        background: '#1E1E24',
        flexGrow: 1,
    },
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
    reserveButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 20px',
        marginTop: '5px',
        marginBottom: '5px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    cancelButton: {
        background: '#ba0000',
        borderRadius: 30,
        color: 'white',
        height: '30px',
        padding: '0 15px',
        marginTop: '5px',
        marginBottom: '5px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    titleText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'Lato',
        fontWeight: 'bold',
        fontSize: 25
    },
    sectionText: {
        color: 'white',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20
    },
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
    },
    titleLines: {
        backgroundColor: 'white',
        height: '3px',
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
    officeText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 16,
        textAlign: 'center'
    },
    deskSectionText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
    },
    FloorText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmationModalText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    deskText: {
        color: 'black',
        fontFamily: 'Lato',
        fontSize: 14,
        display: 'inline'
    },
    paper: {
        position: 'fixed',
        top: '30%',
        left: '35%',
        width: '20%',
        height: '30%',
        backgroundColor: 'white',
        padding: '30px',
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
    mainTitleText: {
        color: 'white',
        textAlign: 'center',
        fontFamily: 'arial',
        fontWeight: 'normal',
        fontSize: 35,
        textDecoration: 'underline',
        marginBottom: '50px',
        marginTop: '50px',
        marginLeft: '-900px',
    },
    upcomingResSectionSpacing: {
        width: '60%',
        marginBottom: '29px',
        marginLeft: '-76vw'
    },
    titleSectionSpacing: {
        marginBottom: '50px',
        marginTop: '50px',
        marginLeft: '30px',
    },
    sidebyside: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'row',
    },
    upcomingResBox: {
        backgroundColor: '#E5E5E5',
        height: '80px',
        marginBottom: '10px',
        borderRadius: '10px'
    },
    upcomingResBoxDate: {
        width: '25%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    upcomingResBoxOffice: {
        width: '60%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'left',
        display: 'flex',
        flexDirection: 'row'
    },
    upcomingResBoxCancel: {
        width: '30%',
        height: '80px',
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    upcomingResBoxCenterSection: {
        width: '50%',
        height: '80px',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
});

function Reservation() {
    const date = new Date();
    const formattedDate = date.getFullYear() + "-" + appendLeadingZeroes(date.getMonth() + 1) + "-" + appendLeadingZeroes(date.getDate());

    const resultOnPage = 25;

    const classes = useStyles();
    const [officeList, setOfficeList] = useState([]);
    const [office, setOffice] = useState('All');
    const [deskList, setDeskList] = useState([]);
    const [floorList, setFloorList] = useState([]);
    const [desk, setDesk] = useState('All');
    const [from, setFrom] = useState(formattedDate);
    const [to, setTo] = useState(formattedDate);
    const [deskResults, setDeskResults] = useState([]);
    const [open, setOpen] = useState(false);
    const [employeeCount, setEmployeeCount] = useState(0);
    const [floorplan, setFloorplan] = useState(false);
    const [officeDisabled, setOfficeDisabled] = useState(true);
    const [confirmationDesk, setConfirmationDesk] = useState();
    const [floorplanSelected, setFloorplanSelected] = useState();
    const [page, setPage] = useState(0);
    const [more, setMore] = useState(true);

    // UpcomingReservations state todo should probably be a separate component..
    const [upcomingRes, setUpcomingRes] = useState([]);
    const [reservationToCancel, setReservationToCancel] = useState();
    const [openCancelRes, setOpenCancelRes] = useState(false);
    const [employeeCountUpcomingRes, setEmployeeCountUpcomingRes] = useState("");

    function appendLeadingZeroes(n) {
        if (n <= 9) {
            return "0" + n;
        }
        return n
    }

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

        getUpcomingReservations();

        search(false, 0);

    }, []);

    const getUpcomingReservations = () => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/reservation/getUpcomingReservations", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result)
                console.log(res)
                setUpcomingRes(res)
            })
            .catch(error => console.log('error', error));
    }

    const expandSelectedReservation = (reservation) =>  {

    }

    const handleOpen = (option) => {
        setConfirmationDesk(option);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpenUpcomingRes = (option) => {
        setReservationToCancel(option);
        setOpenCancelRes(true);
    };

    const handleCloseUpcomingRes = () => {
        setEmployeeCountUpcomingRes("");
        setOpenCancelRes(false);
    };

    const handleFloorplanOpen = () => {
        setFloorplan(true);
    };

    const handleFloorplanClose = () => {
        setFloorplan(false);
    };

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
                    setFloorList(res);
                    // console.log(res);
                    if (res.length > 0) {
                        setOfficeDisabled(false);
                        setFloorplanSelected(res[0]);
                    } else {
                        setOfficeDisabled(true);
                    }
                })
                .catch(error => console.log('error', error));
        } else {
            setOfficeDisabled(true);
            setFloorList([]);
            setDeskList([]);
        }
    };

    const handleDeskChange = (event) => {
        setDesk(event.target.value);
    }

    const handleFromChange = (event) => {
        setFrom(event.target.value);

        const day = new Date(event.target.value)
        const toDay = new Date(to)
        if (day > toDay) {
            setTo(event.target.value)
        }
    }

    const handleToChange = (event) => {
        setTo(event.target.value);

        const day = new Date(from)
        const toDay = new Date(event.target.value)
        if (day > toDay) {
            setFrom(event.target.value)
        }
    }

    const search = (append, pageStart) => {
        var deskParam = ['0', '0']
        var officeParam = ['0', '0']

        if (desk.includes('-')) {
            deskParam = desk.split(['-']);
        }
        if (office.includes('-')) {
            officeParam = office.split(['-']);
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ 
            "desk_id": String(deskParam[1]),
            "floor_num": Number(deskParam[0]),
            "office_id": Number(officeParam[1]),
            "office_location": String(officeParam[0]),
            "start_date": from,
            "end_date": to,
            "startIndex": pageStart,
            "numOnPage": resultOnPage
         });

        console.log(raw);

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(Endpoint + "/desk/getOpenDesks", requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result)
                console.log(res)
                if (deskResults.length === 0 || !append) {
                    setDeskResults(res);
                } else {
                    if (res[0] !== undefined) {
                        setDeskResults((prev) => [...prev, ...res])
                    }
                }
                setMore(((deskResults.length + res.length) % resultOnPage === 0 && res[0] !== undefined) || !append)
                setPage(pageStart + resultOnPage);
            })
            .catch(error => console.log('error', error));
    }

    // TODO GET EMPLOYEE ID
    const makeReservation = (deskObj) => {
        var day = new Date(from)
        var toDay = new Date(to)
        while (day <= toDay) {
            const newDay = day.setDate(day.getDate() + 1);
            day = new Date(newDay)

            const thisDate = day.getFullYear() + "-" + appendLeadingZeroes(day.getMonth() + 1) + "-" + appendLeadingZeroes(day.getDate());
            console.log(thisDate);

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({ "employee_id": 329, "desk_id": String(deskObj.desk_id), "floor_num": Number(deskObj.fk_floor_num), "office_id": Number(deskObj.fk_office_id), "office_location": String(deskObj.fk_office_location), "date": thisDate });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation", requestOptions)
                .then(response => response.text())
                .then(result => console.log(result))
                .then(getUpcomingReservations)
                .catch(error => console.log('error', error));
        }
        handleClose();
        // Replace this with promises followed by then one day... :)
        setTimeout(() => search(false, 0), 3000);
    }

    const getEmployeeCount = (deskObj) => {
        console.log(from);
        console.log(to);
        //var startDate = new Date(from);
        //var endDate = new Date(to);
        //console.log(startDate);
        //console.log(endDate);
        if (to >= from) {
            //const startFullDate = startDate.getFullYear() + "-" + appendLeadingZeroes(startDate.getMonth() + 1) + "-" + appendLeadingZeroes(startDate.getDay());
            //const endFullDate = endDate.getFullYear() + "-" + appendLeadingZeroes(endDate.getMonth() + 1) + "-" + appendLeadingZeroes(endDate.getDay());
            var requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            fetch(Endpoint + "/reservation/getCount/" + deskObj.office_id + "/" + from + "/" + to, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const res = JSON.parse(result)
                    console.log(res[0].avg)
                    setEmployeeCount(res[0].avg)
                    if (res[0].avg == null) {
                        setEmployeeCount(0);
                    }
                }).catch(error => console.log('error', error));
        }
        else setEmployeeCount(0); // just a placeholder else statement to account for to being earlier than from date
    };

    // todo combine with getEmployeeCount?
    const getEmployeeCountUpcomingRes = (reservationObj) => {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/reservation/getCount/" + reservationObj.fk_office_id + "/" + reservationObj.start_date.split("T")[0] + "/" + reservationObj.end_date.split("T")[0], requestOptions)
            .then(response => response.text())
            .then(result => {
                const res = JSON.parse(result)
                console.log(res[0].avg)
                setEmployeeCountUpcomingRes(res[0].avg)
                if (res[0].avg == null) {
                    setEmployeeCountUpcomingRes("0");
                }
            }).catch(error => console.log('error', error));
    };

    const confirmationBody = () => {
        return (
            <div className={classes.paper}>
                <div style={{ width: '105%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex' }}>
                    <IconButton size='small' onClick={handleClose}>
                        <CancelIcon size="small" />
                    </IconButton>
                </div>
                <Typography className={classes.sectionTextModal}>
                    {from} TO {to} RESERVATION
                        </Typography>
                <div style={{ width: '100%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                    <Typography className={classes.deskSectionText}>
                        Office: <Typography className={classes.deskText}>
                            {confirmationDesk.name}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Floor Number: <Typography className={classes.deskText}> {confirmationDesk.fk_floor_num}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Desk Number: <Typography className={classes.deskText}> {confirmationDesk.desk_id}
                        </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Estimated Number of People: <Typography className={classes.deskText}>
                            {employeeCount}
                        </Typography>
                    </Typography>
                </div>
                <Typography className={classes.confirmationModalText}>
                    Do you want to confirm this reservation?
                                            </Typography>
                <div style={{ width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex' }}>
                    <Button className={classes.reserveButton} onClick={() => {
                        makeReservation(confirmationDesk);
                    }}>Confirm</Button>
                </div>
            </div>)
    };

    const confirmCancelResBody = () => {
        return (
            <div className={classes.paper}>
                <div style={{width: '105%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex'}}>
                    <IconButton size='small' onClick={handleCloseUpcomingRes}>
                        <CancelIcon size="small"/>
                    </IconButton>
                </div>
                <Typography className={classes.sectionTextModal}>
                    {reservationToCancel.start_date.split("T")[0]} RESERVATION
                </Typography>
                <div style={{
                    width: '100%',
                    height: '140px',
                    justifyContent: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <Typography className={classes.deskSectionText}>
                        Office: <Typography className={classes.deskText}>
                        {reservationToCancel.fk_office_location /*todo get full office name somehow*/ }
                    </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Floor Number: <Typography className={classes.deskText}> {reservationToCancel.fk_floor_num}
                    </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Desk Number: <Typography className={classes.deskText}> {reservationToCancel.fk_desk_id}
                    </Typography>
                    </Typography>
                    <Typography className={classes.deskSectionText}>
                        Estimated Number of People: <Typography className={classes.deskText}>
                        {employeeCountUpcomingRes}
                    </Typography>
                    </Typography>
                </div>
                <Typography className={classes.confirmationModalText}>
                    Are you sure you want to cancel this reservation?
                </Typography>
                <div style={{width: '100%', marginTop: '10px', justifyContent: 'center', display: 'flex'}}>
                    <Button className={classes.cancelButton} onClick={() => {
                        cancelReservation(reservationToCancel);
                    }}>CANCEL</Button>
                </div>
            </div>)
    };

    const cancelReservation = (reservation) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({ "reservation_id": Number(reservation.reservation_id)});
        console.log(raw);

        var requestOptions = {
            method: 'DELETE',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(Endpoint + "/reservation/deleteReservation", requestOptions)
            .then(response => response.text())
            .then(result => console.log(result))
            .then(getUpcomingReservations)
            .catch(error => console.log('error', error));

        handleCloseUpcomingRes();
    }

    const floorplanBody = () => {
        const officeObj = officeList.find((item) => (item.office_location + "-" + item.office_id) === office);
        const officeName = officeObj !== undefined ? officeObj.name : '';

        // setFloorplanSelected(floorList[0]);

        return (
            <div className={classes.floorplan}>
                <div style={{ width: '102%', marginTop: '-25px', justifyContent: 'flex-end', display: 'flex' }}>
                    <IconButton size='small' onClick={handleFloorplanClose}>
                        <CancelIcon size="small" />
                    </IconButton>
                </div>
                <Typography className={classes.sectionTextModal}>
                    {officeName}
                </Typography>
                <div style={{ width: '100%', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                    <div style={{ justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                        {floorList.map((option) => (
                            <Button className={classes.FloorText} onClick={() => {
                                setFloorplanSelected(option)
                            }}>
                                Floor {option.floor_num}
                            </Button>
                        ))}
                    </div>
                    <div>
                        {floorplanSelected !== undefined && <img src={'data:image/png;base64,' + new Buffer(floorplanSelected.floor_plan, 'binary').toString('base64')} alt="Floorplan" style={{ height: '45vh' }} />}
                    </div>
                </div>
            </div>)
    };

    // Converts MySQL date format to day and month
    const convertStartDate = (sqlStartDate) => {
        const month = sqlStartDate.substring(5, 7);
        const day = sqlStartDate.substring(8, 10);
        var dayMonth = day.concat(" ");
        var monthStr;

        switch(month) {
            case "01":
                monthStr = "Jan"
                break;
            case "02":
                monthStr = "Feb"
                break;
            case "03":
                monthStr = "Mar"
                break;
            case "04":
                monthStr = "Apr"
                break;
            case "05":
                monthStr = "May"
                break;
            case "06":
                monthStr = "June"
                break;
            case "07":
                monthStr = "July"
                break;
            case "08":
                monthStr = "Aug"
                break;
            case "09":
                monthStr = "Sept"
                break;
            case "10":
                monthStr = "Oct"
                break;
            case "11":
                monthStr = "Nov"
                break;
            case "12":
                monthStr = "Dec"
                break;
        }

        dayMonth = dayMonth.concat(monthStr);
        return (dayMonth);
    };


    return (
        <div className={classes.background}>
            <Grid container direction='column' justify='center' alignItems='center'>
                <Grid item xs={1}>
                    <Typography className={classes.mainTitleText}>
                        RESERVATION
                    </Typography>
                </Grid>

                <div className={classes.sidebyside}>
                    <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                        <BookingsCalendar>
                            //TODO: Show details of reservation on calendar click
                        </BookingsCalendar>
                    </Grid>

                    <Grid container justify='center' alignItems='center' className={classes.upcomingResSectionSpacing}>
                        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                            <Grid item xs={3} className={classes.titleLines}/>
                            <Grid item xs={1}>
                                <Typography className={classes.titleText}>
                                    UPCOMING RESERVATIONS
                                </Typography>
                            </Grid>
                            <Grid item xs={3} className={classes.titleLines}/>
                        </Grid>

                        <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                            <Grid item xs={7}>
                                <List>
                                    {upcomingRes.map((option) => (
                                        <ListItem className={classes.upcomingResBox}>
                                            <div className={classes.upcomingResBoxDate}>
                                                <Typography className={classes.officeText}>
                                                    {convertStartDate(option.start_date)}
                                                </Typography>
                                            </div>
                                            <Divider orientation='vertical'
                                                     style={{backgroundColor: 'black', height: '80px', width: '1px'}}/>
                                            <div className={classes.upcomingResBoxOffice}>
                                                <div className={classes.upcomingResBoxCenterSection}>
                                                    <Typography className={classes.deskSectionText}>
                                                        OFFICE: <Typography className={classes.deskText}>
                                                        {option.fk_office_location}
                                                    </Typography>
                                                    </Typography>
                                                    <Typography className={classes.deskSectionText}>
                                                        DESK ID: <Typography className={classes.deskText}>
                                                        {option.fk_office_location + option.fk_floor_num + option.fk_desk_id}
                                                    </Typography>
                                                    </Typography>
                                                </div>
                                            </div>
                                            <Divider orientation='vertical'
                                                     style={{backgroundColor: 'black', height: '80px', width: '1px'}}/>
                                            <div className={classes.upcomingResBoxCancel}>
                                                <Button className={classes.cancelButton} onClick={() => {
                                                    getEmployeeCountUpcomingRes(option);
                                                    handleOpenUpcomingRes(option)
                                                }}>Cancel</Button>
                                            </div>
                                        </ListItem>
                                    ))}
                                    <Modal
                                        open={openCancelRes}
                                        onClose={handleCloseUpcomingRes}>
                                        {reservationToCancel !== undefined ? confirmCancelResBody() : null}
                                    </Modal>
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>

                </div>




                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={3} className={classes.titleLines} />
                    <Grid item xs={1}>
                        <Typography className={classes.titleText}>
                            RESERVE
                    </Typography>
                    </Grid>
                    <Grid item xs={3} className={classes.titleLines} />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
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
                    <Grid item xs={1} />
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={7}>
                        <Button className={classes.actionButton} onClick={handleFloorplanOpen} disabled={officeDisabled}>Floorplan</Button>
                        <Modal
                            open={floorplan}
                            onClose={handleFloorplanClose}
                        >
                            {floorplanBody()}
                        </Modal>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='flex-end' className={classes.sectionSpacing}>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            FROM
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleFromChange} value={from} defaultValue={from} />
                    </Grid>
                    <Grid item xs={3}>
                        <Typography className={classes.sectionText}>
                            TO
                        </Typography>
                        <TextField id="outlined-basic" variant="outlined" type="date" className={classes.inputBoxes} onChange={handleToChange} value={to} defaultValue={to} />
                    </Grid>
                    <Grid item xs={1}>
                        <button onClick={() => {
                            search(false, 0);
                            }} style={{ backgroundColor: 'transparent', border: 'none' }}><img src={Search} alt="Search" style={{ height: '50px' }} /></button>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    <Grid item xs={7}>
                        <List>
                            {deskResults.map((option) => (
                                <ListItem style={{ backgroundColor: '#E5E5E5', height: '150px', marginBottom: '10px' }}>
                                    <div style={{ width: '25%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <img src={'data:image/png;base64,' + new Buffer(option.office_photo, 'binary').toString('base64')} alt="OfficePicture" style={{ height: '100px', width: '100px', borderRadius: 100 }} />
                                        <Typography className={classes.officeText}>
                                            {option.fk_office_location + option.fk_office_id + "-" + option.fk_floor_num + option.desk_id}
                                        </Typography>
                                    </div>
                                    <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '129px', width: '3px' }} />
                                    <div style={{ width: '55%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'row' }}>
                                        <div style={{ width: '40%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                            <Typography className={classes.deskSectionText}>
                                                FLOOR: <Typography className={classes.deskText}>
                                                    {option.fk_floor_num}
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                TYPE: <Typography className={classes.deskText}>
                                                    Desk
                                                </Typography>
                                            </Typography>
                                            <Typography className={classes.deskSectionText}>
                                                CAPACITY: <Typography className={classes.deskText}>
                                                    {option.capacity}
                                                </Typography>
                                            </Typography>
                                        </div>
                                        <div style={{ width: '40%', height: '140px', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                            <Typography className={classes.deskSectionText}>
                                                ADDRESS: <Typography className={classes.deskText}>
                                                    {option.address}
                                                </Typography>
                                            </Typography>
                                        </div>
                                    </div>
                                    <Divider orientation='vertical' style={{ backgroundColor: 'white', height: '129px', width: '3px' }} />
                                    <div style={{ width: '20%', height: '140px', alignItems: 'center', justifyContent: 'center', display: 'flex', flexDirection: 'column' }}>
                                        <Button className={classes.reserveButton} onClick={() => {
                                            getEmployeeCount(option);
                                            handleOpen(option)
                                        }}>Reserve Now</Button>
                                    </div>
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                    >
                                        {confirmationDesk !== undefined ? confirmationBody() : null}
                                    </Modal>
                                </ListItem>
                            ))}
                            <div style={{ justifyContent: 'center', display: 'flex', marginTop: '50px' }}>
                                {deskResults.length <= 0 && <Typography className={classes.sectionText}>No Results Found</Typography>}
                            </div>
                        </List>
                    </Grid>
                </Grid>
                <Grid container justify='center' alignItems='center' className={classes.sectionSpacing}>
                    {deskResults.length > 0 && more && <Button className={classes.actionButton} onClick={() => {
                        search(true, page);
                    }}>Load More</Button>}
                </Grid>
            </Grid>
        </div>
    );
}

export default Reservation;
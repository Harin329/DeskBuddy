import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {MenuItem, TextField} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroller";
import Endpoint from "../../config/Constants";
import {updatePopup} from "./Popup";
import { Modal } from '@material-ui/core';

const styles = theme => ({
    title: {
        fontFamily: 'Lato',
        textAlign: 'center',
        marginLeft: 50
    },
    titleBox: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },
    updateBox: {
        background: '#EEF0F2',
        borderRadius: 10,
        width: '85%',
        height: 82,
        margin: 'auto',
        marginTop: 2,
        marginBottom: 2
    },
    backgroundBox: {
        background: '#FFFCF7',
        borderRadius: 20,
        width: '45%',
        height: 500,
        alignItems: 'center'
    },
    announcementName: {
        paddingLeft: 15,
        paddingTop: 5
    },
    announcementText: {
        paddingLeft: 15
    }

});

class BranchUpdates extends React.Component {

state = {
        announcementList: [],
        hasMoreAnnouncements: true,
        totalAnnouncements: 0,
        selectedOfficeID: 0,
        selectedOfficeLocation: "",
        officeList: [],
        open: false,
        currAnnouncement: null
    };

    handleUpdateOpen = (el) => {
        console.log("update is: " + el);
        this.setState({ open: true, currAnnouncement: el});
    }

    handleClose = () => {
        this.setState({ open: false, currAnnouncement: null});
    }

     handleOfficeChange(event) {

        if (event.target.value !== 'All') {
            const params = event.target.value.split(['-']);

            console.log(params[0])
            console.log(params[1])
            this.setState({selectedOfficeLocation: params[0], selectedOfficeID: params[1], announcementList: []});

            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };

            setTimeout(() => {
                fetch(Endpoint + "/announcement/getBranchAnnouncements/" + this.state.announcementList.length + "/"
                    + this.state.selectedOfficeLocation + "/" + this.state.selectedOfficeID, requestOptions)
                    .then((response) => response.text())
                    .then(result => {
                        const announcements = JSON.parse(result);
                        console.log(announcements);
                        this.setState({announcementList: this.state.announcementList.concat(announcements),
                            hasMoreAnnouncements: !(this.state.announcementList.length === this.state.totalAnnouncements)});
                    })
                    .catch(error => console.log('error', error));

            }, 1000);

        }
    };

    componentDidMount() {
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/announcement/getTotalAnnouncements", requestOptions)
            .then(response => response.text())
            .then(result => {
                const total = JSON.parse(result);
                this.setState({totalAnnouncements: Number(total)});
            })
            .catch(error => console.log('error', error))

        fetch(Endpoint + "/office/getAllOffices", requestOptions)
            .then((response) => response.text())
            .then(result => {
                this.setState({officeList: JSON.parse(result)});
            })
            .catch(error => console.log('error', error));
    }

    getAnnouncements(page){
        console.log("called");
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        if (this.state.selectedOfficeLocation === "" || this.state.selectedOfficeLocation === "ALL") {
            fetch(Endpoint + "/announcement/getAllBranchAnnouncements/" + this.state.announcementList.length, requestOptions)
                .then(response => response.text())
                .then(result => {
                    const announcements = JSON.parse(result);
                    console.log(announcements);
                    this.setState({announcementList: this.state.announcementList.concat(announcements),
                        hasMoreAnnouncements: !(this.state.announcementList.length === this.state.totalAnnouncements)});
                })
                .catch(error => console.log('error', error))

        } else {

        }

    }

    render() {
        const { classes } = this.props;

        let announcements = [];
        this.state.announcementList.map((update, i) => {
            announcements.push(
                <div className={classes.updateBox} key={i} onClick={() => this.handleUpdateOpen(update)}>
                    <h2 className={classes.announcementName}>{this.state.announcementList[i].title}</h2>
                    <h3 className={classes.announcementText}>{this.state.announcementList[i].sub_title}</h3>
                </div>
            );
        });

        const popup = () => {
            if (this.state.open) {
                return (
                    <Modal
                        open={this.state.open}
                        onClose={this.handleClose}
                        style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        {updatePopup(this.state.currAnnouncement)}
                    </Modal>
                )
            } else
                return null;
        }

        return (
            <div className={classes.backgroundBox} style= {{height: '500px', overflow: 'auto'}} ref={(ref) => this.scrollParentRef = ref}>
                <div className={classes.titleBox}>
                    <h1 className={classes.title}>BRANCH UPDATES</h1>
                    <TextField id="outlined-basic" label="" variant="outlined" select onChange={(e) => this.handleOfficeChange(e)} value={this.state.selectedOffice}>
                        {this.state.officeList.map((option) => (
                            <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>

                </div>
                <InfiniteScroll
                    loadMore={this.getAnnouncements.bind(this)}
                    hasMore={this.state.hasMoreAnnouncements}
                    useWindow={false}
                    getScrollParent={() => this.scrollParentRef}
                >
                    {popup()}
                    {announcements}
                </InfiniteScroll>
            </div>
        );
    }

}
export default withStyles(styles, { withTheme: true })(BranchUpdates);
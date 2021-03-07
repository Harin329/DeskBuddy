import React, {useEffect, useState} from 'react';
import {withStyles} from "@material-ui/core/styles";
import {MenuItem, TextField} from "@material-ui/core";
import InfiniteScroll from "react-infinite-scroller";
import Endpoint from "../../config/Constants";

const styles = theme => ({
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
    },
    inputBoxes: {
        marginLeft: 20
    }

});

function handleOfficeChange(){

}

class BranchUpdates extends React.Component {
    componentDidMount() {
        this.getAnnouncements(0);
    }

    getAnnouncements(length){
        console.log("called");
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        fetch(Endpoint + "/announcement/getAnnouncements/" + length, requestOptions)
            .then(response => response.text())
            .then(result => {
                const announcements = JSON.parse(result);
                this.setState({updateList: this.state.updateList.concat(announcements)});
            })
            .catch(error => console.log('error', error))
    }

    hasMore(){
        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        return fetch(Endpoint + "/announcement/getTotalAnnouncements", requestOptions)
            .then(response => response.text())
            .then(result => {
                const total = JSON.parse(result);
                console.log(!(Number(total) === this.state.updateList.length));
            })
            .catch(error => console.log('error', error))

    }
    render() {
        const { classes } = this.props;

        let announcements = [];
        this.state.updateList.map((update, i) => {
            announcements.push(
                <div className={classes.updateBox} key={i}>
                    <h2 className={classes.announcementName}>{this.state.updateList[i].title}</h2>
                    <h3 className={classes.announcementText}>{this.state.updateList[i].sub_title}</h3>
                </div>
            );
        });

        return (
            <div className={classes.backgroundBox} style= {{height: '500px', overflow: 'auto'}} ref={(ref) => this.scrollParentRef = ref}>
                <h1 className={classes.title}>BRANCH UPDATES</h1>
                <TextField id="outlined-basic" label="" variant="outlined" select onChange={handleOfficeChange} value={this.state.office} className={classes.inputBoxes}>
                    <MenuItem key={'All'} value={'All'}>
                        All
                    </MenuItem>
                    {this.state.officeList.map((option) => (
                        <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                            {option.name}
                        </MenuItem>
                    ))}
                </TextField>
                <InfiniteScroll
                    loadMore={this.getAnnouncements(this.state.updateList.length)}
                    hasMore={false}
                    loader={<div className="loader" key={0}>Loading ...</div>}
                    useWindow={false}
                    threshold={500}
                    getScrollParent={() => this.scrollParentRef}
                >
                    {announcements}
                </InfiniteScroll>
            </div>
        );
    }

}
export default withStyles(styles, { withTheme: true })(BranchUpdates);
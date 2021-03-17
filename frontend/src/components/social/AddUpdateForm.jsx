import React from 'react';
import {withStyles} from "@material-ui/core/styles";
import {Button, MenuItem, TextField, Typography} from "@material-ui/core";
import Endpoint from "../../config/Constants";
import safeFetch from "../../util/Util"
import {useMsal} from "@azure/msal-react";


const styles = theme => ({
    actionButton: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        marginRight: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18
    },
    actionButtonCenter: {
        background: '#00ADEF',
        borderRadius: 20,
        color: 'white',
        height: '50px',
        padding: '0 30px',
        marginTop: '10px',
        marginBottom: '10px',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 18,
        justifyContent: "center",
        alignItems: "center"
    },
    sectionTextModal: {
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 20,
        textAlign: 'center',
    },
    addAnnouncement: {
        position: 'fixed',
        top: '20%',
        left: '25%',
        width: '45%',
        height: '400',
        background: '#FFFCF7',
        padding: '30px',
        overflow: 'auto'
    },
    officeSelector: {
        marginLeft : 8
    },
    branchTitle: {
        marginLeft: 8,
        color: 'black',
        fontFamily: 'Lato',
        fontWeight: 'bolder',
        fontSize: 14
    }
});

class AddUpdateForm extends React.Component {

    state = {
        title: "",
        subtitle: "",
        content: "",
        selectedOfficeLocation: "",
        selectedOfficeID: 0,
        officeList: [],
        userID: ""
    }

    componentDidMount() {
        const { accounts } = useMsal();
        const userOID = accounts[0].idTokenClaims.oid;

        this.setState({userID: userOID});

        const requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        safeFetch(Endpoint + "/office/getAllOffices", requestOptions)
            .then((response) => response.text())
            .then(result => {
                this.setState({officeList: JSON.parse(result)});
            })
            .catch(error => console.log('error', error));
    }

    handleSubmit(event) {

        let jsonBody;
        let requestOptions;

        if (this.state.selectedOfficeLocation === "" || this.state.selectedOfficeLocation === "All"){
            jsonBody = {
                user: this.state.userID,
                title: this.state.title,
                subtitle: this.state.subtitle,
                content: this.state.content
            };
            console.log(jsonBody);
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonBody)
            };
            safeFetch(Endpoint + "/announcement/postCompanyAnnouncement", requestOptions)
                .then((response) => response.text())
                .then(result => {
                    this.props.closeModal();
                })
                .catch(error => console.log('error', error));
        } else {
            jsonBody = {
                user: this.state.userID,
                title: this.state.title,
                subtitle: this.state.subtitle,
                content: this.state.content,
                office_id: this.state.selectedOfficeID,
                office_location: this.state.selectedOfficeLocation
            }
            requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsonBody)
            };
            safeFetch(Endpoint + "/announcement/postBranchAnnouncement", requestOptions)
                .then((response) => response.text())
                .then(result => {
                    this.props.closeModal();
                })
                .catch(error => console.log('error', error));

        }
    }

    handleTitleInput(input) {
        this.setState({
            title: input.target.value
        });
    }

    handleSubtitleInput(input) {
        this.setState({
            subtitle: input.target.value
        });
    }

    handleContentInput(input) {
        this.setState({
            content: input.target.value
        });
    }

    handleOfficeChange(event) {
        if (event.target.value !== 'All') {
            const params = event.target.value.split(['-']);

            this.setState({selectedOfficeLocation: params[0], selectedOfficeID: params[1]});
        }
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.addAnnouncement}>
                <Typography className={classes.sectionTextModal}>
                    Create New Announcement
                </Typography>
                <form>
                    <div><TextField
                        id="title"
                        label="Title"
                        style={{ margin: 8 }}
                        placeholder="Announcement Title"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleTitleInput.bind(this)}
                    /></div>
                    <div><TextField
                        id="subtitle"
                        label="Subtitle"
                        style={{ margin: 8 }}
                        placeholder="Announcement Subtitle"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleSubtitleInput.bind(this)}
                    /></div>
                    <div><TextField
                        id="content"
                        label="Content"
                        style={{ margin: 8 }}
                        placeholder="Announcement Details (500 Characters)"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        onChange={this.handleContentInput.bind(this)}
                    /></div>
                    <h1 className={classes.branchTitle}>Branch (Optional)</h1>
                    <TextField className={classes.officeSelector} id="outlined-basic" variant="outlined" select onChange={(e) => this.handleOfficeChange(e)} value={this.state.selectedOffice}>
                        {this.state.officeList.map((option) => (
                            <MenuItem key={option.office_location + "-" + String(option.office_id)} value={option.office_location + "-" + String(option.office_id)}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <div>
                        <Button className={classes.actionButtonCenter} onClick={this.handleSubmit.bind(this)}>
                            Post
                        </Button>
                    </div>
                </form>
            </div>);
    }

}

export default withStyles(styles, { withTheme: true })(AddUpdateForm);
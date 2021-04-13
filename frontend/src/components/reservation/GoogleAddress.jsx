import {useState} from "react";
import React from 'react';
import PlacesAutocomplete from 'react-places-autocomplete';
import {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";
import {TextField} from "@material-ui/core";


class GoogleAddress extends React.Component {
    constructor(props) {
        super(props);
        this.state = { address: '' };
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        this.setState({ address });
    };

    render() {
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <TextField
                            {...getInputProps({
                                placeholder: 'Ex. Burnaby',
                                className: 'location-search-input',
                            })}
                            id="city"
                            label="Address"
                            style={{ margin: 8 }}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active
                                    ? 'suggestion-item--active'
                                    : 'suggestion-item';
                                const style = suggestion.active
                                    ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                                    : { cursor: 'pointer' };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}

export default GoogleAddress;
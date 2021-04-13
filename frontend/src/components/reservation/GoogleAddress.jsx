import {useState} from "react";
import React from 'react';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import {Typography} from "@material-ui/core";


function GoogleAddress() {
    const [addr, setAddr] = useState("");

    const handleChange = (address) => {
        setAddr(address);
        console.log(address);
    }

    return (
        <div>
            <GooglePlacesAutocomplete apiKey={"AIzaSyATgp1q_w6EHcx-ZhySB7lEXDew_JhJ2aY"} selectProps={{addr, onChange: handleChange}}/>
            <Typography>{addr.label}</Typography>
        </div>
    );
}

export default GoogleAddress;
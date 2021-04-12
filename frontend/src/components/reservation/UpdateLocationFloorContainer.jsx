import React, { useState } from 'react';
import UpdateLocationFloor from './UpdateLocationFloor';

function UpdateLocationFloorContainer (props) {
    const [updateLocationFloorAddition, setUpdateLocationFloorAddition] = useState([0]);

    // TODO: remove this handler- it's no longer needed according to the design of the pop-up
    const handleUpdateLocationFloorAddition = () => {
        updateLocationFloorAddition.push(0);
        setUpdateLocationFloorAddition([...updateLocationFloorAddition]);
    }

    return (
        <div>
            {updateLocationFloorAddition.map((curr, index) =>
                <div data-testid='update-location-floor'>
                    <UpdateLocationFloor handleFormChange={props.handleFormChange}
                                         floorsRetrieved={props.floorsRetrieved}
                                         key={curr}>

                    </UpdateLocationFloor>
                </ div>)}
        </div>
    );
}

export default UpdateLocationFloorContainer;

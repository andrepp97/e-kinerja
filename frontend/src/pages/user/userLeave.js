import React, { useState, useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
const absentDesc = ["Alpha", "Annual Leave", "Maternity Leave", "Sick Leave", "Unpaid Leave"]

const UserLeave = ({ data, refresh, httpRequest }) => {
    // State & props
    const [selectedDesc, setSelectedDesc] = useState(null)

    // Lifecycle
    useEffect(() => {
        if (data.desc) setSelectedDesc(data.desc)
    }, [data])

    // Function
    const updateUserDesc = (val) => {
        const body = {
            id: data.id,
            desc: val,
        }
        httpRequest.post('admin/updateUserDesc', body)
            .then((res) => console.log(res.data))
            .catch(err => console.log(err))
            .finally(() => refresh())
    }

    // Render
    return (
        <Autocomplete
            options={absentDesc}
            getOptionLabel={(option) => option}
            onChange={(event, value) => updateUserDesc(value)}
            renderInput={(params) => <TextField {...params} size='small' variant="outlined" />}
            style={{ width: '100%', minWidth: '150px', maxWidth: '250px' }}
            value={selectedDesc}
        />
    );
};

export default UserLeave;
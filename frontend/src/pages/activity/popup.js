import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../context/authProvider';
import httpRequest from '../../api/axios';

// Style
const useStyles = makeStyles(() => ({
    opacity70: {
        opacity: .7
    },
    my1: {
        marginTop: '8px',
        marginBottom: '8px',
    },
    py1: {
        paddingTop: '8px',
        paddingBottom: '8px',
    },
}))

const TaskPopup = (props) => {
    // Variables
    const classes = useStyles()
    const { userState } = useAuth()

    // Props
    const { open, handler, users, getAllAssignment } = props

    // State
    const [title, setTitle] = useState('')
    const [user, setUser] = useState('')
    const [duration, setDuration] = useState(1)
    const [desc, setDesc] = useState('')
    const [errUser, setErrUser] = useState('')
    const [errTitle, setErrTitle] = useState('')
    const [errDuration, setErrDuration] = useState('')

    // Function
    const saveAssignment = () => {
        let err = ''

        if (!title) {
            err = "Title can't be empty"
            setErrTitle("Title can't be empty")
        } else {
            setErrTitle('')
        }

        if (userState.role == 2 && !duration) {
            err = "Duration must be greater than 0"
            setErrDuration("Duration must be greater than 0")
        } else {
            setErrDuration('')
        }

        if (userState.role == 1 && !user) {
            err = "You didn't select any user"
            setErrUser("Please select a user")
        } else {
            setErrUser('')
        }

        if (!err) {
            const body = {
                user_id: userState.role == 1 ? user.id : userState.id,
                admin_id: null,
                task_title: title,
                task_desc: desc,
                attachment: null,
            }

            httpRequest.post('admin/createAssignment', body)
                .then(() => {
                    reset()
                    handler()
                    Swal.fire('Assignment Created', '', 'success')
                    getAllAssignment()
                })
                .catch(err => console.log(err.response))
        }
    }

    const reset = () => {
        setTitle('')
        setDesc('')
        setUser('')
        setDuration(1)
        setErrUser('')
        setErrTitle('')
        setErrDuration('')
    }

    // Render
    return (
        <Dialog
            fullWidth
            open={open}
            onClose={() => {
                handler()
                reset()
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                {"New Assignment"}
            </DialogTitle>
            <DialogContent>
                <div className='flex-column'>
                    {
                        userState.role == 1
                            ? (
                                <Autocomplete
                                    options={users}
                                    className={classes.my1}
                                    getOptionLabel={(option) => option.name}
                                    onChange={(event, value) => setUser(value)}
                                    renderInput={
                                        (params) => (
                                            <TextField
                                                {...params}
                                                size='small'
                                                label="User *"
                                                variant="outlined"
                                                helperText={errUser}
                                                error={errUser ? true : false}
                                            />
                                        )
                                    }
                                />
                            )
                            : null
                    }
                    <TextField
                        size="small"
                        variant="outlined"
                        label="Assignment Title *"
                        className={classes.my1}
                        helperText={errTitle}
                        error={errTitle ? true : false}
                        onChange={e => setTitle(e.target.value)}
                        value={title}
                    />
                    <TextField
                        size="small"
                        type="number"
                        variant="outlined"
                        label="Duration (hours) *"
                        className={classes.my1}
                        helperText={errDuration}
                        error={errDuration ? true : false}
                        onChange={e => e.target.value > 0 ? setDuration(e.target.value) : null}
                        value={duration}
                    />
                    <TextField
                        multiline
                        minRows={5}
                        size="small"
                        label="Description"
                        variant="outlined"
                        className={classes.my1}
                        onChange={e => setDesc(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handler()
                    reset()
                }}>
                    Cancel
                </Button>
                <Button
                    autoFocus
                    color="primary"
                    variant="contained"
                    onClick={saveAssignment}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TaskPopup;
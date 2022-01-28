import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
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

const UserPopup = (props) => {
    // Variables
    const classes = useStyles()

    // Props
    const { open, handler, getUser } = props

    // State
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errName, setErrName] = useState(false)
    const [errUsername, setErrUsername] = useState(false)
    const [errPassword, setErrPassword] = useState(false)

    // Function
    const validation = () => {
        let err = ''

        if (!name) {
            err = "Name can't be empty"
            setErrName(true)
        } else {
            setErrName(false)
        }

        if (!username) {
            err = "Username can't be empty"
            setErrUsername(true)
        } else {
            setErrUsername(false)
        }

        if (!password) {
            err = "Password can't be empty"
            setErrPassword(true)
        } else {
            setErrPassword(false)
        }

        if (!err) saveNewUser()
    }

    const saveNewUser = () => {
        setLoading(true)
        const body = {
            name,
            username,
            password,
        }

        httpRequest.post('/admin/createUser', body)
            .then(({ data }) => {
                reset()
                handler()
                getUser()
            })
            .catch((err) => {
                console.log(err.response)
            })
    }

    const reset = () => {
        setName('')
        setUsername('')
        setPassword('')
        setErrName(false)
        setErrUsername(false)
        setErrPassword(false)
        setLoading(false)
    }

    // Render
    return (
        <div>
            <Dialog
                fullWidth
                open={open}
                onClose={() => {
                    reset()
                    handler()
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>
                    {"New User"}
                </DialogTitle>
                <DialogContent>
                    <div className='flex-column'>
                        <TextField
                            size="small"
                            label="Name *"
                            error={errName}
                            variant="outlined"
                            className={classes.my1}
                            onChange={e => setName(e.target.value)}
                        />
                        <TextField
                            size="small"
                            label="Username *"
                            error={errUsername}
                            variant="outlined"
                            className={classes.my1}
                            onChange={e => setUsername(e.target.value)}
                        />
                        <TextField
                            size="small"
                            type="password"
                            label="Password *"
                            error={errPassword}
                            variant="outlined"
                            className={classes.my1}
                            onChange={e => setPassword(e.target.value)}
                        />
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button
                        disabled={loading}
                        onClick={() => {
                            reset()
                            handler()
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        autoFocus
                        color="primary"
                        variant="contained"
                        onClick={validation}
                        disabled={loading}
                    >
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserPopup;
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../context/authProvider';
import httpRequest from '../../api/axios';
import Logo from '../../logo.png';

// Style
const useStyles = makeStyles(() => ({
    root: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginCard: {
        width: '36vw',
        height: 'auto',
        minWidth: '200px',
        padding: '1.5rem 2rem',
        display: 'flex',
        flexDirection: 'column'
    },
    loginTitle: {
        opacity: .8,
        fontSize: '18px',
        fontWeight: 'bold',
        marginTop: '.5rem',
    },
    my1: {
        marginTop: '8px',
        marginBottom: '8px',
    },
    my2: {
        marginTop: '16px',
        marginBottom: '16px',
    },
    my3: {
        marginTop: '24px',
        marginBottom: '24px',
    },
    py1: {
        paddingTop: '8px',
        paddingBottom: '8px',
    }
}))

// Main Component
const Login = () => {
    // VARIABLE
    const classes = useStyles()
    const { userState, dispatch } = useAuth()

    // STATE
    const [state, setState] = useState({
        username: "",
        password: "",
    })
    const [loading, setLoading] = useState(false)

    // FUNCTION
    const inputValidation = () => {
        let err

        if (!state.password) err = "Password cannot be empty"
        if (!state.username) err = "Username cannot be empty"

        if (err) {
            Swal.fire({
                icon: 'error',
                title: 'Unauthorized',
                text: err,
                didClose: () => setLoading(false),
            })
        }
        return err
    }

    const onLogin = () => {
        if (!inputValidation()) {
            setLoading(true)

            httpRequest.post('/user/login', { ...state })
                .then(({ data }) => {
                    const obj = {
                        id: data.id,
                        role: data.role,
                        name: data.name,
                        username: data.username,
                        userToken: data.token,
                    }
                    localStorage.setItem('@ekinerja/token', JSON.stringify(obj))
                    dispatch({
                        ...obj,
                        type: 'LOGIN',
                    })
                })
                .catch((err) => {
                    // console.log(err.response)
                    Swal.fire({
                        icon: 'error',
                        title: 'Unauthorized',
                        text: err.response.data || '',
                        didClose: () => setLoading(false),
                    })
                })
        }
    }

    const onKeyEnter = (event) => {
        if (event.key === "Enter") {
            onLogin()
        }
    }

    // RENDER
    return userState.isLogin
        ? <Navigate to="/dashboard" />
        : (
            <div id="login-bg" className={classes.root}>
                <Card className={classes.loginCard}>

                    <div className='flex-center my-3 px-2'>
                        <img
                            src={Logo}
                            width={200}
                            alt="E-Kinerja"
                        />
                    </div>

                    <TextField
                        size="small"
                        label="Username"
                        variant="outlined"
                        onKeyUp={onKeyEnter}
                        className={classes.my2}
                        onChange={e => setState({ ...state, username: e.target.value })}
                    />

                    <TextField
                        size="small"
                        type="password"
                        label="Password"
                        variant="outlined"
                        onKeyUp={onKeyEnter}
                        className={classes.my2}
                        onChange={e => setState({ ...state, password: e.target.value })}
                    />

                    <Button
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        onClick={onLogin}
                        className={clsx([classes.my3, classes.py1])}
                    >
                        {
                            loading
                                ? <CircularProgress size={20} />
                                : 'Login'
                        }
                    </Button>

                </Card>
            </div>
        );
};

export default Login;
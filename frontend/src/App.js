import React, { useState, useEffect } from 'react';
import Router from './routes/router';
import clsx from 'clsx';
import { Sidebar } from './components';
import { useAuth } from './context/authProvider';
import { makeStyles } from '@material-ui/core/styles';
import { indigo, deepPurple } from '@material-ui/core/colors';

const drawerWidth = 225;
const useStyles = makeStyles((theme) => ({
    deepPurple: {
        color: theme.palette.getContrastText(deepPurple[500]),
        backgroundColor: deepPurple[500],
    },
    indigo: {
        color: theme.palette.getContrastText(indigo[500]),
        backgroundColor: indigo[500],
    },
    nameText: {
        marginTop: '12px',
        fontSize: '18px',
        fontWeight: '500',
        letterSpacing: '.5px',
        opacity: .8,
    },
    appBar: {
        backgroundColor: '#fecd1a',
        color: '#565656',
        height: '48px',
        justifyContent: 'center',
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        height: '48px',
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: '20px',
    },
    hide: {
        display: 'none',
    },
    drawer: {
        flexShrink: 0,
        width: drawerWidth,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(7),
        },
    },
    toolbar: {
        marginLeft: '4px'
    },
    content: {
        marginLeft: drawerWidth,
        minHeight: '100vh',
        transition: '.25s',
        flexGrow: 1,
    },
    contentShift: {
        marginLeft: '56px',
    },
    title: {
        flexGrow: 1,
        padding: '0 8px',
    },
    secondary: {
        textAlign: 'center',
        padding: '4px 8px',
        opacity: .8,
        margin: 0,
    },
    px1: {
        paddingLeft: '8px',
        paddingRight: '8px',
    },
    px2: {
        paddingLeft: '16px',
        paddingRight: '16px',
    },
}));

const App = () => {
    // Context & Variable
    const classes = useStyles()
    const { userState, dispatch } = useAuth()

    // State
    const [open, setOpen] = useState(true)

    // Function
    const handleDrawerClose = () => setOpen(!open)

    // Lifecycle
    useEffect(() => {
        let token = JSON.parse(localStorage.getItem('@ekinerja/token'))

        const reloadToken = () => {
            if (token) {
                dispatch({
                    ...token,
                    type: 'LOGIN',
                })
            } else {
                dispatch({ type: 'LOGOUT' })
                console.log('Unauthorized')
            }
        }

        reloadToken()
    }, [dispatch])

    // Render
    return (
        <div style={{ background: '#F4F4F4' }}>

            {
                userState.isLogin
                    ? (
                        <Sidebar
                            isOpen={open}
                            classes={classes}
                            handleDrawerClose={handleDrawerClose}
                        />
                    )
                    : null
            }

            <main
                className={
                    userState.isLogin
                        ? clsx(classes.content, { [classes.contentShift]: !open })
                        : ''
                }
            >
                <Router />
            </main>
        </div>
    );
};

export default App;
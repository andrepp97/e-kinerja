import React from 'react';
import Swal from 'sweetalert2';
import clsx from 'clsx';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Assignment, Dashboard, DoneAll, People, ExitToApp } from '@material-ui/icons';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/authProvider';

const adminSideMenu = [
    {
        label: 'Dashboard',
        url: '/dashboard',
        icon: <Dashboard />,
    },
    {
        label: 'Assignments',
        url: '/assignments',
        icon: <Assignment />,
    },
    {
        label: 'Users',
        url: '/users',
        icon: <People />,
    },
]

const userSideMenu = [
    {
        label: 'Dashboard',
        url: '/dashboard',
        icon: <Dashboard />,
    },
    {
        label: 'Attendace',
        url: '/attendance',
        icon: <DoneAll />,
    },
    {
        label: 'Assignments',
        url: '/assignments',
        icon: <Assignment />,
    },
]

const Sidebar = (props) => {
    const {
        isOpen,
        classes,
        handleDrawerClose,
    } = props

    const { userState, dispatch } = useAuth()

    const handleLogout = () => {
        Swal.fire({
            title: `Are you sure want to logout ?`,
            showConfirmButton: false,
            showCancelButton: true,
            showDenyButton: true,
            denyButtonText: `Yes`,
        }).then((result) => {
            if (result.isDenied) {
                localStorage.removeItem('@ekinerja/token')
                dispatch({
                    type: 'LOGOUT'
                })
            }
        })
    }

    return (
        <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
                [classes.drawerOpen]: isOpen,
                [classes.drawerClose]: !isOpen,
            })}
            classes={{
                paper: clsx({
                    [classes.drawerOpen]: isOpen,
                    [classes.drawerClose]: !isOpen,
                }),
            }}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    <MenuIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                {
                    userState.role === 1
                        ? adminSideMenu.map((menu, idx) => (
                            <NavLink
                                key={idx}
                                to={menu.url}
                                className="url-text"
                            >
                                <ListItem button>
                                    <ListItemIcon>
                                        {menu.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={menu.label} />
                                </ListItem>
                            </NavLink>
                        ))
                        : userSideMenu.map((menu, idx) => (
                            <NavLink
                                key={idx}
                                to={menu.url}
                                className="url-text"
                            >
                                <ListItem button>
                                    <ListItemIcon>
                                        {menu.icon}
                                    </ListItemIcon>
                                    <ListItemText primary={menu.label} />
                                </ListItem>
                            </NavLink>
                        ))
                }
            </List>
            <Button
                color='secondary'
                variant='outlined'
                onClick={handleLogout}
                className={isOpen ? 'btn-logout' : 'btn-logout2'}
            >
                {isOpen ? 'Logout' : <ExitToApp fontSize='small' />}
            </Button>
        </Drawer>
    );
};

export default Sidebar;
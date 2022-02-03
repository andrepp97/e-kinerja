import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import Swal from 'sweetalert2';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import httpRequest from '../../api/axios';
import UserPopup from './popup';

// Style
const useStyles = makeStyles(() => ({
    root: {
        padding: '42px 30px',
    },
    opacity70: {
        opacity: .7
    },
    m2: {
        margin: '16px'
    },
    m3: {
        margin: '24px'
    },
    my1: {
        marginTop: '8px',
        marginBottom: '8px',
    },
    my3: {
        marginTop: '24px',
        marginBottom: '24px',
    },
    py1: {
        paddingTop: '8px',
        paddingBottom: '8px',
    },
}))

// Component
const Users = () => {
    // Variables
    const classes = useStyles()

    // State
    const [open, setOpen] = useState(false)
    const [data, setData] = useState(null)
    const [selected, setSelected] = useState(null)
    const [selected2, setSelected2] = useState(null)

    // Get Data
    const getAllUser = () => {
        httpRequest.get('admin/getAllUser')
            .then(({ data }) => setData(data))
            .catch(err => console.log(err.response))
    }

    const toogleBanUser = useCallback((status) => {
        Swal.fire({
            title: `Are you sure you want to ban ${selected.name} ?`,
            showConfirmButton: false,
            showCancelButton: true,
            showDenyButton: true,
            denyButtonText: `Yes`,
            didClose: () => setSelected(null),
        }).then((result) => {
            if (result.isDenied) {
                httpRequest.post('admin/toogleBanUser', { id: selected.id, status })
                    .then(() => {
                        Swal.fire(`${selected.name} has been banned`, '', 'success')
                        getAllUser()
                    })
                    .catch(err => {
                        console.log(err.response)
                        Swal.fire(err.response.data, '', 'error')
                    })
            } else {
                setSelected(null)
            }
        })
    }, [selected])

    const toogleActivateUser = useCallback((status) => {
        Swal.fire({
            title: `Are you sure you want to activate ${selected2.name} ?`,
            showConfirmButton: true,
            showCancelButton: true,
            showDenyButton: false,
            didClose: () => setSelected2(null),
        }).then((result) => {
            if (result.isConfirmed) {
                httpRequest.post('admin/toogleBanUser', { id: selected2.id, status })
                    .then(() => {
                        Swal.fire(`${selected2.name} has been activated`, '', 'success')
                        getAllUser()
                    })
                    .catch(err => {
                        console.log(err.response)
                        Swal.fire(err.response.data, '', 'error')
                    })
            } else {
                setSelected2(null)
            }
        })
    }, [selected2])

    // Lifecycle
    useEffect(() => {
        getAllUser()
    }, [])

    useEffect(() => {
        if (selected) toogleBanUser('inactive')
    }, [selected, toogleBanUser])

    useEffect(() => {
        if (selected2) toogleActivateUser('active')
    }, [selected2, toogleActivateUser])

    // Render
    return (
        <div className={classes.root}>

            <h2 className={classes.opacity70}>
                USERS
            </h2>

            <hr className={classes.opacity70} />

            <UserPopup
                open={open}
                handler={() => setOpen(false)}
                getUser={getAllUser}
            />

            <Button
                color='primary'
                variant='contained'
                startIcon={<AddIcon />}
                className={classes.my1}
                onClick={() => setOpen(true)}
            >
                New User
            </Button>

            <Paper className='mt-2' elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 'bold', minWidth: '12vw' }}>
                                Name
                            </TableCell>
                            <TableCell style={{ fontWeight: 'bold', minWidth: '10vw' }}>
                                Username
                            </TableCell>
                            <TableCell style={{ fontWeight: 'bold', minWidth: '10vw' }}>
                                Join Date
                            </TableCell>
                            <TableCell style={{ fontWeight: 'bold', minWidth: '8vw' }}>
                                Status
                            </TableCell>
                            <TableCell align='center' style={{ fontWeight: 'bold' }}>
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data ? data.map((row) => (
                            <TableRow hover key={row.id}>
                                <TableCell>
                                    {row.name}
                                </TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>
                                    {moment(row.created_date).format('DD MMMM YYYY')}
                                </TableCell>
                                <TableCell>{row.status}</TableCell>
                                <TableCell>
                                    <div className='flex-center'>
                                        <Tooltip title="Details">
                                            <Link to={`/user/${row.id}`}>
                                                <IconButton size='small'>
                                                    <InsertDriveFileIcon color='primary' />
                                                </IconButton>
                                            </Link>
                                        </Tooltip>
                                        <Divider
                                            flexItem
                                            className='mx-1'
                                            orientation='vertical'
                                        />
                                        {
                                            row.status === 'active'
                                                ? (
                                                    <Tooltip title="Ban">
                                                        <IconButton size='small' onClick={() => setSelected(row)}>
                                                            <BlockIcon color='secondary' />
                                                        </IconButton>
                                                    </Tooltip>
                                                )
                                                : (
                                                    <Button
                                                        size='small'
                                                        color='primary'
                                                        className='ml-1'
                                                        variant='outlined'
                                                        onClick={() => setSelected2(row)}
                                                    >
                                                        Activate
                                                    </Button>
                                                )
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        )) : null}
                    </TableBody>
                </Table>
            </Paper>

        </div>
    );
};

export default Users;
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import AddIcon from '@material-ui/icons/Add';
import BlockIcon from '@material-ui/icons/Block';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
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
    dateText: {
        opacity: .75,
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '24px',
    },
    time: {
        fontSize: '3.5vw',
        color: '#606060',
    },
    monthBox: {
        width: '250px',
        margin: '16px 0 16px 0',
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
            .then(({ data }) => {
                setData(data)
            })
            .catch(err => {
                console.log(err.response)
            })
    }

    const toogleBanUser = (status) => {
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
            }
        })
    }

    const toogleActivateUser = (status) => {
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
            }
        })
    }

    // Lifecycle
    useEffect(() => {
        getAllUser()
    }, [])

    useEffect(() => {
        if (selected) toogleBanUser('inactive')
    }, [selected])

    useEffect(() => {
        if (selected2) toogleActivateUser('active')
    }, [selected2])

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

            <Table className="mt-3">
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
                        <TableCell style={{ fontWeight: 'bold' }}>
                            Action
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data ? data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell>
                                {row.name}
                            </TableCell>
                            <TableCell>{row.username}</TableCell>
                            <TableCell>
                                {moment(row.created_date).format('DD MMMM YYYY')}
                            </TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>
                                {
                                    row.status === 'active'
                                        ? (
                                            <Tooltip title="Ban">
                                                <IconButton
                                                    size='small'
                                                    onClick={() => setSelected(row)}
                                                >
                                                    <BlockIcon color='secondary' />
                                                </IconButton>
                                            </Tooltip>
                                        )
                                        : (
                                            <Button
                                                size='small'
                                                color='primary'
                                                variant='outlined'
                                                onClick={() => setSelected2(row)}
                                            >
                                                Activate
                                            </Button>
                                        )
                                }
                            </TableCell>
                        </TableRow>
                    )) : null}
                </TableBody>
            </Table>

        </div>
    );
};

export default Users;
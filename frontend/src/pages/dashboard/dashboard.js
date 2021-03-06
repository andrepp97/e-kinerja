import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../context/authProvider';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import httpRequest from '../../api/axios';

// Static
const useStyles = makeStyles(() => ({
    root: {
        padding: '42px 30px',
    },
    opacity70: {
        opacity: .7,
    },
    my1: {
        marginTop: '8px',
        marginBottom: '8px',
    },
    py1: {
        paddingTop: '8px',
        paddingBottom: '8px',
    },
    welcome: {
        fontSize: 16,
        marginBottom: '36px',
    },
    subText: {
        opacity: .75,
        textAlign: 'center',
    },
}))
const curdate = moment(new Date()).format('YYYY MM DD')
const timeDiffFormat = (time) => {
    if (time !== '---') {
        const arr = time.split(':')

        if (arr[0] !== '00') {
            return arr[0] + ' hour(s) ' + arr[1] + ' minute(s)'
        } else if (arr[1] !== '00') {
            return arr[1] + ' minute(s)'
        } else {
            return arr[2] + ' second(s)'
        }
    } else {
        return '---'
    }
}

// Component
const Dashboard = () => {
    // Variables
    const classes = useStyles()
    const { userState } = useAuth()

    // State
    const [assignments, setAssignments] = useState([])
    const [attendances, setAttendances] = useState([])

    // Get Data
    const getRecentTask = useCallback(() => {
        httpRequest.get('user/getRecentTask', { params: { id: userState.id } })
            .then(({ data }) => setAssignments(data))
            .catch(err => console.log(err.response))
    }, [userState])

    const getRecentAttendance = useCallback(() => {
        httpRequest.get('user/getRecentAttendance', { params: { id: userState.id } })
            .then(({ data }) => setAttendances(data))
            .catch(err => console.log(err.response))
    }, [userState])

    const getAssignmentForAdmin = useCallback(() => {
        const param = {
            id: userState.id,
            role: userState.role,
            limit: 5,
        }
        httpRequest.get('admin/getAllAssignment', { params: param })
            .then(({ data }) => setAssignments(data))
            .catch(err => console.log(err.response))
    }, [userState])

    const getAttendanceForAdmin = () => {
        httpRequest.get('admin/getUserAttendance')
            .then(({ data }) => setAttendances(data))
            .catch(err => console.log(err.response))
    }

    // Lifecycle
    useEffect(() => {
        if (userState.role === 2) {
            getRecentTask()
            getRecentAttendance()
        } else {
            getAssignmentForAdmin()
            getAttendanceForAdmin()
        }
    }, [userState, getRecentTask, getRecentAttendance, getAssignmentForAdmin])

    // Render
    return (
        <div className={classes.root}>

            <h2 className={classes.opacity70}>
                DASHBOARD
            </h2>

            <hr className={classes.opacity70} />

            <Grid container spacing={4}>

                <Grid
                    item
                    className='mt-3'
                    md={userState.role === 1 ? 12 : 6}
                >
                    <Paper className='p-3' elevation={3}>
                        <h3 className={classes.subText}>
                            Recent Work
                        </h3>
                        <Divider />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        Assignment Title
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        Description
                                    </TableCell>
                                    {
                                        userState.role === 1 && (
                                            <TableCell style={{ fontWeight: 'bold', minWidth: '10vw' }}>
                                                Assigned to
                                            </TableCell>
                                        )
                                    }
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {assignments.map((row, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        selected={userState.role === 2 ? row.status === 'done' : row.task_status === 'done'}
                                    >
                                        <TableCell>{row.task_title}</TableCell>
                                        <TableCell>{row.task_desc}</TableCell>
                                        {userState.role === 1 && <TableCell>{row.name}</TableCell>}
                                        <TableCell>
                                            <span>
                                                {userState.role === 2 ? row.status : row.task_status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className='text-right mt-3'>
                            <Link to='/assignments'>
                                <Button color='primary' variant='outlined'>
                                    All assignments
                                </Button>
                            </Link>
                        </div>
                    </Paper>
                </Grid>

                <Grid
                    item
                    className='mt-3'
                    md={userState.role === 1 ? 12 : 6}
                >
                    <Paper className='p-3' elevation={3}>
                        <h3 className={classes.subText}>
                            Recent Attendances
                        </h3>
                        <Divider />
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {
                                        userState.role === 1 && (
                                            <TableCell style={{ fontWeight: 'bold' }}>
                                                User Name
                                            </TableCell>
                                        )
                                    }
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        Clock In
                                    </TableCell>
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        Clock Out
                                    </TableCell>
                                    {
                                        userState.role === 1 && (
                                            <TableCell style={{ fontWeight: 'bold' }}>
                                                Total Hour(s)
                                            </TableCell>
                                        )
                                    }
                                    <TableCell style={{ fontWeight: 'bold' }}>
                                        Date
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {
                                    attendances.map((row, index) => (
                                        <TableRow
                                            hover
                                            key={index}
                                            selected={moment(row.created_date).format('YYYY MM DD') === curdate}
                                        >
                                            {
                                                userState.role === 1 && (
                                                    <TableCell>
                                                        {row.name}
                                                    </TableCell>
                                                )
                                            }
                                            <TableCell>
                                                {row.clock_in === null || row.clock_in === '00:00:00' ? '---' : row.clock_in}
                                            </TableCell>
                                            <TableCell>
                                                {row.clock_out === null || row.clock_out === '00:00:00' ? '---' : row.clock_out}
                                            </TableCell>
                                            {userState.role === 1 && (
                                                <TableCell>
                                                    {timeDiffFormat(row.total)}
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                {
                                                    moment(row.created_date).format('YYYY MM DD') === curdate
                                                        ? (
                                                            <>
                                                                {moment(row.created_date).format('DD MMMM YYYY')}
                                                                <strong className='ml-2'>(Today)</strong>
                                                            </>
                                                        )
                                                        : moment(row.created_date).format('DD MMMM YYYY')
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                        <div className='text-right mt-3'>
                            <Link to={userState.role === 1 ? '/users' : '/attendance'}>
                                <Button color='primary' variant='outlined'>
                                    {userState.role === 1 ? 'All users' : 'All attendances'}
                                </Button>
                            </Link>
                        </div>
                    </Paper>
                </Grid>

            </Grid>

        </div>
    );
};

export default Dashboard;
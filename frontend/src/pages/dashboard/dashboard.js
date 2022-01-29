import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { useAuth } from '../../context/authProvider';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
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
    welcome: {
        fontSize: 16,
        marginBottom: '36px',
    }
}))
const curdate = moment(new Date()).format('YYYY MM DD')

// Component
const Dashboard = () => {
    // Variables
    const classes = useStyles()
    const { userState } = useAuth()

    // State
    const [assignments, setAssignments] = useState([])
    const [attendances, setAttendances] = useState([])

    // Lifecycle
    useEffect(() => {
        if (userState.role == 2) {
            getRecentTask()
            getRecentAttendance()
        } else {
            getAssignmentForAdmin()
        }
    }, [])

    // Get Data
    const getRecentTask = () => {
        httpRequest.get('user/getRecentTask', { params: { id: userState.id } })
            .then(({ data }) => setAssignments(data))
            .catch(err => console.log(err.response))
    }

    const getRecentAttendance = () => {
        httpRequest.get('user/getRecentAttendance', { params: { id: userState.id } })
            .then(({ data }) => setAttendances(data))
            .catch(err => console.log(err.response))
    }

    const getAssignmentForAdmin = () => {
        const param = {
            id: userState.id,
            role: userState.role,
            limit: 5,
        }
        httpRequest.get('admin/getAllAssignment', { params: param })
            .then(({ data }) => setAssignments(data))
            .catch(err => console.log(err.response))
    }

    // Render
    return (
        <div className={classes.root}>

            <h2 className={classes.opacity70}>
                DASHBOARD
            </h2>

            <hr className={classes.opacity70} />

            <p className={classes.welcome}>
                Welcome, <span className='main-text'>{userState.username}</span>
            </p>

            <Grid container spacing={3}>

                <Grid item md={userState.role == 1 ? 10 : 6}>
                    <h5 className={classes.opacity70}>
                        Recent Work
                    </h5>
                    <Paper className='p-2'>
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
                                        userState.role == 1 && (
                                            <TableCell style={{ fontWeight: 'bold' }}>
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
                                        key={index}
                                        style={row.task_status == 'done' ? { background: '#eaeaea' } : {}}
                                    >
                                        <TableCell>{row.task_title}</TableCell>
                                        <TableCell>{row.task_desc}</TableCell>
                                        {userState.role == 1 && <TableCell>{row.name}</TableCell>}
                                        <TableCell>
                                            <span>
                                                {userState.role == 2 ? row.status : row.task_status}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <div className='text-right mt-2'>
                            <Link to='/assignments'>
                                All assignments
                            </Link>
                        </div>
                    </Paper>
                </Grid>

                {
                    userState.role == 2 && (
                        <Grid item md={6}>
                            <h5 className={classes.opacity70}>
                                Recent Attendances
                            </h5>
                            <Paper className='p-2'>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell style={{ fontWeight: 'bold' }}>
                                                Clock In
                                            </TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>
                                                Clock Out
                                            </TableCell>
                                            <TableCell style={{ fontWeight: 'bold' }}>
                                                Date
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            attendances.map((row, index) => (
                                                <TableRow
                                                    key={index}
                                                    style={moment(row.created_date).format('YYYY MM DD') == curdate ? { background: '#eaeaea' } : {}}
                                                >
                                                    <TableCell>
                                                        {row.clock_in == null || row.clock_in == '00:00:00' ? '---' : row.clock_in}
                                                    </TableCell>
                                                    <TableCell>
                                                        {row.clock_out == null || row.clock_out == '00:00:00' ? '---' : row.clock_out}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            moment(row.created_date).format('YYYY MM DD') == curdate
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
                                <div className='text-right mt-2'>
                                    <Link to='/attendance'>
                                        All attendances
                                    </Link>
                                </div>
                            </Paper>
                        </Grid>
                    )
                }

            </Grid>

        </div>
    );
};

export default Dashboard;
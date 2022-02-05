import React, { useEffect, useState, useCallback } from 'react';
import moment from 'moment';
import Swal from 'sweetalert2';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Paper, Button } from '@material-ui/core/';
import { useAuth } from '../../context/authProvider';
import httpRequest from '../../api/axios';

// Static
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
    },
    time: {
        fontFamily: 'Segoe UI',
        fontSize: '3.5vw',
        color: '#606060',
    },
    monthBox: {
        width: '250px',
        margin: '16px 0 16px 0',
    },
}))
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
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const curdate = moment(new Date()).format('YYYY MM DD')

const Attendance = () => {
    // Variables
    const classes = useStyles()
    const { userState } = useAuth()

    // State
    const [date, setDate] = useState(new Date())
    const [selectedMonth, setSelectedMonth] = useState(null)
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    // Get Data
    const getAttendanceList = useCallback(() => {
        const body = {
            id: userState.id,
            month: months.indexOf(selectedMonth) + 1,
        }
        httpRequest.post('user/getAttendanceList', body)
            .then(({ data }) => setData(data))
            .catch(err => console.log(err.response))
    }, [userState, selectedMonth])

    // Lifecycle
    useEffect(() => {
        const timerID = setInterval(() => tick(), 1000)
        getCurentMonth()

        return function cleanup() {
            clearInterval(timerID)
        }
    }, [])

    useEffect(() => {
        if (selectedMonth) getAttendanceList()
    }, [selectedMonth, getAttendanceList])

    // Function
    const tick = () => setDate(new Date())

    const getCurentMonth = () => {
        const d = new Date()
        const month = d.getMonth()
        setSelectedMonth(months[month])
    }

    const userClockIn = (type) => {
        setLoading(true)

        const body = {
            user_id: userState.id,
            clock_in: type === 'clockIn' ? date.toLocaleTimeString('en-GB') : '00:00:00',
            clock_out: type === 'clockOut' ? date.toLocaleTimeString('en-GB') : '00:00:00',
        }

        httpRequest.post(`user/${type}`, body)
            .then(() => {
                Swal.fire(`${type === 'clockIn' ? 'Clocked In' : 'Clocked Out'}`, '', 'success')
                getAttendanceList()
            })
            .catch(err => {
                console.log(err.response)
                Swal.fire(err.response.data, '', 'warning')
            })
            .finally(() => setLoading(false))
    }

    // Render
    return (
        <div className={classes.root}>

            <h2 className={classes.opacity70}>
                ATTENDANCE
            </h2>

            <hr className={classes.opacity70} />

            <Paper
                elevation={3}
                className="mt-3 p-3"
            >
                <Grid
                    container
                    justifyContent='center'
                    className={classes.dateText}
                >
                    <p>
                        {moment().format("DD MMMM YYYY")}
                    </p>
                </Grid>
                <Grid
                    container
                    justifyContent='center'
                    className={classes.time}
                >
                    {date.toLocaleTimeString('en-GB')}
                </Grid>
                <div className='flex-center mt-2'>
                    <Button
                        color='primary'
                        variant='contained'
                        className={classes.m3}
                        onClick={() => userClockIn('clockIn')}
                        disabled={loading}
                    >
                        Clock In
                    </Button>
                    <Button
                        color='primary'
                        variant='contained'
                        className={classes.m3}
                        onClick={() => userClockIn('clockOut')}
                        disabled={loading}
                    >
                        Clock Out
                    </Button>
                </div>
            </Paper>

            <div className='my-4'>
                <p className={classes.dateText}>
                    Attendance List
                </p>
                <Autocomplete
                    options={months}
                    className={classes.monthBox}
                    getOptionLabel={(option) => option}
                    onChange={(event, value) => setSelectedMonth(value)}
                    renderInput={(params) => <TextField {...params} size='small' label="Select Month" variant="outlined" />}
                    value={selectedMonth}
                />
                <Paper elevation={0} style={{ width: '100%' }}>
                    <Table style={{ width: '100%' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Clock In
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Clock Out
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Total Hour(s)
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                data
                                    ? data.length
                                        ? data.map((row) => (
                                            <TableRow
                                                hover
                                                key={row.id}
                                                selected={moment(row.created_date).format('YYYY MM DD') === curdate}
                                            >
                                                <TableCell>
                                                    {row.clock_in === null || row.clock_in === '00:00:00' ? '---' : row.clock_in}
                                                </TableCell>
                                                <TableCell>
                                                    {row.clock_out === null || row.clock_out === '00:00:00' ? '---' : row.clock_out}
                                                </TableCell>
                                                <TableCell>
                                                    {timeDiffFormat(row.total)}
                                                </TableCell>
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
                                        : (
                                            <TableRow>
                                                <TableCell>
                                                    Currently nothing to show here
                                                </TableCell>
                                            </TableRow>
                                        )
                                    : null
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>

        </div>
    );
};

export default Attendance;
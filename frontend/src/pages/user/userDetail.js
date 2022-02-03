import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import moment from 'moment';
import httpRequest from '../../api/axios';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

// Tab Panel
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            {...other}
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
        >
            {value === index && (
                <Box mt={1}>
                    {children}
                </Box>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
}
const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

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
}))
const baseUrl = 'http://localhost:2000'
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

const UserDetail = () => {
    // Variables
    const classes = useStyles()
    const { id } = useParams()

    // State
    const [value, setValue] = useState(0)
    const [data, setData] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [attendances, setAttendances] = useState([])

    // Get Data
    const getUserDetail = useCallback(() => {
        httpRequest.get('admin/getUserById', { params: { id } })
            .then(({ data }) => setData(data))
            .catch(err => console.log(err.response))
    }, [id])

    const getUserAssignment = useCallback(() => {
        httpRequest.get('admin/getAssignmentById', { params: { id } })
            .then(({ data }) => setAssignments(data))
            .catch(err => console.log(err.response))
    }, [id])

    const toogleAssignment = (check, task_id) => {
        const body = {
            check,
            id: task_id,
        }

        httpRequest.post('admin/toogleAssignment', body)
            .then(() => getUserAssignment())
            .catch(err => console.log(err.response))
    }

    const getUserAttendance = useCallback(() => {
        httpRequest.get('admin/getAttendanceById', { params: { id } })
            .then(({ data }) => setAttendances(data))
            .catch(err => console.log(err.response))
    }, [id])

    // Lifecycle
    useEffect(() => {
        getUserDetail()
        getUserAssignment()
        getUserAttendance()
    }, [id, getUserDetail, getUserAssignment, getUserAttendance])

    // Function
    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    // Render
    return (
        <div className={classes.root}>

            <h2 className={classes.opacity70}>
                {data ? data.name : 'Users'}
            </h2>

            <hr className={classes.opacity70} />

            <Tabs
                value={value}
                className='mt-3'
                textColor="primary"
                indicatorColor="primary"
                onChange={handleChange}
                style={{ boxShadow: 'rgba(99, 99, 99, 0.2) 0px 2px 8px 0px' }}
            >
                <Tab label="Assignments" {...a11yProps(0)} />
                <Tab label="Attendances" {...a11yProps(1)} />
            </Tabs>

            <TabPanel value={value} index={0}>
                <div className='text-right mt-2'>
                    <ReactHTMLTableToExcel
                        sheet="Assignments"
                        table="assignment-table"
                        className="btn-download"
                        buttonText="Download as Excel"
                        filename={data ? data.name + ' (Assignments)' : 'Assignments'}
                    />
                </div>
                <Paper className='mt-2' elevation={3}>
                    <Table id="assignment-table">
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Assignment Title
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Description
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', minWidth: '6vw' }}>
                                    Duration
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', minWidth: '8vw' }}>
                                    Attachment
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                assignments.length
                                    ? assignments.map((row) => (
                                        <TableRow
                                            hover
                                            key={row.id}
                                            selected={row.status === 'done'}
                                        >
                                            <TableCell>{row.task_title}</TableCell>
                                            <TableCell>{row.task_desc}</TableCell>
                                            <TableCell>
                                                {row.duration} hour(s)
                                            </TableCell>
                                            <TableCell>
                                                {
                                                    row.attachment
                                                        ? (
                                                            <a href={baseUrl + row.attachment} target="_blank" rel="noopener noreferrer" download>
                                                                <Button
                                                                    variant='contained'
                                                                    color='primary'
                                                                    size='small'
                                                                >
                                                                    Download
                                                                </Button>
                                                            </a>
                                                        ) : '---'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    color="primary"
                                                    checked={row.status === 'done' ? true : false}
                                                    onChange={e => toogleAssignment(e.target.checked, row.id)}
                                                />
                                                <span>
                                                    {row.task_status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                    : (
                                        <TableRow>
                                            <TableCell>
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                    )
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </TabPanel>

            <TabPanel value={value} index={1}>
                <div className='text-right mt-2'>
                    <ReactHTMLTableToExcel
                        sheet="Attendances"
                        table="attendance-table"
                        className="btn-download"
                        buttonText="Download as Excel"
                        filename={data ? data.name + ' (Attendances)' : 'Attendances'}
                    />
                </div>
                <Paper className='mt-2' elevation={3}>
                    <Table id='attendance-table'>
                        <TableHead>
                            <TableRow>
                                <TableCell style={{ fontWeight: 'bold', minWidth: '14vw' }}>
                                    Clock In
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', minWidth: '14vw' }}>
                                    Clock Out
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', minWidth: '14vw' }}>
                                    Total Hour(s)
                                </TableCell>
                                <TableCell style={{ fontWeight: 'bold', minWidth: '14vw' }}>
                                    Date
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                attendances.length
                                    ? attendances.map((row) => (
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
                                                No Data
                                            </TableCell>
                                        </TableRow>
                                    )
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </TabPanel>

        </div>
    )
};

export default UserDetail;
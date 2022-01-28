import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import AddIcon from '@material-ui/icons/Add';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import { useAuth } from '../../context/authProvider';
import httpRequest from '../../api/axios';
import Upload from './upload';
import Popup from './popup';

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
}))
const baseUrl = 'http://localhost:2000'

const Assignment = () => {
    // Variables
    const classes = useStyles()
    const { userState } = useAuth()

    // State
    const [data, setData] = useState([])
    const [selected, setSelected] = useState(null)
    const [assignments, setAssignments] = useState([])
    const [upload, setUpload] = useState(false)
    const [open, setOpen] = useState(false)

    // Lifecycle
    useEffect(() => {
        getUserData()
        getAllAssignment()
    }, [])

    // Get Data
    const getUserData = () => {
        httpRequest.get('admin/getAllUser')
            .then(({ data }) => setData(data))
            .catch(err => console.log(err.response))
    }

    const getAllAssignment = () => {
        const param = {
            id: userState.id,
            role: userState.role,
        }
        httpRequest.get('admin/getAllAssignment', { params: param })
            .then(({ data }) => setAssignments(data))
            .catch(err => console.log(err.response))
    }

    const toogleAssignment = (check, task_id) => {
        const body = {
            check,
            id: task_id,
        }

        httpRequest.post('admin/toogleAssignment', body)
            .then(({ data }) => getAllAssignment())
            .catch(err => console.log(err.response))
    }

    const uploadAttachment = (file) => {
        let formdata = new FormData(),
            options = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }

        formdata.append('file', file)
        formdata.append('id', selected.task_id)

        httpRequest.post('user/uploadAttachment', formdata, options)
            .then(({ data }) => {
                Swal.fire('Uploaded', '', 'success')
                setUpload(false)
                getAllAssignment()
            })
            .catch(err => console.log(err.response))
    }

    // Render
    return (
        <div className={classes.root}>

            <h2 className={classes.opacity70}>
                ASSIGNMENTS
            </h2>

            <hr className={classes.opacity70} />

            <Button
                color='primary'
                variant='contained'
                startIcon={<AddIcon />}
                className={classes.my1}
                onClick={() => setOpen(true)}
            >
                New Assignment
            </Button>

            <Table className="mt-3">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 'bold' }}>
                            Assignment Title
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold', minWidth: '120px' }}>
                            Description
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold', minWidth: '120px' }}>
                            Assigned to
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold', minWidth: '120px' }}>
                            Attachment
                        </TableCell>
                        <TableCell style={{ fontWeight: 'bold', minWidth: '100px' }}>
                            Status
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {assignments.map((row) => (
                        <TableRow
                            key={row.task_id}
                            style={row.task_status == 'done' ? { background: '#eaeaea' } : {}}
                        >
                            <TableCell>{row.task_title}</TableCell>
                            <TableCell>{row.task_desc}</TableCell>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>
                                {
                                    userState.role == 2
                                        ? row.attachment
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
                                            )
                                            : (
                                                <Button
                                                    startIcon={<CloudUploadIcon />}
                                                    variant="outlined"
                                                    component="span"
                                                    color="primary"
                                                    size='small'
                                                    onClick={() => {
                                                        setSelected(row)
                                                        setUpload(true)
                                                    }}
                                                >
                                                    Upload
                                                </Button>
                                            )
                                        : row.attachment
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
                                    disabled={userState.role == 1 ? false : true}
                                    checked={row.task_status == 'done' ? true : false}
                                    onChange={e => toogleAssignment(e.target.checked, row.task_id)}
                                />
                                <span>
                                    {row.task_status}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Popup
                open={open}
                users={data}
                handler={() => setOpen(false)}
                getAllAssignment={getAllAssignment}
            />

            <Upload
                open={upload}
                data={selected}
                userUpload={uploadAttachment}
                handler={() => setUpload(false)}
            />

        </div>
    );
};

export default Assignment;
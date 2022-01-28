import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
registerPlugin(FilePondPluginImagePreview)


const Upload = (props) => {
    // Props
    const { open, handler, data, userUpload } = props

    // State
    const [files, setFiles] = useState([])
    
    // Render
    return (
        <Dialog
            fullWidth
            open={open}
            onClose={() => {
                handler()
                setFiles([])
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                {data && data.task_title}
            </DialogTitle>
            <DialogContent>
                <FilePond
                    files={files}
                    onupdatefiles={setFiles}
                    labelIdle='<span class="filepond--label-action">Upload your attachment</span>'
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    handler()
                    setFiles([])
                }}>
                    Cancel
                </Button>
                <Button
                    autoFocus
                    color="primary"
                    variant="contained"
                    disabled={!files.length}
                    onClick={() => userUpload(files[0].file)}
                >
                    Upload
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Upload;
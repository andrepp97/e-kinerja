import React from 'react';
import Button from '@material-ui/core/Button';
import { ArrowBackIos } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 96px)',
    },
    mainText: {
        color: '#424242',
        marginTop: 0,
    },
    notFoundText: {
        fontSize: '20px',
        color: '#999999',
        marginBottom: '3rem',
    },
    notFoundBox: {
        textAlign: 'center',
        margin: '12px',
        marginBottom: '24px',
        padding: '18px 36px',
        borderRadius: '12px',
        border: '2px solid #424242',
    }
}))

const PageNotFound = (props) => {
    const classes = useStyles()
    return (
        <div className={classes.root}>
            <div className={classes.notFoundBox}>
                <h1 className={classes.mainText}>404</h1>
                <span className={classes.notFoundText}>
                    Page Not Found
                </span>
            </div>
            <Button color="primary" onClick={() => window.location.pathname = "/"}>
                <ArrowBackIos fontSize="small" />
                Back to Website
            </Button>
        </div>
    );
};

export default PageNotFound;
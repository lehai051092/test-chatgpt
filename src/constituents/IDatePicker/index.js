import React, {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme) => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
        width: '100%'
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: '100%',
    },
}));

export default function DatePickers(props) {
    const classes = useStyles();

    return (
        <form className={classes.container} noValidate>
            <TextField
                label={props.label}
                type="date"
                className={classes.textField}
                InputLabelProps={{
                    shrink: true,
                }}
                value={props.value}
                onChange={(e) => {
                    props.set(e.target.value)
                }}
                variant={'outlined'}
            />
        </form>
    );
}
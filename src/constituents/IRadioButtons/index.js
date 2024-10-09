import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';

import colors from '../../themes/colors';

const useStyles = makeStyles({
    root: {
        padding : 0,
        '&:hover': {
            backgroundColor: 'transparent',
        }
    },
    icon: {
        borderRadius: '50%',
        width: 24,
        height: 24,
        boxShadow: colors.radio_button.icon.box_shadow,
        backgroundColor: colors.radio_button.icon.background_color,
        backgroundImage: colors.radio_button.icon.background_image,
        '&:before': {
            display: 'block',
            width: 24,
            height: 23.5,
            backgroundImage: colors.radio_button.icon.before.background_image,
            content: '""',
        },
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: colors.radio_button.icon.hover.background_color,
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: colors.radio_button.icon.disabled.background,
        },
    },
    checkedIcon: {
        boxShadow: colors.radio_button.checked_icon.box_shadow,
        backgroundColor: colors.radio_button.checked_icon.background_color,
        backgroundImage: colors.radio_button.checked_icon.background_image,
        '&:before': {
            display: 'block',
            width: 24,
            height: 23.5,
            backgroundImage: colors.radio_button.checked_icon.before.background_image,
            content: '""',
        },
        'input:hover ~ &': {
            // backgroundColor: colors.radio_button.checked_icon.hover.background_color,
        },
    },
});

const RadioButton = (props) => {
    const classes = useStyles();
  
    return (
        <Radio
            className={classes.root}
            disableRipple
            color="default"
            checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
            icon={<span className={classes.icon} />}
            {...props}
        />
    );
};

export default RadioButton;
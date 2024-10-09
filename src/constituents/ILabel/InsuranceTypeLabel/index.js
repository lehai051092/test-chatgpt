import React from 'react';

import classes from './styles.module.css'

const BackgroundBlueLabel = ({ label, className, style, id, name}) => {

    return (
        <p className={`${classes.bg_blue} ${className}`} style={style} id={id} name={name}> {label}</p>
    )
}

export default BackgroundBlueLabel;
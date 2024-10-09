import React from 'react';

import classes from './styles.module.css'

const BackgroundBlueLabel = ({ label, className, style, id}) => {

    return (
        <p className={`${classes.bg_blue} ${className}`} style={style} id={id}> {label}</p>
    )
}

export default BackgroundBlueLabel;
import React from 'react';

import classes from './styles.module.css'

const BackgroundBlueLabel = ({ label, className, style, idName}) => {

    return (
        <p className={`${classes.bg_blue} ${className ? className : ''}`} style={style} id={idName} name={idName}> {label}</p>
    )
}

export default BackgroundBlueLabel;
import React from 'react';

import classes from './styles.module.css'

const BackgroundGreenLabel = ({ label, className, style, idName}) => {

    return (
        <p className={`${classes.bg_green} ${className ? className : ''} font-18`} style={style} id={idName} name={idName}> {label}</p>
    )
}

export default BackgroundGreenLabel;
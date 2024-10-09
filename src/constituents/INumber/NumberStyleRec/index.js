import React from 'react';

import classes from './styles.module.css'

const NumberStyleRec = ({title, className, style}) => {

    return (
        <span className={`${classes.number} ${className}`} >{title}</span>
    )
}

export default NumberStyleRec;
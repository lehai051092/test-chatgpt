import React from 'react';

import classes from './styles.module.css'

const NumberStyleCircle = ({title, className, style}) => {

    return (
        <span className={`${classes.number} ${className}`} >{title}</span>
    )
}

export default NumberStyleCircle;
import React from 'react';

import classes from './styles.module.css'

const AddButtonPurple = ({ onClick, title, className, style, value, id, disabled}) => {

    return (
        <button className={`${classes.add_btn} ${className}`} style={style} onClick={onClick} value={value} id={id}  disabled={disabled}>+ {title}</button>
    )
}

export default AddButtonPurple;
import React from 'react';

import classes from './styles.module.css'

const GeneralButton = ({ onClick, title, className, style, value, id, disabled, onClickDeleteIcon}) => {

    return (
        title != '' && ( 
        <button className={`${classes.add_keyword_btn} ${className}`} 
                style={style} 
                onClick={onClick} 
                value={value} 
                id={id}  
                disabled={disabled}> {title} 
                <span onClick={onClickDeleteIcon} id={title}>x</span>
        </button>)
    )
}

export default GeneralButton;
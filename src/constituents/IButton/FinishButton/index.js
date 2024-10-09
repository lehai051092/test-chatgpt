import React from 'react';

import './styles.css'

const GeneralButton = ({ onClick, title, className, style, value, id, disabled}) => {

    return (
        <button className={`finish-btn ${className}`} style={style} onClick={onClick} value={value} id={id}  disabled={disabled}> {title}</button>
    )
}

export default GeneralButton;
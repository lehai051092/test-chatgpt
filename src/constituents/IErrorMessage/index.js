import React from 'react';


import classes from './styles.module.css';

const ErrorMessage = ({ message, className, style,id}) => {
    return (
        <div className={`font-14 RobotoRegular ${classes.error_message} ${className}`} style={style}>
            <p id={id}>{message}</p>
        </div>
    )
}

export default ErrorMessage;
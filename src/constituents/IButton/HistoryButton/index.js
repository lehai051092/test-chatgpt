import React from 'react';

import './styles.css'

const HistoryButton = ({ onClick, title, className, style, value, idName, disabled}) => {
    return (
        <button className={`history_btn ${className ? className : ''}`} style={style} onClick={()=>{
            if(idName){
                document.getElementById(idName).blur();
            }
            if(onClick){
                onClick();
            }
        }} value={value} id={idName} name={idName} disabled={disabled}> {title}</button>
    )
}

export default HistoryButton;
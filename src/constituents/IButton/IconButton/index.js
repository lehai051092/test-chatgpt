import React from 'react';
import styles from './styles.module.css';

const IconButton = ({ onClick, title, className, icon, style, idName="back_button", disabled=false}) => {
    return (
        <button className={`${className ? className : ''} ${styles.back_btn}`} style={style} onClick={()=>{
            if(idName){
                document.getElementById(idName).blur();
            }
            if(onClick){
                onClick();
            }
        }} id={idName} name={idName} disabled={disabled} >
            {icon}
            <span>{title}</span>
        </button>
    )
}

export default IconButton;
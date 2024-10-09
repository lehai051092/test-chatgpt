import React from 'react';
import styles from './styles.module.css';

const BackButton = ({ onClick, title, className, style, idName="back_button", disabled=false}) => {
    return (
        <button className={`${styles.back_btn} ${className ? className : ''}`} style={style} onClick={()=>{
            if(idName){
                document.getElementById(idName).blur();
            }
            if(onClick){
                onClick();
            }
        }} id={idName} name={idName} disabled={disabled} >
            <span>{title}</span>
        </button>
    )
}

export default BackButton;
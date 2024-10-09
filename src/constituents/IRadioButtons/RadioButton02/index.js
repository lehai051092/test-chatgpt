import React from 'react';


import styles from './styles.css';

const GeneralButton02 = ({ title, name, checked, className, onClick,id, disabled}) => {

    return (
        <label className={`control control--radio ${className}`}>     
            { checked == 'checked' ? <input type="radio" name={name} id={id} checked="checked" /> : <input type="radio" name={name} id={id}/> }
            <div className="control__indicator">{title}</div>
        </label> 
    )
}

export default GeneralButton02;
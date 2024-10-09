import React from 'react';
import styles from './styles.module.css';

const GeneralTextbox = ({ placeholder, className, style, onChange, text, inputtype, autoFocus, id, icon, onKeyPress,disabled }) => {
    return (
        <>
            <input 
                id={id}
                className={`${styles.general_textbox} form-control ${className ? className : ''}`}
                disabled={disabled}
                placeholder={placeholder}
                onChange={onChange}
                value={text}
                type={inputtype}
                autoFocus={autoFocus}
                onKeyPress={onKeyPress} 
            />
        </>
    )
}

export default GeneralTextbox;
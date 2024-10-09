import React from 'react';
import ErrorIcon from '../../../../property/images/msg_error_icon.svg'
import styles from './styles.module.css';

const GeneralTextbox = ({ placeholder, maxlength, className, style, onChange, text, inputtype, autoFocus, id, icon, onKeyPress, disabled, name = null,  dataIndex = null, onBlur}) => {
    return (
        <div className={`${styles.general_textbox}`} >
            <input type={inputtype} id={id} name={name?name:id} maxLength={maxlength} className={`${className} ${styles.input_text}`} disabled={disabled} placeholder={placeholder} onChange={onChange} onBlur={onBlur} value={text} autoFocus={autoFocus} onKeyPress={onKeyPress} data-index={dataIndex} name={name}/>
            {
            (icon == 'show')&&
            <img src={ErrorIcon}  alt="error icon" className={styles.icon} />
            }
        </div>
    )
}

export default GeneralTextbox;
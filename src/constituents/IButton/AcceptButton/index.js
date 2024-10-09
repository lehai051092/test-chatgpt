import React from 'react';
import styles from './styles.module.css';

const AcceptButton = ({ onClick, title, className, style, id}) => {

    return (
        <button className={`${styles.back_btn} ${className}`} style={style} onClick={onClick} id={id}>
            <p>{title}</p>
        </button>
    )
}

export default AcceptButton;
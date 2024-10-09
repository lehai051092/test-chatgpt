import React, {useState} from 'react';
import styles from './styles.module.css';

const GeneralTextarea = ({ className, Message, name, dataIndex, onChange, id, placeholder }) => {
    return (
        <>
            {/* <div className={`${styles.textarea_box} ${className}`} contentEditable="true">
                <span className="point-list">{Message}</span> */}
                {/* <ul className="point-list">
                    {
                        Message && Message.map( i => (                        
                            <li>{i.name}</li>
                        ))
                    }
                </ul> */}
            {/* </div> */}
            <textarea 
                className={`${styles.textarea_box} ${className}`}
                name={name}
                id={id}
                data-index={dataIndex}
                onChange={onChange}
                type="text"
                value={Message}
                placeholder={placeholder}
            >
                {/* {vMessage} */}
            </textarea>
        </>
    )
}

export default GeneralTextarea;
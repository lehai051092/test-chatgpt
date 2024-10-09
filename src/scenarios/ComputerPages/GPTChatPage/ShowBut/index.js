import React from "react";
import styles from './styles.module.css'

const ShowBut = (props) => {
    const { onChange, checkState, buttonLabel } = props;
    return (
        <div className={`d-flex align-items-center float-right ${styles.video_chat_keyword_toggle_btn}`}>
            <span className={`${styles.text_font} mr-1`}>{buttonLabel}</span>
            <label className={`${styles.switch}`}>
                <input type="checkbox" className="d-none" onChange={onChange} checked={checkState} />
                <div className={`${styles.slider}`}></div>
                <div className={`${styles.text}`}></div>
            </label>
        </div>
    );
};

export default ShowBut;
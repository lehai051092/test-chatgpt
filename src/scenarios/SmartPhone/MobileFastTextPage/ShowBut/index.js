import React from "react";
import { browserRedirect } from "../../../../utils/util";
import styles from './styles.module.css'

const ShowBut = (props) => {
    const { onChange, checkState, buttonlabel, isVertical } = props;
    return (
        <div className={`d-flex align-items-center float-right ${styles.video_chat_keyword_toggle_btn}`}>
            {/* <span className={`${styles.text_font} mr-1`}>全てを表示する​</span> */}
            <span className={`${isVertical ? styles.text_font : styles.text_font_landscape}  mr-1`}>{buttonlabel}</span>
            <label className={`${styles.switch}`}>
                <input type="checkbox" className="d-none" onChange={onChange} checked={checkState} />
                <div className={`${styles.slider}`}></div>
                <div className={`${styles.text}`}></div>
            </label>
        </div>
    );
};

export default ShowBut;
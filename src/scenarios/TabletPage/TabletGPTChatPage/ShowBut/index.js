import React from "react";
import styles from './styles.module.css'

const ShowBut = (props) => {
  const {onChange, checkState, buttonLabel, showFlg} = props;
  
  return (
    showFlg ?
      <div className={`d-flex align-items-center float-right ${styles.video_chat_keyword_toggle_btn}`}>
        <span className={`${styles.text_font} mr-1`}>{buttonLabel}</span>
        <div onClick={onChange} style={{padding: '5px', marginTop: '5px'}}>
          <label className={`${styles.switch}`}>
            <input type="checkbox" className="d-none" checked={checkState}/>
            <div className={`${styles.slider}`} onClick={(e) => {
              e.stopPropagation()
            }}></div>
            <div className={`${styles.text}`}></div>
          </label>
        </div>
      </div>
      
      :
      
      <div className={`d-flex align-items-center float-left ${styles.video_chat_keyword_toggle_btn}`}>
        <div onClick={onChange} style={{padding: '5px', marginTop: '5px'}}>
          <label className={`${styles.switch}`}>
            <input type="checkbox" className="d-none" checked={checkState}/>
            <div className={`${styles.slider}`} onClick={(e) => {
              e.stopPropagation()
            }}></div>
            <div className={`${styles.text}`}></div>
          </label>
        </div>
        <span className={`${styles.text_font} mr-1`}>{buttonLabel}</span>
      </div>
  );
};

export default ShowBut;
import React from "react";
import { useLocation } from "react-router-dom";
import { browserRedirect } from "../../utils/util";
import styles from './styles.module.css'

const ISwitch = (props) => {
    const {onChange,checkState,text="全てを表示する​"} = props;
    const location = useLocation();
    return (
        <div className="d-flex align-items-center float-right">
            <span className={`${styles.text_font} mr-1`}>{text}</span>
            <label className={`${styles.switch}`}>
                <input type="checkbox" className="d-none" onChange={onChange} checked={checkState}/>
                <div className={`${styles.slider} ${browserRedirect()===3&&(location.pathname.includes('ai-score')||location.pathname.includes('free-story-score'))&&styles.slider_multiple_scenarios}`}></div>
                <div className={`${styles.text}`}></div>
            </label>
        </div>
    );
  };

export default ISwitch;
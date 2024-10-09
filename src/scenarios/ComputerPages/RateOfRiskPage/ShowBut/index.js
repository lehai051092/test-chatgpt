import React from "react";
import { useLocation } from 'react-router-dom';
import { browserRedirect } from "../../../../utils/util";
import styles from './styles.module.css'

const ShowBut = (props) => {
    const {onChange,checkState} = props;
    const location = useLocation();
    return (
        <div className={`d-flex align-items-center float-right ${browserRedirect()===3&&styles.tablet_view}`}>
            <span className={`${styles.text_font}`}>全てを表示する​</span>
            <label className={`${styles.switch}`}>
                <input type="checkbox" className="d-none" onChange={onChange} checked={checkState}/>
                <div className={`${styles.slider} ${location.pathname.includes('multiple-scenarios')&&styles.slider_multiple_scenarios}`}></div>
                <div className={`${styles.text}`}></div>
            </label>
        </div>
    );
  };

export default ShowBut;
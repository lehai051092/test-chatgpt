import React,{useState,useEffect} from "react";
import ErrorIcon from '../../../property/images/close_circle_red.svg'
import ErrorBtn from '../../../property/images/close_icon_circle_wh.png'


import classes from './styles.module.css';

const ErrorMessage = ({ message, className, style,id}) => {
    const [selected, setSelected] = useState(false);
    return (
        <div className={`${classes.error_message_box} ${className} ${selected && classes.error_message_box_dis }`} style={style}>
            <img src={ErrorIcon} />
            <p id={id}>{message}</p>
            
            <img src={ErrorBtn} className={classes.close_btn} onClick={()=>setSelected(!false)}/>
        </div>
    )
}

export default ErrorMessage;
import React from 'react';
import classes from "./styles.module.css";
import { browserRedirect } from '../../utils/util';

const LoadingText = ({text}) => {

    return (
        <div id="myModal" className={`${classes.modal} ${browserRedirect()!=1 ? classes.mobile_view : classes.pc_view}`}>

        <div className={classes.modalcontent}>
            {/* <span class="close">&times;</span> */}
            <p>{text}..</p>
        </div>

        </div>   
    )
}

export default LoadingText;
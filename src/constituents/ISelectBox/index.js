import React from 'react';

import classes from './styles.module.css'

const GeneralSelectBox = ({ onClick, title, className, style, value, id, disabled}) => {

    return (
        <div className={`${classes.cmn_select_box} ${className}`} style={style}>
            <select className="select-box-border-non">
                <option selected>Select</option>
                <option>Option 1</option>
                <option>Option 2</option>
                <option>Option 3</option>
            </select>
        </div>   
    )
}

export default GeneralSelectBox;
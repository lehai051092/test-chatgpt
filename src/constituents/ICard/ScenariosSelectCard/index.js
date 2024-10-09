import React from 'react';

import MandatoryTitle from '../../IMandatoryTitle'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import classes from './styles.module.css'
import AddButtonPurple from '../../IButton/AddButtonPurple'
import SelectBox from '../../ISelectBox'

const ScenariosNoCard = ({ card_title, data, className, onClick, style, disabled}) => {

    return (
        
        <div className={`${classes.scenarios_action_box} cmn-bg-white-box ${className} `} style={style}>            
            <div className="d-flex align-items-center justify-content-between mb-3">
                <MandatoryTitle title={card_title}/>
                <AddButtonPurple/>
            </div>
            <div className="d-flex align-items-center justify-content-between flex-wrap">                
                <h3 className="font-weight-normal mb-0">{data}</h3>                
                <SelectBox/>
            </div>
        </div>
    )
}

export default ScenariosNoCard;
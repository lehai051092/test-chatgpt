import React from 'react';

import MandatoryTitle from '../../IMandatoryTitle'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus } from "@fortawesome/free-solid-svg-icons";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import classes from './styles.module.css'

const ScenariosNoCard = ({ card_title, data, className, onClick, style, disabled}) => {

    return (
        
        <div className={`${classes.scenarios_action_box} cmn-bg-white-box d-flex align-items-end justify-content-between ${className} `} style={style}>
            <div>
                <MandatoryTitle title={card_title} className="mb-3"/>
                <h3 className="font-weight-normal mb-0">{data}</h3>
            </div>
            <div>
                <button className="btn font-gray2"><FontAwesomeIcon icon={faMinus}/></button>
                <button className="btn font-gray2"><FontAwesomeIcon icon={faPlus}/></button>
            </div>
        </div>
    )
}

export default ScenariosNoCard;
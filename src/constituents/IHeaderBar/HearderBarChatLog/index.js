import React, {useState} from 'react'
import {Modal, Button} from 'react-bootstrap'
import { Container, Row, Col } from 'reactstrap';
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import GeneralButton from "../../IButton/GeneralButton"
import PersonalInfoPopUp from './PersonalInfoPopUp'

import classes from './styles.module.css';

const HeaderBar = () => {
    const [show, setShow] = useState(false);
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    return (
        <header>
            <div className="cmn-inner-width">    
                    <div className={`${classes.nav_bar} mb-0`}>
                        <div className=""> 
                            <GeneralButton title="Suspension" className="font-16 px-32 py-3"/>                   
                        </div>
                        <div className="order-3">       
                            <PersonalInfoPopUp/>
                            <GeneralButton title="Start over" className="font-16 ml-2 py-3"/>                        
                        </div>
                        <div className="d-flex algin-items-center">
                            <h3 className="mb-0 font-weight-normal">Scenario 4</h3>                         
                        </div>
                    </div>
            
                </div>
        </header>
    );
}

export default HeaderBar;
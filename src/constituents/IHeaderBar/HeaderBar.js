import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, NavLink } from "react-router-dom";

import { faHome } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import LessonIcon from '../../property/images/menubar_icon/lesson_icn.png'
import LessonIconActive from '../../property/images/menubar_icon/lesson_active_icn.png'

import ResultIcon from '../../property/images/menubar_icon/training_result_icn.png'
import ResultIconActive from '../../property/images/menubar_icon/training_result_active_icn.png'

import ScenarioIcon from '../../property/images/menubar_icon/scenario_creation_icn.png'
import ScenarioIconActive from '../../property/images/menubar_icon/scenario_creation_active_icn.png'

import SettingIcon from '../../property/images/menubar_icon/setting_icn.png'
import SettingIconActive from '../../property/images/menubar_icon/setting_active_icn.png'


import classes from './styles.module.css';

const HeaderBar = () => {
    return (
        <header>
            <div className="cmn-inner-width">
                <div className={`${classes.nav_bar}`}>
                    <div className={`${classes.left}`}>
                        <h3 className={`mb-0 font-weight-normal ${classes.person_selection}`}>Person Selection</h3>        
                    </div>
                    <div className={`${classes.right}`}>
                        <ul>
                            <li>
                                <NavLink to="lessons" activeClassName={`${classes.current}`}>
                                    {/* <span><FontAwesomeIcon icon={faHome} /></span> */}
                                    <img src={LessonIconActive} alt="Lesson Active Icon" className={classes.active}/>
                                    <img src={LessonIcon} alt="Lesson Icon"/>
                                    <span>Lesson</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="agency" activeClassName={`${classes.current}`}>
                                    <img src={ResultIconActive} alt="Result Active Icon" className={classes.active}/>
                                    <img src={ResultIcon} alt="Result Icon"/>                                    
                                    <span>Traning Result</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="ScenariosPage" activeClassName={`${classes.current}`}>
                                    <img src={ScenarioIconActive} alt="Scenario Active Icon" className={classes.active}/>
                                    <img src={ScenarioIcon} alt="Scenario Icon"/>                                    
                                    <span>Scenario Creation</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="setting" activeClassName={`${classes.current}`}>
                                    <img src={SettingIconActive} alt="Setting Active Icon" className={classes.active}/>
                                    <img src={SettingIcon} alt="Setting Icon"/>                                    
                                    <span>setting</span>
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default HeaderBar;
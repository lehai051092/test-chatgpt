import React from 'react'
import classes from './styles.module.css'
import { useHistory  } from "react-router-dom";
import { browserRedirect } from '../../../utils/util';

const ThemeTab = ({ className, selectedTab, onSelect, tabItems, type }) => {
    const handleClick = (item) => {
        onSelect(item)
    }
    const check_selected = (selectedTab, item) => {
        if(type == 'theme')
        {
            return selectedTab?.themeCode === item?.themeCode
        }else if(type == 'persona'){
            return selectedTab?.personaId === item?.personaId
        }else{
            return selectedTab?.scenarioCode === item?.scenarioCode
        }
    }

    return (
        <div id="tab_box" name="tab_box" className={`${browserRedirect()!=1 ? classes.mobile_view : classes.pc_view} ${classes.tabs} ${className}`}>
            <ul className={`${classes.tabs_titles}`}>
                {
                tabItems.map((item, index) => (
                    <li key={index} id={`persona_info_${index+1}`} name={`persona_info_${index+1}`} onClick={() => handleClick(item)} className={` ${classes.tab_title} ${check_selected(selectedTab, item) && classes.tab_title__active} }`}>
                        {
                            type == 'theme' ? item.themeName : (type == 'persona' ? item.persona : item.scenarioName)
                        }
                    </li>
                ))
                }
            </ul>
        </div>
    )
}
  
export default ThemeTab;

import React, { useState,useRef, useEffect } from 'react';
import filterSelectMoreArrow from '../../property/icons/filter-select-more-arrow.svg';
import filterSelectLessArrow from '../../property/icons/filter-select-less-arrow.svg';
import classes from './styles.module.css';
import { browserRedirect } from '../../utils/util';

/**
 * custom select
 * @param vSetThemes [{key:"",text:""}] 
 * @param  f_getSelectedTheme (v)=>{}
 * @param  selectv ''
 * @returns dom
 */
const ThemeFilter = ({allSelection,vSetThemes,f_getSelectedTheme}) => {

  const [vTheme, setTheme] = useState({key: 'all', text: ''});
  const [vShowOptions, setShowOptions] = useState(false);
  const ThemeFilterRef = useRef(null);

  const showThemeOptions = () => {
    setShowOptions(!vShowOptions);
  }
  
  const seletedTheme = (event) => {
    setTheme({key: event.target.id.substring(11), text: event.target.innerText});
    f_getSelectedTheme(event.target.id.substring(11));
  }

  const hideThemeOptions = () => {
    setShowOptions(false);
  }

  useEffect(()=>{
    setTheme({key: 'all', text: allSelection})
  },[vSetThemes])

  return (
    <div ref={ThemeFilterRef} onClick={showThemeOptions} tabIndex="0" onBlur={hideThemeOptions} className={browserRedirect()===2 ? classes.theme_filter_container_mb : null}>
      <div className={`${classes.filter_selected_wrapper} ${vShowOptions?classes.filter_selected_wrapper_oprate:null}`}>
        <span>{vTheme.text}</span>
        <span>
          <img src={vShowOptions? filterSelectLessArrow: filterSelectMoreArrow}/>
        </span>
      </div>
      {
        vShowOptions && 
        <ul className={classes.filter_theme_options_list}>
            <li 
              className={`${classes.filter_theme_option_item} ${vTheme.key == 'all' ? classes.filter_theme_option_item_selected : null}`}
              onClick={seletedTheme}
            >{allSelection}</li>
            {vSetThemes?.map((option, index) => {
              return(
                <li 
                  key={'themeFilter' + option.key}
                  className={`${classes.filter_theme_option_item} ${vTheme.key == option.key ? classes.filter_theme_option_item_selected : null}`}
                  onClick={seletedTheme}
                  id={'themeFilter' + option.key}
                >
                  {option.text}
                </li>
              )
            })
          }
        </ul>
      }
    </div>
  )
}

export default ThemeFilter;
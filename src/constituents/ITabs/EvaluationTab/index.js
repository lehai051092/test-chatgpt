import React from 'react'
import styles from './styles.module.css'
import { connect } from 'react-redux'
import { useHistory  } from "react-router-dom";


const Tab = ({ className, selectedTab, onSelect, tabItems }) => {
    let history = useHistory();
    const handleClick = (id, personaInfo, index) => {
        onSelect && onSelect(id, personaInfo);
        switch(index) {
            case 1:
                history.push('/admin/create/tab1')
              break;
            case 2:
                history.push('/admin/create/tab2')
              break;
            case 3:
                history.push('/admin/create/tab3')
              break;
            default:
                history.push('/admin/create/tab1')
          }
    }

    return (
        <div id="tab_box" name="tab_box" className={`${styles.tabs} ${className} `}>
            <ul className={`${styles.tabs_titles}`}>
                {
                tabItems.map((item, index) => (
                    <li key={item.id} id={`persona_info_${index+1}`} name={`persona_info_${index+1}`} onClick={() => handleClick(item.id, item.personaInfo, index+1)} className={` ${styles.tab_title} ${selectedTab === item.id && styles.tab_title__active} }`}>
                        {item.personaInfo}
                    </li>
                ))
                }
            </ul>
        </div>
    )
}
const stateToProps = state => {
    return {
      evaluation_task_all: state.evaluation_task_all,
    }
  }
  
export default connect(stateToProps, null)(Tab)

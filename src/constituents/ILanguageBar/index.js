import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.css';
import EnglishFlag from '../../property/images/english_flag.png';
import JapanFlag from '../../property/images/japan_flag.png';

const HeaderBar = ({className, style}) => {
    const {i18n} = useTranslation();

    const [language, setLanguage] = useState(i18n.language);

    const onEnglishFlagClick = () => {
        i18n.changeLanguage('en');
        setLanguage('en');
    }

    const onJapanFlagClick = () => {
        i18n.changeLanguage('jp');
        setLanguage('jp');
    }

    return (
        <div className={`${styles.header_bar} ${className ? className : ''}`} style={style}>
            <div className={styles.flags_container}>
                <img 
                    src={EnglishFlag} 
                    onClick={onEnglishFlagClick}
                    className={ language === 'en' ? styles.selected_flag_icon : styles.flag_icon} alt="english flag" />
                <img 
                    src={JapanFlag} 
                    onClick={onJapanFlagClick}
                    className={ language === 'jp' ? styles.selected_flag_icon : styles.flag_icon} alt="japan flag" />
            </div>
        </div>
    )
}

export default HeaderBar;
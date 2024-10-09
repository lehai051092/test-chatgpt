import React from 'react';
import { useTranslation } from 'react-i18next';


import classes from './styles.module.css';

function IESupportedPage() {
    const { t } = useTranslation();
    return (
        <div className={classes.ie_supported_page}>
            <div>
                {/* <img src={require('../../property/images/logo.png').default} className={classes.logo} alt="logo" /> */}
                <h5 className={classes.title}>{t('ie_supported_page.title')}</h5>
            </div>
        </div>
    )
}

export default IESupportedPage;
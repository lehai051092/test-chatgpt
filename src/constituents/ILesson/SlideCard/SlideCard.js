import React from 'react'
import SlideToggle from "react-slide-toggle"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import classes from './styles.module.css'
import { useTranslation } from 'react-i18next';

function SlideCard({show}) {

    const { t } = useTranslation();

    return (
        <SlideToggle
                duration={200}
                collapsed={show?'':'collapsed'}
                interpolateOnReverse
                render={({ onToggle, setCollapsibleElement, progress }) => (
                <div className={`${classes.slide_card_wrapper} my-collapsible`}>
                    <div className={classes.show_wrapper}>
                        <p className={classes.slide_card_title}>{t('persona.product_detail')}</p>
                        <button className={`${classes.slide_card_button} my-collapsible__toggle`} onClick={onToggle}>
                            {t('persona.view_detail')} <FontAwesomeIcon icon={faAngleDown} />
                        </button>
                    </div>
                    <div className={`my-collapsible__content ${classes.collapsible_content}`} ref={setCollapsibleElement}>
                        <div
                            className="my-collapsible__content-inner"
                            style={{
                            transform: `translateY(${Math.round(20 * (-1 + progress))}px)`
                            }}
                        >
                            <p>■Super cancer insurance (1 unit) Special contract MAX (whole life)</p>
                            <p>・Hospitalization benefit limit: 184 days</p>
                            <p>・Insured: Contractor only</p>
                            <p>・Guarantee: Illness / disaster hospitalization 5,000 yen</p>
                            <p>Surgical benefits: 5,100,200,000 yen</p>
                        </div>
                    </div>
                </div>
                )}
            />
    )
}

export default SlideCard

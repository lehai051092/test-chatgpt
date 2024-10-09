import React from 'react'
import 'react-circular-progressbar/dist/styles.css';
import classes from './styles.module.css';
import { useTranslation } from 'react-i18next';
import {CircleProgress} from 'react-gradient-progress'
import { browserRedirect } from '../../../utils/util';

const CircleChart = ({precisionPercent, bestUserPrecision}) => {
    
    const { t } = useTranslation();

    return (
        <>
         <div className={`${classes.inner_circle} position-absolute`}>
                <div className={`${classes.inner_circle_text_wrapper_tablet} ${precisionPercent>99 && classes.inner_circle_text_wrapper_width_tablet}`}>
                    <div className={`${classes.inner_circle_text_content} mb-3 d-flex align-items-center justify-content-center`}>
                        <span className={`${classes.inner_circle_text} pr-2 font-weight-bold font-16`} id="circle_chart_precision_percent_header" name="circle_chart_precision_percent_header">{t('aiscore.cicle_percentage.header_1')}</span>
                        {browserRedirect() !==3 ?
                        <>
                        <span className={`${classes.inner_circle_p_text} font-36`} id="circle_chart_precision_percent" name="circle_chart_precision_percent">{precisionPercent}</span>
                        <span className={`${classes.percent_color} font-30`}>%</span>
                        </> :
                        <span className={classes.inner_circle_text_right} style={{marginRight:15}}>
                            <span className={`${classes.inner_circle_p_text} ${browserRedirect()===3?`font-48`:`font-36`}`} id="circle_chart_precision_percent" name="circle_chart_precision_percent">{precisionPercent}</span>
                            <span className={`${classes.percent_color} ${classes.percent_width_tablet} font-30`}>%</span>
                        </span>
                    }
                    </div>
                    <hr className={classes.inner_circle_hr}  style={browserRedirect()!=3?{}:{marginTop:-15,marginBottom:10}}/>
                    <div className={`${classes.inner_circle_text_content} mb-3 d-flex align-items-center justify-content-center`}>
                        <span className={`${classes.inner_circle_text} pr-2 font-weight-bold font-14`} id="circle_chart_ppersonal_best_header" name="circle_chart_ppersonal_best_header">{t('aiscore.cicle_percentage.header_2')}</span>
                        {browserRedirect() !==3 ?
                        <>
                        <span className={`${classes.inner_circle_p_text} font-30 ${classes.inner_circle_personal_best}`} id="circle_chart_ppersonal_best" name="circle_chart_ppersonal_best">{bestUserPrecision}</span>
                        <span className={`font-20 ${classes.inner_circle_personal_best_percent}`}>%</span>
                        </> :
                        <span className={classes.inner_circle_text_right} style={{marginRight:20}}>
                            <span className={`${classes.inner_circle_p_text} font-30 ${classes.inner_circle_personal_best}`} id="circle_chart_ppersonal_best" name="circle_chart_ppersonal_best">{bestUserPrecision}</span>
                            <span className={`font-20 ${classes.inner_circle_personal_best_percent} ${classes.percent_width_tablet}`}>%</span>
                        </span>
                    }
                    </div>
                </div>
        </div>
        <CircleProgress percentage={precisionPercent} strokeWidth={8} secondaryColor={browserRedirect()===3?`#DBDBDB`:`#f0f0f0`} primaryColor={['#007CA3', '#66C9E8']} width={300} hidePercentageText={true}>
            
        </CircleProgress>
        </>
    )
}

export default CircleChart

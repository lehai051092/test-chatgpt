import React from 'react';
import {  Row, Col } from 'reactstrap';
import perImg from '../../../property/images/perfect.png'
import okImg from '../../../property/images/ok.png'
import noImg from '../../../property/images/no.png'
import qiImg from '../../../property/images/qi.png'
import { useTranslation } from 'react-i18next';

import classes from './styles.module.css'

const ScoreBar = ({ id, item = null}) => {

    const { t } = useTranslation();
    let lastId = 0;
    const autoId = (prefix = '_scorebar_') => {
        lastId++;
        return `${id}${prefix}${lastId}`;
    }

    const date = (item) => {
        let date = new Date(item.start);
        var days = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat'];
        return `${date.getFullYear()}${t('general.date.year')}${date.getMonth()+1}${t('general.date.month')}${date.getDate()}${t('general.date.day')} (${t(`general.date.days.${days[date.getDay()]}`)})`
        
    }

    const getTwoTime = (item) => {
        let dt1 = new Date(item.start)
        let dt2 = new Date(item.finished)
        let minute1  = (dt1.getMinutes()<10?'0':'') + dt1.getMinutes()
        let minute2  = (dt2.getMinutes()<10?'0':'') + dt2.getMinutes()
        return `${dt1.getHours()}:${minute1} - ${dt2.getHours()}:${minute2}`
    }
    const percent = (item) => {
        if(item.score)
        {
            return (item.score.precision*100).toFixed(0)
        }
        return 0;
    }

    return (
    <div className={`${classes.scroll_bar} ${item.commitId != ""?'':classes.scroll_bar_hide_before}`} id={autoId()} name={autoId()}>
            <Row className={classes.time_style}>
                <Col className={classes.col_style}>
                    <span id={`${id}_date_text`} name={`${id}_date_text`}>{date(item)}</span>
                    <span id={`${id}_time_diff`} name={`${id}_time_diff`} >{getTwoTime(item)}</span>
                </Col>
                <Col className={classes.col_style}>
                    {
                            item.commitId ?
                            <span>
                                <img src={qiImg} alt="Smile Image" className={classes.w_18} id={autoId()}/> 
                            </span>
                            : 
                            ""
                    }
                </Col>
            </Row>
            <Row className={classes.row2_style}>
                <Col xs="1.5">
                    {
                        percent(item) >=85 && percent(item) <=100?
                        <span>
                            <img src={perImg} alt="Smile Image" className={classes.w_19} id={autoId()}/> 
                        </span>
                        : 
                        percent(item) >=70 ?
                        <span>
                            <img src={okImg} alt="Smile Image" className={classes.w_19} id={autoId()}/>
                        </span>
                        :
                        <span><img src={noImg} alt="Smile Image" className={classes.w_19} id={autoId()}/></span>
                    }
                </Col>
                <Col xs="1.5">
                            <span className={`mr-1 pr-xl-2 ${classes.date_section}`} id={`${id}_correct_answer_text`} name={`${id}_correct_answer_text`}>{t('rateOfRisk.correct_answer_rate')}</span>
                            <span style={{fontSize:'30px'}} className={`mr-xl-6 ${classes.scroll_sce}`} id={`${id}_percent`} name={`${id}_percent`}>{percent(item)}</span>
                            <span className={classes.scroll_bai}>%</span>
                </Col>
            </Row>
        </div>
    )
}

export default ScoreBar;
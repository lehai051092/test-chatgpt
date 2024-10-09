import React from 'react';
import {  Row, Col } from 'reactstrap';
import perImg from './img/perfect.png'
import okImg from './img/ok.png'
import noImg from './img/no.png'
import qiImg from './img/qi.png'
import { useTranslation } from 'react-i18next';

import classes from './styles.module.css'
import { browserRedirect } from '../../../utils/util';

const ScoreBar = ({ label, className, style, id, item = null, v_selectScore = null}) => {

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

  const getFinishedDate = (item) => {
    let date = new Date(item.finished);
    var days = ['sun', 'mon', 'tue', 'wed', 'thurs', 'fri', 'sat'];
    return `${date.getFullYear()}${t('general.date.year')}${date.getMonth()+1}${t('general.date.month')}${date.getDate()}${t('general.date.day')} (${t(`general.date.days.${days[date.getDay()]}`)})`
  }

  const getFinishedTime = (item) => {
    let dt2 = new Date(item.finished)
    let minute2  = (dt2.getMinutes()<10?'0':'') + dt2.getMinutes()
    return `${dt2.getHours()}:${minute2}`
  }

    const getStartTime = (item) => {
      let dt1 = new Date(item.start)
      let dt2 = new Date(item.finished)
      let minute1  = (dt1.getMinutes()<10?'0':'') + dt1.getMinutes()
      let minute2  = (dt2.getMinutes()<10?'0':'') + dt2.getMinutes()
      return `${dt1.getHours()}:${minute1}`
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
    <Row className={`${classes.scroll_bar} ${item.commitId != ""?'':classes.scroll_bar_hide_before} ${browserRedirect() === 3 ? classes.scroll_bar_tablet : null}`} id={autoId()} name={autoId()}>
            <Col xs="1.8">
                <span className={browserRedirect() === 3 ? classes.time_style_tablet : classes.time_style} id={`${id}_date_text`} name={`${id}_date_text`}>{date(item)}{getStartTime(item)}</span>
           </Col>
           <Col  xs="1.5" >
                <span className={browserRedirect() === 3 ? classes.sec_style : null} id={`${id}_time_diff`} name={`${id}_time_diff`} > - {getFinishedDate(item)}{getFinishedTime(item)}</span>
           </Col>
           <Col xs="0.5">
                <div className={classes.bord_shu}></div>
           </Col>
           <Col xs="1.5">
                {
                    percent(item) >=85 && percent(item) <=100?
                    <span>
                        <img src={perImg} alt="Smile Image" className={classes.w_19} id={autoId()}/> 
                    </span>
                    : 
                    percent(item) >=70 ?
                    <span><img src={okImg} alt="Smile Image" className={classes.w_19} id={autoId()}/></span>
                    :
                    <span><img src={noImg} alt="Smile Image" className={classes.w_19} id={autoId()}/></span>
                }
           </Col>
           <Col xs="1.5" className={browserRedirect()===3?classes.correct_answer_text_tablet:null}>
                    <span className={`mr-1 pr-xl-2 ${classes.date_section}`} id={`${id}_correct_answer_text`} name={`${id}_correct_answer_text`}>{t('rateOfRisk.correct_answer_rate')}</span>
                    <span style={{fontSize:'22px'}} className={`mr-xl-6 ${classes.scroll_sce}`} id={`${id}_percent`} name={`${id}_percent`}>{percent(item)}</span>
                    <span className={classes.scroll_bai}>%</span>
           </Col>
           <Col xs="1.5">
                {
                    item.commitId != "" ?
                    <span>
                        <img src={qiImg} alt="Smile Image" className={classes.w_19} id={autoId()}/> 
                    </span>
                    : 
                    ""
                }
           </Col>
       </Row>
    )
}

export default ScoreBar;
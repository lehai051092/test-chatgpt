import React from 'react';
import {  Row, Col } from 'reactstrap';

import smileImg from '../../property/images/icons/smile.png'
import NoSmileImg from '../../property/images/icons/nosmile.png'
import starImg from '../../property/images/icons/star.png'
import starImgBlack from '../../property/images/icons/star_white.png'
import { useTranslation } from 'react-i18next';

import classes from './styles.module.css'

const ScoreBar = ({ label, className, style, id, item = null, v_selectScore = null}) => {

    const { t } = useTranslation();
    let lastId = 0;
    const autoId = (prefix = '_scorebar_') => {
        lastId++;
        return `${id}${prefix}${lastId}`;
    }

    const getStarCount = (percent) => {
        //get fill star count
        let starCount = 0
        if(percent >= 0 && percent <= 69)
        {
            starCount = 1
        }else if(percent >= 70 && percent <= 84)
        {
            starCount = 2
        }else if(percent >= 85 && percent <= 100)
        {
            starCount = 3
        }
        return starCount
    }
    
    const precisionPercentage = (item) => {
        if(item.score)
        {
            return item.score.uniqueScoringKeywordCount
        }
        return 0;
    }

    const cardStar = (percent, item) => {
        let starCount = item.score ? getStarCount(parseFloat(percent).toFixed(0)) : 0; //get full star count
        let starHtml = []
        for (let index = 0; index < starCount; index++) {
            //push full start count
            starHtml.push(<img src={starImg} key={index} alt="Star Image Black" className={classes.w_17} id={`${id}_star_icon_${index}`} name={`${id}_star_icon_${index}`}/>)
        }
        if(starCount < 3)
        {
            let starWhiteCount = 3 - starCount //get white star count
            
            for (let index = 0; index < starWhiteCount; index++) {
                //push white star count
                starHtml.push(<img src={starImgBlack} key={index+starCount} alt="Star Image Black" className={classes.w_17} id={`${id}_star_icon_${index+starCount}`} name={`${id}_star_icon_${index+starCount}`}/>)
            }
        }
        return starHtml
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

    const checkSmileFace = (item) => {
        if(item.score)
        {
            return item.score.grade
        }
        return "BAD";
    }
    const percent = (item) => {
        if(item.score)
        {
            return (item.score.precision*100).toFixed(0)
        }
        return 0;
    }

    const selectScore = () => {
        if(v_selectScore)
        {
            if(v_selectScore.recordId == item.recordId)
            {
                return true
            }
            return false
        }
        return false
    }

    return (
       <Row className={`${classes.scroll_bar} ${(v_selectScore) ? ((v_selectScore.recordId == item.recordId) ? classes.selectScore : '' ) : ''} ${item.commitId != ""?'':classes.scroll_bar_hide_before}`} id={autoId()} name={autoId()}>
           <Col lg={6} md={6} sm={12} className={`${classes.date_section} p-0`}>
                {/* date */}
                <span id={`${id}_date_text`} name={`${id}_date_text`}>{date(item)}</span>
                <span className="ml-2 ml-xl-4" id={`${id}_time_diff`} name={`${id}_time_diff`}>{getTwoTime(item)}</span>
           </Col>
           <Col>
                <Row>
                    <Col lg={5} className={`${classes.scroll_btn_sec} d-flex align-items-center p-0`}>
                            <span className="mr-1 pr-0  pr-xl-2" id={`${id}_correct_answer_text`} name={`${id}_correct_answer_text`}>{t('rateOfRisk.correct_answer_rate')}</span>
                            <span className=" mr-xl-4" id={`${id}_percent`} name={`${id}_percent`}>({percent(item)}%)</span>
                    </Col>
                    <Col className={`${classes.scroll_btn_sec} text-center p-0`}>
                            <span className={`mr-4 ${classes.score_star}`}>
                                {/* star */}
                                {cardStar(percent(item), item)}
                            </span>
                            <img src={percent(item)>=70? smileImg : NoSmileImg} alt="Smile Image" className={classes.w_19} id={autoId()}/>
                            {/* <img src={checkSmileFace(item) != 'BAD'? smileImg : NoSmileImg} alt="Smile Image" className={classes.w_19} id={`${id}_emotion_icon`} name={`${id}_emotion_icon`}/> */}
                    </Col>
                </Row>
           </Col>
       </Row>
    )
}

export default ScoreBar;
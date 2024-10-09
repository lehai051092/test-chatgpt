import React, { useState,useEffect } from 'react';
import {  Row, Col } from 'reactstrap'; 
import expand_plus from "../../../../property/images/expand_plus.png";
import expand_minus from "../../../../property/images/expand_minus.png";
import SmileTwoHandIcon from "../../../../property/icons/free_story_img/smile_two_hand.svg";
import SmileOneHandIcon from "../../../../property/icons/free_story_img/smile_one_hand.svg";
import SmileTwoFingerIcon from "../../../../property/icons/free_story_img/smile_two_finger.svg";
import SadHandIcon from "../../../../property/icons/free_story_img/sad_icon.svg";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ISwitch from '../../../../constituents/ISwitch'
import classes from './styles.module.css'
import ScoringDetail from './ScoringDetail';
import { getAiScoreDetailBySection } from '../../../../request/backendApi/api';
import logger from "redux-logger";
import eventShuttle from "../../../../eventShuttle";
import LoadingText from '../../../../constituents/ILoadingText'
import { browserRedirect } from '../../../../utils/util';

const data = [{id:1,name :'アプローチ'},{id:2,name :'既契約内容説明'}]

const ScoringOverall = (props) => {
    let {userId,sectionId,scoringRecords,passState, selectedItem} = props;
    const [overallScoring, setOverallScoring] = useState(false)
    const [expanded, setExpanded] = useState([]);
    const [vScoringRecords, setScoringRecords] = useState([]);
    const [vCheckExpand, setCheckExpand] = useState([]);
    const [vScorePercentage, setScorePercentage] = useState([]);
    const [vIsLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setScoringRecords(scoringRecords)
        setScorePercentage([])
    }, [sectionId, scoringRecords])
    useEffect(() => {
        let allExpended = [];
        scoringRecords.map((item,index)=>allExpended.push({isExpended :false,index :index, isClickable: item.isClickable, clickTimes: 0}))
        setExpanded(allExpended);
    }, [scoringRecords])
    console.log('expanded',expanded);
    
    const handleChange = (event) => {
        setOverallScoring(event.target.checked);
        let newArr = [...expanded]; // copying the old datas array
        if (event.target.checked === true) {
            setIsLoading(true)
            newArr.map((item) => item.isClickable && (item.isExpended =true) )
        }else{
            newArr.map(item => item.isExpended =false )
        }
        setExpanded(newArr); // ??
    };

    useEffect(() => {
        setOverallScoring(false)
        let newArr = [...expanded]; // copying the old datas array
        newArr.map(item => item.isExpended =false )
        setExpanded(newArr);
    }, [selectedItem])

    const handleAccordianChange = (index) => (event, newExpanded) => {
        let newArr = [...expanded]; // copying the old datas array
        if(newArr[index]){
            newArr[index].clickTimes += 1;
            console.log(newArr[index].clickTimes)
            newArr[index].isExpended = newExpanded; // replace e.target.value with whatever you want to change it to
            setCheckExpand(newArr[index])
        }
        setExpanded(newArr);
        if(newExpanded == true && newArr[index].clickTimes == 1){
            setIsLoading(true)
        }
    };

    const checkisExpanded = (index) => {
        let checkIsExist = expanded.length > 0 && expanded.find(item => item.index === index && item.isExpended === true)
        return checkIsExist ? true:false;
    }
    const getStarScore = (percent) => {
        let percentF = percent
        //get fill star count
        let starCount = 0
        if(percentF >= 0 && percentF <= 69)
        {
            starCount = 1
        }else if(percentF >= 70 && percentF <= 84)
        {
            starCount = 2
        }else if(percentF >= 85 && percentF <= 100)
        {
            starCount = 3
        }
        return starCount
    }

    const cardStar = (task, percent, clickCheck) => {
        if(task.time !== "00:00:00"){
            if (percent >= 0 && percent <= 69) {
                return (
                  <span
                    className={`${classes.one_hand_icon} ${classes.task_smile_container}`}
                  >
                    <img src={SmileOneHandIcon} />
                    <span>もう少し！</span>
                  </span>
                );
              } else if (percent >= 70 && percent <= 84) {
                return (
                  <span
                    className={`${classes.tow_finger} ${classes.task_smile_container}`}
                  >
                    <img src={SmileTwoFingerIcon} />
                    <span>合格！</span>
                  </span>
                );
              } else if (percent >= 85 && percent <= 100) {
                return (
                  <span className={`${classes.task_smile_container} ${classes.two_hand}`}>
                    <img src={SmileTwoHandIcon} />
                    <span>完ペキ！</span>
                  </span>
                );
              }else{
                return (
                    <span
                      className={`${classes.task_smile_container} ${classes.sad_hand_icon}`}
                    >
                      <img src={SadHandIcon} />
                      <span>未実施</span>
                    </span>
                  );
              }
        }else{
            return (
                <span
                  className={`${classes.task_smile_container} ${classes.sad_hand_icon}`}
                >
                  <img src={SadHandIcon} />
                  <span>未実施</span>
                </span>
              );
        }
    };

    const chgScore = (item) => {
        console.log(item, 'item')
        let filterData = vScorePercentage;
        let getIndex = filterData.findIndex(x => x.index === item.index);
        //time

        var fromTime = new Date(item.value.start);
        var toTime = new Date(item.value.finished);
        
        var differenceTravel = toTime.getTime() - fromTime.getTime();
        var seconds = Math.floor((differenceTravel) / (1000));
        let formatSecod = new Date(seconds * 1000).toISOString().substr(11, 8)
        /////
        if(getIndex != -1)
        {
            filterData[getIndex].percent = (item.value.score.precision*100).toFixed(0)
            filterData[getIndex].time = formatSecod
            setScorePercentage([...filterData])
        }else{
            setScorePercentage( prevState  => ([...prevState, {index:item.index, percent: (item.value.score.precision*100).toFixed(0), time: formatSecod}]));
        }
    }

    const getTime = (index, item) => {
        if(vScorePercentage.length > 0)
        {
            let filterPercent = vScorePercentage.filter(i => i.index === index);
            if(filterPercent.length > 0)
            {
                return filterPercent[0].time;
            }
            return item.time;
        }else{
            return item.time;
        }
    }
    

    const getPercent = (index, item) => {
        if(vScorePercentage.length > 0)
        {
            let filterPercent = vScorePercentage.filter(i => i.index === index);
            if(filterPercent.length > 0)
            {
                return filterPercent[0].percent;
            }
            return (item.precision*100).toFixed(0);
        }else{
            return (item.precision*100).toFixed(0);
        }
    }
    let loadingcheck = 0;
    const catchLoading = (isLoading, loadingLenght) => {
        loadingcheck++;
        if(loadingcheck == loadingLenght)
        {
            setIsLoading(isLoading)
        }
    }     
 
    return (
        <div className={`${browserRedirect()!=1 ? browserRedirect()===3 ? `${classes.tablet_view } ${classes.table_view_padding}`: classes.mobile_view : classes.pc_view}`}>
            {
                vIsLoading && <LoadingText text="読み込み中....." />
            }
            <Row className={`${classes.title_border_botton} mx-0 ${browserRedirect()===3?'mb-4':'mb-2'}`} >
                <Col className={`px-0 ${classes.title_wrapper}`}>
                   <div className='float-left'><p className="font-20 font-weight-bold mb-1 mb-xl-3" id="scoring_overall" name="scoring_overall">採点</p></div> 
                   <ISwitch onChange={handleChange} checkState={overallScoring} text="全てを表示する"/>
                </Col>              
                
            </Row>
            {
                vScoringRecords && vScoringRecords.map((item, index)=>{
                    return (
                            <Accordion 
                                id="overall-scoring-section" 
                                disabled={item.isClickable?false:true} 
                                key={index} 
                                className={`history ${classes.accordianHead} MeiryoRegular`} 
                                square
                                expanded={item.isClickable && checkisExpanded(index)} onChange={handleAccordianChange(index)}
                            >
                            <AccordionSummary 
                                className={ `${item.isClickable === false ?classes.gray_background : classes.accordiansummaryHead} ${classes.accordion_wrappers} ${checkisExpanded(index)?classes.accordion_wrappers_top_radius:classes.accordion_wrappers_radius}`}
                                expandIcon={item.isClickable ? checkisExpanded(index)?<img src={expand_minus}></img>:<img src={expand_plus}></img>:<div style={{width : '30px',height : '30px'}}></div>}
                                aria-controls={`panel${index}bh-content`}
                                id={`panel${index}bh-header`}
                            >
                                <span id="section-name" className={`${classes.heading} d-flex flex-wrap align-items-center`}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className={`font-14 font-weight-bold MeiryoRegular ${item.isClickable?'text-white':""} ${classes.section_name}`}>{item.sectionsName}</div>
                                    </div>
                                </span>
                                <span id="pass-fail-star" className={`${classes.secondaryHeading} ${browserRedirect() !== 2 && classes.alignCenterStar}`}>
                                    {
                                        browserRedirect() === 2 ?
                                        <Row className={`MeiryoRegular w-100 d-flex align-items-center ${classes.secondary_wrapper}`}>
                                            <div className={classes.secondary_card_wrapper}>
                                            <Col lg={6} className={`text-center pl-0 ${classes.secondary_card_status_wrapper}`}>
                                                <span
                                                    className={`${classes.star_icon} ${classes.star_icon_arr}`}
                                                    id={`task_rate_${index + 1}$`}
                                                    name={`task_rate_${index + 1}$`}
                                                >
                                                    {cardStar(item, getPercent(index, item), item.isClickable)}
                                                </span>
                                            </Col>
                                            </div>
                                            <div className={classes.secondary_time_wrapper}>
                                                <Col lg={3} className={`font-14 ${item.isClickable?'text-white':""} text-center ${classes.secondary_time_wrapper} ${classes.font_weight_500}`}>
                                                    {getTime(index, item)}
                                                </Col>
                                                <Col lg={3} className={`text-left ${item.isClickable?'text-white':""} ${classes.secondary_percent_wrapper} ${classes.font_weight_700}`}>
                                                    正答率 ({getPercent(index, item)}%)
                                                </Col>
                                            </div>
                                        </Row> : 
                                        <Row className={`MeiryoRegular w-100 d-flex align-items-center ${classes.flex_nowrap}`}>
                                            <Col lg={3} className={`${browserRedirect()===3?'font-18':'font-16'} ${item.isClickable?'text-white':""} text-center ${classes.font_weight_500}` }>
                                                {getTime(index, item)}
                                            </Col>
                                            <Col lg={6} className={`text-center pl-0 ${classes.pr_0}`}>
                                                <span
                                                    className={`${classes.star_icon} ${classes.star_icon_arr}`}
                                                    id={`task_rate_${index + 1}$`}
                                                    name={`task_rate_${index + 1}$`}
                                                >
                                                    {cardStar(item, getPercent(index, item), item.isClickable)}
                                                </span>
                                            </Col>
                                            <Col lg={3} className={`text-left ${item.isClickable?'text-white':""} ${browserRedirect()===3&&'font-18'} ${classes.text_nowrap} ${classes.font_weight_700}`}>
                                                正答率 ({getPercent(index, item)}%)
                                            </Col>
                                        </Row>
                                    }
                                </span>
                            </AccordionSummary>
                            <AccordionDetails>
                                <span className="w-100">
                                    <ScoringDetail f_chgScore={chgScore} passState={passState} scoreData={item} userId={userId} sectionId={item.sectionId} isClickable={item.isClickable} f_catchLoading={catchLoading} isExpand={vCheckExpand} indexKey={index} overallScoring={overallScoring} expanded={expanded} extraClass={`${classes.title_border_botton}`}/>
                                </span>
                            </AccordionDetails>
                        </Accordion>
                    )
                })
            }
        </div>
    )

}

export default ScoringOverall;
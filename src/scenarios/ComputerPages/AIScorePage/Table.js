import React, { useState, useEffect } from 'react';
import BackgroundBlueChip from "../../../constituents/ILabel/BackgroundBlueChip"
import BackgroundWhiteChip from "../../../constituents/ILabel/BackgroundWhiteChip"
import { Row, Col } from 'reactstrap';
import { useTranslation } from 'react-i18next';

import EvaluationIcon1 from "../../../property/images/evaluation_icon3.svg"
import success from "../../../property/images/success.png"
import cross_icon from "../../../property/images/cross_icon.png"
import classes from './styles.module.css';
import BackgroundGreenLabel from '../../../constituents/ILabel/BackgroundGreenLabel';
import { browserRedirect } from '../../../utils/util';

const Table = ({selectScore, clickKeyword}) => {

    const { t } = useTranslation();
    let lastId = 0;
    const autoId = (prefix = 'ai-score-') => {
        lastId++;
        return `${prefix}${lastId}`;
    }

    const [vTableRow, settableRow] = useState([])
    const [tableLoading, setTableLoading] = useState(true)
    
    useEffect(() => {
        if(selectScore.recordScoreTable != undefined)
        {
            settableRow(selectScore.recordScoreTable)
            setTableLoading(false)
        }
    }, [selectScore])

    const sysmbole = (item) => {
        let matchKeyword = []
        selectScore.matchedWords.map((v, k) => {
            item.keywords.map((v1, k1) => {
                if(v.scoringKeyword.keyword == v1)
                {
                    if(!matchKeyword.includes(v1))
                    {
                        matchKeyword.push(v1)
                    }
                }
            })
        })

        let filterEmptyString = Array.from(new Set(item.keywords.filter(word => word != '')));
        let correctAnswerRate = ((matchKeyword.length/filterEmptyString.length)*100).toFixed(0)
        if(matchKeyword.length == filterEmptyString.length)
        {
            return <img src={success} alt="Evaluation Icon3" className={`mw-100 ${classes.evaluation_icon}`} id="all_mactch_keyword" name="all_mactch_keyword"/>
        }else if(matchKeyword.length >= 1)
        {
            return <img src={EvaluationIcon1} alt="Evaluation Icon3" className={`mw-100 ${classes.evaluation_icon}`} id="one_match_keyword" name="one_match_keyword"/>
        }else if(matchKeyword.length == 0)
        {
            return <img src={cross_icon} alt="Evaluation Icon1" className={`mw-100 ${classes.evaluation_icon}`} id="not_match_keyword" name="not_match_keyword"/>
        }
        return <img src={cross_icon} alt="Evaluation Icon1" className={`mw-100 ${classes.evaluation_icon}`} id="not_match_keyword" name="not_match_keyword"/>
    }

    const checkMatchKey = (keyword) => {
        let check = selectScore.matchedWords.find(element => element.scoringKeyword.keyword == keyword)
        if(check != undefined)
        {
            return true
        }
        return false
    }

    const getClickKeyword = (keyword) => {
        let check = selectScore.matchedWords.find(element => element.scoringKeyword.keyword == keyword);
        if(check != undefined)
        {
            clickKeyword(check)
        }
        return false;
    }

    const pointSplit = (item) => {
        return item.split("\n");
    }

    return (
        <>
            <div id="rate_risk_record_score_table_container" name="rate_risk_record_score_table_container">
            <div className={` ${classes.evaluation_table}`}>
                <Row className={`smallest-padding-box02 ${classes.evaluation_table_h_row}`}>
                    <Col sm="3" lg="2" className={classes.evaluation_table_h_col}>
                        <BackgroundGreenLabel label={t('aiscore.process')} className={` mb-0 `} id="table_col_process"/>
                    </Col>
                    <Col sm="4" lg="5" className={classes.evaluation_table_h_col}>
                        <BackgroundGreenLabel label={t('aiscore.evaluation')} className={` mb-0 `} id="table_col_evaluation"/>
                    </Col>
                    <Col sm="5" lg="5" className={classes.evaluation_table_h_col}>
                        <BackgroundGreenLabel label={t('aiscore.point')} className={` mb-0 `} id="table_col_point"/>
                    </Col>
                </Row>
                
                {
                    vTableRow.map((item, index) => {
                        return <Row className={`smallest-padding-box02 ${classes.evaluation_table_row}`} key={index}>
                                    <Col sm="3" lg="2" className="d-sm-flex pr-md-0">
                                        <div  className={`d-inline-flex d-sm-flex  align-items-center w-100 h-100 px-3 ${classes.scoring_detail_border_box}`}>
                                            <p className="font-16 font-weight-bold mb-0" id={`table_col_name${index}`} name={`table_col_name${index}`}>{item.name}</p>
                                        </div>
                                    </Col>
                                    <Col sm="4" lg="5" className="d-sm-flex px-md-0">
                                        <Row  className={` m-0 w-100  d-block d-sm-flex  ${classes.scoring_detail_border_box} ${classes.scoring_detail_border_box_tablet}`}>
                                            <Col className={`my-1 border-right border-dark ${classes.scoring_detail_symbol}`}>
                                                <div  className="h-100 d-sm-flex align-items-center justify-content-center ">
                                                    {sysmbole(item)}
                                                </div>
                                            </Col>
                                            <Col lg="10" className={'align-items-center d-flex'}>
                                                <div className={`d-flex flex-wrap ${classes.evaluation_table_body_col_2}`}>
                                                        {
                                                        Array.from(new Set(item.keywords)).map((keyword, keyIndex) => {
                                                                if(keyword != '')
                                                                {
                                                                    if(checkMatchKey(keyword))
                                                                    {
                                                                        return <button key={keyIndex} className={`w-auto h-100 mb-1 p-0 border-0 bg-transparent ${classes.keyword_adjust}`} onClick={() => getClickKeyword(keyword)}>
                                                                            <BackgroundBlueChip  key={keyIndex} label={keyword} className="rounded-0 mr-2" id={`background_blue_chip_${keyIndex}`} name={`background_blue_chip_${keyIndex}`} style={browserRedirect() === 3 ? {fontSize:'13px'}: null}/>
                                                                        </button>
                                                                    }else{
                                                                        return <button key={keyIndex} className={`w-auto h-100 mb-1 p-0 border-0 bg-transparent ${classes.keyword_adjust} ${classes.cursor_auto}`} onClick={() => getClickKeyword(keyword)}>
                                                                            <BackgroundWhiteChip  key={keyIndex} label={keyword} className="rounded-0 mr-2" id={`background_blue_chip_${keyIndex}`} name={`background_blue_chip_${keyIndex}`} style={browserRedirect() === 3 ? {fontSize:'13px'}: null}/>
                                                                        </button>
                                                                    }
                                                                }
                                                            })
                                                        }
                                                </div>
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col sm="5" lg="5" className="d-sm-flex pl-md-0">
                                        <div  className={`d-sm-flex align-items-center p-3 h-100 w-100 ${classes.scoring_detail_border_box}`}>
                                            {
                                                item.point ?
                                                <ul className={classes.point_list}>
                                                {
                                                    pointSplit(item.point).map((v, k) => {
                                                        return <li key={k}>{v}</li>
                                                    })
                                                }
                                                </ul>
                                                : <span className="font-weight-bold">-</span>
                                            }
                                        </div>
                                    </Col>
                                </Row>
                    })
                }
                </div>
            </div>
        </>
    )
}
export default Table
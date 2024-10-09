import React, { createRef, useState, useEffect, useRef } from 'react';
import classes from './styles.module.css'
import BackgroundBlueLabel from "../../../constituents/ILabel/BackgroundBlueLabel"
import { Container, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getScoreTable, getFile, getBase64Name } from '../../../request/backendApi/api'
import eventShuttle from '../../../eventShuttle'
import logger from 'redux-logger';
import PdfIcon from '../../../property/images/icons/pdf_icon.png'
import { browserRedirect } from '../../../utils/util';

function Table({scoreTable, processToken, lessonId, taskId}) {
    const { t } = useTranslation();
    let lastId = 0;
    const autoId = (prefix = 'rate-of-risk-') => {
        lastId++;
        return `${prefix}${lastId}`;
    }
    const [vScoreTableList, setScoreTableList] = useState([])

    const getScoreTableData = async (taskId) => {
        try {
            const data = getScoreTable(taskId).then(res => {
                if(res.data){
                    setScoreTableList(res.data)
                    setTableLoading(false)
                } else {
                    logger.error("スコアテーブルデータエラーです。応答形式が正しくありません。")
                    // logger.error("getScoreTableData error, response format is not legal.")
                }
            })
        } catch (error) {
            // eventShuttle.dispatch("something_went_wrong");
            eventShuttle.dispatch("エラーが発生しました。確認してもう一度お試しください。");
        }
    };

    const [vTableLoading, setTableLoading] = useState(true)

    useEffect(() => {
        getScoreTableData(taskId)
    }, [])

    const splitTablePoint = (item) => {
        return item.split("\n");
    }

    return (
        <>
            <Row className="mb-4"></Row>
            <div id="record_score_table_container" name="record_score_table_container" className={classes.table_row}>
            <Row className={`smallest-padding-box02 mt-3 ${classes.mt_3}`} >
                <Col xs="4" style={{padding: '0px'}}>
                    <div
                        className={classes.bg_green} 
                        id={t('table_first_header')} 
                        name={t('table_first_header')}
                        >
                            {t('rateOfRisk.s_header_1')}
                    </div>                    
                    {/* <BackgroundBlueLabel style={{ background:  '#99DBF0'}} key={1} label={t('rateOfRisk.s_header_1')} className={`font-18 ${classes.padding_chg} ${classes.bg_green} `} id={"table_first_header"}/> */}
                </Col>
                <Col xs="8" style={{padding: '0px'}}>
                    <div
                        className={classes.bg_green} 
                        id={t('table_second_header')} 
                        name={t('table_second_header')}
                        >
                            {t('rateOfRisk.s_header_2')}
                    </div> 
                    {/* <BackgroundBlueLabel key={2} label={t('rateOfRisk.s_header_2')} className={`font-18 ${classes.padding_chg} ${classes.bg_green}`} id={"table_second_header"}/> */}
                </Col>       
            </Row>
            {
                vScoreTableList.map((tableRow, index) => {
                    return <Row className={`smallest-padding-box02 ${classes.mt_3}`} key={index} id={`table_row_${index}`} name={`table_row_${index}`}>                                                  
                                <Col xs="4" style={{padding: '0px'}}>
                                    <div 
                                        className={`${classes.top_btn } ${classes.content_bottom_extra} ${browserRedirect()!==1? classes.top_btn_tablet : null}`} 
                                        id={`table_col_name_${index}`} 
                                        name={`table_col_name_${index}`}
                                        >
                                            {browserRedirect() === 1 ?
                                                <span className={classes.top_span}>{ index + 1 +'.' + tableRow.name}</span>
                                                 :
                                                <>
                                                    <span className={classes.top_span_left_tablet}>{ index + 1 +' .' }</span>
                                                    <span className={classes.top_span_right_tablet}>{tableRow.name}</span>
                                                </>
                                            }
                                            
                                    </div>
                                </Col>
                                <Col xs="8" style={{padding: '0px'}}>
                                    <div className={classes.content_outline}>
                                        <ul className={classes.point_list}>
                                        {
                                            splitTablePoint(tableRow.point).map((item, index1) => {
                                                return <li key={index1}>{item}</li>
                                            })
                                        }
                                        </ul>
                                    </div>
                                </Col>
                            </Row>
                })
            }
            </div>
        </>
    )
}

export default Table

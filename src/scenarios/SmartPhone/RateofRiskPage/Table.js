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
            <div id="record_score_table_container" name="record_score_table_container" className={classes.table_row}>
                <div
                    className={classes.bg_green} 
                    id={t('table_first_header')} 
                    name={t('table_first_header')}
                    >
                    {t('rateOfRisk.s_header_1')}・{t('rateOfRisk.s_header_2')}
                </div>
                {
                    vScoreTableList.map((tableRow, index) => {
                        return <div className={classes.mt_3} key={index} id={`table_row_${index}`} name={`table_row_${index}`}>  
                                    <div 
                                        className={`${classes.top_btn } ${classes.content_bottom_extra}`} 
                                        id={`table_col_name_${index}`} 
                                        name={`table_col_name_${index}`}
                                        >
                                            <span className={classes.top_span}>{ index +1 +'.' +  tableRow.name}</span>
                                            
                                    </div>
                                    <div className={classes.content_outline}>
                                        <ul className={classes.point_list}>
                                        {
                                            splitTablePoint(tableRow.point).map((item, index1) => {
                                                return <li key={index1}>{item}</li>
                                            })
                                        }
                                        </ul>
                                    </div>
                                </div>
                    })
                }
            </div>
        </>
    )
}

export default Table

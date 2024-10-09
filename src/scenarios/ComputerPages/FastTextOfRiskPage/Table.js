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

function Table({scoreTable, processToken, lessonId, taskId,pdfLink}) {
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
                    pdfLink(res.data)
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

    const splitTableSalesTool = (item) => {
        return item.split("\n");
    }

    const checkMaterialType = (item) => {
        let type = item.referenceName.split('.').pop()
        if(type == 'pdf')
        {
          return PdfIcon
        }else{
          return `${item.referencePath}?${processToken}`
        }
    }

    function dataURLtoBlob(data) {
        var bstr = atob(data)
        var n = bstr.length;
        var u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: 'pdf' });
    }

    const openNewWindow = (src, material) => {
        getBase64Name(material.referencePathName).then(res => {
            const blob = dataURLtoBlob(res?.data);
            const href = URL.createObjectURL(blob);

            var newWindow = window.open(src, '_blank', 'location=yes,scrollbars=yes,status=yes');
            newWindow.document.write("<html><head><title>" + material.referenceName + "</title></head><body>"
                + '<a href="' + href + '" download="' + material.referenceName + '" style="text-decoration:none;font-size:8px">'
                + '<h1>' + material.referenceName + '<button style="cursor:pointer;border: none;background-color: orange;color: white;border-radius: 5px;margin-left: 10px;">ダウンロードはこちら</button></h1></a>'
                + '<iframe src="' + src + '#toolbar=0" height="100%" width="100%" frameborder="0"></iframe></body></html>');
        })
    }

    return (
        <>
            <Row className="mb-4"></Row>
            <div id="record_score_table_container" name="record_score_table_container" className={classes.table_row}>
            <Row className="smallest-padding-box02 mt-8 " >
            <Col xs="4" style={{padding: '0px'}}>
                    <div
                        className={classes.bg_green} 
                        id={t('table_first_header')} 
                        name={t('table_first_header')}
                        >
                            {t('rateOfRisk.s_header_1')}
                    </div>                    
                   </Col>
                <Col xs="8" style={{padding: '0px'}}>
                    <div
                        className={classes.bg_green} 
                        id={t('table_second_header')} 
                        name={t('table_second_header')}
                        >
                            {t('rateOfRisk.s_header_2')}
                    </div> 
                </Col> 
            </Row>
            {
                vScoreTableList.map((tableRow, index) => {
                    return <Row className={`smallest-padding-box02 mt-3 ${classes.mt_3}`} key={index} id={`table_row_${index}`} name={`table_row_${index}`}>                                                  
                                <Col xs="4" style={{padding: '0px'}}>
                                        <div
                                        className={`${classes.top_btn} ${browserRedirect() === 3 ? classes.top_btn_tablet : null}`}
                                        id={`table_col_name_${index}`} 
                                        name={`table_col_name_${index}`}
                                        >
                                            {browserRedirect() !== 3 ? 
                                                <>
                                                    <span className={classes.top_span}>{tableRow.name}</span>
                                                </> : 
                                                <>
                                                    <span style={{minWidth: "24px"}}> {`${index + 1} .`}</span>
                                                    <span className={browserRedirect() ===3 ? classes.top_span_tablet : classes.top_span}>{tableRow.name}</span>
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

import React, {useEffect, useState} from 'react';
import classes from './styles.module.css'
import {Col, Row} from 'reactstrap';
import {useTranslation} from 'react-i18next';
import {getScoreTable} from '../../../request/backendApi/api'
import eventShuttle from '../../../eventShuttle'
import logger from 'redux-logger';
import {browserRedirect} from '../../../utils/util';

function Table({taskId, pdfLink}) {
  const {t} = useTranslation();
  const [vScoreTableList, setScoreTableList] = useState([])
  
  const getScoreTableData = async (taskId) => {
    try {
      getScoreTable(taskId).then(res => {
        if (res.data) {
          setScoreTableList(res.data)
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
        <Row className="smallest-padding-box02 mt-8 ">
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
            return <Row className={`smallest-padding-box02 mt-3 ${classes.mt_3}`} key={index} id={`table_row_${index}`}
                        name={`table_row_${index}`}>
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
                      <span
                        className={browserRedirect() === 3 ? classes.top_span_tablet : classes.top_span}>{tableRow.name}</span>
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

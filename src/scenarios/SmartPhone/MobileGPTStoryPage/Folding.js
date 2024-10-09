import React, {useEffect, useState} from 'react';
import classes from './styles.module.css'
import {Link} from "react-router-dom";
import {useTranslation} from 'react-i18next';
import {getProcessToken, getRateOfRiskScoreBar} from '../../../request/backendApi/api'
import Table from './Table'
import ScoreBar from "./scorebar"
import eventShuttle from '../../../eventShuttle'
import store from '../../../storage'
import LoadingText from '../../../constituents/ILoadingText'
import linkImg from "../../../property/images/link.png"
import LoadingMask from '../../../constituents/ILoadingMask';
import {getLocationState, onDownload, setLocationState} from '../../../utils/util';

function Folding({multiTasks}) {
  const {t} = useTranslation();
  const [vAiScore, setAiScore] = useState(new Map());
  const [tableRows, _setTableRows] = useState([]);
  const [vProcessToken, setProcessToken] = useState();
  const [selectTask, setSelectTask] = useState([]);
  const [vIsLoadingComponent, setIsLoadingComponent] = useState(false);
  const [vPdfLinks, setPdfLinks] = useState([]);
  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  
  useEffect(() => {
    setSelectTask([...multiTasks])
    scoreBarData(multiTasks.taskID);
  }, [multiTasks]);
  
  useEffect(() => {
    // only trigger the first time selectTask has value
    if (selectTask && selectTask.length > 0 && selectTask.every(task => task.showStatus === undefined)) {
      toggleFoldingArea(0, multiTasks[0]);
    }
  }, [selectTask])
  
  useEffect(() => {
    GetProcessToken()
  }, [getLocationState(), selectTask])
  
  function scoreBarData(taskId) {
    return new Promise((resolve, reject) => {
      try {
        let userId = store.getState().login_task_all.userId.value;
        if (taskId) {
          getRateOfRiskScoreBar(taskId, userId).then(res => {
            let sortedRecoredList = res.data.sort((a, b) => b.recordId - a.recordId)
            setAiScore(new Map(vAiScore.set(taskId, sortedRecoredList)));
            resolve()
          })
        }
      } catch (error) {
        reject(error)
        eventShuttle.dispatch("エラーが発生しました。確認してもう一度お試しください。");
      }
    })
  }
  
  const contextSplit = (item) => {
    return item.split("\n");
  }
  
  const toggleFoldingArea = (index, task) => {
    setIsLoadingComponent(true)
    scoreBarData(task.taskID).then(_result => {
      let tempArray = JSON.parse(JSON.stringify(selectTask));
      tempArray[index].showStatus = true;
      setSelectTask([...tempArray]);
      setIsLoadingComponent(false)
    }).catch(error => {
      console.log(error)
      eventShuttle.dispatch("something_went_wrong");
    });
  }
  const pdfLink = (val) => {
    if (val && val.length !== 0) {
      let arr = [];
      val.forEach(element => {
        if (element.referenceMaterials && element.referenceMaterials !== 0) {
          element.referenceMaterials.forEach(data => {
            arr.push(data);
          });
        }
      });
      setPdfLinks(arr)
    }
  }
  const downloadFile = (val, name) => {
    setIsLoadingMask(true);
    onDownload(val.referencePath + "?" + vProcessToken, name, () => {
      setIsLoadingMask(false);
    });
  }
  
  return (
    <>
      <div>
        {vIsLoadingComponent && <LoadingText text="読み込み中....."/>}
        {
          selectTask.map((select_task, index) => {
            return <div className={classes.foldableArea} key={index}>
              <div className={classes.purpose_sec}>
                                <span id="rate_of_risk_header" name="rate_of_risk_header">
                                    <span className={classes.firstTitle}>{select_task.name}</span>
                                </span>
              </div>
              <div className={classes.historyList}>
                <div className={classes.top_style}>
                  <div>
                    <div className={classes.adjust_div}>
                      <span className={classes.adjust_text_header2} id="header2"
                            name="header2">{t('freeRateOfRisk.header_1')}</span>
                    </div>
                    <div className={classes.span_style}>
                      <ul className={classes.adjust_point_list}>
                        {
                          selectTask &&
                          contextSplit(select_task.context).map((v, k) => {
                            return <li key={k} className={classes.adjust_span} id="secondary_header"
                                       name="secondary_header">{v}<br/></li>
                          })
                        }
                      </ul>
                    </div>
                  </div>
                  <div>
                    <div className={classes.adjust_div}>
                      <span className={classes.adjust_text_header2} id="header2"
                            name="header2">{t('freeRateOfRisk.header_2')}</span>
                    </div>
                    {
                      vPdfLinks.map((material, materialIndex) => {
                        return <div className={classes.div_pdf} key={materialIndex}>
                          <img src={linkImg} className={classes.img_left} alt={'img_left'}/>
                          <span className={`mr-2 ${classes.cursor_pointer}`}>
                                                        <a href="javascript:void(0);" className={classes.linkFlie}
                                                           onClick={() => downloadFile(material, material.referenceName)}
                                                           key={materialIndex}>{material.referenceName}</a>
                                                    </span>
                        </div>
                      })
                    }
                  </div>
                </div>
                <Table scoreTable={tableRows} processToken={vProcessToken} lessonId={select_task.lessonId}
                       taskId={select_task.taskID} pdfLink={pdfLink}></Table>
                <div className={classes.table_row}>
                  <p className={`font-16 font-weight-bold mb-1 ${classes.p_style}`} id="table_header"
                     name="table_header">
                    {t('aiscore.chartbar.header')}
                  </p>
                  <div className={`mt-1 pb-2 cmn-scroll-bar ${classes.scroll_container}`}>
                    {
                      select_task.showStatus && vAiScore.get(select_task.taskID).map((item, index) => {
                        return <Link to={{pathname: `/ai-score/${select_task.taskID}/${item.section.persona.id}`}}
                                     key={index}
                                     onClick={() => {
                                       setLocationState({
                                         item,
                                         isGPT: true
                                       }, `ai-score/${select_task.taskID}/${item.section.persona.id}`)
                                     }}>
                          <ScoreBar key={index} className="mb-1" item={item} id={`record_history_list_${index}`}/>
                        </Link>
                      })
                    }
                  </div>
                </div>
              </div>
            </div>
          })
        }
        <LoadingMask val={vIsLoadingMask}/>
      </div>
    </>
  )
}

export default Folding

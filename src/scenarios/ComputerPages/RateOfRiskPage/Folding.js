import React, { createRef, useState, useEffect, useRef } from 'react';
import classes from './styles.module.css'
import { Container, Row, Col } from 'reactstrap';
import { BrowserRouter as Router, Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { getRateOfRiskScoreBar, getProcessToken } from '../../../request/backendApi/api'
import Table from './Table'
import ScoreBar from "./scorebar"
import eventShuttle from '../../../eventShuttle'
import store from '../../../storage'
import LoadingText from '../../../constituents/ILoadingText'
import { getScoreTable, getFile, getBase64Name } from '../../../request/backendApi/api'
import PdfIcon from "./img/link.png"
import logger from 'redux-logger';
import LoadingMask from '../../../constituents/ILoadingMask';
import { browserRedirect, getLocationState, setLocationState, onDownload } from '../../../utils/util';

function Folding({multiTasks,vAllSecShowFlag}) {
    const { t } = useTranslation();
    const location = useLocation();
    const [vAiScore, setAiScore] = useState(new Map());
    const [tableRows, setTableRows] = useState([]);
    const [vProcessToken, setProcessToken] = useState();
    const [task, setTask] = useState(true);
    const [selectTask, setSelectTask] = useState([]);
    const [vShowToggleBtn, setShowToggleBtn] = useState(true);
    const [vIsLoadingComponent, setIsLoadingComponent] = useState(false);
    const [vChangeFlag, setChangeFlag] = useState(true);
    const GetProcessToken = async () => {
        const response = await getProcessToken();
        setProcessToken(response.data);
    };
    const [vScoreTableList, setScoreTableList] = useState([]);
    const [pdfList, setPdfList] = useState([]);
    const [vIsLoadingMask, setIsLoadingMask] = useState(false);
    // var tempArray = [];
    useEffect(()=>{
        let taskList = multiTasks;
        setSelectTask([...taskList])
        let tempArray1 =[];
        // core - !
        let promiseAll = [];
        let taskIDArray = [];

        taskList.forEach((item,index) => {
            scoreBarData(multiTasks[index].taskID);
        });

        multiTasks.map((item1,index1)=> {
            // getScoreTableData(multiTasks[index].taskID);
            promiseAll.push(getScoreTable(multiTasks[index1].taskID));
            taskIDArray.push(multiTasks[index1].taskID);
        });
        
        Promise.all(promiseAll).then((resAll) => {
            for (let index = 0; index < resAll.length; index++) {
                let tempArray = {
                    task_ID:'',
                    referenceMaterials:[]
                };
                const res = resAll[index];
                if(res.data){
                    tempArray.task_ID = taskIDArray[index] ;
                    let urlDate = res.data;
                    urlDate.forEach((item2,index2) => {
                        urlDate[index2].referenceMaterials.forEach((item3,index3) => {
                            tempArray.referenceMaterials.push(JSON.parse(JSON.stringify(urlDate[index2].referenceMaterials[index3])));
                        });
                        
                    }); 
                    tempArray1.push(tempArray);
                }else{
                    logger.error("スコアテーブルデータエラーです。応答形式が正しくありません。")
                }
                console.log(tempArray1,"~~~~~");

                setPdfList(tempArray1);
            }
          }).catch((err) => {
            console.log("promise all exception",err)
        })
    }, [multiTasks]);

    useEffect(()=>{
        // only trigger the first time selectTask has value
        if(selectTask && selectTask.length > 0 && selectTask.every(task=>task.showStatus == undefined)){
            toggleFoldingArea(0, multiTasks[0], false);
        }

        if((vAllSecShowFlag==''||vAllSecShowFlag==undefined)&&selectTask && selectTask.length !=0 && !location.pathname.includes('multiple-scenarios') && multiTasks.length == 1){
            // if single scenario, hide fold button
            setShowToggleBtn(false);
            
        }
    },[selectTask])

    useEffect(()=>{
        setChangeFlag(true);
        if(vAllSecShowFlag!=undefined && vAllSecShowFlag!=''){
            if(vAllSecShowFlag ==1){
                vAllSecShowFlag=true;
            }else{
                vAllSecShowFlag=false;
            }
            let tempArray = JSON.parse(JSON.stringify(selectTask));
            tempArray.forEach((item) => {
            item.showStatus=vAllSecShowFlag;
          });
          setSelectTask([...tempArray]);
          setChangeFlag(false);
        }
    },[vAllSecShowFlag])

    useEffect(() => {
        GetProcessToken()
    }, [])

    function scoreBarData(taskId){
        return new Promise((resolve, reject)=>{
            try {
                let userId = store.getState().login_task_all.userId.value;
                getRateOfRiskScoreBar(taskId, userId).then(res => {
                    let sortedRecoredList = res.data.sort((a, b) => b.recordId - a.recordId)
    
                    setAiScore(new Map(vAiScore.set(taskId, sortedRecoredList)));
                    resolve()
                })
            } catch (error) {
                reject(error)
                eventShuttle.dispatch("エラーが発生しました。確認してもう一度お試しください。");
            }
        })
    };

    const contextSplit = (item) => {
        return item.split("\n");
    }

    const toggleFoldingArea = (index, task, showStatusCheck)=>{
        if(!vAiScore.get(index+1)){
            if(!showStatusCheck)
            {
                setIsLoadingComponent(true)
                // send request when there is no data
                scoreBarData(task.taskID).then(result=>{
                    let tempArray = JSON.parse(JSON.stringify(selectTask));
                    if(tempArray[index].showStatus != undefined){
                        tempArray[index].showStatus = !(tempArray[index].showStatus);
                    }else{
                        tempArray[index].showStatus = true;
                    }
    
                    setSelectTask([...tempArray]);
                    setIsLoadingComponent(false)
                }).catch(error=>{
                    console.log(error)
                    eventShuttle.dispatch("something_went_wrong");
                });
            }else{
                let tempArray = JSON.parse(JSON.stringify(selectTask));
                if(tempArray[index].showStatus != undefined){
                    tempArray[index].showStatus = !(tempArray[index].showStatus);
                }else{
                    tempArray[index].showStatus = true;
                }
                setSelectTask([...tempArray]);
            }
        } else {
            let tempArray = JSON.parse(JSON.stringify(selectTask));
            if(tempArray[index].showStatus != undefined){
                tempArray[index].showStatus = !(tempArray[index].showStatus);
            }else{
                tempArray[index].showStatus = true;
            }
            
            setSelectTask([...tempArray]);
        }

        setChangeFlag(true);
    }

    const xhrequest = (url, callback) =>{
        var xhr = new XMLHttpRequest();
        xhr.open("get", url, true);
        xhr.responseType = "blob";
        xhr.onload = function() {
        callback(this);
        };
        xhr.send();
    }

    const downloadFile = (val, name) => {
        setIsLoadingMask(true);
        onDownload(val.referencePath + "?" + vProcessToken,name,()=>{
          setIsLoadingMask(false);
        });
    }

    return (
        <>
        <div>
        { vIsLoadingComponent && <LoadingText text="読み込み中....." /> }
        {
            selectTask.map((select_task, index) => {
                return <div className={classes.foldableArea} key={index}>
                            <div className={browserRedirect() === 3 ? classes.purpose_sec_tablet: classes.purpose_sec}>
                                <span id="rate_of_risk_header" name="rate_of_risk_header" style={
                                    browserRedirect() === 3? 
                                    selectTask[index].showStatus ?
                                        {height: '52px'} :
                                        {height: '45px'}
                                    :
                                    {height:'79px'}
                                }>
                                    <span className={classes.firstTitle}>{select_task.name}</span>
                                    {
                                        vShowToggleBtn && <span className={`${browserRedirect() ===3 ? classes.toggleBtn_tablet: classes.toggleBtn} ${selectTask[index].showStatus ? classes.button_arrow_up : classes.button_arrow_down}`} onClick={() => toggleFoldingArea(index, select_task, selectTask[index].showStatus)}>                                                   
                                        </span>
                                    }
                                </span>
                            </div>
                            <div className={classes.historyList} style={{display: selectTask[index].showStatus ? 'block':'none'}}>
                                <div className={classes.top_style}>
                                    <Row className={`mb-1 mt-3 d-flex ${classes.no_wrap}`}>
                                        <Col  xs="1.5"> 
                                            <div className={classes.adjust_div}>
                                                <span className={classes.adjust_text_header2} id="header2" name="header2">{selectTask[index].showStatus ? t('rateOfRisk.header_2'):''}</span>
                                            </div>
                                        </Col>
                                        <Col  className={classes.max_set}>
                                            <div className={classes.span_style}>
                                                <ul className={classes.adjust_point_list}>
                                                  {
                                                      select_task &&
                                                      contextSplit(select_task.context).map((v, k) => {
                                                          return <li key={k} className={classes.adjust_span} id="secondary_header" name="secondary_header">{v}<br/></li>
                                                      })
                                                  } 
                                                </ul>
                                            </div>
                                        </Col>                               
                                    </Row>
                                    <Row className={`mb-1 d-flex ${classes.no_wrap} ${browserRedirect()===3 ? `${classes.fold_material_tablet} mt-4`: `mt-3`}`}>
                                        <Col  xs="1.5"> 
                                            <div className={classes.adjust_div}>
                                                <span className={classes.adjust_text_header2} id="header2" name="header2" >募集資材・スクリプト</span>
                                            </div>
                                        </Col>
                                        <Col className={classes.max_set}>
                                                {   
                                                    pdfList.map((tableRow, materialIndex) => { 
                                                        if(tableRow && tableRow.task_ID == select_task.taskID){
                                                            
                                                                return <Row className={classes.pdf_row} key={materialIndex}>
                                                                    {
                                                                        tableRow.referenceMaterials.map((tableRow1, materialIndex1)=> {  
                                                                            return  <div className={classes.div_pdf} key={materialIndex1}>  
                                                                                        <img src={PdfIcon} className={classes.img_left}/>
                                                                                        <span className={`mr-2 ${classes.cursor_pointer}`} onClick={()=>downloadFile(tableRow1,tableRow1.referenceName)}>{tableRow1.referenceName}</span>
                                                                                    </div>
                                                                        })
                                                                    } 
                                                                </Row>
                                                        }                                                         
                                                    })
                                                }                                           
                                        </Col>                      
                                    </Row>
                                </div>                              
                                <Table scoreTable={tableRows} processToken={vProcessToken} lessonId={select_task.lessonId} taskId={select_task.taskID}></Table>
                                <div className="p-2 mt-4">
                                    <p className="font-18 font-weight-bold mb-1" id="table_header" name="table_header">
                                        {t('aiscore.chartbar.header')}
                                    </p>
                                    <div className={`mt-1 pb-2 cmn-scroll-bar ${classes.scroll_container}`} style={browserRedirect()===3?{overflowX:"hidden"}:null}>
                                        {/* <Col lg="12" className={`mx-auto ${classes.score_wrapper} `} id="record_history_lists" name="record_history_lists"> */}
                                            {
                                                selectTask[index].showStatus && vAiScore.get(select_task.taskID).map((item, index) => {
                                                    let checkLink = (item.commitId != "") && (location.pathname.includes('multiple-scenarios'));
                                                    // to={{pathname:`/ai-score/${!checkLink ? select_task.taskID : "multiple-scenarios"}/${item.section.persona.id}`,state:{item} }}
                                                    return  <Link to={{pathname:`/ai-score/${select_task.taskID}/${item.section.persona.id}` }} key={index} onClick={()=>{setLocationState({item}, `ai-score/${ select_task.taskID}/${item.section.persona.id}`)}}>
                                                                <ScoreBar key={index} className="mb-1" item={item} id={`record_history_list_${index}`}/>
                                                            </Link>
                                                })
                                            }
                                        {/* </Col> */}
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

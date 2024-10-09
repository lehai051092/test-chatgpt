import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {Col, Row} from "reactstrap";

import HistoryButton from "../../../constituents/IButton/HistoryButton";
import BackButton from "../../../constituents/IButton/BackButton";
import ChatLog from "./ChatLog";

import classes from "./styles.module.css";
import {Link, useLocation, useParams} from "react-router-dom";
import {
  getAiScoreHistoryChats,
  getLessonTask,
  getOverallAiScoreData,
  getRateOfRiskCirclePercent,
  getRateOfRiskScoreBar,
} from "../../../request/backendApi/api";
import eventShuttle from "../../../eventShuttle";
import CircleChart from "./CircleChart";
import Table from "./Table";
import CustomChart from "./CustomChart/index";
import logger from "redux-logger";
import {connect} from "react-redux";
import {selectTask} from "../../../storage/reduxActions/index";
import store from "../../../storage";
import {SELECT_TASK} from "../../../storage/consts";
import VOCUpdate from "./TalkListenSectionUpdate/VOC"
import ScoringOverall from "./ScoringOverall";
import {getAvatarDetail, getScoreParamsDetail,} from "../../../utils/scoreProcessor";
import LoadingText from "../../../constituents/ILoadingText";
import {browserRedirect, getLocationState, setLocationState} from "../../../utils/util";
import ISwitch from "../../../constituents/ISwitch";
import ICoreFrame from "../../../constituents/ICoreFrame";
import GPTChatLog from "./GPTChatLog";


const AIScorePage = ({selectTask}) => {
  const location = useLocation();
  const {t} = useTranslation();
  let {taskID} = useParams();
  let {lessonId} = useParams();
  const [vPrecisionPercent, setPrecisionPercent] = useState(null);
  const [vBestUserPrecision, setBestUserPrecision] = useState(0);
  const [vAiScore, setAiScore] = useState([]);
  const [vSelectScore, setSelectScore] = useState({});
  const [vScoreLoading, setScoreLoading] = useState(true);
  const [vMessages, setMessages] = useState([]);
  const [vGetAllMessages, setGetAllMessages] = useState([]);
  const [vSelectKeyword, setSelectKeyword] = useState(null);
  // control whether avatar shows
  const [vShowStoryImg, setShowStoryImg] = useState(false);
  // avatar using
  const [vAvatar, setAvatar] = useState("");
  const [vAvatarText, setAvatarText] = useState("ナイス！");
  const [vChClickable, setChClickable] = useState(true);
  const [vMultipleChartData, setMultipleChartData] = useState([]);
  const [
    vMultipleCurrentScoringRecords,
    setMultipleCurrentScoringRecords,
  ] = useState([]);
  const [shrinkAvatar, setShrinkAvatar] = useState(false);
  const [vIsLoading, setIsLoading] = useState(false);
  const [vSelectedItem, setSelectedItem] = useState(null);
  
  //for multi scenarios
  const [isMultiScenarios, setIsMultiScenarios] = useState(
    location.pathname.includes("multiple-scenarios")
  );
  const [overallScoringData, setoverallScoringData] = useState();
  const [currentChatID, setCurrentChatID] = useState();
  //voc data
  const [VOCUrl, setVOCUrl] = useState("");
  const [currentUserId, setCurrentUserId] = useState();
  // cache data of current lesson
  const [lessonData, setLessonData] = useState([]);
  // current selected section
  const [curSection, setCurSection] = useState({});
  const [vSectionName, setSectionName] = useState();
  const [vPassState, setPassState] = useState();
  //avata image name
  const [vAvatarName, setAvatarName] = useState('');
  const [vVOCWrapperShowStatus, setVOCWrapperShowStatus] = useState([false, false, false])
  const [vIsAllVOCOpen, setIsAllVOCOpen] = useState(false)
  //fast text score
  const [isFastTextScore, setIsFastTextScore] = useState(false);
  const [isGPT, setIsGPT] = useState(false)
  
  useEffect(() => {
    let checker = arr => arr.every(v => v === true);
    checker(vVOCWrapperShowStatus) ? setIsAllVOCOpen(true) : setIsAllVOCOpen(false);
  }, [vVOCWrapperShowStatus])
  
  useEffect(() => {
    let passState = isMultiScenarios ? overallScoringData ? overallScoringData : "" : curSection?.persona;
    setPassState(passState)
  }, [overallScoringData, curSection])
  
  useEffect(() => {
    const body = document.querySelector(".main-content-inr");
    if (body) {
      body.scrollIntoView(
        {
          behavior: "smooth",
        },
        500
      );
    }
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    let state = getLocationState();
    if (location.pathname.includes("multiple-scenarios")) {
      setIsMultiScenarios(true);
    } else {
      let userId = state?.user_id
        ? state?.user_id
        : store.getState().login_task_all.userId.value;
      let sectionId =
        state?.item && state?.item?.sectionId
          ? state?.item?.sectionId
          : state?.item && state?.item?.section?.id
            ? state?.item?.section?.id
            : store.getState().select_task.id
              ? store.getState().select_task.id
              : store.getState().select_task[0].id
                ? store.getState().select_task[0].id
                : store.getState().select_task[0].sectionId;
      setVOCUrl(`voc/results/users/${userId}/sections/${sectionId}`);
      setCurrentChatID(
        state?.chatId
          ? state?.chatId
          : state?.item?.recordId
            ? state?.item?.recordId
            : state?.item?.latestRecordId
      );
    }
    if (state?.isFastText) {
      setIsFastTextScore(state?.isFastText);
    }
    if (state?.isGPT) {
      setIsGPT(state?.isGPT)
    }
  }, []);
  
  useEffect(() => {
    // cache the information of this lesson for redo role-play
    getLessonTask(`lessons/${lessonId}/tasks`).then((res) => {
      setLessonData(res.data);
      res.data.length > 0 && setAvatarName(res.data[0].persona.avatar)
    });
  }, []);
  const clickKeyword = (keyword) => {
    setSelectKeyword(keyword);
  };
  //get chart list
  const scoreBarData = (userId) => {
    try {
      const data = getRateOfRiskScoreBar(taskID, userId).then((res) => {
        if (res.data) {
          setAiScore(res.data);
          setSectionName(res.data[0]?.section?.name);
          setScoreLoading(false);
          setIsLoading(false);
        } else {
          logger.error(
            "リスク率履歴リストのエラーです。応答形式が正しくありません。"
          );
        }
      });
    } catch (error) {
      eventShuttle.dispatch(
        "エラーが発生しました。確認してもう一度お試しください。"
      );
    }
  };
  //get message for chat history
  const getMessages = async (userId) => {
    try {
      const data = getAiScoreHistoryChats(taskID, userId).then((res) => {
        if (res.data) {
          setGetAllMessages(res.data);
        } else {
          logger.error(
            "メッセージ履歴エラーです。応答形式が正しくありません。"
          );
        }
      });
    } catch (error) {
      eventShuttle.dispatch(
        "エラーが発生しました。確認してもう一度お試しください。"
      );
    }
  };
  const setPercentData = async (userId) => {
    let state = getLocationState();
    try {
      const data = getRateOfRiskCirclePercent(taskID, userId).then((res) => {
        if (res.data) {
          // if comes from other pages, do not cover data fetched from redux
          if (state?.item == undefined) {
            setPrecisionPercent(
              parseInt((res.data.recentUserPrecision * 100).toFixed(0))
            );
          }
          if (state?.item?.sectionRate != undefined) {
            setPrecisionPercent(
              parseInt((res.data.recentUserPrecision * 100).toFixed(0))
            );
          }
          setBestUserPrecision(
            parseInt((res.data.bestUserPrecision * 100).toFixed(0))
          );
        } else {
          logger.error(
            "パーセントデータエラーです。応答形式が正しくありません。"
          );
        }
      });
    } catch (error) {
      eventShuttle.dispatch(
        "エラーが発生しました。確認してもう一度お試しください。"
      );
    }
  };
  const getOverallScoringData = async (personaId, commitId, userId) => {
    try {
      getOverallAiScoreData(personaId, commitId, userId).then((res) => {
        if (res.data) {
          // if comes from other pages, do not cover data fetched from redux
          let recentUserPrecision = parseInt(
            (res.data.recentUserOverallPrecision * 100).toFixed(0)
          );
          setPrecisionPercent(recentUserPrecision);
          
          let BestUserPrecision = parseInt(
            (res.data.bestUserOverallPrecision * 100).toFixed(0)
          );
          setBestUserPrecision(BestUserPrecision);
          setoverallScoringData(res.data);
          setMultipleChartData(res.data.trainingScoringRecords);
          setMultipleCurrentScoringRecords(res.data.currentScoringRecords);
          setAvatarName(res.data.personaAvatar)
          setIsLoading(false);
        } else {
          logger.error(
            "パーセントデータエラーです。応答形式が正しくありません。"
          );
        }
      });
    } catch (error) {
      eventShuttle.dispatch(
        "エラーが発生しました。確認してもう一度お試しください。"
      );
    }
  };
  
  const multipleChartBarClick = (item) => {
    setIsLoading(true);
    let state = getLocationState();
    let userId = state?.user_id
      ? state?.user_id
      : store.getState().login_task_all.userId.value;
    let personaId = item.personaId;
    let commitId = item?.commitId;
    setShowStoryImg(false);
    setSelectedItem(item);
    getOverallScoringData(personaId, commitId, userId);
  };
  
  useEffect(() => {
    setIsLoading(true);
    let state = getLocationState();
    let userId = state?.user_id
      ? state?.user_id
      : store.getState().login_task_all.userId.value;
    
    let personaId = state?.item
      ? state?.item?.sectionRate
        ? state?.item?.personaId
        : state?.item?.section?.persona?.id
      : store.getState().currentChosedPersona.id;
    let commitId = state.commitId ? state.commitId : state?.item?.commitId;
    
    if (state?.item != undefined) {
      if (state?.item.latestCommitId) {
        commitId = state?.item?.latestCommitId;
        personaId = state?.personaId;
      }
    }
    
    setCurrentUserId(userId);
    setTimeout(() => {
      if (!isMultiScenarios) {
        scoreBarData(userId);
        getMessages(userId);
        setPercentData(userId);
      }
      isMultiScenarios && getOverallScoringData(personaId, commitId, userId);
    }, 500);
    // window.scrollTo(0, 0);
    if (state?.buttonDisable != undefined) {
      setChClickable(userId == store.getState().login_task_all.userId.value);
    }
  }, [location, isMultiScenarios]);
  
  useEffect(() => {
    //get select scroe value
    let state = getLocationState();
    if (state?.item != undefined) {
      // if jump from other pages
      if (state?.item?.rate == undefined) {
        setSelectScore(state?.item);
        if (!isMultiScenarios) {
          if (state?.item?.recordId != undefined) {
            setPrecisionPercent(
              parseInt((state?.item?.score?.precision * 100).toFixed(0))
            );
          } else if (state?.item?.sectionRate == undefined) {
            // if single
            if (vAiScore.length >= 1) {
              for (const [key, value] of Object.entries(vAiScore)) {
                if (value.recordId == currentChatID) {
                  setPrecisionPercent(
                    parseInt((value?.score?.precision * 100).toFixed(0))
                  );
                }
              }
              let latestRecord = vAiScore[vAiScore.length - 1];
              setSelectScore(latestRecord);
            }
          } else {
            if (vAiScore.length >= 1) {
              let latestRecord = vAiScore[vAiScore.length - 1];
              setSelectScore(latestRecord);
              let chatID = latestRecord.recordId;
              for (const [key, value] of Object.entries(vGetAllMessages)) {
                if (value.id == chatID) {
                  setMessages(value.messages);
                }
              }
            }
          }
        }
        if (state?.item?.recordId != undefined) {
          let chatID = state?.item.recordId;
          for (const [key, value] of Object.entries(vGetAllMessages)) {
            if (value.id == chatID) {
              setMessages(value.messages);
            }
          }
        } else {
          let chatID = state?.item.latestRecordId;
          for (const [key, value] of Object.entries(vGetAllMessages)) {
            if (value.id == chatID) {
              setMessages(value.messages);
            }
          }
        }
      } else {
        if (vAiScore.length >= 1) {
          let latestRecord = {};
          vAiScore.forEach((item) => {
            if (
              !latestRecord.recordId ||
              item.recordId > latestRecord.recordId
            ) {
              latestRecord = JSON.parse(JSON.stringify(item));
            }
          });
          
          setSelectScore(latestRecord);
          let chatID = latestRecord.recordId;
          for (const [key, value] of Object.entries(vGetAllMessages)) {
            if (value.id == chatID) {
              setMessages(value.messages);
            }
          }
        }
      }
    } else {
      // if by completing role play
      if (vAiScore.length >= 1) {
        let latestRecord = {};
        vAiScore.forEach((item) => {
          if (!latestRecord.recordId || item.recordId > latestRecord.recordId) {
            latestRecord = JSON.parse(JSON.stringify(item));
          }
        });
        setSelectScore(latestRecord);
        let chatID = latestRecord.recordId;
        for (const [key, value] of Object.entries(vGetAllMessages)) {
          if (value.id == chatID) {
            setMessages(value.messages);
          }
        }
      }
      if (vAiScore.length >= 1) {
        selectTask(vAiScore[0].section);
      }
    }
    if (state?.isShowStory != undefined) {
      setShowStoryImg(state?.isShowStory);
    }
    if (vAiScore.length >= 1) {
      setCurSection(vAiScore[0].section);
    }
  }, [vAiScore]);
  
  useEffect(() => {
    // dynamic show result persona pictures by user's former choice
    // if all data was fetched
    getAvatarDetail(
      getScoreParamsDetail(
        vPrecisionPercent,
        vBestUserPrecision,
        isMultiScenarios ? vMultipleChartData : vAiScore
      ),
      setAvatar,
      setAvatarText,
      isMultiScenarios,
      setShrinkAvatar,
      vAvatarName
    );
  }, [vPrecisionPercent, vBestUserPrecision, vAiScore, vMultipleChartData]);
  
  function scoreClickHandle(item) {
    setCurrentChatID(item.recordId);
    setVOCUrl(`voc/results/users/${item.userId}/sections/${item.section.id}`);
    setSelectScore(item);
    if (item.score) {
      setShowStoryImg(false);
      setPrecisionPercent(parseInt((item.score.precision * 100).toFixed(0)));
    }
  }
  
  useEffect(() => {
    if (!isMultiScenarios) {
      let chatID = vSelectScore.recordId;
      for (const [key, value] of Object.entries(vGetAllMessages)) {
        if (value.id == chatID) {
          setMessages(value.messages);
        }
      }
    }
  }, [vGetAllMessages, vSelectScore]);
  
  const redirectToVideoChatPage = () => {
    if (isGPT) {
      let state = getLocationState();
      let currentSection = state?.item?.sectionId
        ? state?.item?.sectionId
        : taskID;
      return `/gpt-chat/${currentSection}/${lessonId}`;
    }
    if (!isFastTextScore) {
      let state = getLocationState();
      if (lessonData && lessonData.length > 0) {
        if (location.pathname.includes("multiple-scenarios")) {
          return {
            pathname: `/video-chat/${lessonData[0].id}/${lessonId}/multiple-scenarios`,
          };
        } else {
          // if single
          let currentSection = state?.item?.sectionId
            ? state?.item?.sectionId
            : taskID;
          return `/video-chat/${currentSection}/${lessonId}`;
        }
      }
    } else {
      let sectionId = location.pathname.split('/')[2];
      let personaId = location.pathname.split('/')[3];
      return `/fast-text/${sectionId}/${personaId}`;
    }
  };
  
  const handleReproduceRolePlay = () => {
    let state = getLocationState();
    if (lessonData && lessonData.length > 0) {
      if (location.pathname.includes("multiple-scenarios")) {
        setLocationState("multiple-scenarios");
        // if multiple mode, return to multiple
        store.dispatch({type: SELECT_TASK, payload: lessonData});
      } else {
        // if single
        let currentSection = state?.item?.sectionId
          ? state?.item?.sectionId
          : taskID;
        let selectedLesson = lessonData.filter(
          (data) => data.id == currentSection
        );
        store.dispatch({type: SELECT_TASK, payload: selectedLesson});
      }
      setLocationState("multiple-scenarios");
    }
  };
  const backOnlick = () => {
    return ''
  }
  
  const handleVOCChange = (event) => {
    setIsAllVOCOpen(event.target.checked)
    let checkedItem = [];
    for (let index = 0; index < vVOCWrapperShowStatus.length; index++) {
      checkedItem.push(event.target.checked)
    }
    checkedItem.length > 0 && setVOCWrapperShowStatus(checkedItem);
  }

  return (
    <>
      <ICoreFrame
        component={<>
          {vIsLoading && <LoadingText text="読み込み中....."/>}
          <div
            className={`top-page ${browserRedirect() != 1 ? browserRedirect() === 3 ? classes.tablet_view : classes.mobile_view : classes.pc_view}`}>
            <Row
              className={browserRedirect() === 3 ? classes.tablet_head : `align-items-center mb-1 ${classes.mobile_ml_mr_0}`}>
              <Col className={classes.header_title_wrapper}>
                <p className="mb-0 font-18 font-weight-bold d-block d-sm-inline d-lg-block"
                   id="ai_score_header" name="ai_score_header">
                <span className="mr-3">
                  {isMultiScenarios
                    ? overallScoringData
                      ? overallScoringData.themeName
                      : ""
                    : curSection?.persona?.themeName}
                </span>
                  <span>
                  {isMultiScenarios
                    ? overallScoringData
                      ? overallScoringData.scenarioName
                      : ""
                    : curSection?.persona?.scenarioName}
                </span>
                </p>
                <p
                  className={`mb-0 font-22 font-weight-bold d-block d-sm-inline d-lg-block ${browserRedirect() === 3 && classes.ai_score_header_right}`}
                  id="ai_score_header"
                  name="ai_score_header"
                >
                  {/* {select_task.name} */}
                  {isMultiScenarios
                    ? overallScoringData
                      ? overallScoringData.personasName
                      : ""
                    : curSection?.persona?.persona}
                </p>
              </Col>
              {browserRedirect() !== 3 ?
                <>
                  <Col xl="5" lg="6" md="6" sm="12"
                       className={`text-right pl-1 ${classes.header_link_gp}`}>
                    {/* <div  className={`text-center text-lg-right pl-lg-1 ${classes.score_btn_gp}`}> */}
                    {vChClickable && (
                      <>
                        <Link to={{pathname: `/start-new-role-play`}} onClick={() => {
                          setLocationState(false, 'start-new-role-play')
                        }}>
                          <BackButton
                            title="コース一覧"
                            className={`w-auto ${classes.keyword_adjust} ${classes.score_btn_adjust}`}
                            idName="link_to_scenario_selection" onClick={backOnlick}
                          />
                        </Link>
                        
                        {!isFastTextScore && !isGPT &&
                          <Link
                            to={{pathname: `/start-new-role-play`}}
                            onClick={() => {
                              setLocationState({
                                lessonId,
                                selectPersona: vPassState
                              }, 'start-new-role-play');
                            }}
                          >
                            <BackButton
                              title="セクション一覧"
                              className={`ml-2 w-auto px-3 ${classes.keyword_adjust} ${classes.score_btn_adjust}`}
                              id="link_to_persona_selection"
                            />
                          </Link>
                        }
                        
                        <Link
                          to={redirectToVideoChatPage}
                          onClick={handleReproduceRolePlay}
                        >
                          <HistoryButton
                            className={`ml-2 ${classes.keyword_adjust}`}
                            title="リトライ"
                            idName="link_to_video_chat"
                            onClick={() => {
                            }}
                          />
                        </Link>
                      </>
                    )}
                    {/* </div> */}
                  </Col>
                </> : null
              }
            </Row>
            {browserRedirect() === 3 ?
              <>
                <Row className={classes.header_link_gp_wrapper}>
                  <Col className={classes.header_link_gp}>
                    {vChClickable && (
                      <>
                        <Link to={{pathname: `/start-new-role-play`}} onClick={() => {
                          setLocationState(false, 'start-new-role-play')
                        }}>
                          <BackButton
                            title="コース一覧"
                            className={`w-auto ${classes.keyword_adjust} ${classes.score_btn_adjust}`}
                            idName="link_to_scenario_selection" onClick={backOnlick}
                          />
                        </Link>
                        
                        {!isFastTextScore && !isGPT &&
                          <Link
                            to={{pathname: `/start-new-role-play`}}
                            onClick={() => {
                              setLocationState({
                                lessonId,
                                selectPersona: vPassState
                              }, 'start-new-role-play')
                            }}
                          >
                            <BackButton
                              title="セクション一覧"
                              className={`ml-2 w-auto px-3 ${classes.keyword_adjust} ${classes.score_btn_adjust}`}
                              id="link_to_persona_selection"
                            />
                          </Link>
                        }
                        
                        <Link
                          to={redirectToVideoChatPage}
                          onClick={handleReproduceRolePlay}
                        >
                          <HistoryButton
                            className={`ml-2 ${classes.keyword_adjust}`}
                            title="リトライ"
                            idName="link_to_video_chat"
                            onClick={() => {
                            }}
                          />
                        </Link>
                      </>
                    )}
                    {/* </div> */}
                  </Col>
                </Row>
              </> : null
            }
            <div className="bg-white rounded">
              {vShowStoryImg && (
                <div className={`mb-3 pt-3 ${classes.avatar_status_box}`}>
                  {vAvatar && (
                    browserRedirect() != 1 ? <>
                        {browserRedirect() === 3 ?
                          <div className="d-flex justify-content-center align-items-center">
                            <img src={vAvatar} className={classes.avatar_img_size}/>
                            <div className={classes.tablet_result_tips}>{vAvatarText}</div>
                          </div>
                          :
                          <div className="text-center">
                            <div className={classes.mobile_result_tips}>{vAvatarText}</div>
                            <img src={vAvatar} className={classes.mobile_avatar_img_size}/>
                          </div>
                        }
                      </>
                      :
                      <Row className={classes.result_bannner}>
                        <img src={vAvatar} className={classes.avatar_img_size}/>
                        <div className={classes.result_tips}>{vAvatarText}</div>
                      </Row>
                  )}
                </div>
              )}
              <div className={classes.top_header_wrapper}>
                {isMultiScenarios ? <p className="ml-2">総合評価</p> :
                  <p className="ml-2">{vSectionName}</p>}
              </div>
              <div className={`cmn-bg-box ${classes.remove_radius}`}>
                <Row className="mb-2"
                     style={browserRedirect() === 3 ? {marginLeft: '0', marginRight: '0'} : null}>
                  <Col md={browserRedirect() === 3 ? `5` : `6`}
                       className="mb-3 mb-xl-4 mb-md-3 mb-lg-3 d-flex">
                    <div
                      className={`d-flex align-items-center ${classes.circle_wrapper}`}
                    >
                      <div
                        className={classes.inner_circle_wrapper}
                        id="circle_chart_container"
                        name="circle_chart_container"
                      >
                        <CircleChart
                          precisionPercent={vPrecisionPercent}
                          bestUserPrecision={vBestUserPrecision}
                        ></CircleChart>
                      </div>
                    </div>
                  </Col>
                  <Col md="6" className="mb-3 mb-xl-4 mb-md-3 mb-lg-3 d-flex"
                       style={browserRedirect() === 3 ? {marginLeft: '35px'} : null}>
                    <div
                      className={`cmn-bg-box-inr ${browserRedirect() === 3 ? classes.process_recored_tablet : null}`}
                      id="line_chart_container"
                      name="line_chart_container"
                    >
                      <p
                        className={`font-16 font-weight-bold text-center m-0 ${classes.line_chart_title}`}
                        id="line_chart_header"
                        name="line_chart_header"
                      >
                        {t("aiscore.chartbar.header")}
                      </p>
                      {isMultiScenarios ? (
                        <CustomChart
                          f_scoreClickHandle={multipleChartBarClick}
                          aiScore={vMultipleChartData}
                          isMultiple={true}
                          is_flag={false}
                          chatID="multiple_chart_wrapper"
                        ></CustomChart>
                      ) : (
                        <CustomChart
                          f_scoreClickHandle={scoreClickHandle}
                          aiScore={vAiScore}
                          isMultiple={false}
                          is_flag={true}
                          state={getLocationState()}
                          chatID="singal_chart_wrapper"
                        ></CustomChart>
                      )}
                    </div>
                  </Col>
                </Row>
                {isMultiScenarios ? (
                  ""
                ) : (
                  <div className={browserRedirect() === 3 ? classes.process_detail_tablet : null}>
                    <p
                      className={`font-20 font-weight-bold mb-3 mb-xl-3 ${classes.title_border_botton}`}
                      id="table_header"
                      name="table_header"
                    >
                      {t("aiscore.score_by_process")}
                    </p>
                    
                    <Table
                      selectScore={vSelectScore}
                      clickKeyword={clickKeyword}
                    ></Table>
                  </div>
                )}
                <Row className={browserRedirect() === 3 ? `my-2 ${classes.score_bottom_box}` : `my-4`}>
                  <Col
                    md={browserRedirect() === 1 ? 6 : isMultiScenarios || browserRedirect() === 2 ? 12 : 6}
                    lg={isMultiScenarios ? 12 : browserRedirect() === 3 ? 6 : 4}
                    className="mb-4 mb-md-0">
                    <div className="">
                      <Row className={`${classes.title_border_botton} mb-3 mb-xl-3 m-0`}>
                        <Col className="p-0">
                          <p
                            className={`font-20 font-weight-bold mb-0`}
                            id="table_header"
                            name="table_header"
                          >
                            話し方_分析結果
                          </p>
                        </Col>
                        { /** don‘t change it , Involving isMultiScenarios and single */}
                        {
                          isMultiScenarios ?
                            <ISwitch onChange={handleVOCChange} checkState={vIsAllVOCOpen}
                                     text="全てを表示する"/>
                            : null
                        }
                        {
                          browserRedirect() === 2 && !isMultiScenarios ?
                            <ISwitch onChange={handleVOCChange} checkState={vIsAllVOCOpen}
                                     text="全てを表示する"/>
                            : null
                        }
                      </Row>
                      {
                        browserRedirect() != 2 && !isMultiScenarios ?
                          <Row>
                            <Col className="mx-1">
                              <ISwitch onChange={handleVOCChange}
                                       checkState={vIsAllVOCOpen} text="全てを表示する"/>
                            </Col>
                          </Row>
                          : null
                      }
                      <VOCUpdate
                        VOCUrl={VOCUrl}
                        chatID={currentChatID}
                        isOverall={isMultiScenarios}
                        vocDataStatic={overallScoringData}
                        vVOCWrapperShowStatus={vVOCWrapperShowStatus}
                        setVOCWrapperShowStatus={setVOCWrapperShowStatus}
                      />
                    </div>
                  
                  </Col>
                  <Col>
                    {isMultiScenarios ? (
                      ""
                    ) : (
                      <Row>
                        <Col id="chat_container" name="chat_container">
                          <p
                            className={`font-20 font-weight-bold mb-3 ${classes.title_border_botton}`}
                            id="chat_wrapper"
                            name="chat_wrapper"
                          >
                            {t("aiscore.utterance")}
                          </p>
                          {isGPT ?
                            <GPTChatLog
                              messages={vMessages}
                              id="chat_list"
                              selectKeyword={vSelectKeyword}
                              vSelectScore={vSelectScore}
                              vAvatarName={vAvatarName}
                            />
                            :
                            <ChatLog
                              messages={vMessages}
                              id="chat_list"
                              selectKeyword={vSelectKeyword}
                              MsgSelectScore={vSelectScore}
                              vAvatarName={vAvatarName}
                            />
                          }
                        </Col>
                      </Row>
                    )}
                  </Col>
                </Row>
                {isMultiScenarios ? (
                  <Row className="large-padding-box mt-4" id="multiple_scroll_wrapper">
                    <Col lg="12" md="12" className="">
                      <ScoringOverall
                        passState={getLocationState()}
                        userId={currentUserId}
                        sectionId={1}
                        scoringRecords={vMultipleCurrentScoringRecords}
                        selectedItem={vSelectedItem}
                      />
                    </Col>
                  </Row>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
        </>}
      />
    </>
  );
};

const stateToProps = (state) => {
  return {
    select_task: state.select_task,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    selectTask: (select_task) => {
      dispatch(selectTask(select_task));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(AIScorePage);

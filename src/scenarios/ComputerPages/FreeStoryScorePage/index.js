import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";

import HistoryButton from "../../../constituents/IButton/HistoryButton";
import BackButton from "../../../constituents/IButton/BackButton";
import ChatLog from "./ChatLog";

import classes from "./styles.module.css";
import { BrowserRouter as Router, Link, useParams } from "react-router-dom";
import {
  getRateOfRiskCirclePercent,
  getAiScoreHistoryChats,
  getRateOfRiskScoreBar,
  getOverallAiScoreData,
  getCheckFreeVideo,
  deleteFreeVideo,
} from "../../../request/backendApi/api";
import eventShuttle from "../../../eventShuttle";
import CircleChart from "./CircleChart";
import Table from "./Table";
import { useLocation, useHistory } from "react-router-dom";
import CustomChart from "./CustomChart/index";
import logger from "redux-logger";
import { connect } from "react-redux";
import { selectTask } from "../../../storage/reduxActions/index";
import store from "../../../storage";
import { SELECT_TASK } from "../../../storage/consts";
// import VOC from "./TalkListenSection/VOC";
import VOCUpdate from "./TalkListenSectionUpdate/VOC"
import { getLessonTask } from "../../../request/backendApi/api";
import LoadingText from '../../../constituents/ILoadingText'
import ConfirmDialog from '../../../constituents/IConfirmDialog'
import ISwitch from "../../../constituents/ISwitch";
import ICoreFrame from "../../../constituents/ICoreFrame";
import { browserRedirect, getLocationState,setLocationState } from "../../../utils/util";
// import {isDevOrLocalEnv} from "../../../utils/runtime";

const AIScorePage = ({ select_task, selectTask, lesson_categories }) => {
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation();
  let { taskID } = useParams();
  let { lessonId } = useParams();
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
    setMultipleCurrentScoringRecords
  ] = useState([]);
  const [shrinkAvatar, setShrinkAvatar] = useState(false)
  const [vIsLoading, setIsLoading] = useState(false)
  const [vSelectedItem, setSelectedItem] = useState(null)

  //for multi scenarios
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

  //confirm record
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isOpenOverrideConfirmDialog, setIsOpenOverrideConfirmDialog] = useState(false);
  //voc switch section
  const [vVOCWrapperShowStatus, setVOCWrapperShowStatus] = useState([false, false, false])
  const [vIsAllVOCOpen, setIsAllVOCOpen] = useState(false)

  useEffect(() => {
    let checker = arr => arr.every(v => v === true);
    checker(vVOCWrapperShowStatus)?setIsAllVOCOpen(true):setIsAllVOCOpen(false);
  }, [vVOCWrapperShowStatus])

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
    let userId = state ? (state?.user_id ? state?.user_id : store.getState().login_task_all.userId.value) : store.getState().login_task_all.userId.value;

    let sectionId =
      state?.item && state?.item.sectionId
        ? state?.item.sectionId
        : state?.item && state?.item.section.id
          ? state?.item.section.id
          : store.getState().select_task.id
            ? store.getState().select_task.id
            : store.getState().select_task[0].id
            ? store.getState().select_task[0].id
            : store.getState().select_task[0].sectionId;
    setVOCUrl(`voc/results/users/${userId}/sections/${sectionId}`);
    // freestory 
    setCurrentChatID(
      state?.chatId
        ? state?.chatId
        : state?.item.recordId
          ? state?.item.recordId
          : state?.item.latestRecordId
    );
  }, []);

  useEffect(() => {
    const state = getLocationState();
    let saveRecordDataStatus = state?.saveRecordDataStatus;
    let userId = state?.user_id
      ? state?.user_id
      : store.getState().login_task_all.userId.value;
    saveRecordDataStatus && checkFreeVideo(userId);
  }, [])

  useEffect(() => {
    // cache the information of this lesson for redo role-play
    getLessonTask(`lessons/${lessonId}/tasks`).then((res) => {
      setLessonData(res.data);
    });
  }, []);

  const clickKeyword = (keyword) => {
    setSelectKeyword(keyword);
  };
  //get check free video active or not
  const checkFreeVideo = (userId) => {
    const state = getLocationState();
    if (state?.freeStoryFlag === 2) {
      try {
        getCheckFreeVideo(taskID, userId).then((res) => {
          if (res.data === "INACTIVE") {
            setIsOpenConfirmDialog(true);
          } else {
            setIsOpenOverrideConfirmDialog(true);
          }
        });
      } catch (error) {
        eventShuttle.dispatch(
          "エラーが発生しました。確認してもう一度お試しください。"
        );
      }
    }
  };
  //update original state Value saveRecordDataStatus
  const updateOriginalState = () => {
    const state = getLocationState();
    let copyState = { ...state };
    copyState.saveRecordDataStatus = false;
    history.replace({ state: copyState });
  }
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
    const state = getLocationState();
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
          // setSelectScore(latestRecord);
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
    ///auto scroll
    // const body = document.getElementById("multiple_scroll_wrapper");
    // body.scrollIntoView(
    //   {
    //     behavior: "smooth",
    //   },
    //   500
    // );
    ///auto scroll
    setIsLoading(true);
    const state = getLocationState();
    let userId = state?.user_id
      ? state?.user_id
      : store.getState().login_task_all.userId.value;
    // let personaId = state.item ? state?.item?.section?.persona?.id : store.getState().currentChosedPersona.id;
    let personaId = item.personaId;
    let commitId = item.commitId;
    setShowStoryImg(false);
    setSelectedItem(item)
    getOverallScoringData(personaId, commitId, userId);
  };

  useEffect(() => {
    const state = getLocationState();
    setIsLoading(true);
    let userId = state?.user_id
      ? state?.user_id
      : store.getState().login_task_all.userId.value;

    let personaId = state?.item
      ? state?.item.sectionRate
        ? state?.item.personaId
        : state?.item?.section?.persona?.id
      : store.getState().currentChosedPersona.id;
    let commitId = state?.commitId ? state?.commitId : state?.item?.commitId;

    if (state?.item != undefined) {
      if (state?.item.latestCommitId) {
        commitId = state?.item?.latestCommitId;
        personaId = state?.item?.personaId;
      }
    }

    setCurrentUserId(userId);
    setTimeout(() => {
      scoreBarData(userId);
      getMessages(userId);
      setPercentData(userId);
    }, 500);
    // window.scrollTo(0, 0);
    setChClickable(userId == store.getState().login_task_all.userId.value);
  }, [location]);

  useEffect(() => {
    const state = getLocationState();
    //get select scroe value
    if (state?.item != undefined) {
      // if jump from other pages
      if (state?.item.rate == undefined) {
        let chatID = state?.item.latestRecordId == undefined ? state?.item.recordId : state?.item.latestRecordId;
        console.log(chatID, 'chatID')
        let latestRecord = {};
        vAiScore.forEach((item) => {
          if (
            item.recordId == chatID
          ) {
            latestRecord = JSON.parse(JSON.stringify(item));
          }
        });
        setSelectScore(latestRecord);
        // if single
        if (state?.item?.sectionRate == undefined) {
          // setPrecisionPercent(
          //   parseInt((state?.item?.highestScore * 100).toFixed(0))
          // );

          setPrecisionPercent(
            parseInt((latestRecord?.score?.precision * 100).toFixed(0))
          );
        }
        for (const [key, value] of Object.entries(vGetAllMessages)) {
          if (value.id == chatID) {
            setMessages(value.messages);
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
        console.log(latestRecord, 'latestRecord')

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
    // }
  }, [vAiScore]);

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
    let chatID = vSelectScore.recordId;
    for (const [key, value] of Object.entries(vGetAllMessages)) {
      if (value.id == chatID) {
        setMessages(value.messages);
      }
    }
  }, [vGetAllMessages, vSelectScore]);

  const handleReproduceRolePlay = () => {
    const state = getLocationState();
    if (lessonData && lessonData.length > 0) {
      // if single
      let currentSection = state?.item?.sectionId
        ? state?.item?.sectionId
        : taskID;
      let selectedLesson = lessonData.filter(
        (data) => data.id == currentSection
      );
      store.dispatch({ type: SELECT_TASK, payload: selectedLesson });
    }

    if (lessonData && lessonData.length > 0) {
      // if single
      let currentSection = state?.item?.sectionId
        ? state?.item?.sectionId
        : taskID;
      setLocationState({
        senario: state?.senario
      }, `free-story-chat-page/${currentSection}/${lessonId}`);
      history.push({
          pathname: `/free-story-chat-page/${currentSection}/${lessonId}`,
      });
    }
  };

  const SaveRecordData = () => {
    const state = getLocationState();
    try {
      let status = "ACTIVE"
      let chatId = state?.chatId;
      chatId !== "" && deleteFreeVideo(chatId, status).then(res => {
        console.log('res', res)
      })
    } catch (error) {
      eventShuttle.dispatch(
        "エラーが発生しました。確認してもう一度お試しください。"
      );
    }
  }

  const handleSaveRecording = () => {
    updateOriginalState();
    SaveRecordData();
    setIsOpenConfirmDialog(false);
  }
  const handleCancelRecording = () => {
    updateOriginalState();
    setIsOpenConfirmDialog(false);
  }
  const handleOverrideRecording = () => {
    updateOriginalState();
    SaveRecordData();
    setIsOpenOverrideConfirmDialog(false);
  }
  const handleCancelOverrideRecording = () => {
    updateOriginalState();
    setIsOpenOverrideConfirmDialog(false);
  }

  console.log("IsMobileOrPC" , browserRedirect())

  //for control scroll y when modal box open
  useEffect(() => {
    if (isOpenConfirmDialog || isOpenOverrideConfirmDialog) {
      document.body.classList.add('control_scroll');
    } else {
      document.body.classList.remove('control_scroll');
    }
  }, [isOpenConfirmDialog, isOpenOverrideConfirmDialog])

  const handleVOCChange = (event) =>{
    setIsAllVOCOpen(event.target.checked)
    let checkedItem = [];
    for (let index = 0; index < vVOCWrapperShowStatus.length; index++) {
      checkedItem.push(event.target.checked)
    }
    checkedItem.length > 0 && setVOCWrapperShowStatus(checkedItem);
  }
  return (
    <ICoreFrame
      component={
        <>
          {
            vIsLoading && <LoadingText text="読み込み中....." />
          }
          <ConfirmDialog
            open={isOpenConfirmDialog}
            setOpen={setIsOpenConfirmDialog}
            showSecOption="false"
            onConfirm={handleSaveRecording}
            onCancel={handleCancelRecording}
            title='録画データを保存します。​よろしいですか？​'
            isShowCloseHeader={false}
          />
          <ConfirmDialog
            open={isOpenOverrideConfirmDialog}
            setOpen={setIsOpenOverrideConfirmDialog}
            showSecOption="false"
            onConfirm={handleOverrideRecording}
            onCancel={handleCancelOverrideRecording}
            title='既に録画データが存在します。​
          上書きして保存しますがよろしいですか？​​​'
            isShowCloseHeader={false}
          />
          {/* <Row className="align-items-center mb-2 mb-xl-4 pb-0 pb-xl-2">
        <Col className="mb-3 mb-lg-0"> */}
          <div className={`${browserRedirect()!=1?browserRedirect()===3?classes.tablet_view:classes.mobile_view:classes.pc_view}`}>
          <Row className="align-items-center mb-1">
            <Col className={`mb-2 mb-lg-0 ${classes.header_text_tablet}`}>
              <div className={`ml-2 text-center text-sm-left ${classes.header_row}`}>
                <h3 className=" font-18 mb-0 d-inline" id="ai_score_header" name="ai_score_header">
                  {curSection?.persona?.themeName}&nbsp;
                  {/* {select_task.persona?.themeName} */}
                </h3>
                <h3 className=" font-18 mb-0 d-inline" id="ai_score_header" name="ai_score_header">
                  {curSection?.persona?.scenarioName}&nbsp;
                </h3>
                <h3 className={`mb-0 d-block d-sm-inline d-lg-block ${browserRedirect()===3?`font-20`:`font-22`}`} id="ai_score_header" name="ai_score_header">
                  {/* {select_task.name} */}
                  {curSection?.persona?.persona}
                </h3>
              </div>
            </Col>
            <Col xl="5" lg="6" md="12" sm="12">
              <div className={`text-center text-lg-right pl-lg-1 ${classes.score_btn_gp}`}>
                {vChClickable && (
                  <>
                      <BackButton
                        title="コース一覧"
                        className={`mx-2 w-auto px-3 ${classes.keyword_adjust} ${classes.free_story_adjust} ${classes.button_shadow_tablet}`}
                        idName="link_to_scenario_selection"
                        onClick={() => {
                          const state = getLocationState();
                          if(state && state?.freeModel){
                            history.push({ pathname: `/start-new-role-play`});
                            setLocationState({ freeModel: true }, 'start-new-role-play');
                          }else{
                            history.push({ pathname: `/start-new-role-play`});
                            setLocationState(false, 'start-new-role-play');
                          }
                        }}
                      />
                      <HistoryButton
                        className={`${classes.keyword_adjust} ${classes.button_shadow_tablet}`}
                        title="リトライ"
                        idName="link_to_video_chat"
                        onClick={handleReproduceRolePlay}
                      />
                  </>
                )}
              </div>
            </Col>
          </Row>
          {/* {vShowStoryImg && (
            <div className={`mb-3 ${classes.avatar_status_box}`}>
              {vAvatar && (
                <Row className={classes.result_bannner}>
                  <div
                    className={`${classes.result_image} ${shrinkAvatar ? classes.shrink_gif_avatar_width : ''}`}
                    style={{ backgroundImage: `url(${vAvatar})` }}
                  ></div>
                  <div className={classes.result_tips}>{vAvatarText}</div>
                </Row>
              )}
            </div>
          )} */}
          <div className={classes.top_header_wrapper}>
            <p>{vSectionName}</p>
          </div>
          <div className={`cmn-bg-box ${classes.remove_radius} bg-white`}>
            <Row className={`mb-2 ${classes.charts_wrapper_tablet}`}>
              <Col md={browserRedirect()===3?`5`:`6`} className="mb-3 mb-xl-4 mb-md-3 mb-lg-3 d-flex" style={browserRedirect()===3?{marginRight:'40px'}:null}>
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
              <Col md="6" className="mb-3 mb-xl-4 mb-md-3 mb-lg-3 d-flex">
                <div
                  className={`cmn-bg-box-inr ${classes.line_chart_wrapper}`}
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
                  <CustomChart
                    f_scoreClickHandle={scoreClickHandle}
                    aiScore={vAiScore}
                    isMultiple={false}
                    is_flag={true}
                    state={getLocationState()}
                    chatID="singal_chart_wrapper"
                  ></CustomChart>
                </div>
              </Col>
            </Row>
            <div className="mb-2 mb-xl-4">
              <div className={classes.process_detail_tablet}>
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
              <Row className={`my-4 ${classes.talking_analyse_wrapper}`}>
                <Col md="6" lg={browserRedirect()===3?6:4} className="mb-4 mb-md-0">                
               
                    <div >
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
                      {
                        browserRedirect() === 2 ?
                        <Row>
                            <Col className="mx-1">
                              <ISwitch onChange={handleVOCChange} checkState={vIsAllVOCOpen} text="全てを表示する"/>
                          </Col>
                        </Row>
                        :
                        null
                      }
                    </Row>
                    {
                      browserRedirect() != 2 ?
                      <Row>
                          <Col className="mx-1">
                            <ISwitch onChange={handleVOCChange} checkState={vIsAllVOCOpen} text="全てを表示する"/>
                        </Col>
                      </Row>
                      :
                      null
                    }
                      <VOCUpdate
                        VOCUrl={VOCUrl}
                        chatID={currentChatID}
                        vocDataStatic={overallScoringData}
                        vVOCWrapperShowStatus={vVOCWrapperShowStatus}
                        setVOCWrapperShowStatus={setVOCWrapperShowStatus}
                      />
                    </div>                   
                  
                </Col>
                <Col>
                  <Row>
                    <Col id="chat_container" name="chat_container">
                      <p
                        className={`font-20 font-weight-bold mb-3 ${classes.title_border_botton}`}
                        id="chat_wrapper"
                        name="chat_wrapper"
                      >
                        {t("aiscore.utterance")}
                      </p>
                      <ChatLog
                        messages={vMessages}
                        id="chat_list"
                        selectKeyword={vSelectKeyword}
                        MsgSelectScore={vSelectScore}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
          </div>
        </>
      }
    />

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

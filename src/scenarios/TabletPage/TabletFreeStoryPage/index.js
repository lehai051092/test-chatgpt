import React, {useCallback, useEffect, useRef, useState} from 'react';
import styles from './styles.module.css'
import {Col} from 'reactstrap';
import {finishScoring, sendFreeStoryChatMsg, startChat} from '../../../request/backendApi/api';
import store from '../../../storage'
import WebCam from '../../../constituents/IWebCam/Index';
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import ConfirmDialogRecord from "../../../constituents/IConfirmDialogRecord";
import pointerLeftMobile from '../../../property/images/free_story/free_story_left.png'
import pointerRightMobile from '../../../property/images/free_story/free_story_right.png'
import {CURRENT_CHAT_INFO, IS_ROLE_PLAY_ONGOING, UPDATE_TRANSCRIPTION} from '../../../storage/consts'
import {useTranslation} from "react-i18next";
import right from '../../../property/images/free_story/right.png'

import key_word_back from '../../../property/images/free_story/key_word_back.png'
import key_word_go from '../../../property/images/free_story/key_word_go.png'
import LoadingMask from '../../../constituents/ILoadingMask';
import {useHistory, useParams} from "react-router-dom";
import ICoreFrame from '../../../constituents/ICoreFrame';
import SliderImages from '../../../constituents/IScreenRecord/ISliderImages';
import ChatApi from '../../../request/textSpeechTransitionApi/chatApi';
import {getLocationState, setLocationState} from '../../../utils/util';
import FreeStoryStartMic from '../../../property/icons/free_story_img/free_story_start_mic.svg';
import FreeStoryDefaleAvatar from '../../../property/images/free_story/free_story_defalut_avatar.png';
import IWaveformMobile from '../../../constituents/IWaveformMobile';
import IWaveformMobileGray from '../../../constituents/IWaveformMobileGray';
import timer_icon from '../../../property/images/free_story/timer.svg'
import {zeroPad} from 'react-countdown';

let timerInterval = null;
let timeArray = [];
// duration
let startTime = 0;
// duration
let stopTime = 0;

/**
 * screen record
 * @param {*}
 * @author Jmx
 * @returns dom
 */

const FreeStoryPage = () => {
  const {t} = useTranslation();
  const history = useHistory();
  let {taskID} = useParams();
  let {lessonId} = useParams();
  // web cam-video
  const [cameraOnUse, setCameraOnUse] = useState(true);
  // chatdetail
  const [chatDetail, setChatDetail] = useState({});
  const [chatText, setChatText] = useState('');
  // recorder switch [isStart, melt (3) or isRecord+Stt(2) or Stt(1) or end(0)]
  const [vIsRecordingStarted, setIsRecordingStarted] = useState([false, 0]);
  // 中断する ConfirmDialog
  const [isOpendSuspendDialog, setIsOpendSuspendDialog] = useState(false);
  // やり直す ConfirmDialog
  const [isOpendResumeDialog, setIsOpendResumeDialog] = useState(false);
  // 採点 ConfirmDialog
  const [isOpendFinishDialog, setIsOpendFinishDialog] = useState(false);
  // ask if record ConfirmDialog
  const [isAskRecordDialog, setIsAskRecordDialog] = useState(false);

  const [timer, setTimer] = useState('00:00');

  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  const [vIsVertical, setIsVertical] = useState(true);

  const [matchedKeywords, setmatchedKeywords] = useState([]);

  // waveform
  const [volume, setVolume] = useState([0]);

  /** stt ⬇ */
  const SAMPLING_RATE = 4096;
  const audioContextRef = useRef(window.AudioContext);
  const streamRef = useRef(MediaStream);
  const streamSourceRef = useRef(MediaStreamAudioSourceNode);
  const processorRef = useRef(window.AudioWorkletNode);
  const [messageId, setMessageId] = useState('');


  // Trigger immediately when the component is destroyed to prevent the socket from being destroyed
  useEffect(() => {
    return () => {
      closeConnection();
    }
  }, [])

  useEffect(() => {
    let secCount = 0;
    let hour;
    let min;
    let sec;
    if (vIsRecordingStarted[0]) {
      let timer = setInterval(() => {
        secCount += 1;
        if (secCount >= 60) {
          min = Math.floor(secCount / 60);
          sec = secCount % 60;
          if (min >= 60) {
            hour = Math.floor(min / 60);
            min = min % 60;
          }
        } else {
          sec = secCount;
        }
        setTimer(`${hour ? zeroPad(hour) + `:` : ``}${min ? zeroPad(min) : `00`}:${sec ? zeroPad(sec) : `00`}`)
      }, 1000)
      return () => {
        setTimer('00:00');
        clearInterval(timer);
      }
    }
  }, [vIsRecordingStarted])

  function startConnection() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.log("This browser does not support mic recording");
    }
    navigator.mediaDevices.getUserMedia({audio: true})
        .then((stream) => {
          streamRef.current = stream;
          audioContextRef.current = new AudioContext();
          streamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
          processorRef.current = audioContextRef.current.createScriptProcessor(SAMPLING_RATE, 1, 1);
          processorRef.current.onaudioprocess = processAudio;

          streamSourceRef.current.connect(processorRef.current);
          processorRef.current.connect(audioContextRef.current.destination);
          ChatApi.startConnection(audioContextRef.current.sampleRate);
          ChatApi.setupTranscriptionCallback(processTranscription);
        })
        .catch((error) => {
          // audioContextRef?.current?.close().then(() => {
          //     audioContextRef.current = undefined;
          // });
          console.log(`Please check whether the microphone access permission of the browser is turned on normally!`)
          console.log(error.message);
        });
  }

  const processAudio = useCallback((event) => {
    const buffer = event.inputBuffer.getChannelData(0) || new Float32Array(SAMPLING_RATE);
    let volume = Math.max.apply(Math, buffer);
    setVolume([volume]);
    const toSend = new Int16Array(buffer.length);
    for (let index = buffer.length; index >= 0;) {
      toSend[index] = 32767 * Math.min(1, buffer[index]);
      index -= 1;
    }
    ChatApi.sendStream(toSend.buffer);
  }, []);

  // deal response from google speech to text server
  const processTranscription = useCallback(
      (transcription) => {
        console.log(transcription.transcription);
        let tempTrans = store.getState().transcript_one_time;
        console.log(transcription.isFinal ? "done...." : "doing...");
        store.dispatch({type: UPDATE_TRANSCRIPTION, transcript: tempTrans + transcription.transcription})
        setChatText(transcription.transcription);
        // let params = {
        //     text: store.getState().transcript_one_time,
        //     startTime: new Date(startTime).toISOString(),
        //     endTime: new Date(startTime).toISOString()
        // }
        let startTime = new Date().toISOString();
        let endTime = new Date(startTime);
        endTime.setMilliseconds(endTime.getMilliseconds() + parseFloat(transcription?.duration).toFixed(2) * 1000)
        let params = {
          text: store.getState().transcript_one_time,
          startTime: startTime,
          endTime: endTime.toISOString()
        }
        if (chatDetail && chatDetail["chat"]) {
          sendFreeStoryChatMsg(chatDetail["chat"].id, params).then(res => {
            if (res.status === 200) {
              console.log(`Message sent: ${store.getState().transcript_one_time}`)
              setMessageId(res["data"]?.messageId);
              let t_chatDetail_processes = chatDetail["processes"];
              for (let i = 0; i < res["data"]["matchedProcessIds"].length; i++) {
                const element = res["data"]["matchedProcessIds"][i];
                for (let j = 0; j < t_chatDetail_processes.length; j++) {
                  if (t_chatDetail_processes[j]["id"] === element) {
                    t_chatDetail_processes[j]["hitFlg"] = true;
                  }
                }
              }
              let set_matchedKeywords = Array.from(new Set(res["data"]["matchedKeywords"]));
              for (let i = 0; i < set_matchedKeywords.length; i++) {
                for (let j = 0; j < t_chatDetail_processes.length; j++) {
                  for (let k = 0; k < t_chatDetail_processes[j]["keywords"].length; k++) {
                    if (set_matchedKeywords[i] === t_chatDetail_processes[j]["keywords"][k] && !t_chatDetail_processes[j]["matchedKeywords"].includes(set_matchedKeywords[i])) {
                      t_chatDetail_processes[j]["matchedKeywords"].push(set_matchedKeywords[i]);
                      t_chatDetail_processes[j]["matchedKeywordCount"]++;
                    }
                  }
                }
              }
              let t_chatDetail = chatDetail;
              t_chatDetail["processes"] = t_chatDetail_processes;
              setChatDetail(Object.assign([], t_chatDetail));
            }
            store.dispatch({type: UPDATE_TRANSCRIPTION, transcript: ''})
          })
        }
        return;
      }, [chatDetail, matchedKeywords]
  );

  const closeConnection = async () => {
    // check the permission for mic and camera
    // if (navigator.permissions) {
    //     await navigator.permissions.query(
    //         { name: 'microphone' }
    //     ).then(function (permissionStatus) {
    //         console.log(`Mic permission: ${permissionStatus.state}`)
    //         if (permissionStatus.state == 'granted') {

    //         }
    //     })
    // }
    // navigator.permission is not supported in safari
    try {
      ChatApi.endConnection();
      processorRef.current?.disconnect();
      streamSourceRef.current?.disconnect();

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = undefined;

      audioContextRef.current?.close().then(() => {
        audioContextRef.current = undefined;
        streamSourceRef.current = undefined;
        processorRef.current = undefined;
      });
    } catch (error) {
      console.log("Please check whether the microphone access permission of the browser is turned on normally");
      console.log(error);
    }
  }

  const finishScore = async () => {
    // send message (1) / not send (0)
    let res = await finishScoring(chatDetail?.chat?.id, '1');
    if (res.status === 200) {
      setLocationState({
        saveRecordDataStatus: true,
        chatId: chatDetail?.chat?.id,
        freeStoryFlag: vIsRecordingStarted[1],
        senario: getLocationState()?.senario
      }, `free-story-score/${taskID}/${lessonId}`)
      history.push({
        pathname: `/free-story-score/${taskID}/${lessonId}`,
      });
    }

  }

  /** stt ⬆ */

      // init
  const FreeStoryPageScorePointInit = async () => {
        let cur_login_user_info = store.getState().cacheMstUserInfo;
        let cur_login_user_header = store.getState().login_task_all;
        let userRole = '';
        if (cur_login_user_header["userRoles"].includes("GENERAL_USER")) {
          userRole = 'RECRUITER';
        }
        const res = await startChat(taskID, {
          "userName": cur_login_user_info["salsmanSeiKj"] ? cur_login_user_info["salsmanSeiKj"] : '',
          "userRole": userRole
        });
        if (res["status"] === 200) {
          res["data"]["processes"].forEach(item => {
            item.matchedKeywordCount = 0;
            item.matchedKeywords = [];
          });
          setChatDetail(res["data"]);
          store.dispatch({type: CURRENT_CHAT_INFO, payload: res["data"]?.chat});
        }
      }

  useEffect(() => {
    const body = document.querySelector(".main-content-inr");
    if (body) {
      body.style.minHeight = 'calc(100vh - 56px)'
    }
  }, [])

  useEffect(() => {
    document.body.style.backgroundColor = "#EFEEEA";
    if (window.orientation === 180 || window.orientation === 0) {
      setIsVertical(true);
    } else if ((window.orientation === 90 || window.orientation === -90)) {
      setIsVertical(false);
    }
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
      if (window.orientation === 180 || window.orientation === 0) {
        setIsVertical(true);
      }
      if ((window.orientation === 90 || window.orientation === -90)) {
        setIsVertical(false);
      }
    }, false);
    FreeStoryPageScorePointInit();
    return () => {
      setIsLoadingMask(false);
      store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
    }
  }, [])

  useEffect(() => {
    if (vIsRecordingStarted[0]) {
      if (vIsRecordingStarted[1] === 1) {
        // stt
        onStartHandleStt();
      }
    } else {
      if (vIsRecordingStarted[1] === 1) {
        // stt
        closeConnection();
        finishScore();
      }
    }
  }, [vIsRecordingStarted])

  // start
  const mobileFreeStoryStart = () => {
    if (!vIsRecordingStarted[0]) {
      setIsRecordingStarted([true, 1]);
      store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: true})
    }
  }

  // stt start
  const onStartHandleStt = () => {
    startConnection();
  }


  return (
      <div style={{width: '100vw'}}>
        <ICoreFrame
            onBack={() => {
              history.push({
                pathname: `/free-rate-of-risk/${taskID}/${lessonId}`
              })
            }}
            component={vIsVertical ? <>
                  {/** v- */}
                  <div className={styles.video_chat_name_context}>
                    {
                      chatDetail?.chat ?
                          <div>
                            <label>
                              <span>{`${chatDetail?.chat?.section?.persona?.themeName}`}</span>
                              <span>{`${chatDetail?.chat?.section?.persona?.scenarioName}`}</span>
                              <span>{`${chatDetail?.chat?.section?.persona?.persona}`}</span>
                            </label>
                            <label></label>
                          </div>
                          :
                          null
                    }
                  </div>
                  <div className={styles.role_play_main_area}>
                    <div className={styles.video_chat_list_title}>
                      <p className={styles.video_chat_list_first_title} id="ongoing_section"
                         name="ongoing_section">実施中のセクション</p>
                      <span className="video-chat-top-buttons">
                                <div className={styles.video_chat_btn_tips} id="long_term_care_insurance"
                                     name="long_term_care_insurance">
                                    {chatDetail?.chat?.section?.name}
                                </div>
                            </span>
                    </div>
                    <div className={styles.flex_mobile_column_reverse}>
                      <Col className={`${styles.chat_avatar_area} mb-sm-`}>
                        <div className={styles.chat_img_container}>
                          <div className="chat_img_sec mb-3">
                            <SliderImages/>
                          </div>
                        </div>
                      </Col>
                    </div>
                    {
                      !vIsRecordingStarted[0] ?
                          <div className={styles.free_story_start_btn} onClick={() => {
                            mobileFreeStoryStart()
                          }}>
                            <img src={FreeStoryStartMic} alt="mic icon"/>
                            ロープレ開始
                          </div>
                          : null
                    }
                    <FreeStoryPageScorePointMobile
                        chatDetail={chatDetail}
                        matchedKeywords={matchedKeywords}
                    />
                    <div className={styles.free_story_webcam_input_wrapper}>
                      <div
                          className={vIsRecordingStarted[0] && cameraOnUse ? styles.free_story_webcam_box : styles.free_story_webcam_box_blank}>
                        {
                          vIsRecordingStarted[0] && cameraOnUse ?
                              <WebCam setCamera={v => setCameraOnUse(v)}/>
                              :
                              <img src={FreeStoryDefaleAvatar} width={92} height={86} alt="defale_avatar"/>
                        }
                      </div>
                      <textarea value={chatText} readOnly className={styles.free_story_textarea} name="free_story_textarea"
                                id="free_story_textarea"/>
                      <div>
                        {
                          vIsRecordingStarted[0] ?
                              <IWaveformMobile value={volume} isVertical={vIsVertical} isTablet={true}/>
                              :
                              <IWaveformMobileGray isVertical={vIsVertical} isTablet={true}/>
                        }
                        <div className={styles.tablet_free_story_clock}>
                          <img src={timer_icon} alt="timer icon"/>
                          <span>{timer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${styles.free_story_bottom_btns}`}>
                    <div className={styles.free_story_bottom_btns_left}>

                      {/** やり直す */}
                      <div
                          className={`${styles.free_story_terminate_btn} ${styles.free_story_resume_btn} ${vIsRecordingStarted[0] ? styles.free_story_terminate_btn_started : styles.free_story_terminate_btn_not_start}`}
                          onClick={() => {
                            if (vIsRecordingStarted[0]) {
                              setIsOpendResumeDialog(true);
                            }
                          }}>最初からやり直す
                      </div>
                    </div>
                    {/** 採点する */}
                    <div
                        className={`${styles.free_story_chat_end_btn} ${vIsRecordingStarted[0] ? styles.free_story_chat_end_btn_started : styles.free_story_chat_end_btn_not_start}`}
                        onClick={() => {
                          if (vIsRecordingStarted[0]) {
                            setIsOpendFinishDialog(true);
                          }
                        }}>採点する
                    </div>
                  </div>
                </> :
                // landscape
                <>
                  <div className={styles.video_chat_name_context}>
                    {
                      chatDetail?.chat ?
                          <div style={{marginTop: 0}}>
                            <label>
                              <span>{`${chatDetail?.chat?.section?.persona?.themeName}`}</span>
                              <span>{`${chatDetail?.chat?.section?.persona?.scenarioName}`}</span>
                              <span>{`${chatDetail?.chat?.section?.persona?.persona}`}</span>
                            </label>
                            <label></label>
                          </div>
                          :
                          null
                    }
                  </div>
                  <div className={styles.role_play_main_area_landscape}>
                    <div className={styles.role_play_main_area_top_landscape}>
                      <div className={styles.role_play_main_area_top_left_landscape}>
                        <label className={styles.subtitle_name}>
                          実施中のセクション
                        </label>
                        <br/>
                        <label className={styles.subtitle_name_context}>
                          {chatDetail?.chat?.section?.name}
                        </label>
                        <FreeStoryPageScorePointMobile
                            chatDetail={chatDetail}
                        />
                        {
                          !vIsRecordingStarted[0] ?
                              <div className={styles.free_story_start_btn_landscape} onClick={() => {
                                mobileFreeStoryStart()
                              }}>
                                <img src={FreeStoryStartMic} alt="mic icon"/>
                                ロープレ開始
                              </div>
                              :
                              null
                        }
                      </div>
                      <div className={styles.pdf_landscape}>
                        <SliderImages/>
                      </div>
                    </div>
                    <div className={styles.role_play_main_area_bottom_landscape}>
                      <div
                          className={vIsRecordingStarted[0] && cameraOnUse ? styles.free_story_webcam_box : styles.free_story_webcam_box_blank}>
                        {
                          vIsRecordingStarted[0] && cameraOnUse ?
                              <WebCam setCamera={v => setCameraOnUse(v)}/>
                              :
                              <img src={FreeStoryDefaleAvatar} width={92} height={86} alt="defale_avatar"/>
                        }
                      </div>
                      <textarea value={chatText} readOnly className={styles.free_story_textarea_landscape}
                                name="free_story_textarea" id="free_story_textarea"/>
                      <div>
                        {
                          vIsRecordingStarted[0] ?
                              <IWaveformMobile value={volume} isVertical={vIsVertical} isTablet={true}/>
                              :
                              <IWaveformMobileGray isVertical={vIsVertical} isTablet={true}/>
                        }
                        <div className={styles.tablet_free_story_clock}>
                          <img src={timer_icon} alt="timer icon"/>
                          <span>{timer}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.free_story_bottom_btns_landscape}>
                    <div className={styles.free_story_bottom_btns_left}>
                      {/** やり直す */}
                      <div
                          className={`${styles.free_story_terminate_btn_landscape} ${vIsRecordingStarted[0] ? styles.free_story_terminate_btn_landscape_started : styles.free_story_terminate_btn_landscape_not_start}`}
                          onClick={() => {
                            if (vIsRecordingStarted[0]) {
                              setIsOpendResumeDialog(true);
                            }
                          }}>最初からやり直す
                      </div>
                    </div>
                    {/** 採点する */}
                    <div
                        className={`${styles.free_story_chat_end_btn_landscape} ${vIsRecordingStarted[0] ? styles.free_story_chat_end_btn_started : styles.free_story_chat_end_btn_not_start}`}
                        onClick={() => {
                          if (vIsRecordingStarted[0]) {
                            setIsOpendFinishDialog(true);
                          }
                        }}>採点する
                    </div>
                  </div>
                </>
            }
        />
        {/** 中断する */}
        <ConfirmDialog
            open={isOpendSuspendDialog}
            setOpen={setIsOpendSuspendDialog}
            onConfirm={() => {
              store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
              setIsRecordingStarted([false, 3]);
              setTimeout(() => {
                history.push({
                  pathname: `/free-rate-of-risk/${taskID}/${lessonId}`,
                });
              }, 0)
            }}
            title={'採点せずに前の画面に戻ります。<br/> よろしいですか？'}
        />
        {/** やり直す */}
        <ConfirmDialog
            open={isOpendResumeDialog}
            setOpen={setIsOpendResumeDialog}
            onConfirm={() => {
              store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
              window.location.reload();
            }}
            title={'採点せずに最初からやり直します。<br/> よろしいでしょうか？'}
        />

        {/** 採点 */}
        <ConfirmDialog
            open={isOpendFinishDialog}
            setOpen={setIsOpendFinishDialog}
            onConfirm={() => {
              if (chatDetail?.chat?.id) {
                setIsLoadingMask(true);
                setIsRecordingStarted([false, vIsRecordingStarted[1]]);
              }
            }}
            title={'採点を実施しますか？'}
        />
        {/** Ask if record */}
        <ConfirmDialogRecord
            open={isAskRecordDialog}
            setOpen={setIsAskRecordDialog}
            onConfirm={() => {
              // close this dialog
              setIsAskRecordDialog(false);
              // recordStart
              setIsRecordingStarted([true, 2]);
            }}
            onCancel={() => {
              // stt start
              setIsRecordingStarted([true, 1]);
            }}
            title={'ロープレを録画します。よろしいですか？'}
        />
        <LoadingMask val={vIsLoadingMask}/>
      </div>
  )
}

const FreeStoryPageScorePointMobile = ({chatDetail, matchedKeywords}) => {

  const [sectionMobileIndex, setSectionMobileIndex] = useState(0);

  const [flg, setFlg] = useState(false);

  return (
      <div className={styles.free_story_key_display}>
        {
          chatDetail.processes != null ?
              <>
                {
                  sectionMobileIndex === 0 ?
                      <img src={key_word_back} className={styles.mobile_previous}/>
                      :
                      <img src={pointerLeftMobile} onClick={() => {
                        if (sectionMobileIndex === 0) {
                          return false;
                        }
                        let t_sectionMobileIndex = sectionMobileIndex;
                        t_sectionMobileIndex--;
                        setSectionMobileIndex(t_sectionMobileIndex);
                      }} className={styles.mobile_previous}/>
                }

                <section className={styles.task_list_card} key={chatDetail.processes[sectionMobileIndex].id}>
                  {/* {
                                <img 
                                    className={styles.tag_list_flg} 
                                    src={flg?closeKeywordList:openKeywordList}
                                    onClick={()=>{
                                        setFlg(!flg);
                                    }}
                                />
                            } */}

                  <div
                      className={chatDetail.processes[sectionMobileIndex].hitFlg === true ? styles.task_list_card_selection : styles.task_list_card_unselection}>
                    {chatDetail.processes[sectionMobileIndex].hitFlg === true ? <img src={right}/> : null}
                  </div>

                  <div className={styles.task_list_card_context}>
                    <div height={50} className={styles.task_list_card_context_flex}>
                      <span
                          className={chatDetail.processes[sectionMobileIndex].hitFlg === true ? styles.card_title_select : styles.card_title_unselect}>{chatDetail.processes[sectionMobileIndex].name}</span>
                      <span
                          className={chatDetail.processes[sectionMobileIndex].hitFlg === true ? styles.card_title_select : styles.card_title_unselect}>{chatDetail.processes[sectionMobileIndex].matchedKeywordCount}/{chatDetail.processes[sectionMobileIndex].keywords.length}</span>
                    </div>
                    {/* {
                                    flg?
                                    <div className={styles.tag_wrapper}>
                                        {
                                            chatDetail.processes[sectionMobileIndex].keywords.map(n => {
                                                let c = 0;
                                                for (const index in matchedKeywords) {
                                                    if(matchedKeywords[index] === n){
                                                        c++;
                                                    }
                                                }  
                                                return <div className={c === 0?styles.tag_wrapper_tag:styles.tag_wrapper_tag_selected}>{n}</div>
                                            })
                                        }
                                    </div>
                                    :
                                    null
                                } */}
                  </div>
                </section>
                {
                  sectionMobileIndex == chatDetail.processes.length - 1 ?
                      <img src={key_word_go} className={styles.mobile_next}/>
                      :
                      <img src={pointerRightMobile} onClick={() => {
                        if (sectionMobileIndex == chatDetail.processes.length - 1) {
                          return false;
                        }
                        let t_sectionMobileIndex = sectionMobileIndex;
                        t_sectionMobileIndex++;
                        setSectionMobileIndex(t_sectionMobileIndex);
                      }} className={styles.mobile_next}/>
                }
              </>
              : null
        }

      </div>
  )
}

export default FreeStoryPage;
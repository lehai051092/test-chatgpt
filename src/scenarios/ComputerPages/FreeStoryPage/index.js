import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './styles.module.css'
import SliderImages from '../../../constituents/IScreenRecord/ISliderImages';
import FreeStoryStartBtn from "./FreeStoryStartBtn";
import FreeStoryEndBtn from "./FreeStoryEndBtn";
import FreeStoryRestart from "./FreeStoryRestart";
import BackButton from "../../../constituents/IButton/BackButton";
import {
  finishScoring,
  getLessonTask,
  getProcessToken,
  saveChat,
  sendFreeStoryChatMsg,
  startChat
} from '../../../request/backendApi/api';
import store from '../../../storage'
import WebCam from '../../../constituents/IWebCam/Index';
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import cancel from '../../../property/images/free_story/cancel.png'
import { zeroPad } from 'react-countdown';
import { useTranslation } from "react-i18next";
import right from '../../../property/images/free_story/right.png'
import free_story_page_right_interactive_camera
  from '../../../property/images/free_story/free_story_page_right_interactive_camera.svg'
import timer_icon from '../../../property/images/free_story/timer.svg'
import LoadingMask from '../../../constituents/ILoadingMask';
import { IS_ROLE_PLAY_ONGOING, UPDATE_TRANSCRIPTION } from '../../../storage/consts';
import { useHistory, useParams } from "react-router-dom";
import ICoreFrame from '../../../constituents/ICoreFrame';
import IWaveformPc from '../../../constituents/IWaveformPc';
import IWaveformPcGray from '../../../constituents/IWaveformPcGrey';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import { getLocationState, isSafari, onDownload, reloadByHash, setLocationState } from '../../../utils/util';
import { getManualUrl2 } from "../../../utils/runtime";
import ChatApi from '../../../request/textSpeechTransitionApi/chatApi';
import {
  lessonTaskAll,
  selectTask,
  updateAllSectionId,
  updateRolePlayingSavedDuringProcess
} from "../../../storage/reduxActions";
import ConfirmDialogReRolePlay from "../../../constituents/IConfirmDialogReRolePlay";
import { Col } from "reactstrap";

let timerInterval = null;
let timeArray = [];

/**
 * screen record
 * @param {*}
 * @author Jmx
 * @returns dom
 */

const FreeStoryPage = () => {
  const { t } = useTranslation();
  const history = useHistory();
  let { taskID } = useParams();
  let { lessonId } = useParams();
  // web cam-video
  const [cameraOnUse, setCameraOnUse] = useState(true);
  // chatdetail
  const [chatDetail, setChatDetail] = useState(null);
  // recorder switch [isStart, melt (3) or isRecord+Stt(2) or Stt(1) or end(0)]
  const [vIsRecordingStarted, setIsRecordingStarted] = useState([false, 0]);
  // 中断する ConfirmDialog
  const [isOpendSuspendDialog, setIsOpendSuspendDialog] = useState(false);
  // やり直す ConfirmDialog
  const [isOpendResumeDialog, setIsOpendResumeDialog] = useState(false);
  // 採点 ConfirmDialog
  const [isOpendFinishDialog, setIsOpendFinishDialog] = useState(false);
  // ask if record ConfirmDialog
  // const [isAskRecordDialog, setIsAskRecordDialog] = useState(false);
  // resume flg
  const [resumeFlg, setResumeFlg] = useState(false);
  // waveform
  const [volume, setVolume] = useState([0]);
  //textarea
  const [transcription, setTranscription] = useState('');
  
  const [timer, setTimer] = useState('00:00');
  
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  
  const [microphonePermissionm, setMicrophonePermission] = useState(false);
  
  const [vProcessToken, setProcessToken] = useState();
  
  const [isConfirmDialog, setIsConfirmDialog] = useState(false)
  const hasRolePlayingData = store.getState().rolePlayingSavedDuringProcess
  const [checkedReDialog, setCheckedReDialog] = useState(false);
  
  /** stt ⬇ */
  const SAMPLING_RATE = 4096;
  const audioContextRef = useRef(window.AudioContext);
  const streamRef = useRef(MediaStream);
  const streamSourceRef = useRef(MediaStreamAudioSourceNode);
  const processorRef = useRef(window.AudioWorkletNode);
  
  function startConnection() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.log("This browser does not support mic recording");
    }
    navigator.mediaDevices.getUserMedia({ audio: true })
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
    const toSend = new Int16Array(buffer.length);
    let v = Math.max.apply(Math, buffer);
    setVolume([v]);
    for (let index = buffer.length; index >= 0;) {
      toSend[index] = 32767 * Math.min(1, buffer[index]);
      index -= 1;
    }
    ChatApi.sendStream(toSend.buffer);
  }, []);
  
  // deal response from google speech to text server
  const processTranscription = useCallback(
    (transcription) => {
      setTranscription(transcription.transcription);
      let tempTrans = store.getState().transcript_one_time;
      console.log(transcription.isFinal ? "done...." : "doing...");
      store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: tempTrans + transcription.transcription })
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
          store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: '' })
        })
      }
      return;
    }, [chatDetail]
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
      for (let index = 0; index < 25; index++) {
        setVolume([new Array(20).fill[0]]);
      }
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
        freeStoryFlag: vIsRecordingStarted[1]
      }, `free-story-score/${taskID}/${lessonId}`)
      history.push({
        pathname: `/free-story-score/${taskID}/${lessonId}`
      });
    }
    
  }
  
  /** stt ⬆ */
  
  useEffect(() => {
    FreeStoryPageScorePointInit();
    return () => {
      setIsLoadingMask(false);
      setIsRecordingStarted([false, 3]);
      closeConnection();
      store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
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
  
  // stt start
  const onStartHandleStt = () => {
    startConnection();
  }
  
  const initTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    setTimer('00:00');
    timeArray = [0, 0];
    timerInterval = setInterval(() => {
      let minuteOffset = timeArray[0];
      let secondOffset = timeArray[1];
      secondOffset = parseInt(timeArray[1]) + 1;
      
      // In order to avoid the strange appearance of "0:60", it is processed
      if (secondOffset === 60) {
        secondOffset = secondOffset - 60;
        minuteOffset = timeArray[0] + 1;
      }
      timeArray = [minuteOffset, secondOffset];
      setTimer(`${zeroPad(minuteOffset)}:${zeroPad(secondOffset)}`);
    }, 1000);
  }
  
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
        item["matchedKeywordCount"] = 0;
        item["matchedKeywords"] = [];
      });
      setChatDetail(res["data"]);
    }
  }
  
  const FreeStoryPageFinish = async () => {
    if (chatDetail?.chat?.id) {
      setIsRecordingStarted([false, vIsRecordingStarted[1]]);
      clearInterval(timerInterval);
    }
  }
  
  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };
  
  const downloadFile = async (val, name) => {
    setIsLoadingMask(true);
    onDownload(val + "?" + vProcessToken, name, () => {
      setIsLoadingMask(false);
    });
  }
  
  const xhrequest = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      callback(this);
    };
    xhr.send();
  }
  
  useEffect(() => {
    GetProcessToken()
  }, []);
  
  document.onkeydown = function (event) {
    event.preventDefault();
  }
  
  return (
    <div className="role_play_main_area_wrap">
      <ICoreFrame
        onBack={() => {
          history.push({
            pathname: `/free-rate-of-risk/${taskID}/${lessonId}`
          })
        }}
        component={<div className={styles.free_story_page}>
          <div className={styles.free_story_page_container}>
            <div className={styles.free_story_header}>
              <div className={styles.video_chat_name_context}>
                <BackButton
                  title={"戻る"}
                  className={styles.free_story_return}
                  onClick={() => {
                    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
                    setIsRecordingStarted([false, 3]);
                    setTimeout(() => {
                      history.push({
                        pathname: `/free-rate-of-risk/${taskID}/${lessonId}`
                      })
                    }, 0)
                  }}
                  idName="back_evaluation_page"
                />
                <div className={styles.persona_font}>
                  <label>
                    {chatDetail?.chat?.section?.persona?.persona}
                  </label>
                </div>
              
              </div>
              <div className={styles.task_list_title_div}>
                <span className={styles.task_list_title_sub}>実施中のセクション</span>
                <span id="task_list_title_sub"
                      className={styles.task_list_title}>{chatDetail?.chat?.section?.name}</span>
              </div>
              <FreeStoryPageScorePoint taskID={taskID} chatDetail={chatDetail}/>
            </div>
            <div id={"record-screen"} className={styles.free_story_page_right}>
              {/** controlled by setIsRecordingStarted  */}
              {/* <IScreenRecord
                                setIsRecordingStop={() => {
                                    setIsRecordingStarted([false, 0]);
                                    // clear timer
                                    clearInterval(timerInterval);
                                    setTimer('00:00');
                                    timeArray = [0, 0];
                                }}
                                setChatDetail={setChatDetail}
                                processTag={vIsRecordingStarted}
                                chatDetail={chatDetail}
                                resumeFlg={resumeFlg}
                                setMicrophonePermission={()=>{
                                    setMicrophonePermission(true);
                                }}
                                setVolume={setVolume}
                                setTranscription={setTranscription}

                            /> */}
              <div id="element-to-record" style={{ width: '58vw' }}>
                <SliderImages/>
              </div>
              <div className={styles.free_story_wave_and_clock}>
                {vIsRecordingStarted[0] ?
                  <IWaveformPc value={volume}/>
                  :
                  <IWaveformPcGray/>
                }
                <div className={styles.free_story_clock}>
                  <img src={timer_icon}/>
                  <span>{timer}</span>
                </div>
              </div>
              <div className={styles.free_story_textarea_and_camera}>
                    <textarea className={styles.free_story_textarea} value={transcription} readOnly
                              name="free_story_textarea" id="free_story_textarea"/>
                <div className={
                  vIsRecordingStarted[0] && cameraOnUse
                    ? "chat_people_box"
                    : "chat_people_box_blank"}
                >
                  {
                    vIsRecordingStarted[0] && cameraOnUse ?
                      <WebCam setCamera={v => setCameraOnUse(v)}/>
                      :
                      <img src={free_story_page_right_interactive_camera}/>
                  }
                </div>
              </div>
            
            
            </div>
          </div>
        
        </div>
        }
      />
      <div className="video-chat-footer-buttons">
        <div className="video-chat-bottom-left-btn">
          <div
            className={styles.free_storyleft_bottom_item}
          >
            {/** 最初からやり直す */}
            <FreeStoryRestart
              processTag={vIsRecordingStarted[0]}
              onClick={() => {
                if (vIsRecordingStarted[0]) {
                  setIsOpendResumeDialog(true);
                }
              }}
            />
          </div>
        </div>
        <div
          className="video-chat-bottom-middle-btn"
        >
          {/** ロープレ開始 */}
          <FreeStoryStartBtn
            processTag={vIsRecordingStarted[0]}
            onClick={() => {
              if (hasRolePlayingData && !checkedReDialog) {
                setIsConfirmDialog(true)
                return
              }
              if (!vIsRecordingStarted[0]) {
                // setIsAskRecordDialog(true)
                isSafari(
                  () => {
                    // timer
                    initTimer();
                    // stt start
                    setIsRecordingStarted([true, 1]);
                    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: true })
                  },
                  () => {
                    setMicrophonePermission(true)
                  }
                );
              }
            }}
          />
        </div>
        <div>
          {/** 採点する */}
          <FreeStoryEndBtn
            processTag={vIsRecordingStarted[0]}
            onClick={() => {
              if (vIsRecordingStarted[0]) {
                setIsOpendFinishDialog(true);
              }
            }}
          />
        </div>
      </div>
      <ConfirmDialogReRolePlay
        open={isConfirmDialog}
        setOpen={setIsConfirmDialog}
        showSecOption="true"
        firstTitle="途中保存ロープレを再開"
        secondTitle="新規ロープレを開始"
        thirdTitle="閉じる"
        onConfirm={async () => {
          setIsConfirmDialog(false)
          const state = getLocationState();
          if (hasRolePlayingData.record?.isSelectAllModel === '1') {
            const lessonTasksRes = await getLessonTask(`lessons/${hasRolePlayingData.personaId}/tasks`)
            let taskSort = lessonTasksRes.data.sort(
              (a, b) => a.displayNumber - b.displayNumber
            );
            store.dispatch(lessonTaskAll(taskSort))
            store.dispatch(selectTask(taskSort))
            store.dispatch(updateAllSectionId(hasRolePlayingData.record?.commitId))
            setLocationState({
              select_task: state,
              pname: 'multiple-scenarios'
            }, `video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`);
          }
          const path = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}`
          const multiPath = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`
          await history.push({
            pathname: hasRolePlayingData.record?.isSelectAllModel === '1' ? multiPath : path,
            state: {
              isReRolePlaying: true,
              isReRolePlayingMultiScenariosDuringProcess: hasRolePlayingData.record?.isSelectAllModel === '1'
            }
          })
        }}
        onRollBack={async () => {
          setCheckedReDialog(true)
          setIsConfirmDialog(false)
          if (hasRolePlayingData && hasRolePlayingData.record) {
            store.dispatch(updateRolePlayingSavedDuringProcess(null))
            await saveChat(hasRolePlayingData.record.id, false, '')
          }
          if (!vIsRecordingStarted[0]) {
            // setIsAskRecordDialog(true)
            isSafari(
              () => {
                // timer
                initTimer();
                // stt start
                setIsRecordingStarted([true, 1]);
                store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: true })
              },
              () => {
                setMicrophonePermission(true)
              }
            );
          }
        }}
        title='ロープレの途中保存データがあります。
                        <br><br>新規ロープレを開始すると、<br>途中保存データが削除されます。'
      />
      {/** 中断する */}
      <ConfirmDialog
        open={isOpendSuspendDialog}
        setOpen={setIsOpendSuspendDialog}
        onConfirm={() => {
          setIsRecordingStarted([false, 3]);
          store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
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
          store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
          reloadByHash()
        }}
        title={'採点せずに最初からやり直します。<br/> よろしいでしょうか？'}
      />
      {/** 採点 */}
      <ConfirmDialog
        open={isOpendFinishDialog}
        setOpen={setIsOpendFinishDialog}
        onConfirm={() => {
          setIsLoadingMask(true);
          FreeStoryPageFinish();
        }}
        title={'採点を実施しますか？'}
      />
      <Modal
        open={microphonePermissionm}
        onClose={() => {
          setMicrophonePermission(false)
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          {/*  - material ui style -  */}
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '500px !important',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            borderRadius: 10,
            boxShadow: 24,
            p: 4,
          }}>
            <img
              src={cancel}
              alt="Cancel"
              className={`${styles.cancel}`}
              onClick={() => {
                setMicrophonePermission(false)
              }}
            />
            <label className={styles.microphone_permissionm_font}>
              端末またはブラウザの音声入力がオフになっているため発話された音声が認識されません。
            </label>
            <div className={styles.microphone_permissionm_control}>
              <button className={styles.microphone_permissionm_button} onClick={() => {
                navigator.mediaDevices.getUserMedia({ audio: true })
                  .then(function (stream) {
                    stream.stop();
                    setMicrophonePermission(false);
                  })
                  .catch(function (err) {
                    console.log('No mic for you!')
                  });
              }}>
                <div style={{ marginLeft: 20 }}>
                  <p align="left">ブラウザの音声入力</p>
                  <p align="left">をオンにする</p>
                </div>
              </button>
            </div>
            <div className={styles.microphone_permissionm_bottom}>
              ボタンをクリックしても反応しない場合はブラウザの音声入力をご確認ください。
              <br/>
              ブラウザの音声入力がオンの場合でも音声認識しない場合は、端末の音声入力をご確認ください。
            </div>
            <div
              className={styles.microphone_permissionm_bottom_link}
              onClick={() => {
                downloadFile(getManualUrl2(), '端末・ブラウザの音声入力をオンにする方法_V1.1.pdf')
              }}
            >
              端末・ブラウザの音声入力をオンにする方法
            </div>
          </Box>
        </div>
      </Modal>
      <LoadingMask val={vIsLoadingMask}/>
    </div>
  )
}


const FreeStoryPageScorePoint = ({ chatDetail }) => {
  
  return (
    <div className={styles.task_list}>
      {
        chatDetail?.["processes"].map((item) => {
          return <section className={styles.task_list_card} key={item.id}>
            <div
              className={item["hitFlg"] === true ? styles.task_list_card_selection : styles.task_list_card_unselection}>
              {item["hitFlg"] === true ? <img src={right}/> : null}
            </div>
            <div className={styles.task_list_card_context} onClick={(e) => {
            }}>
                <span
                  className={item["hitFlg"] === true ? styles.card_title_select : styles.card_title_unselect}>{item.name}</span>
              <span>{item["matchedKeywordCount"]}/{item.keywords.length}</span>
            </div>
          </section>
        })
      }
    </div>
  )
}
export default FreeStoryPage;

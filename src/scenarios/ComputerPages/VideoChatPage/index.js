import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import { useHistory, useLocation, useParams } from "react-router-dom";
import Countdown, { zeroPad } from 'react-countdown';

import HistoryButton from "../../../constituents/IButton/HistoryButton"
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import ConfirmDialogReRolePlay from "../../../constituents/IConfirmDialogReRolePlay";
import styles from './styles.module.css'
import './styles.css';
import WebCam from '../../../constituents/IWebCam/Index';
import ChatApi from "../../../request/textSpeechTransitionApi/chatApi";
import {
  deleteScoring,
  finishScoring,
  getChatIdListByCommitIdForMultipleSection,
  getChatMatchWords,
  getChatScriptLines,
  getCheckSavedChat,
  getLessonList,
  getLessonTask,
  getProcessToken,
  postTexhToSpeech,
  reStartChat,
  saveChat,
  saveScriptLine,
  startChat,
  upArrow
} from '../../../request/backendApi/api';
import {
  CONDUCT_ALL_SECTION_ID,
  CURRENT_CHAT_INFO,
  CURRENT_CHOSED_PERSONA,
  CURRENT_SECTION_COUNT_DOWN,
  IS_ROLE_PLAY_ONGOING
} from '../../../storage/consts';
import store from '../../../storage'
import ShowBut from './ShowBut'
import { getSpeakerId } from '../../../utils/personaImageMapping';
import SliderImages from '../../../constituents/IScreenRecord/ISliderImages'
import KeywordList from './KeywordsList'
import TalkScript from './TalkScriptModal'
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import { getLocationState, isSafari, onDownload, reloadByHash, setLocationState } from '../../../utils/util';
import { getManualUrl2 } from "../../../utils/runtime";
import LoadingMask from '../../../constituents/ILoadingMask';
import cancel from '../../../property/images/free_story/cancel.png'
import rolePlayBtnMicphone from '../../../property/icons/role-play-btn-micphone.png';
import closeRolePlayBtnGrayArrow from '../../../property/icons/close-role-play-btn-gray-arrow.svg';
import closeRolePlayBtnOrangeArrow from '../../../property/icons/close-role-play-btn-orange-arrow.svg';
import nextRolePlayBtnBlueArrow from '../../../property/icons/next-role-play-btn-blue-arrow.svg';
import humanAvatar from '../../../property/icons/human-avatar.png';
import FreeStoryResume from '../FreeStoryPage/FreeStoryResume';
import IWaveformPc from '../../../constituents/IWaveformPc';
import IWaveformPcGrey from '../../../constituents/IWaveformPcGrey';
import getGifImage from '../../../utils/newMapFIle';
import FreeStoryStopBtn from "../FreeStoryPage/FreeStoryStopBtn";
import {
  lessonTaskAll,
  selectTask,
  updateAllSectionId,
  updateRestartText,
  updateRolePlayingSavedDuringProcess,
  updateTalkScriptDialog,
  updateTalkScriptDialogPosition,
  updateTempRolePlaying
} from "../../../storage/reduxActions";
import ShowButTalkScript from "./ShowButTalkScript";
import TalkScriptMoveDialog from "./TalkScriptMoveDialog";
import { connect } from "react-redux";

// record STT first trigger time
var vMsgStartTime = '';
// voice duration that STT detects
var vSTTDuration = 0;
// stt text
let tempTrans = '';

let timeoutId = '';

const VideoChatPage = ({ talkScriptDialogOpen }) => {
  const location = useLocation();
  const { t } = useTranslation();
  
  let lastId = 0;
  const autoId = (prefix = 'video-chat-') => {
    lastId++;
    return `${prefix}${lastId}`;
  }
  let { taskID } = useParams();
  let { lessonId } = useParams();
  const history = useHistory();
  const [vChatMsg, setChatMsg] = useState('');
  const [vRecording, setRecording] = useState(false);
  const [isCameraOnUse, setIsCameraOnUse] = useState(true);
  const [vSetSendFocus, setSendFocus] = useState(true);
  const [vSetDelFocus, setDelFocus] = useState(false);
  const [vSetVideoFocus, setVideoFocus] = useState(false);
  const [vIsplayed, setIsplayed] = useState(false);
  const [vTask, setTask] = useState(null);
  const [speakerId, setSpeakerId] = useState('');
  const [vProcesses, setProcesses] = useState([]);
  const [chatPerson, setChatPerson] = useState();
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isOpenMutiConfirmDialog, setIsOpenMultiConfirmDialog] = useState(false);
  const countdownRef = useRef();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  
  const [vCountdownTime, setCountdownTime] = useState(Date.now());
  const [curPersona, setCurPersona] = useState(1);
  const [name, setName] = useState(false);
  const [isOpenSuspendDialog, setIsOpenSuspendDialog] = useState(false);
  const [isOpenStartOverDialog, setIsOpenStartOverDialog] = useState(false);
  const [countDownTimeSpan, setCountDownTimeSpan] = useState('');
  const [taskIdFromPath, setTaskIdFromPath] = useState(taskID);
  const [currentTime, setCurrentTime] = useState("00 : 00");
  const [overallScoring, setOverallScoring] = useState(false);
  const [vTextAreaInput, setTextAreaInput] = useState(false);
  // for control button click，when it is blank, clicking is not allowed
  const [vReflectClickIsDisable, setReflectClickIsDisable] = useState(true);
  // whether STT is used
  const [sttOpened, setSttOpened] = useState(false);
  // whether start chat api is completed
  const [isChatInitial, setIsChatInitial] = useState(false);
  
  // talk script
  const [vTalkScript, setTalkScript] = useState(false);
  const [vTalkScriptList, setTalkScriptList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [microphonePermissionm, setMicrophonePermission] = useState(false);
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  // waveform
  const [volume, setVolume] = useState([0]);
  const [inputEdit, setInputEdit] = useState(true);
  const [talkScriptKey, setTalkScriptKey] = useState([]);
  const [avatarKey, setAvatarKey] = useState(null)
  const [delChatMsg, setDelChatMsg] = useState('');
  const [vProcessToken, setProcessToken] = useState();
  const textareaRef = useRef(null);
  const hasRolePlayingData = store.getState().rolePlayingSavedDuringProcess
  const [checkedReDialog, setCheckedReDialog] = useState(false);
  const [localIsReRolePlaying, setLocalIsReRolePlaying] = useState(false);
  const [localReRolePlayingMultiScenariosDuringProcess, setLocalReRolePlayingMultiScenariosDuringProcess] = useState(false);
  const isReRolePlaying = useMemo(() => {
    return location.state?.isReRolePlaying || localIsReRolePlaying
  }, [location.state?.isReRolePlaying, localIsReRolePlaying]);
  const isReRolePlayingMultiScenariosDuringProcess = useMemo(() => {
    return location.state?.isReRolePlayingMultiScenariosDuringProcess || localReRolePlayingMultiScenariosDuringProcess
  }, [location.state?.isReRolePlayingMultiScenariosDuringProcess, localReRolePlayingMultiScenariosDuringProcess]);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false)
  const [vIsRecordingSave, setIsRecordingSave] = useState(false);
  const [dialogTalkScripts, setDialogTalkScripts] = useState([]);
  const [inFocus, setInFocus] = useState(false);

  const getGif = async (avatarkey, emotionKey = null) => {
    if (!avatarkey) {
      return false;
    }
    let img = await getGifImage(avatarkey, emotionKey)
    setChatPerson(img)
  }
  
  // Trigger immediately when the component is destroyed to prevent the socket from being destroyed
  useEffect(() => {
    return () => {
      closeConnection();
      document.onkeydown = null;
    }
  }, [])
  
  
  useEffect(() => {
    // if not first one in multiple mode, for starting over, start role-play automatically
    if (isMultiMode() && !isMultiModetheFirst() && !isReRolePlaying) {
      startRolePlay();
    }
    
    return () => {
      closeConnection();
      clearTimeout(timeoutId);
    }
  }, [vTask])
  
  useEffect(() => {
    let pathname = location.pathname.split('/');
    // cache lessonId in local
    setTaskIdFromPath(pathname[2]);
  }, [location.pathname])
  
  useEffect(async () => {
    const res = await getCheckSavedChat()
    store.dispatch(updateRolePlayingSavedDuringProcess(res && res.data ? res.data : null))
    await GetTask();
  }, [location.pathname]);
  
  useEffect(() => {
    if (avatarKey) {
      getGif(avatarKey, 'videoHead')
      setSpeakerId(getSpeakerId(avatarKey));
    }
  }, [store.getState().currentChosedPersona])
  
  useEffect(() => {
    // reset the count down in store
    if (isMultiModetheFirst()) {
      store.dispatch({ type: CURRENT_SECTION_COUNT_DOWN, time: '' })
    }
    // in case redirecting from history page and will cause error if no lessonId in score page
    if (!store.getState().currentChosedPersona?.id || store.getState().currentChosedPersona.id != lessonId) {
      getLessonList("/lessons").then((res) => {
        if (res.data) {
          let currentPerson = res.data.find(item => item.id == lessonId);
          store.dispatch({ type: CURRENT_CHOSED_PERSONA, persona: currentPerson })
        }
      })
    }
  }, []);
  
  
  function isMultiModetheFirstNoPath() {
    const state = getLocationState();
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      let index = allTask.findIndex(a => a.id == taskIdFromPath);
      
      return index == 0 && state && state.pname == 'multiple-scenarios' && location.pathname.includes('multiple-scenarios')
    } else {
      // TODO exception?
      return false;
    }
  }
  
  function isMultiModetheFirst() {
    const state = getLocationState();
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      let index = allTask.findIndex(a => a.id == taskID);
      
      return index == 0 && state && state.pname == 'multiple-scenarios' && location.pathname.includes('multiple-scenarios')
    } else {
      // TODO exception?
      return false;
    }
  }
  
  function isMultiMode() {
    const state = getLocationState();
    return state && state.pname == 'multiple-scenarios' && location.pathname.includes('multiple-scenarios')
  }
  
  function isSingleMode() {
    return !location.pathname.includes('multiple-scenarios');
  }
  
  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    let minuteOffset = '';
    let secondOffset = '';
    if (store.getState().current_section_count_down && '' != store.getState().current_section_count_down) {
      let time = store.getState().current_section_count_down.split(':');
      if ((parseInt(time[1]) + seconds) > 60) {
        secondOffset = parseInt(time[1]) + seconds - 60;
        minuteOffset = parseInt(time[0]) + minutes + 1;
      } else {
        secondOffset = parseInt(time[1]) + seconds;
        minuteOffset = parseInt(time[0]) + minutes;
      }
    } else {
      secondOffset = seconds;
      minuteOffset = minutes;
    }
    // In order to avoid the strange appearance of "0:60", it is processed
    if (secondOffset === 60) {
      secondOffset = secondOffset - 60;
      minuteOffset = minuteOffset + 1;
    }
    
    window.onbeforeunload = function () {
      if (currentTime != "00 : 00") {
        store.dispatch({ type: CURRENT_SECTION_COUNT_DOWN, time: currentTime });
      }
    };
    
    setCountDownTimeSpan(`${zeroPad(minuteOffset)} : ${zeroPad(secondOffset)}`);
    return (<>
          <span type="text" className="time_text_box" id="time"
                name="time">{`${zeroPad(minuteOffset)} : ${zeroPad(secondOffset)}`}</span>
    </>)
  }
  
  const startCountdown = (e) => {
    countdownRef.current?.start();
  }
  
  const pauseCountdown = (e) => {
    countdownRef.current?.pause();
  }
  
  const onCompleteCountdown = () => {
    setCountdownTime(Date.now());
  }
  
  const onChatMsgType = (e) => {
    
    let text = e.target.value.replace(/([\s\u3000]*|[\r\n\u3000]*)/ig, '');
    if (text.length > 0) {
      setReflectClickIsDisable(false);
    } else {
      setReflectClickIsDisable(true);
    }
    setChatMsg(e.target.value);
    tempTrans = e.target.value;
    //setDelChatMsg('input')
    if (e.target.value.length > 0) {
      setVideoFocus(false);
      // setSendFocus(false);
      // setDelFocus(false);
      setTextAreaInput(true);
    } else {
      setVideoFocus(true);
    }
  }
  
  const SAMPLING_RATE = 4096;
  const audioContextRef = useRef(window.AudioContext);
  const streamRef = useRef(MediaStream);
  const streamSourceRef = useRef(MediaStreamAudioSourceNode);
  const processorRef = useRef(window.AudioWorkletNode);
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
    // if to enable google stt
    // ChatApi.sendData(toSend.buffer, new Date().toISOString());
  }, []);
  
  
  function startConnection() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setDelChatMsg('stt')
        setInputEdit(false);
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
        setDelChatMsg('input')
        setInputEdit(false);
      });
  }
  
  function closeConnection() {
    // check the permission for mic and camera
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then(function (permissionStatus) {
        if (permissionStatus.state == 'granted') {
          try {
            setVideoFocus(true);
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
            console.log(error);
          }
        }
      })
    }
  }
  
  // deal response from google speech to text server
  const processTranscription = useCallback((transcription) => {
    // use Azure STT
    tempTrans += transcription.transcription;
    vSTTDuration = parseFloat(vSTTDuration) + parseFloat(transcription?.duration);
    setChatMsg(tempTrans);
    store.dispatch(updateRestartText(tempTrans))
  }, []);
  
  const dealIconShow = () => {
    // indicate whether stream was opened
    setSttOpened(true);
    // start recording
    setRecording(true);
    setVideoFocus(false)
    // setSendFocus(true);
    // setDelFocus(false);
    startConnection();
    setTextAreaInput(false);
    setReflectClickIsDisable(false);
  }
  
  // if input by micphone
  const dealIconHide = () => {
    setReflectClickIsDisable(true);
    store.dispatch(updateTempRolePlaying(vTask?.chat))
    store.dispatch(updateRolePlayingSavedDuringProcess(
      {
        personaId: lessonId,
        sectionId: taskID,
        record: vTask.chat
      }
    ))
    store.dispatch(updateRestartText(''))
    if (delChatMsg === 'stt') {
      // indicate whether stream was closed
      setSttOpened(false);
      // stop recording
      playAct('byMicphone');
    } else {
      if (vTask) {
        playAct();
      }
    }
    if (vTask.chat?.id && vTalkScriptList[currentIndex]?.id) {
      saveScriptLine(vTask.chat?.id, vTalkScriptList[currentIndex].id)
    }
  }
  
  const dealCancel = () => {
    // cancel recording
    setChatMsg('');
    tempTrans = '';
    setRecording(false);
    // closeConnection();
    vSTTDuration = 0;
    // indicate whether stream was closed
    // setSttOpened(false);
  }
  
  // main initial function
  const GetTask = async () => {
    const state = getLocationState();
    tempTrans = '';
    let cur_login_user_info = store.getState().cacheMstUserInfo;
    let cur_login_user_header = store.getState().login_task_all;
    let mstDBUserName = cur_login_user_header?.userId?.value ? cur_login_user_header.userId?.value : '';
    let userRole = '';
    if (cur_login_user_info.salsmanSeiKj) {
      mstDBUserName = cur_login_user_info.salsmanSeiKj + cur_login_user_info.salsmanMeiKj;
    }
    
    if (cur_login_user_header.userRoles?.includes("GENERAL_USER")) {
      userRole = 'RECRUITER';
    }
    
    let isSelectAllModel = '';
    let params = {
      userName: mstDBUserName, userRole: userRole, isSelectAllModel: isSelectAllModel,
    }
    if (state && state.pname == 'multiple-scenarios' && location.pathname.includes('multiple-scenarios') && store.getState().select_task.length > 0) {
      // if multiple scenarios
      params.isSelectAllModel = '1';
    } else {
      delete params["isSelectAllModel"];
    }
    
    let response;
    const savedChat = store.getState().rolePlayingSavedDuringProcess
    const restartChatFlg = savedChat && isReRolePlaying && savedChat.sectionId.toString() === taskID && savedChat.personaId.toString() === lessonId
    if (restartChatFlg) {
      response = await reStartChat(savedChat.sectionId, savedChat.record.id);
      if (response && response.data && response.data.restartText) {
        setChatMsg(response.data.restartText)
        tempTrans = response.data.restartText
        store.dispatch(updateRestartText(response.data.restartText))
      }
      if (response && response.data && response.data.incomingMessages && response.data.incomingMessages.length === 1) {
        const replyTtsText = vTask.incomingMessages[0].ttsText ?? '';
        GetAudio(null, replyTtsText !== '' ? replyTtsText : vTask.incomingMessages[0].text, true);
      }
    } else {
      if (state && state.pname == 'multiple-scenarios' && store.getState().select_task.length > 1) {
        if (taskID && isMultiModetheFirst()) {
          // if for multiple first time
          response = await startChat(taskID, params);
          store.dispatch({ type: CONDUCT_ALL_SECTION_ID, id: response?.data?.chat?.commitId })
        } else {
          params.isSelectAllModel = '1';
          params.commitId = store.getState().conduct_all_section_id;
          response = await startChat(taskID, params);
        }
      } else {
        // if for single
        if (taskID) {
          response = await startChat(taskID, params);
        }
      }
    }
    dialogOpenCloseHandler(false)
    store.dispatch(updateTalkScriptDialogPosition(null
    ))
    await getChatScriptLines(response.data.chat.id).then((res) => {
      if (res && res.data) {
        setDialogTalkScripts(res.data)
      }
    })
    
    setAvatarKey(response.data.chat.section.persona.avatar)
    setSpeakerId(getSpeakerId(response.data.chat.section.persona.avatar));
    getGif(response.data.chat.section.persona.avatar, 'videoHead')
    
    setName(response.data.chat.section.persona.name);
    setTask(response.data);
    store.dispatch(updateTempRolePlaying(response.data.chat))
    // for delete record if leaving ongoing role play
    store.dispatch({ type: CURRENT_CHAT_INFO, payload: response?.data?.chat });
    buildProcesses(response.data.processes);
    buildTalkScriptKeywords(response.data.processes);
    
    // set chat status as initializtion completed
    setIsChatInitial(true);
    // set talk Script
    setCurrentIndex(0);
    setTalkScriptList(response.data?.scriptLines ?? []);
    
    if (response.data && response.data.chat) {
      const wordsRes = await getChatMatchWords(response.data.chat.id)
      checkKeywordMatching(wordsRes.data, response.data.processes)
    }
  }
  
  // get keywords to talk script
  const buildTalkScriptKeywords = (list) => {
    let array = [];
    if (list instanceof Array) {
      list.forEach(item => {
        item.keywords instanceof Array && array.push(...item.keywords);
      })
    }
    if (array.length > 0) {
      array.sort((key1, key2) => {
        return key2.length - key1.length;
      })
    }
    setTalkScriptKey(array);
  }
  
  // to send message
  const playAct = async (origin) => {
    let params = {
      text: vChatMsg,
    }
    
    if ('byMicphone' == origin) {
      // from micphone
      if (vSTTDuration != 0) {
        params.startTime = new Date().toISOString();
        
        let endTime = new Date(params.startTime);
        // endTime.setSeconds(endTime.getSeconds() + parseInt(vSTTDuration));
        endTime.setMilliseconds(endTime.getMilliseconds() + parseFloat(vSTTDuration).toFixed(2) * 1000)
        params.endTime = endTime.toISOString();
      }
    }
    // reset start time when message sent
    vMsgStartTime = '';
    
    const response = await upArrow(vTask.chat.id, params);
    
    setVideoFocus(true);
    setChatMsg('');
    //setInputEdit(true);
    vSTTDuration = 0;
    //tempTrans = ''
    checkKeywordMatching(response.data.message.matchedWords, vProcesses);
    
    // はい for nod,
    // いいえ for shaking head,
    // 悩む for thinking or wondering,
    // クチパク for starting to speak,
    // オーバーアクション for jumping up and celebrating
    switch (response?.data?.replies[0]?.personaAction) {
      case 'クチパク':
        getGif(avatarKey, 'Talking')
        break;
      case 'くちぱく':
        getGif(avatarKey, 'Talking')
        break;
      case 'はい':
        getGif(avatarKey, 'Nod')
        // setCh
        break;
      case 'いいえ':
        getGif(avatarKey, 'Shake')
        break;
      case '悩む':
        getGif(avatarKey, 'Worry')
        break;
      case '疑問':
        getGif(avatarKey, 'Wonder')
        break;
      case '喜び':
        getGif(avatarKey, 'Pleasure')
        break;
      case '不満':
        getGif(avatarKey, 'Complaint')
        break;
      case '安心':
        getGif(avatarKey, 'Relief')
        break;
      default:
        break;
    }

    const replyTtsText = response.data.replies[0].ttsText ?? '';
    await GetAudio(null, replyTtsText !== '' ? replyTtsText : response.data.replies[0].text, true);
  }
  
  
  // get audio stream and play
  const GetAudio = async (id, value, continueFlg) => {
    if (value === '') {
      dealIconShow();
      setTimeout(() => {
        getGif(avatarKey, 'videoHead');
      }, 1000)
      return
    }
    closeConnection();
    // clear stt text
    if (value !== 'ロープレを再開してください。') {
      tempTrans = '';
      setChatMsg('');
    }
    setRecording(false);
    try {
      const response = await postTexhToSpeech({
        text: value, speakerId: id ? id : speakerId
      });
      
      if (response.status === 200) {
        // play the audio
        var df = document.createDocumentFragment();
        var snd = new Audio("data:audio/wav;base64," + response.data.audio);
        snd.volume = 1;
        df.appendChild(snd);
        snd.play();
        snd.onerror = () => {
          dealIconShow();
        }
        snd.onended = () => {
          df.removeChild(snd);
          dealIconShow();
          getGif(avatarKey, 'videoHead');
        }
      } else {
        if (continueFlg) {
          GetAudio(id, value, false)
        } else {
          dealIconShow();
          getGif(avatarKey, 'videoHead');
        }
      }
    } catch (error) {
      dealIconShow();
      getGif(avatarKey, 'videoHead');
    }
  }
  
  // if single, accomplish current role-play
  const dealSingleScore = async () => {
    // setIsOpenConfirmDialog(false);
    setIsOpenDialog(false);
    setIsLoadingMask(true)
    await finishScoring(vTask.chat.id, '1');
    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false });
    setIsLoadingMask(false)
    history.push({ pathname: `/ai-score/${taskID}/${lessonId}` });
    setLocationState({
      isShowStory: true,
      isShowKururinpaImg: true,
      chatId: vTask.chat.id
    }, `ai-score/${taskID}/${lessonId}`)
  }
  
  // if multiple, finish current role-play and start a next one, or accomplish all
  const proceedRolePlay = async () => {
    setIsOpenConfirmDialog(false);
    setIsOpenDialog(false);
    setOverallScoring(false);
    setTalkScriptKey([]);
    setIsRecordingSave(false)
    
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      let index = allTask.findIndex(a => a.id == taskID);
      if (index != -1 && index < allTask.length - 1) {
        await finishScoring(vTask.chat.id, '0');
        // proceed next section's role-play
        setCurrentTime(countDownTimeSpan);
        // reset STT input
        setChatMsg('');
        tempTrans = ''
        setRecording(false);
        // prevent to close stream which is not initialized
        if (sttOpened) {
          closeConnection();
          // indicate whether stream was closed for new section
          setSttOpened(false);
        }
        // reset chat initial indicator
        setIsChatInitial(false);
        // 全セクション実施で一時保存中は次のセクションを先に保存する
        if (hasRolePlayingData) {
          let cur_login_user_info = store.getState().cacheMstUserInfo;
          let cur_login_user_header = store.getState().login_task_all;
          let mstDBUserName = cur_login_user_header?.userId.value ? cur_login_user_header.userId.value : '';
          let userRole = '';
          if (cur_login_user_info.salsmanSeiKj) {
            mstDBUserName = cur_login_user_info.salsmanSeiKj + cur_login_user_info.salsmanMeiKj;
          }
          if (cur_login_user_header.userRoles.includes("GENERAL_USER")) {
            userRole = 'RECRUITER';
          }
          let params = {
            userName: mstDBUserName,
            userRole: userRole,
            commitId: hasRolePlayingData?.record?.commitId
          }
          const startRes = await startChat(allTask[index + 1].id,
            {
              isSelectAllModel: '1',
              startTextNone: true,
              ...params
            });
          await saveChat(startRes.data.chat.id, true, '')
          setLocationState({
            select_task: getLocationState().select_task,
            pname: 'multiple-scenarios'
          }, `video-chat/${allTask[index + 1].id}/${lessonId}/multiple-scenarios`);
          history.push({
            pathname: `/video-chat/${allTask[index + 1].id}/${lessonId}/multiple-scenarios`,
            state: {
              isReRolePlayingMultiScenariosDuringProcess: hasRolePlayingData?.record?.isSelectAllModel === '1',
              isReRolePlaying: true
            }
          });
          setLocalIsReRolePlaying(true)
        } else {
          setLocationState({
            select_task: getLocationState().select_task,
            pname: 'multiple-scenarios'
          }, `video-chat/${allTask[index + 1].id}/${lessonId}/multiple-scenarios`);
          history.push({
            pathname: `/video-chat/${allTask[index + 1].id}/${lessonId}/multiple-scenarios`,
            state: {
              isReRolePlayingMultiScenariosDuringProcess: hasRolePlayingData?.record?.isSelectAllModel === '1',
              isReRolePlaying: false
            }
          });
          setLocalIsReRolePlaying(false)
        }
        setLocalReRolePlayingMultiScenariosDuringProcess(hasRolePlayingData?.record?.isSelectAllModel === '1')
      } else if (index != -1) {
        // accomplish all
        setIsLoadingMask(true);
        await finishScoring(vTask.chat.id, '1');
        store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
        setIsLoadingMask(false);
        setLocationState(
          { isShowStory: true, isShowKururinpaImg: true, commitId: store.getState().conduct_all_section_id },
          `ai-score/multiple-scenarios/${lessonId}`
        )
        history.push({ pathname: `/ai-score/multiple-scenarios/${lessonId}` });
      }
    }
  }
  
  const submitDisableControll = () => {
    return vReflectClickIsDisable || ableToNext()
  }
  
  const renderOperateBtn = () => {
    const state = getLocationState();
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      let index = allTask.findIndex(a => a.id == taskID);
      
      if (state && state.pname == 'multiple-scenarios' && location.pathname.includes('multiple-scenarios') && store.getState().select_task.length > 0 && index < allTask.length - 1) {
        // if multiple, and not the last time
        return <button
          className={` ${!ableToNext() ? 'video-chat-next-section-btn' : 'video-chat-next-section-btn-gray'}`}
          disabled={submitDisableControll()}
          onClick={() => setIsOpenDialog(true)}
        >
          <span>次へ</span>
          <span>
                        <img src={!ableToNext() ? nextRolePlayBtnBlueArrow : closeRolePlayBtnGrayArrow}/>
                    </span>
        </button>
      } else if (location.pathname.includes('multiple-scenarios')) {
        // if multiple last time
        return <button
          className="close-role-play-btn close-role-play-btn-orange"
          disabled={submitDisableControll()}
          onClick={() => setIsOpenMultiConfirmDialog(true)}
        >
          <span>採点する</span>
          <img src={closeRolePlayBtnOrangeArrow}/>
        </button>
      } else {
        // if single
        return <button
          className={`close-role-play-btn ${!ableToNext() ? 'close-role-play-btn-orange' : 'close-role-play-btn-gray'}`}
          disabled={submitDisableControll()}
          onClick={() => setIsOpenConfirmDialog(true)}
        >
          <span>採点する</span>
          <img src={!ableToNext() ? closeRolePlayBtnOrangeArrow : closeRolePlayBtnGrayArrow}/>
        </button>
      }
    } else {
      return <HistoryButton title={t('videochat.score')} idName="score" onClick={() => setIsOpenConfirmDialog(true)}/>
    }
  }
  
  const renderPauseDialogByStatus = () => {
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      let index = allTask.findIndex(a => a.id == taskID);
      if (isMultiMode()) {
        if (index == 0) {
          // first one in multiple mode
          return <ConfirmDialog
            open={isOpenSuspendDialog}
            setOpen={setIsOpenSuspendDialog}
            showSecOption="false"
            onConfirm={dealRollBack}
            title='採点せずにセクション選択画面へ戻ります。<br>よろしいでしょうか？'
          />
        } else {
          // not first one in multiple mode
          return <ConfirmDialog
            open={isOpenSuspendDialog}
            setOpen={setIsOpenSuspendDialog}
            showSecOption="true"
            onRollBack={dealRollBack}
            onConfirm={terminateAndScore}
            title=''
            firtTitle='前セクションまでを採点して終了'
            secondTitle='採点せずに終了'
            thirdTitle='ロープレを継続'
          />
        }
      } else {
        // if single mode
        return <ConfirmDialog
          open={isOpenSuspendDialog}
          setOpen={setIsOpenSuspendDialog}
          showSecOption="false"
          onConfirm={dealRollBack}
          title='採点せずにセクション選択画面へ戻ります。<br>よろしいでしょうか？'
        />
      }
    }
  }
  
  const renderRestartDiagByStatus = () => {
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      let index = allTask.findIndex(a => a.id == taskID);
      if (isMultiMode()) {
        if (index == 0) {
          // first one in multiple mode
          return <ConfirmDialog
            open={isOpenStartOverDialog}
            setOpen={setIsOpenStartOverDialog}
            onConfirm={startOver}
            title={'採点せずに最初からやり直します。<br> よろしいでしょうか？'}
          />
        } else {
          // not first one in multiple mode
          return <ConfirmDialog
            open={isOpenStartOverDialog}
            setOpen={setIsOpenStartOverDialog}
            onConfirm={startOver}
            title={'本セクションのロールプレイを最初からやり直します。<br> よろしいでしょうか？'}
          />
        }
      } else {
        // if single mode
        return <ConfirmDialog
          open={isOpenStartOverDialog}
          setOpen={setIsOpenStartOverDialog}
          onConfirm={startOver}
          title={'採点せずに最初からやり直します。<br> よろしいでしょうか？'}
        />
      }
    }
  }
  
  const ableToNext = () => {
    if (!vIsplayed) {
      return true;
    }
    return !isChatInitial;
  }
  
  const dealRollBack = () => {
    let commitId = store.getState().conduct_all_section_id;
    if (location.pathname.includes('multiple-scenarios')) {
      if (!commitId) {
        return false;
      }
      getChatIdListByCommitIdForMultipleSection(commitId).then(result => {
        let sequence = [];
        if (result && result.data && result.data instanceof Array) {
          result.data.forEach(chatId => {
            sequence.push(deleteScoring(chatId));
          })
          
          Promise.all(sequence).then(results => {
            if (results && results instanceof Array) {
              if (results.every(res => res?.data?.responseStatus == 'SUCCESS')) {
                store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
                setLocationState({
                  lessonId: lessonId,
                  selectPersona: vTask?.chat?.section.persona
                }, 'start-new-role-play')
                history.push({ pathname: `/start-new-role-play` });
              }
            }
          }).catch(e => {
          })
        }
      })
    } else {
      // if single
      deleteScoring(vTask.chat.id).then(res => {
        if (res?.data?.responseStatus == 'SUCCESS') {
          store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
          
          setLocationState({ lessonId, selectPersona: vTask?.chat?.section.persona }, 'start-new-role-play')
          history.push({ pathname: `/start-new-role-play`, });
        }
      })
    }
  }
  
  const terminateAndScore = () => {
    // straight to score page
    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
    setLocationState({
      commitId: store.getState().conduct_all_section_id,
      isShowStory: true,
      isShowKururinpaImg: true
    }, `ai-score/multiple-scenarios/${lessonId}`)
    history.push({ pathname: `/ai-score/multiple-scenarios/${lessonId}` });
  }
  
  const dealReturn = () => {
    const state = getLocationState();
    if (isReRolePlaying) {
      history.push({ pathname: `/start-new-role-play` });
      store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
      setLocationState({ locationCheck: 'clickLink' }, 'start-new-role-play')
      return
    }
    if (location.pathname.includes('multiple-scenarios')) {
      // if multiple mode
      store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
      setLocationState(store.getState()?.select_task, `rate-of-risk/multiple-scenarios/${lessonId}`);
      history.push({ pathname: `/rate-of-risk/multiple-scenarios/${lessonId}` });
    } else {
      // if single mode
      if (!state || !state.freeModel) {
        store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
        setLocationState({
          task: store.getState()?.select_task[0], selectedThemeName: vTask?.chat?.section.persona.themeName,
          selectedScenarioName: vTask?.chat?.section.persona.scenarioName,
          selectedCustomerData: store.getState().selected_customer_data
        }, `rate-of-risk/${taskID}/${lessonId}`)
        history.push({ pathname: `/rate-of-risk/${taskID}/${lessonId}` });
      } else {
        setLocationState({
          task: store.getState()?.select_task[0], selectedThemeName: vTask?.chat?.section.persona.themeName,
          selectedScenarioName: vTask?.chat?.section.persona.scenarioName,
          selectedCustomerData: store.getState().selected_customer_data
        }, `free-rate-of-risk/${taskID}/${lessonId}`)
        history.push({ pathname: `/free-rate-of-risk/${taskID}/${lessonId}` });
      }
    }
  }
  
  const buildProcesses = useCallback((processes) => {
    if (processes) {
      let data = JSON.parse(JSON.stringify(processes));
      data.forEach(item => {
        item.matched = false;
        item.keywords = Array.from(new Set(item.keywords));
      })
      setProcesses(data);
    }
  }, [])
  
  const checkKeywordMatching = useCallback((matchedWords, processes) => {
    if (matchedWords) {
      let TempProcess = [...processes]
      for (let index = 0; index < TempProcess.length; index++) {
        const checkbox = TempProcess[index].keywords;
        for (let i = 0; i < checkbox.length; i++) {
          const keyword = checkbox[i];
          for (let c = 0; c < matchedWords.length; c++) {
            const word = matchedWords[c].word;
            if (word == keyword) {
              TempProcess[index].matched = true;
              TempProcess[index].keywords.map((value) => {
                if (value == keyword) {
                  if (TempProcess[index].selected === undefined || TempProcess[index].selected.length == 0) {
                    TempProcess[index].selected = [value];
                  } else {
                    TempProcess[index].selected.push(value);
                  }
                }
              })
            }
          }
        }
      }
      setProcesses(TempProcess);
    }
  }, [])
  
  useEffect(() => {
    // 保存を破棄して開始する
    if (checkedReDialog) startRolePlay()
  }, [checkedReDialog]);
  
  const startRolePlay = () => {
    // 確認ダイアログを表示条件
    // 1. 一時保存済みデータ(hasRolePlayingData)がある
    // 2. 一時保存データ再開でない(isReRolePlaying:false)
    // 3. 一時保存データ確認ダイアログチェック済みでない(checkedReDialog:false)
    // 4. 一時保存データ再開で複数プロセス中でない(isReRolePlayingMultiScenariosDuringProcess:false)
    if (hasRolePlayingData && !isReRolePlaying && !checkedReDialog && !isReRolePlayingMultiScenariosDuringProcess) {
      setIsConfirmDialog(true)
      return
    }
    isSafari(() => {
      if (vTask && vTask.incomingMessages[0]) {
        // if starts
        store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: true })
        // start timer
        startCountdown();
        // video. etc
        setIsplayed(true);
        // if not first one in multiple mode, for starting over, start role-play automatically
        getGif(avatarKey, 'Talking')
        GetAudio(null, vTask.restartIncomingMessage ? vTask.restartIncomingMessage : vTask.incomingMessages[0].text, true);
        setTextAreaInput(false);
      } else {
        setTimeout(() => {
          startRolePlay();
        }, 1000)
      }
    }, () => {
      setMicrophonePermission(true)
    });
  }
  
  const startOver = () => {
    setChatMsg('');
    reloadByHash();
    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false });
  }
  
  document.onkeydown = function (event) {
    const e = event ? event : (window.event ? window.event : null);
    if (isOpenConfirmDialog || isOpenMutiConfirmDialog || isOpenDialog || isOpenSuspendDialog || isOpenStartOverDialog || store.getState().dialogue_status) {
      // if dialogue is open, prevent event to operate
      return;
    }
    if (e != null) {
      switch (e.keyCode) {
        case 13://enter
        {
          if (vIsplayed && delChatMsg === 'stt') {
            if (vSetSendFocus && !(vChatMsg.length === 0 || vReflectClickIsDisable)) {
              if (inFocus) setInFocus(false);
              dealIconHide()
            }
            if (vSetDelFocus) {
              dealCancel();
            }
          }
        }
          break;
        //up arrow
        case 38: {
          if (delChatMsg === 'stt' && vIsplayed) {
            setDelFocus(false);
          }
        }
          break;
        // down arrow
        case 40: {
          if (delChatMsg === 'stt' && vIsplayed) {
            setDelFocus(true);
          }
        }
          break;
      }
    }
    
  }
  
  const handleChange = (event) => {
    setOverallScoring(event.target.checked);
    if (vProcesses) {
      let processTemp = JSON.parse(JSON.stringify(vProcesses));
      if (event.target.checked === true) {
        processTemp.map(item => item.toggle = true)
      } else {
        processTemp.map(item => item.toggle = false)
      }
      setProcesses([...processTemp]);
    }
  };
  
  const handleTalkScriptChange = (event) => {
    setTalkScript(event.target.checked);
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
  
  const handleTextareaInputFocus = () => {
    setInFocus(true);
    //setDelChatMsg('input')
    closeConnection();
    //tempTrans = '';
  }
  
  const handleTextareaInputBlur = (e) => {
    setInFocus(false);
    dealIconShow();
    store.dispatch(updateRestartText(e.target.value))
  }
  
  // useEffect(() => {
  //   if (delChatMsg === '' || delChatMsg === 'stt' && vChatMsg.length != 0) {
  //     setInputEdit(true);
  //   } else {
  //     setInputEdit(false);
  //   }
  // }, [vChatMsg])
  
  useEffect(() => {
    GetProcessToken()
  }, []);
  
  const dealCancelAndBackStt = () => {
    setDelChatMsg('stt')
    if (vTask) {
      // clear stt text
      tempTrans = '';
      setChatMsg('');
      getGif(avatarKey, 'videoHead');
      dealIconShow();
    }
  }
  
  const dialogOpenCloseHandler = useCallback((value) => {
    store.dispatch(updateTalkScriptDialog(value))
  }, [])
  
  const startOrRestartOrSaveButton = useMemo(() => {
    if (vIsplayed) {
      return (
        <FreeStoryStopBtn
          onClick={async () => {
            if (!vTask?.chat?.id || vIsRecordingSave) return
            store.dispatch(updateTempRolePlaying(vTask?.chat))
            setIsRecordingSave(true)
            const res = await saveChat(vTask.chat.id, true, vChatMsg ?? '')
            store.dispatch(updateRolePlayingSavedDuringProcess(
              {
                personaId: lessonId,
                sectionId: taskID,
                record: vTask.chat
              }
            ))
            if (vTask.chat?.id && vTalkScriptList[currentIndex]?.id) {
              await saveScriptLine(vTask.chat?.id, vTalkScriptList[currentIndex].id)
            }
            setIsRecordingSave(false)
          }}
          processTag={vIsRecordingSave}
        />
      )
    } else if (isReRolePlaying) {
      return (
        <button
          className={styles.restartRolePlayBtn}
          disabled={vIsplayed}
          onClick={async () => {
            store.dispatch(updateTempRolePlaying(vTask?.chat))
            await startRolePlay()
            if (isReRolePlaying) {
              store.dispatch(updateRolePlayingSavedDuringProcess(null))
              await saveChat(vTask.chat.id, false, '')
            }
          }}
        >
          <img
            className={styles.restartRolePlayBtnImg}
            src={rolePlayBtnMicphone} alt=""/>
          <span
            className={styles.restartRolePlayBtnSpan}
          >ロープレ再開</span>
        </button>
      )
    } else {
      return (
        <button
          className={`start-role-play-btn ${vIsplayed ? 'start-role-play-btn-active' : ''}`}
          disabled={vIsplayed}
          onClick={async () => {
            store.dispatch(updateTempRolePlaying(vTask?.chat))
            await startRolePlay()
            if (isReRolePlaying) {
              store.dispatch(updateRolePlayingSavedDuringProcess(null))
              await saveChat(vTask.chat.id, false, '')
            }
            store.dispatch(updateRestartText(''))
          }}
        >
          <img src={rolePlayBtnMicphone} alt=""/>
          <span>ロープレ開始</span>
        </button>
      )
    }
  }, [currentIndex, isReRolePlaying, lessonId, startRolePlay, taskID, vIsRecordingSave, vIsplayed, vTalkScriptList, vTask?.chat])
  
  return (
    <div className="role_play_main_area_wrap">
      <div className="role_play_main_area">
        {
          talkScriptDialogOpen && vTalkScriptList && dialogTalkScripts
          && vTalkScriptList.length > 0
          && dialogTalkScripts.length > 0 ?
            <TalkScriptMoveDialog
              vAvatarName={avatarKey}
              talkScripts={vTalkScriptList}
              dialogTalkScripts={dialogTalkScripts}
            />
            : null
        }
        <Row className="flex-mobile-column-reverse">
          <Col lg="4" className="mb-3 m-lg-0">
            <div className="video-chat-keyword-list-main">
              <Row>
                <Col>
                  <div className="video-chat-name-context">
                    {(isMultiModetheFirstNoPath() || isSingleMode()) &&
                      <button title={t('general.return')} className="video-chat-btn-click-back"
                              onClick={dealReturn}>{t('general.return')}</button>}
                    {vTask?.chat?.section.persona.themeName ? <div>
                      {/* <label title={`${vTask?.chat?.section.persona.themeName} ${vTask?.chat?.section.persona.scenarioName}`}>{`${vTask?.chat?.section.persona.themeName} ${vTask?.chat?.section.persona.scenarioName}`}</label> */}
                      <label
                        title={`${vTask?.chat?.section.persona.persona}`}>{`${vTask?.chat?.section.persona.persona}`}</label>
                    </div> : <></>}
                  </div>
                  <div>
                    <p className="video-chat-list-first-titile" id="ongoing_section"
                       name="ongoing_section">{t('videochat.ongoing_section')}</p>
                    <span className="video-chat-top-buttons">
                      <div title={vTask && `${vTask.chat.section.name}`}
                           className="video-chat-btn-tips" id="long_term_care_insurance"
                           name="long_term_care_insurance">
                          {vTask && (vTask?.chat?.section?.name).split('\n').map((v, k) => {
                            return (<div>
                              <p style={{ textTransform: 'none' }}
                                 className="video-chat-section-name" key={k}>{v}</p>
                            </div>)
                          })}
                      </div>
                  </span>
                  </div>
                  <div className="video-chat-keyword-list">
                    <ShowBut onChange={handleChange} checkState={overallScoring} buttonlabel={`全てを表示する`}/>
                    <KeywordList vProcesses={vProcesses} setProcesses={setProcesses}></KeywordList>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col lg="8" className="chat_avatar_area mb-sm-">
            <div className="chat_img_container">
              <div className="chat_img_sec mb-2">
                <SliderImages/>
              </div>
            </div>
            <div className="chat_img_container">
              <div className="chat_img_sec mb-2">
                <Col className="video-chat-bottom-middle-btn">
                  <div className="vitual_chat_avatar">
                    {name && <div className="chat_name_box">{name}</div>}
                    {chatPerson && (<img
                      src={chatPerson}
                      alt="Chat People"
                      className="main_chat_people"
                      id="chat_person"
                      name="chat_person"
                      key={Math.random() * 100}
                    />)}
                  </div>
                </Col>
                <Col className="flex-grow-chat-chart">
                  <Row>
                    <div style={{ width: "100%" }}>
                      <Row className="talk_chart_contain">
                        <Row className="ml-0">
                          <div className="talk_chart">
                            {
                              delChatMsg === 'stt' && sttOpened && !inFocus
                                ?
                                <IWaveformPc value={volume}/>
                                :
                                <IWaveformPcGrey/>
                            }
                          </div>
                          <div className={styles.timer}>
                            <Countdown
                              key="countdown"
                              ref={countdownRef}
                              autoStart={false}
                              date={vCountdownTime}
                              zeroPadTime={2}
                              onComplete={onCompleteCountdown}
                              renderer={countdownRenderer}
                              overtime={true}
                            />
                            {inFocus ? (<span className={styles.is_editing}>テキスト編集中</span>) : null}
                          </div>
                        </Row>
                        <Row className="talk-script-wrapper">
                          <ShowButTalkScript
                            onChange={handleTalkScriptChange}
                            checkState={vTalkScript}
                            buttonlabel="トークスクリプトを表示する"
                            vTask={vTask}
                            setTalkScript={setTalkScript}
                            vTalkScriptList={vTalkScriptList}
                            setCurrentIndex={setCurrentIndex}
                          />
                          <button
                            className="talk-script-btn"
                            onClick={() => {
                              dialogOpenCloseHandler(true)
                            }}
                          >
                            拡大する
                          </button>
                        </Row>
                      </Row>
                      {(vTalkScript && vTalkScriptList.length > 0) && (<div
                        id="talkScriptBox"
                        className={`talk_script_main_box`}
                      >
                        <div className="talk_script_checkbox_button">
                          <div
                            id="talkScriptGrayBox"
                            className="talk_script_gray_box"
                          >
                            <TalkScript
                              vIsplayed={vIsplayed}
                              vTask={vTask}
                              talkScriptList={vTalkScriptList}
                              currentIndex={currentIndex}
                              setCurrentIndex={setCurrentIndex}
                              talkScriptKey={talkScriptKey}
                            />
                          </div>
                        </div>
                      </div>)}
                    </div>
                  </Row>
                  <Row>
                    <div className="mb-20 video_chat_input_area">
                      <div className="video_chat_input_button">
                          <textarea
                            ref={textareaRef}
                            autoFocus={vSetVideoFocus}
                            className="video-chat-input"
                            disabled={inputEdit || !(delChatMsg === 'stt' && sttOpened)}
                            onFocus={() => {
                              handleTextareaInputFocus()
                            }}
                            onBlur={(e) => {
                              handleTextareaInputBlur(e)
                            }}
                            type="text"
                            placeholder=""
                            value={vChatMsg}
                            onChange={(e) => onChatMsgType(e)}
                            id="reply"
                            name="reply"
                            autoComplete="off"
                          />
                      </div>
                      <div
                        className={vIsplayed && isCameraOnUse ? "chat_people_box" : "chat_people_box_blank"}
                      >
                        {vIsplayed && isCameraOnUse ? <WebCam setCamera={v => setIsCameraOnUse(v)}/> :
                          <img src={humanAvatar}/>}
                      </div>
                    </div>
                  </Row>
                </Col>
              </div>
            </div>
            
            <Modal
              open={microphonePermissionm}
              onClose={() => {
                setMicrophonePermission(false)
              }}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
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
            </Modal>
          </Col>
        </Row>
      </div>
      <div className="video-chat-footer-buttons">
        <div className="video-chat-bottom-left-btn">
          {/** やり直す ⬇ */}
          <div className={styles.free_storyright_bottom_item} onClick={() => {
            if (!ableToNext()) {
              setIsOpenStartOverDialog(true);
            }
          }}>
            <FreeStoryResume processTag={!ableToNext()}/>
          </div>
        </div>
        <div className="video-chat-bottom-middle-btn">
          {/* start btn */}
          {startOrRestartOrSaveButton}
          {/* 反映 */}
          <button
            disabled={vChatMsg.length === 0 || vReflectClickIsDisable}
            className={`
                                        role-play-handle-btn
                                        ${vIsplayed ? 'role-play-handle-btn-active' : 'role-play-handle-btn-not-start'}
                                        ${vIsplayed ? vSetSendFocus ? 'role-play-handle-btn-onfocus' : 'role-play-handle-btn-onblur' : ''}
                                    `}
            autoFocus={vSetSendFocus}
            onClick={dealIconHide}
            id={autoId()}
          >
            テキストを反映
          </button>
          {/* 重新输入 */}
          <button className={`
                                    role-play-handle-btn
                                    ${vIsplayed ? 'role-play-handle-btn-start' : 'role-play-handle-btn-not-start'}
                                    ${vIsplayed ? vSetDelFocus ? 'role-play-handle-btn-onfocus' : 'role-play-handle-btn-onblur' : ''}
                                `}
                  onClick={vIsplayed ? delChatMsg !== 'input' ? dealCancel : dealCancelAndBackStt : null}
                  id="cancel_icon" autoFocus={vSetDelFocus} name="cancel_icon">
            言い直す
          </button>
        </div>
        {/* 踩点按钮 ⬇ */}
        {/** submit */
          renderOperateBtn()}
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
          const path = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}`
          const multiPath = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`
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
          setLocalIsReRolePlaying(true)
          setLocalReRolePlayingMultiScenariosDuringProcess(hasRolePlayingData.record?.isSelectAllModel === '1')
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
            store.dispatch(updateRestartText(''))
          }
        }}
        title='ロープレの途中保存データがあります。
                        <br><br>新規ロープレを開始すると、<br>途中保存データが削除されます。'
      />
      {/** single */}
      <ConfirmDialog
        title={t("videochat.to_score_confirmation")}
        open={isOpenConfirmDialog}
        setOpen={setIsOpenConfirmDialog}
        onConfirm={dealSingleScore}
      />
      <ConfirmDialog
        title={t("videochat.to_score_confirmation")}
        open={isOpenMutiConfirmDialog}
        setOpen={setIsOpenMultiConfirmDialog}
        onConfirm={proceedRolePlay}
      />
      <ConfirmDialog
        open={isOpenDialog}
        setOpen={setIsOpenDialog}
        onConfirm={proceedRolePlay}
        title='次のセクションへ進みますがよろしいでしょうか？'
      />
      <LoadingMask val={vIsLoadingMask}/>
      {renderPauseDialogByStatus()}
      {renderRestartDiagByStatus()}
    </div>
  )
}
const mapStateToProps = state => {
  return {
    talkScriptDialogOpen: state.talkScriptDialogOpen,
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}
export default connect(mapStateToProps, mapDispatchToProps)(VideoChatPage);

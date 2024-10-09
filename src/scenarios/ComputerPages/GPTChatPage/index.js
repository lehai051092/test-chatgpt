import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import { useHistory, useLocation, useParams } from "react-router-dom";
import Countdown, { zeroPad } from 'react-countdown';
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import styles from './styles.module.css'
import ChatApi from "../../../request/textSpeechTransitionApi/chatApi";
import {
  finishScoring,
  getLessonList,
  getLessonTask,
  getProcessToken,
  postTexhToSpeech,
  saveChat,
  sendGPT,
  startChat,
  startGPTMessage
} from '../../../request/backendApi/api';
import { CURRENT_CHAT_INFO, CURRENT_CHOSED_PERSONA, IS_ROLE_PLAY_ONGOING } from '../../../storage/consts';
import store from '../../../storage'
import ShowBut from './ShowBut'
import { getSpeakerId } from '../../../utils/personaImageMapping';
import KeywordList from './KeywordsList'
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import {
  getLocationState,
  isSafari,
  MaximumNumberOfCharactersSentGPTText,
  MaximumNumberOfCharactersSentGPTTextLength,
  onDownload,
  reloadByHash,
  setLocationState,
  WarningGPTTextEndSoon
} from '../../../utils/util';
import { getManualUrl2 } from "../../../utils/runtime";
import LoadingMask from '../../../constituents/ILoadingMask';
import cancel from '../../../property/images/free_story/cancel.png'
import rolePlayBtnMicphone from '../../../property/icons/role-play-btn-micphone.png';
import closeRolePlayBtnGrayArrow from '../../../property/icons/close-role-play-btn-gray-arrow.svg';
import closeRolePlayBtnOrangeArrow from '../../../property/icons/close-role-play-btn-orange-arrow.svg';
import FreeStoryResume from '../FreeStoryPage/FreeStoryResume';
import IWaveformPc from '../../../constituents/IWaveformPc';
import IWaveformPcGrey from '../../../constituents/IWaveformPcGrey';
import getGifImage from '../../../utils/newMapFIle';
import {
  lessonTaskAll,
  selectTask,
  updateAllSectionId,
  updateRolePlayingSavedDuringProcess,
  updateTalkScriptDialog
} from "../../../storage/reduxActions";
import ConfirmDialogReRolePlay from "../../../constituents/IConfirmDialogReRolePlay";
import { playGifPersonaAction } from "./gpt-utils";
import { connect } from "react-redux";
import GPTChatScripts from "./GPTChatScripts";
import GPTChatErrorDialog from "./GPTChatErrorDialog";
import GPTChatFinishDialog from "./GPTChatFinishDialog";
import GPTChatFirstConfirmDialog from "./GPTChatFirstConfirmDialog";
// record STT first trigger time
var vMsgStartTime = '';
// voice duration that STT detects
var vSTTDuration = 0;
// stt text
let tempTrans = '';
let currentAudioElement = null
let currentAudioDivElement = null
const GPTChatPage = ({}) => {
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
  const [vSetSendFocus, setSendFocus] = useState(true);
  const [vSetDelFocus, setDelFocus] = useState(false);
  const [vSetVideoFocus, setVideoFocus] = useState(false);
  const [vIsplayed, setIsplayed] = useState(false);
  const [vTask, setTask] = useState(null);
  const [speakerId, setSpeakerId] = useState('');
  const [vProcesses, setProcesses] = useState();
  const [chatPerson, setChatPerson] = useState();
  const [chatPersonName, setChatPersonName] = useState();
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isFinishDialog, setIsFinishDialog] = useState(false);
  const [isFirstConfirmDialog, setIsFirstConfirmDialog] = useState(true);
  const countdownRef = useRef();
  const [vCountdownTime, setCountdownTime] = useState(Date.now());
  const [isOpenStartOverDialog, setIsOpenStartOverDialog] = useState(false);
  const [overallScoring, setOverallScoring] = useState(false);
  const [vReflectClickIsDisable, setReflectClickIsDisable] = useState(true);
  const [sttOpened, setSttOpened] = useState(false);
  const [isChatInitial, setIsChatInitial] = useState(false);
  const [microphonePermissionm, setMicrophonePermission] = useState(false);
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  const [volume, setVolume] = useState([0]);
  const [inputEdit, setInputEdit] = useState(true);
  const [avatarKey, setAvatarKey] = useState(null)
  const [delChatMsg, setDelChatMsg] = useState('');
  const [vProcessToken, setProcessToken] = useState();
  const [isConfirmDialog, setIsConfirmDialog] = useState(false)
  const hasRolePlayingData = store.getState().rolePlayingSavedDuringProcess
  const [checkedReDialog, setCheckedReDialog] = useState(false);
  const [dialogTalkScripts, setDialogTalkScripts] = useState([]);
  const [gptErrorDialogContent, setGPTErrorDialogContent] = useState('')
  const [isGPTErrorDialog, setIsGPTErrorDialog] = useState(false)
  const [isTimeUpFlg, setIsTimeUpFlg] = useState(false)
  const [warningText, setWarningText] = useState('')
  const [isSendMessageRequesting, setIsSendMessageRequesting] = useState(false)
  const [defaultAvatarGIF, setDefaultAvatarGIF] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoAnswer, setAutoAnswer] = useState(null)
  const [inFocus, setInFocus] = useState(false)
  // sound
  const SAMPLING_RATE = 4096;
  const audioContextRef = useRef(window.AudioContext);
  const streamRef = useRef(MediaStream);
  const streamSourceRef = useRef(MediaStreamAudioSourceNode);
  const processorRef = useRef(window.AudioWorkletNode);
  
  // Trigger immediately when the component is destroyed to prevent the socket from being destroyed
  useEffect(() => {
    return () => {
      audioOffHandler()
      closeConnection();
      document.onkeydown = null;
    }
  }, [])
  
  useEffect(async () => {
    await getTask();
  }, [location.pathname]);
  
  useEffect(async () => {
    if (avatarKey) {
      let img = await getGifImage(avatarKey, 'videoHead')
      setChatPerson(img)
      setDefaultAvatarGIF(img)
      setSpeakerId(getSpeakerId(avatarKey));
    }
  }, [store.getState().currentChosedPersona])
  
  useEffect(() => {
    // in case redirecting from history page and will cause error if no lessonId in score page
    if (!store.getState()?.currentChosedPersona?.id || store.getState()?.currentChosedPersona?.id !== lessonId) {
      getLessonList("/lessons").then((res) => {
        if (res.data) {
          let currentPerson = res.data.find(item => item.id === lessonId);
          store.dispatch({ type: CURRENT_CHOSED_PERSONA, persona: currentPerson })
        }
      })
    }
  }, []);
  
  useEffect(() => {
    if (delChatMsg === '' || delChatMsg === 'stt' && vChatMsg.length !== 0) {
      setInputEdit(true);
    } else {
      setInputEdit(false);
    }
  }, [vChatMsg])
  
  useEffect(async () => {
    await getProcessTokenHandler()
  }, []);
  
  useEffect(() => {
    store.dispatch(updateTalkScriptDialog(false))
  }, [])
  
  useEffect(() => {
    // 保存を破棄して開始する
    if (checkedReDialog) startRolePlay()
  }, [checkedReDialog]);
  
  
  const gptErrorConfirmHandler = useCallback(async () => {
    await getTask()
    setIsGPTErrorDialog(false)
    setGPTErrorDialogContent('')
    await getGif(avatarKey, 'videoHead')
    setIsplayed(false);
    setDialogTalkScripts([])
    setChatMsg('')
    setWarningText('')
    countdownRef.current?.stop();
    setCountdownTime(Date.now() + 1000 * 60 * vTask.chat.roleplayTime)
  }, [vTask]);
  const getGif = async (avatarKey, emotionKey = null) => {
    if (!avatarKey) {
      return false;
    }
    let img = await getGifImage(avatarKey, emotionKey)
    setChatPerson(img)
  }
  
  function isSingleMode() {
    return !location.pathname.includes('multiple-scenarios');
  }
  
  const countdownRenderer = ({ _hours, minutes, seconds, _completed }) => {
    let minuteOffset;
    let secondOffset;
    if (store.getState().current_section_count_down && '' !== store.getState().current_section_count_down) {
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
    
    return (<>
          <span type="text" className={styles.time_text_box} id="time"
                name="time">{`${zeroPad(minuteOffset)} : ${zeroPad(secondOffset)}`}</span>
    </>)
  }
  
  const startCountdown = () => {
    countdownRef.current?.start();
  }
  const onCompleteCountdown = () => {
  }
  
  const onChatMsgType = (e) => {
    let text = e.target.value.replace(/([\s\u3000]*|[\r\n\u3000]*)/ig, '');
    if (text.length > 0) {
      setReflectClickIsDisable(false);
    } else {
      setReflectClickIsDisable(true);
    }
    if (e.target.value.length > MaximumNumberOfCharactersSentGPTTextLength) {
      setWarningText(MaximumNumberOfCharactersSentGPTText)
    } else {
      setWarningText('')
      setChatMsg(e.target.value);
      tempTrans = e.target.value;
    }
    //setDelChatMsg('input')
    if (e.target.value.length > 0) {
      setVideoFocus(false);
    } else {
      setVideoFocus(true);
    }
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
  
  
  function startConnection() {
    console.log('startConnection!!!')
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
      .catch((_error) => {
        setDelChatMsg('input')
        setInputEdit(false);
      });
  }
  
  function audioOffHandler() {
    // audio off
    if (currentAudioDivElement && currentAudioDivElement) {
      currentAudioDivElement.removeChild(currentAudioElement);
      currentAudioDivElement = null
      currentAudioElement = null
    }
  }
  
  function closeConnection() {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then(function (permissionStatus) {
        if (permissionStatus.state === 'granted') {
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
              setVolume([0]);
            }
          } catch (error) {
          }
        }
      })
    }
  }
  
  // deal response from google speech to text server
  const processTranscription = useCallback((transcription) => {
    // use Azure STT
    tempTrans += transcription.transcription;
    if (tempTrans && tempTrans.length > MaximumNumberOfCharactersSentGPTTextLength) {
      setWarningText(MaximumNumberOfCharactersSentGPTText)
    } else {
      setWarningText('')
      vSTTDuration = parseFloat(vSTTDuration) + parseFloat(transcription?.duration);
      setChatMsg(tempTrans);
    }
  }, []);
  
  const dealIconShow = () => {
    // indicate whether stream was opened
    setSttOpened(true);
    // start recording
    setVideoFocus(false)
    startConnection();
    setReflectClickIsDisable(false);
  }
  
  // テキストを反映
  const dealIconHide = () => {
    setInputEdit(true);
    setReflectClickIsDisable(true);
    setWarningText('')
    closeConnection();
    tempTrans = '';
    setChatMsg('');
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
  }
  
  // 言い直す
  const dealCancel = () => {
    console.log('dealCancel')
    // cancel recording
    setChatMsg('');
    tempTrans = '';
    setWarningText('')
    vSTTDuration = 0;
  }
  
  // 言い直す
  const dealCancelAndBackStt = () => {
    console.log('dealCancelAndBackStt')
    setDelChatMsg('stt')
    if (vTask) {
      // clear stt text
      tempTrans = '';
      setChatMsg('');
      setWarningText('')
      getGif(avatarKey, 'videoHead');
      dealIconShow();
    }
  }
  
  // main initial function
  const getTask = async () => {
    tempTrans = '';
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
    
    let isSelectAllModel = '';
    let params = {
      userName: mstDBUserName, userRole: userRole, isSelectAllModel: isSelectAllModel,
    }
    
    let response;
    
    // if for single
    if (taskID) {
      response = await startChat(taskID, params);
    }
    setCountdownTime(Date.now() + 1000 * 60 * response.data?.chat?.roleplayTime)
    setAvatarKey(response.data.chat.section.persona.avatar)
    setSpeakerId(getSpeakerId(response.data.chat.section.persona.avatar));
    getGif(response.data.chat.section.persona.avatar, 'videoHead')
    setChatPersonName(response.data.chat.section.persona.name);
    setTask(response.data);
    store.dispatch({ type: CURRENT_CHAT_INFO, payload: response?.data?.chat });
    buildProcesses(response.data.processes);
    setIsChatInitial(true);
  }
  
  // to send message
  const playAct = async (origin) => {
    if (isSendMessageRequesting) return
    else setIsSendMessageRequesting(true)
    
    let params = {
      text: vChatMsg,
    }
    
    if ('byMicphone' === origin) {
      if (vSTTDuration !== 0) {
        params.startTime = new Date().toISOString();
        let endTime = new Date(params.startTime);
        endTime.setMilliseconds(endTime.getMilliseconds() + parseFloat(vSTTDuration).toFixed(2) * 1000)
        params.endTime = endTime.toISOString();
      }
    }
    if (autoAnswer) {
      params.autoAnswer = autoAnswer;
    }
    // reset start time when message sent
    vMsgStartTime = '';
    setWarningText('考え中...')
    try {
      const response = await sendGPT(vTask.chat.id, params)
      setVideoFocus(true);
      setChatMsg('');
      setWarningText('')
      setIsSendMessageRequesting(false)
      vSTTDuration = 0;
      tempTrans = ''
      if (response?.data?.errorType &&
        response?.data.replies
        && response?.data.replies[0]
        && response?.data.replies[0].text) {
        setWarningText(response?.data.replies[0].text)
        dealIconShow()
      } else {
        let replyText = "";
        let replyTtsText = "";
        let replyPersonaAction = "";
        if (response?.data?.autoAnswer?.message && response?.data?.autoAnswer?.personaAction) {
          replyText = response?.data?.autoAnswer?.message;
          replyPersonaAction = response?.data?.autoAnswer?.personaAction;
          replyTtsText = response?.data?.autoAnswer?.ttsText ?? "";
        } else {
          replyText = response?.data?.replies[0]?.text;
          replyPersonaAction = response?.data?.replies[0]?.personaAction;
          replyTtsText = response?.data?.replies[0]?.ttsText ?? "";
        }
        setDialogTalkScripts(val => [...val,
          {
            type: '',
            text: response?.data?.message?.text,
            matchedWords: response?.data?.message?.matchedWords,
          },
          {
            type: "IncomingMessage",
            text: replyText,
            personaAction: replyPersonaAction,
            keywordDensity: response?.data?.keywordDensities,
          }
        ])
        if (response?.data?.autoAnswer) {
          setAutoAnswer(response?.data?.autoAnswer);
        }
        checkKeywordMatching(response.data.message.matchedWords);
        playGifPersonaAction(avatarKey, replyPersonaAction, getGif);
        const audioValue = (replyTtsText !== '') ? replyTtsText : replyText;
        await getAudio(null, audioValue, true);
      }
    } catch (e) {
      setIsSendMessageRequesting(false)
      setGPTErrorDialogContent(e.response.data.message + '<br><br>' + e.response.data.body)
      setIsGPTErrorDialog(true)
    }
  }
  
  
  // get audio stream and play
  const getAudio = async (id, value, continueFlg) => {
    if (value === '') {
      dealIconShow()
      setTimeout(() => {
        getGif(avatarKey, 'videoHead');
      }, 1000)
      return
    }
    setIsSpeaking(true)
    try {
      const response = await postTexhToSpeech({
        text: value, speakerId: id ? id : speakerId
      });
      
      if (response.status === 200) {
        // play the audio
        currentAudioDivElement = document.createDocumentFragment();
        currentAudioElement = new Audio("data:audio/wav;base64," + response.data.audio);
        currentAudioDivElement.appendChild(currentAudioElement);
        currentAudioElement.play();
        currentAudioElement.onerror = () => {
          setIsSpeaking(false)
          dealIconShow();
          currentAudioDivElement = null
          currentAudioElement = null
        }
        currentAudioElement.onended = () => {
          setIsSpeaking(false)
          if (currentAudioDivElement) {
            currentAudioDivElement.removeChild(currentAudioElement);
          }
          currentAudioDivElement = null
          currentAudioElement = null
          dealIconShow();
          getGif(avatarKey, 'videoHead');
        }
      } else {
        setIsSpeaking(false)
        if (continueFlg) {
          getAudio(id, value, false)
        } else {
          dealIconShow();
          getGif(avatarKey, 'videoHead');
        }
      }
    } catch (error) {
      setIsSpeaking(false)
      dealIconShow();
      getGif(avatarKey, 'videoHead');
    }
  }
  
  // if single, accomplish current role-play
  const dealSingleScore = async () => {
    setIsLoadingMask(true)
    await finishScoring(vTask.chat.id, '1');
    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false });
    setIsLoadingMask(false)
    setLocationState({
      isShowStory: true,
      isShowKururinpaImg: true,
      chatId: vTask.chat.id,
      isFastText: false,
      item: vTask.chat,
      isGPT: true
    }, `ai-score/${taskID}/${lessonId}`)
    history.push({ pathname: `/ai-score/${taskID}/${lessonId}` });
  }
  
  const renderRestartDiagByStatus = () => {
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      // if single mode
      return <ConfirmDialog
        open={isOpenStartOverDialog}
        setOpen={setIsOpenStartOverDialog}
        onConfirm={startOver}
        title={'採点せずに最初からやり直します。<br> よろしいでしょうか？'}
      />
    }
  }
  
  const ableToNext = () => {
    if (!vIsplayed) {
      return true;
    }
    return !isChatInitial;
  }
  
  const dealReturn = () => {
    store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: false })
    history.push({
      pathname: `/gpt-story/${taskID}/${lessonId}`
    })
  }
  
  const buildProcesses = (processes) => {
    if (processes) {
      let data = JSON.parse(JSON.stringify(processes));
      data.forEach(item => {
        item.matched = false;
        item.keywords = Array.from(new Set(item.keywords));
      })
      setProcesses(data);
    }
  }
  
  const checkKeywordMatching = (matchedWords) => {
    if (matchedWords) {
      let TempProcess = [...vProcesses]
      for (let index = 0; index < TempProcess.length; index++) {
        const checkbox = TempProcess[index].keywords;
        for (let i = 0; i < checkbox.length; i++) {
          const keyword = checkbox[i];
          for (let c = 0; c < matchedWords.length; c++) {
            const word = matchedWords[c].word;
            if (word === keyword) {
              TempProcess[index].matched = true;
              TempProcess[index].keywords.map((value) => {
                if (value === keyword) {
                  if (TempProcess[index].selected === undefined || TempProcess[index].selected.length === 0) {
                    TempProcess[index].selected = [value];
                  } else {
                    TempProcess[index].selected.push(value);
                  }
                }
              })
            }
          }
        }
        setProcesses(TempProcess);
      }
    }
  }
  
  
  const startRolePlay = () => {
    if (hasRolePlayingData && !checkedReDialog) {
      setIsConfirmDialog(true)
      return
    }
    isSafari(async () => {
      if (vTask &&
        vTask.messages &&
        vTask.messages[0] &&
        vTask.messages[1] &&
        vTask.chat
      ) {
        await startGPTMessage(vTask.chat.id).then((data) => {
          if (data?.data?.autoAnswer) {
            setAutoAnswer(data?.data?.autoAnswer)
          }
        });
        const warnTime = vTask.chat.roleplayTime - 1 >= 0 ? vTask.chat.roleplayTime - 1 : 0
        setTimeout(() => {
          setWarningText(WarningGPTTextEndSoon)
        }, 1000 * 60 * warnTime)
        setTimeout(async () => {
          setIsTimeUpFlg(true)
          setIsFinishDialog(true)
        }, vTask.chat.roleplayTime >= 0 ? 1000 * 60 * vTask.chat.roleplayTime : 0)
        setCountdownTime(Date.now() + 1000 * 60 * vTask?.chat?.roleplayTime)
        store.dispatch({ type: IS_ROLE_PLAY_ONGOING, status: true })
        startCountdown();
        setIsplayed(true);
        getGif(avatarKey, 'Talking');
        await getAudio(null, vTask.messages[1].text, true);
        setDialogTalkScripts([...vTask.messages])
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
    if (isOpenConfirmDialog || isOpenStartOverDialog || store.getState().dialogue_status) {
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
  
  
  const getProcessTokenHandler = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };
  
  const downloadFile = async (val, name) => {
    setIsLoadingMask(true);
    onDownload(val + "?" + vProcessToken, name, () => {
      setIsLoadingMask(false);
    });
  }
  const handleTextareaInputFocus = () => {
    setInFocus(true);
    //setDelChatMsg('input')
    closeConnection();
    //tempTrans = '';
  }
  
  const handleTextareaInputBlur = () => {
    setInFocus(false);
    dealIconShow();
  }
  
  const textSubmitClasses = useMemo(() => {
    if (vIsplayed) {
      if (isTimeUpFlg) {
        return 'role-play-handle-btn-not-start'
      } else {
        return 'role-play-handle-btn-active'
      }
    } else return 'role-play-handle-btn-not-start'
  }, [vIsplayed, isTimeUpFlg]);
  
  return (
    <div className="role_play_main_area_wrap">
      <div className={styles.fast_text_page_flex}>
        <div className={styles.fast_text_page_flex_left}>
          <div className="video-chat-keyword-list-main">
            <Row>
              <Col>
                <div className="video-chat-name-context">
                  {(isSingleMode()) && <button title={t('general.return')} className="video-chat-btn-click-back"
                                               onClick={dealReturn}>{t('general.return')}</button>}
                  {vTask?.chat?.section.persona.themeName ? <div>
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
                            return (<div key={v}>
                              <p className="video-chat-section-name" key={k}>{v}</p>
                            </div>)
                          })}
                      </div>
                  </span>
                </div>
                <div className="video-chat-keyword-list">
                  <ShowBut onChange={handleChange} checkState={overallScoring}
                           buttonLabel={`全てを表示する`}/>
                  <KeywordList vProcesses={vProcesses} setProcesses={setProcesses}></KeywordList>
                </div>
              </Col>
            </Row>
          </div>
        </div>
        <div className={styles.fast_text_page_flex_right}>
          <div className={styles.fast_text_page_flex_right_avatar}>
            {chatPersonName && <div className={styles.chat_person_name}>{chatPersonName}</div>}
            {
              chatPerson ?
                <img
                  src={chatPerson}
                  alt="Chat People"
                  className={styles.main_chat_people}
                  id="chat_person"
                  name="chat_person"
                />
                :
                null
            }
          </div>
          <div>
            <div className="chat_img_sec mb-2">
              <Col className="flex-grow-chat-chart">
                <Row>
                  <div style={{ width: "100%" }}>
                    <Row className="talk_chart_contain">
                      <Row className="ml-1">
                        <div className={styles.talk_chart}>
                          {delChatMsg === 'stt' && sttOpened && !inFocus ? <IWaveformPc value={volume}/> : <IWaveformPcGrey/>}
                        </div>
                        <span className={styles.countdown}>
                          <Countdown
                              key="countdown"
                              ref={countdownRef}
                              autoStart={false}
                              date={vCountdownTime}
                              zeroPadTime={2}
                              onComplete={onCompleteCountdown}
                              renderer={countdownRenderer}
                              overtime={false}
                          />
                        </span>
                        {inFocus ? (<span className={styles.is_editing}>テキスト編集中</span>) : null}
                      </Row>
                    </Row>
                  </div>
                </Row>
                <Row className={styles.textarea_row}>
                  <div className={styles.video_chat_input_area}>
                    <div className={styles.video_chat_input_button}>
                    <textarea
                      autoFocus={vSetVideoFocus}
                      className={`${styles.video_chat_input} ${inFocus ? styles.video_chat_input_in_focus : ''}`}
                      disabled={!vIsplayed || isSpeaking || isSendMessageRequesting}
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
                  </div>
                  {warningText ?
                    <div
                      className={styles.warning_area}
                      dangerouslySetInnerHTML={{ __html: warningText }}
                    />
                    : null}
                
                </Row>
              </Col>
            </div>
          </div>
        </div>
        <div className={styles.fast_text_buttons}>
          <div className={styles.fast_text_bottom_left_btn}>
            <div className={styles.free_storyright_bottom_item} onClick={() => {
              if (!ableToNext()) {
                setIsOpenStartOverDialog(true);
              }
            }}>
              <FreeStoryResume processTag={!ableToNext()}/>
            </div>
          </div>
          
          <div className="video-chat-bottom-middle-btn">
            <button className={`start-role-play-btn ${vIsplayed ? 'start-role-play-btn-active' : ''}`}
                    disabled={vIsplayed} onClick={startRolePlay}>
              <img src={rolePlayBtnMicphone} alt=""/>
              <span>ロープレ開始</span>
            </button>
            <button
              disabled={vChatMsg.length === 0 || vReflectClickIsDisable || isTimeUpFlg}
              className={`role-play-handle-btn ${textSubmitClasses}`}
              autoFocus={vSetSendFocus}
              onClick={dealIconHide}
              id={autoId()}
            >
              テキストを反映
            </button>
            <button
              disabled={vChatMsg.length === 0 || vReflectClickIsDisable || isTimeUpFlg}
              className={`role-play-handle-btn ${vIsplayed ? 'role-play-handle-btn-start' : 'role-play-handle-btn-not-start'} ${vIsplayed ? vSetDelFocus ? 'role-play-handle-btn-onfocus' : 'role-play-handle-btn-onblur' : ''}`}
              onClick={isTimeUpFlg || (vIsplayed ? delChatMsg !== 'input' ? dealCancel : dealCancelAndBackStt : null)}
              id="cancel_icon" autoFocus={vSetDelFocus}
              name="cancel_icon">
              言い直す
            </button>
          </div>
          <div
            className={styles.chatNext}
          >
            <button
              className={`close-role-play-btn ${!ableToNext() ? 'close-role-play-btn-orange' : 'close-role-play-btn-gray'}`}
              disabled={ableToNext()}
              onClick={() => setIsOpenConfirmDialog(true)}
            >
              <span>採点する</span>
              <img src={!ableToNext() ? closeRolePlayBtnOrangeArrow : closeRolePlayBtnGrayArrow} alt="score_next"/>
            </button>
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
              let taskSort = lessonTasksRes.data.sort((a, b) => a.displayNumber - b.displayNumber);
              store.dispatch(lessonTaskAll(taskSort))
              store.dispatch(selectTask(taskSort))
              store.dispatch(updateAllSectionId(hasRolePlayingData.record?.commitId))
              setLocationState({
                select_task: state, pname: 'multiple-scenarios'
              }, `video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`);
            }
            const path = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}`
            const multiPath = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`
            await history.push({
              pathname: hasRolePlayingData.record?.isSelectAllModel === '1' ? multiPath : path, state: {
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
          }}
          title='ロープレの途中保存データがあります。
                        <br><br>新規ロープレを開始すると、<br>途中保存データが削除されます。'
        />
        <ConfirmDialog
          title={t("videochat.to_score_confirmation")}
          open={isOpenConfirmDialog}
          setOpen={setIsOpenConfirmDialog}
          onConfirm={dealSingleScore}
        />
        <GPTChatErrorDialog
          title={'エラーが発生しました'}
          content={gptErrorDialogContent}
          open={isGPTErrorDialog}
          setOpen={setIsGPTErrorDialog}
          onConfirm={gptErrorConfirmHandler}
        />
        <GPTChatFinishDialog
          open={isFinishDialog}
          setOpen={setIsFinishDialog}
          onConfirm={dealSingleScore}
        />
        <GPTChatFirstConfirmDialog
          open={isFirstConfirmDialog}
          setOpen={setIsFirstConfirmDialog}
          onConfirm={() => setIsFirstConfirmDialog(false)}
        />
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
        <div className={styles.fast_text_page_flex_right2}>
          <GPTChatScripts
            vAvatarName={avatarKey}
            scripts={dialogTalkScripts}
            vTask={vTask}
            defaultAvatarImg={defaultAvatarGIF}
          />
        </div>
      </div>
      <LoadingMask val={vIsLoadingMask}/>
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
  return {
    selectTask: (select_task) => {
      dispatch(selectTask(select_task));
    },
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(GPTChatPage);

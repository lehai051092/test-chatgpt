import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Col} from 'reactstrap';
import {useHistory, useLocation, useParams} from "react-router-dom";
import {zeroPad} from 'react-countdown';
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import classes from './styles.module.css';
import ChatApi from "../../../request/textSpeechTransitionApi/chatApi";
import {
  deleteScoring,
  finishScoring,
  getChatMatchWords,
  getCheckSavedChat,
  getLessonList,
  postTexhToSpeech,
  sendGPT,
  startChat, startGPTMessage
} from '../../../request/backendApi/api';
import {
  CURRENT_CHAT_INFO,
  CURRENT_CHOSED_PERSONA,
  CURRENT_SECTION_COUNT_DOWN,
  IS_ROLE_PLAY_ONGOING
} from '../../../storage/consts';
import store from '../../../storage'
import ShowBut from './ShowBut'
import {getSpeakerId} from '../../../utils/personaImageMapping';
import KeywordList from './KeywordsList'
import ICoreFrame from '../../../constituents/ICoreFrame';
import LoadingMask from '../../../constituents/ILoadingMask';
import {
  MaximumNumberOfCharactersSentGPTText,
  MaximumNumberOfCharactersSentGPTTextLength,
  setLocationState,
  WarningGPTTextEndSoon
} from '../../../utils/util';
import getGifImage from '../../../utils/newMapFIle';
import rolePlayBtnMicphone from '../../../property/icons/role-play-btn-micphone.png';
import IWaveformMobile from '../../../constituents/IWaveformMobile';
import IWaveformMobileGray from '../../../constituents/IWaveformMobileGray';
import timer_icon from '../../../property/images/role-play-timer-black.svg';
import closeRolePlayBtnGrayArrow from '../../../property/icons/close-role-play-btn-gray-arrow.svg';
import closeRolePlayBtnOrangeArrow from '../../../property/icons/close-role-play-btn-orange-arrow.svg';
import {
  selectTask,
  updateRestartText,
  updateRolePlayingSavedDuringProcess,
  updateTalkScriptDialog,
  updateTalkScriptDialogPosition
} from "../../../storage/reduxActions";
import {connect} from "react-redux";
import ChatScriptMoveDialog from "./ChatScriptMoveDialog";
import {playGifPersonaAction} from "../../ComputerPages/GPTChatPage/gpt-utils";
import GPTChatErrorDialog from "../../ComputerPages/GPTChatPage/GPTChatErrorDialog";
import GPTChatFinishDialog from "../../ComputerPages/GPTChatPage/GPTChatFinishDialog";
import GPTChatFirstConfirmDialog from "../../ComputerPages/GPTChatPage/GPTChatFirstConfirmDialog";

// record STT first trigger time
var vMsgStartTime = '';
// voice duration that STT detects
var vSTTDuration = 0;
// timer Interval
let timerInterval = null;
let timeArray = [];
// stt text
let tempTrans = '';
let currentAudioElement = null
let currentAudioDivElement = null
const TabletGPTChatPage = ({talkScriptDialogOpen}) => {
  const location = useLocation();
  const {t} = useTranslation();
  let lastId = 0;
  const autoId = (prefix = 'video-chat-') => {
    lastId++;
    return `${prefix}${lastId}`;
  }
  let {taskID} = useParams();
  let {lessonId} = useParams();
  const history = useHistory();
  const [vChatMsg, setChatMsg] = useState('');
  const [vSetSendFocus, setSendFocus] = useState(false);
  const [vSetDelFocus, setDelFocus] = useState(false);
  const [vSetVideoFocus, setVideoFocus] = useState(false);
  const [vIsplayed, setIsplayed] = useState(false);
  const [vTask, setTask] = useState(null);
  const [speakerId, setSpeakerId] = useState('');
  const [vProcesses, setProcesses] = useState([]);
  const [chatPerson, setChatPerson] = useState();
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const countdownRef = useRef();
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [name, setName] = useState(false);
  const [isOpenSuspendDialog, setIsOpenSuspendDialog] = useState(false);
  const [isOpenStartOverDialog, setIsOpenStartOverDialog] = useState(false);
  const [overallScoring, setOverallScoring] = useState(false);
  const [vTextAreaInput, setTextAreaInput] = useState(false);
  const [sttOpened, setSttOpened] = useState(false);
  const [isChatInitial, setIsChatInitial] = useState(false);
  const [vTalkScriptList, setTalkScriptList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  const [vKeywordCurrentIndex, setKeywordCurrentIndex] = useState(0);
  const [vIsVertical, setIsVertical] = useState(true);
  const [avatarKey, setAvatarKey] = useState(null)
  const [volume, setVolume] = useState([0]);
  const [timer, setTimer] = useState(store.getState().current_section_count_down ? store.getState().current_section_count_down : '00:00');
  const [inputEdit, setInputEdit] = useState(true);
  const [delChatMsg, setDelChatMsg] = useState('');
  const [reflectLoading, setReflectLoading] = useState(false);
  const [dialogTalkScripts, setDialogTalkScripts] = useState([]);
  const [isTimeUpFlg, setIsTimeUpFlg] = useState(false)
  const [isFinishDialog, setIsFinishDialog] = useState(false);
  const [isFirstConfirmDialog, setIsFirstConfirmDialog] = useState(true);
  const [gptErrorDialogContent, setGPTErrorDialogContent] = useState('')
  const [isGPTErrorDialog, setIsGPTErrorDialog] = useState(false)
  const [warningText, setWarningText] = useState('')
  const [defaultAvatarGIF, setDefaultAvatarGIF] = useState(null)
  const [isSendMessageRequesting, setIsSendMessageRequesting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoAnswer, setAutoAnswer] = useState(null)
  const [inFocus, setInFocus] = useState(false)
  
  const dialogOpenCloseHandler = useCallback((value) => {
    store.dispatch(updateTalkScriptDialog(value))
  }, [])
  
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
      setTimer('00:00');
      closeConnection();
      audioOffHandler()
      store.dispatch({type: CURRENT_SECTION_COUNT_DOWN, time: ''})
    }
  }, [])
  
  
  useEffect(async () => {
    const res = await getCheckSavedChat()
    store.dispatch(updateRolePlayingSavedDuringProcess(res && res.data ? res.data : null))
    await GetTask();
  }, [location.pathname]);
  
  useEffect(async () => {
    if (avatarKey) {
      setSpeakerId(getSpeakerId(avatarKey));
      let img = await getGifImage(avatarKey, 'videoHead')
      setChatPerson(img)
      setDefaultAvatarGIF(img)
    }
  }, [store.getState().currentChosedPersona])
  
  useEffect(() => {
    // in case redirecting from history page and will cause error if no lessonId in score page
    if (!store.getState()?.currentChosedPersona?.id || store.getState()?.currentChosedPersona?.id !== lessonId) {
      getLessonList("/lessons").then((res) => {
        if (res.data) {
          let currentPerson = res.data.find(item => item.id === lessonId);
          store.dispatch({type: CURRENT_CHOSED_PERSONA, persona: currentPerson})
        }
      })
    }
  }, []);
  
  const changeDeviceAspectRation = () => {
    const isPortrait = window.matchMedia("(orientation: portrait)").matches;
    const isLandscape = window.matchMedia("(orientation: landscape)").matches;
    if (isPortrait) {
      setIsVertical(true);
    } else if (isLandscape) {
      setIsVertical(false)
    }
  }
  
  useEffect(() => {
    changeDeviceAspectRation()
    window.addEventListener("resize", changeDeviceAspectRation)
    return () => {
      window.removeEventListener('resize', changeDeviceAspectRation);
    };
  }, []);
  
  
  // timer Interval
  const initTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timeArray = [vTask?.chat?.roleplayTime ? vTask?.chat?.roleplayTime : 0, 0]
    // timeArray = [0, '10']
    timerInterval = setInterval(() => {
      let minuteOffset = parseInt(timeArray[0]);
      let secondOffset = parseInt(timeArray[1]) - 1;
      if (secondOffset < 0) {
        secondOffset = 59
        minuteOffset = timeArray[0] - 1;
      }
      if (minuteOffset < 0) {
        secondOffset = 0
        minuteOffset = 0
      }
      timeArray = [minuteOffset, secondOffset];
      setTimer(`${zeroPad(minuteOffset)}:${zeroPad(secondOffset)}`);
    }, 1000);
  }
  
  
  function isSingleMode() {
    return !location.pathname.includes('multiple-scenarios');
  }
  
  const startCountdown = () => {
    countdownRef.current?.start();
    initTimer();
  }
  const onChatMsgType = (e) => {
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
      setSendFocus(false);
      setDelFocus(false);
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
  }, []);
  
  
  function startConnection() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    navigator.mediaDevices.getUserMedia({audio: true})
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
      .catch(() => {
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
    // navigator.permission is not supported in safari
    try {
      setVideoFocus(true);
      setDelFocus(false);
      setSendFocus(false);
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
      console.log(error);
    }
  }
  
  // deal response from google speech to text server
  const processTranscription = useCallback(
    (transcription) => {
      // use Azure STT
      tempTrans += transcription.transcription;
      if (tempTrans && tempTrans.length > MaximumNumberOfCharactersSentGPTTextLength) {
        setWarningText(MaximumNumberOfCharactersSentGPTText)
      } else {
        setWarningText('')
        vSTTDuration = parseFloat(vSTTDuration) + parseFloat(transcription?.duration);
        setChatMsg(tempTrans);
      }
    }, []
  );
  
  const dealIconShow = () => {
    // indicate whether stream was opened
    setSttOpened(true);
    // start recording
    setVideoFocus(false)
    setSendFocus(true);
    setDelFocus(false);
    startConnection();
    setTextAreaInput(false);
    // close reflec loading
    setReflectLoading(false);
  }
  
  // if input by micphone
  const dealIconHide = () => {
    setReflectLoading(true);
    setWarningText('')
    closeConnection();
    tempTrans = '';
    setChatMsg('');
    if (delChatMsg === 'stt') {
      setSttOpened(false);
      playAct('byMicphone');
    } else {
      if (vTask) {
        playAct();
      }
    }
  }
  
  const dealCancel = () => {
    setChatMsg('');
    tempTrans = '';
    vSTTDuration = 0;
    setWarningText('')
  }
  
  // main initial function
  const GetTask = async () => {
    tempTrans = '';
    let cur_login_user_info = store.getState().cacheMstUserInfo;
    let cur_login_user_header = store.getState().login_task_all;
    let mstDBUserName = cur_login_user_header?.userId?.value ? cur_login_user_header.userId.value : '';
    let userRole = '';
    if (cur_login_user_info.salsmanSeiKj) {
      mstDBUserName = cur_login_user_info.salsmanSeiKj + cur_login_user_info.salsmanMeiKj;
    }
    
    if (cur_login_user_header.userRoles.includes("GENERAL_USER")) {
      userRole = 'RECRUITER';
    }
    
    let isSelectAllModel = '';
    let params = {
      userName: mstDBUserName,
      userRole: userRole,
      isSelectAllModel: isSelectAllModel,
    }
    
    let response;
    response = await startChat(taskID, params);
    dialogOpenCloseHandler(false)
    store.dispatch(updateTalkScriptDialogPosition(null
    ))
    setTimer(response.data.chat.roleplayTime + ':00')
    setAvatarKey(response.data.chat.section.persona.avatar)
    setSpeakerId(getSpeakerId(response.data.chat.section.persona.avatar));
    let img = await getGifImage(response.data.chat.section.persona.avatar, 'videoHead')
    setChatPerson(img)
    setDefaultAvatarGIF(img)
    setName(response.data.chat.section.persona.name);
    setTask(response.data);
    // for delete record if leaving ongoing role play
    store.dispatch({type: CURRENT_CHAT_INFO, payload: response?.data?.chat});
    buildProcesses(response.data.processes);
    
    // set chat status as initializtion completed
    setIsChatInitial(true);
    // set talk Script
    setCurrentIndex(0);
    setKeywordCurrentIndex(0);
    setTalkScriptList(response.data?.scriptLines ?? []);
    if (response.data && response.data.chat) {
      const wordsRes = await getChatMatchWords(response.data.chat.id)
      checkKeywordMatching(wordsRes.data, response.data.processes)
      if (wordsRes.data && wordsRes.data.length > 0) {
        setOverallScoring(true)
      }
    }
  }
  
  // to send message
  const playAct = async (origin) => {
    if (isSendMessageRequesting) return
    else setIsSendMessageRequesting(true)
    let params = {
      text: vChatMsg,
    }
    if ('byMicphone' === origin) {
      // from micphone
      if (vSTTDuration !== 0) {
        params.startTime = new Date().toISOString();
        let endTime = new Date(params.startTime);
        // endTime.setSeconds(endTime.getSeconds() + vSTTDuration);
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
      vSTTDuration = 0;
      tempTrans = ''
      setWarningText('')
      setIsSendMessageRequesting(false)
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
        text: value,
        speakerId: id ? id : speakerId
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
    setIsOpenDialog(false);
    setIsLoadingMask(true);
    await finishScoring(vTask.chat.id, '1');
    store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
    setIsLoadingMask(false);
    setLocationState({
      isShowStory: true,
      isShowKururinpaImg: true,
      chatId: vTask.chat.id,
      isFastText: false,
      item: vTask.chat,
      isGPT: true
    }, `ai-score/${taskID}/${lessonId}`);
    history.push({pathname: `/ai-score/${taskID}/${lessonId}`});
  }
  
  const submitDisableControl = () => {
    return reflectLoading || ableToNext()
  }
  
  const renderOperateBtn = () => {
    return <div
    >
      <button
        disabled={submitDisableControl()}
        onClick={() => setIsOpenConfirmDialog(true)}
        className={ableToNext() ? classes.disable : classes.single_button}>
        採点する
      </button>
    </div>
  }
  
  const renderOperateBtnLandscape = () => {
    return <div
    >
      <button
        onClick={ableToNext() ? () => {
        } : () => setIsOpenConfirmDialog(true)}
        className={ableToNext() ? classes.disable : classes.single_button}
      >
        <span>採点する</span>
        <img src={!ableToNext() ? closeRolePlayBtnOrangeArrow : closeRolePlayBtnGrayArrow} alt={'score-next'}></img>
      </button>
    </div>
  }
  
  const renderPauseDialogByStatus = () => {
    let allTask = store.getState().select_task;
    if (allTask && allTask instanceof Array) {
      return <ConfirmDialog
        open={isOpenSuspendDialog}
        setOpen={setIsOpenSuspendDialog}
        showSecOption="false"
        onConfirm={dealRollBack}
        title='採点せずにセクション選択画面へ戻ります。<br>よろしいでしょうか？'
      />
    }
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
  
  const dealRollBack = () => {
    deleteScoring(vTask.chat.id).then(res => {
      if (res?.data?.responseStatus === 'SUCCESS') {
        store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
        history.push({pathname: `/start-new-role-play`,});
        setLocationState({lessonId}, 'start-new-role-play')
      }
    })
  }
  
  
  const dealReturn = () => {
    store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
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
  const startRolePlay = async () => {
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
      store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: true})
      startCountdown();
      setIsplayed(true);
      getGif(avatarKey, 'Talking')
      getAudio(null, vTask.messages[1].text, true);
      setDialogTalkScripts([...vTask.messages])
      setTextAreaInput(false);
    } else {
      setTimeout(() => {
        startRolePlay();
      }, 1000)
    }
  }
  
  const startOver = () => {
    setChatMsg('');
    window.location.reload();
    store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false});
  }
  
  document.onkeydown = function (event) {
    const e = event ? event : (window.event ? window.event : null);
    if (isOpenConfirmDialog || isOpenDialog || isOpenSuspendDialog || isOpenStartOverDialog || store.getState().dialogue_status) {
      // if dialogue is open, prevent event to operate
      return;
    }
    if (e != null) {
      switch (e.keyCode) {
        case 13://enter
        {
          if (vIsplayed) {
            if (vSetSendFocus && !(vChatMsg.length === 0 || reflectLoading)) {
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
          if (!vTextAreaInput && vIsplayed) {
            setDelFocus(false);
          }
        }
          break;
        // down arrow
        case 40: {
          if (!vTextAreaInput && vIsplayed) {
            setDelFocus(true);
          }
        }
          break;
      }
    }
    
  }
  
  const handleChange = (event) => {
    setOverallScoring(event.target.checked);
  };
  
  const handleTextareaInputFocus = () => {
    setInFocus(true);
    //setDelChatMsg('input')
    closeConnection();
    //tempTrans = '';
  }
  
  const handleTextareaInputBlur = (e) => {
    setInFocus(false);
    dealIconShow();
    //store.dispatch(updateRestartText(e.target.value))
  }
  
  useEffect(() => {
    if (delChatMsg === '' || delChatMsg === 'stt' && vChatMsg.length !== 0) {
      setInputEdit(true);
    } else {
      setInputEdit(false);
    }
  }, [vChatMsg])
  
  useEffect(() => {
    const body = document.querySelector(".main-content-inr");
    if (body) {
      body.style.minHeight = 'calc(100vh - 48px)'
    }
  }, [])
  
  const dealCancelAndBackStt = async () => {
    setDelChatMsg('stt')
    if (vTask) {
      // clear stt text
      tempTrans = '';
      setChatMsg('');
      await getGif(avatarKey, 'videoHead');
      dealIconShow();
    }
  }
  
  const startOrRestartOrSaveButton = useMemo(() => {
    return (
      <div style={{position: 'relative', top: -1}}
           className={`${vIsplayed ? classes.start_role_play_btn_box_display_none : classes.start_role_play_btn_box1}`}>
        <button
          className={`${classes['start-role-play-btn']} ${vIsplayed ? classes['start-role-play-btn-active'] : ''}`}
          disabled={vIsplayed}
          onClick={async () => {
            await startRolePlay()
          }}
        >
          <img src={rolePlayBtnMicphone} alt=""/>
          <span>ロープレ開始</span>
        </button>
      </div>
    )
  }, [currentIndex, lessonId, startRolePlay, taskID, vIsplayed, vTalkScriptList, vTask?.chat]);
  
  const gptErrorConfirmHandler = useCallback(async () => {
    closeConnection()
    await GetTask()
    setIsGPTErrorDialog(false)
    setGPTErrorDialogContent('')
    await getGif(avatarKey, 'videoHead')
    setIsplayed(false);
    setDialogTalkScripts([])
    setChatMsg('')
    setWarningText('')
    countdownRef.current?.stop();
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = null
  }, [vTask]);
  
  return (
    <>
      {
        talkScriptDialogOpen && dialogTalkScripts ?
          <ChatScriptMoveDialog
            vAvatarName={avatarKey}
            scripts={dialogTalkScripts}
            vTask={vTask}
            defaultAvatarImg={defaultAvatarGIF}
          />
          : null
      }
      <ICoreFrame
        onBack={!(isSingleMode()) ? null : () => {
          dealReturn();
        }}
        component={
          vIsVertical ?
            <>
              <div className={classes.main_content_inr_body_sp}>
                <div className={classes.main_content_inr_child_box_sp}>
                  {
                    vTask?.chat?.section.persona.themeName ?
                      <div className={classes.video_chat_name_context}>
                        <label>{`${vTask?.chat?.section.persona.themeName} ${vTask?.chat?.section.persona.scenarioName}`}</label>
                        <label>{`${vTask?.chat?.section.persona.persona}`}</label>
                      </div> : <></>
                  }
                  <div className={classes.role_play_main_area_sp}>
                    <div
                      className={classes.video_chat_btn_tips}
                    >
                      <p>
                        {t('videochat.ongoing_section')}
                      </p>
                      {
                        vTask &&
                        (vTask?.chat?.section?.name).split('\n').map((v, k) => {
                          return (<p style={{textTransform: 'none'}} key={k}>{v}</p>)
                        })
                      }
                    </div>
                    <div className={classes.flex_mobile_column_reverse}>
                      <Col className={`${classes.chat_avatar_area} mb-sm-`}>
                        <div className={classes.chat_img_container}>
                          <div className={`chat_img_sec ${vIsplayed ? 'mb-3' : ''}`}>
                          
                          </div>
                        </div>
                        <div>
                          {startOrRestartOrSaveButton}
                        </div>
                        <div className={classes.video_chat_keyword_list_main}>
                          <div className={classes.video_chat_keyword_list}>
                            <div className={classes.video_chat_keyword_wrap}>
                              <div className={classes.video_chat_keyword_wrap_left}>
                                {warningText ?
                                  <div
                                    className={classes.warning_area}
                                    dangerouslySetInnerHTML={{__html: warningText}}
                                  />
                                  : null}
                              </div>
                              <div>
                                <div className={classes.talk_script_buttons}>
                                  <button
                                    className={classes.talk_script_btn}
                                    onClick={() => {
                                      dialogOpenCloseHandler(true)
                                    }}
                                  >
                                    会話履歴を表示する
                                  </button>
                                </div>
                                <div>
                                  <ShowBut showFlg={true} onChange={handleChange}
                                           checkState={overallScoring}
                                           buttonLabel="プロセス/キーワードを表示する"/>
                                </div>
                              </div>
                            </div>
                            {
                              overallScoring ?
                                <KeywordList
                                  vProcesses={vProcesses}
                                  setProcesses={setProcesses}
                                  currentIndex={vKeywordCurrentIndex}
                                  setCurrentIndex={setKeywordCurrentIndex}
                                />
                                : null
                            }
                          </div>
                        </div>
                      </Col>
                      <div className={classes.vitual_chat_avatar}>
                        {name &&
                          <div className={classes.chat_name_box}>
                            {name}
                          </div>
                        }
                        {
                          chatPerson ?
                            <img
                              src={chatPerson}
                              alt="Chat People"
                              className={classes.main_chat_people}
                              id="chat_person"
                              name="chat_person"
                            />
                            :
                            null
                        }
                      </div>
                    </div>
                    <div className={`mb-20 ${classes.video_chat_input_area}`}>
                      <div className={classes.video_chat_input_button}>
                        <textarea
                          onFocus={() => {
                            handleTextareaInputFocus()
                          }}
                          onBlur={(e) => {
                            handleTextareaInputBlur(e)
                          }}
                          autoFocus={vSetVideoFocus}
                          className={classes.video_chat_input}
                          disabled={!vIsplayed || isSpeaking || isSendMessageRequesting}
                          type="text"
                          value={vChatMsg}
                          onChange={(e) => onChatMsgType(e)}
                          autoComplete="off"
                        />
                      </div>
                      <div className={classes.video_chat_tablet_wave_timer}>
                        <div className={classes.video_chat_tablet_wave}>
                          {
                            delChatMsg === 'stt' && sttOpened && !inFocus
                              ?
                              <IWaveformMobile value={volume} isVertical={true}
                                               isTablet={true}/> :
                              <IWaveformMobileGray isVertical={true} isTablet={true}/>
                          }
                        </div>
                        <div className={classes.video_chat_tablet_timer}>
                          <img src={timer_icon} alt={'timer-icon'}/>
                          <span>{timer}</span>
                        </div>
                        {inFocus ? (<span className={classes.is_editing}>テキスト編集中</span>) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className={classes.tablet_control_buttons}>
                  <div className={classes.tablet_control_buttons_left}>
                    <button className={ableToNext() ? classes.disable : ''}
                            onClick={ableToNext() ? () => {
                            } : () => {
                              setIsOpenStartOverDialog(true)
                            }}>最初からやり直す
                    </button>
                  </div>
                  <div className={classes.tablet_control_buttons_middle}>
                    <button
                      className={`${ableToNext() ? classes.disable : ''} ${isTimeUpFlg ? classes.disable : ''}`}
                      onClick={reflectLoading || vChatMsg.length === 0 ? () => {
                      } : dealIconHide} id={autoId()}
                    >反映
                    </button>
                    <button
                      className={`${ableToNext() ? classes.disable : ''} ${isTimeUpFlg ? classes.disable : ''}`}
                      onClick={vIsplayed ? delChatMsg !== 'input' ? dealCancel : dealCancelAndBackStt : null}>
                      言い直す
                    </button>
                  </div>
                  <div className={classes.tablet_control_buttons_right}>
                    {
                      renderOperateBtn()
                    }
                  </div>
                </div>
              </div>
            </> :
            // landscape
            <>
              <div className={classes.main_content_inr_body_sp}>
                <div>
                  {
                    vTask?.chat?.section.persona.themeName ?
                      <div className={classes.video_chat_name_context}>
                        <label>{`${vTask?.chat?.section.persona.themeName} ${vTask?.chat?.section.persona.scenarioName}`}</label>
                        <label>{`${vTask?.chat?.section.persona.persona}`}</label>
                      </div> : <></>
                  }
                  <div className={classes.role_play_main_area_sp_landscape}>
                    <div className={classes.flex_mobile_column_reverse_landscape}>
                      <Col className={`${classes.chat_avatar_area} mb-sm-`}>
                        <div className={classes.chat_img_container}>
                          <div className={classes.tablet_content_flex}>
                            <div
                              className={classes.tablet_landscape_left_content_landscape}>
                              <div>
                                <p>
                                  {t('videochat.ongoing_section')}
                                </p>
                              </div>
                              <div className={classes.tablet_subtitle_left}>
                                {
                                  vTask &&
                                  (vTask?.chat?.section?.name).split('\n').map((v, k) => {
                                    return (<p style={{textTranform: 'none'}}
                                               key={k}>{v}</p>)
                                  })
                                }
                              </div>
                              <div className={classes.video_chat_keyword_list_all}>
                                {warningText ?
                                  <div className={classes.warning_area_landscape_wrap}>
                                    <div
                                      className={classes.warning_area}
                                      dangerouslySetInnerHTML={{__html: warningText}}
                                    />
                                  </div>
                                  : null}
                                <div className={classes.video_chat_keyword_list_main}>
                                  <div
                                    className={classes.video_chat_keyword_list_landscape}>
                                    <div className={classes.talk_script_buttons_hr}>
                                      <button
                                        className={classes.talk_script_btn}
                                        onClick={() => {
                                          dialogOpenCloseHandler(true)
                                        }}
                                      >
                                        会話履歴を表示する
                                      </button>
                                    </div>
                                    <div
                                      style={{padding: '0 1px'}}
                                    >
                                      <ShowBut
                                        showFlg={false}
                                        onChange={handleChange}
                                        checkState={overallScoring}
                                        buttonLabel="プロセス/キーワードを表示する"
                                      />
                                    </div>
                                    
                                    {
                                      overallScoring ?
                                        <KeywordList
                                          vProcesses={vProcesses}
                                          setProcesses={setProcesses}
                                          currentIndex={vKeywordCurrentIndex}
                                          setCurrentIndex={setKeywordCurrentIndex}
                                        />
                                        : null
                                    }
                                  </div>
                                </div>
                                {startOrRestartOrSaveButton}
                              </div>
                            </div>
                            <div className={classes.vitual_chat_avatar_landscape}>
                              {name &&
                                <div className={classes.chat_name_box_landscape}>
                                  {name}
                                </div>
                              }
                              {
                                chatPerson ?
                                  <img
                                    src={chatPerson}
                                    alt="Chat People"
                                    className={classes.main_chat_people_landscape}
                                    id="chat_person"
                                    name="chat_person"
                                  />
                                  :
                                 null
                              }
                              
                            </div>
                          </div>
                        </div>
                      </Col>
                    </div>
                    <div className={`mb-20 ${classes.video_chat_input_area_landscape}`}>
                      <div className={classes.video_chat_input_button_landscape}>
                        <textarea
                          onFocus={() => {
                            handleTextareaInputFocus()
                          }}
                          onBlur={(e) => {
                            handleTextareaInputBlur(e)
                          }}
                          autoFocus={vSetVideoFocus}
                          className={classes.video_chat_input}
                          disabled={!vIsplayed || isSpeaking || isSendMessageRequesting}
                          //type="text"
                          value={vChatMsg}
                          onChange={(e) => onChatMsgType(e)}
                          autoComplete="off"
                        />
                      </div>
                      <div className={classes.video_chat_tablet_wave_timer_landscape}>
                        <div className={classes.video_chat_tablet_wave}>
                          {
                            delChatMsg === 'stt' && sttOpened  && !inFocus
                              ?
                              <IWaveformMobile value={volume} isVertical={false}
                                               isTablet={true}/> :
                              <IWaveformMobileGray isVertical={false} isTablet={true}/>
                          }
                        </div>
                        <div className={classes.video_chat_tablet_timer_landscape}>
                          <img src={timer_icon} alt={'timer-icon'}/>
                          <span>{timer}</span>
                        </div>
                        {inFocus ? (<span className={classes.is_editing}>テキスト編集中</span>) : null}
                      </div>
                    </div>
                  </div>
                  <div className={classes.tablet_control_buttons_landscape}>
                    <div className={classes.tablet_control_buttons_left_landscape}>
                      <button className={ableToNext() ? classes.disable : ''}
                              onClick={ableToNext() ? () => {
                              } : () => {
                                setIsOpenStartOverDialog(true)
                              }}>最初からやり直す
                      </button>
                    </div>
                    <div className={classes.tablet_control_buttons_middle_landscape}>
                      <button
                        className={`${ableToNext() ? classes.disable : ''} ${isTimeUpFlg ? classes.disable : ''}`}
                        onClick={reflectLoading || vChatMsg.length === 0 ? () => {
                        } : dealIconHide} id={autoId()}
                      >テキストを反映
                      </button>
                      <button
                        className={`${ableToNext() ? classes.disable : ''} ${isTimeUpFlg ? classes.disable : ''}`}
                        onClick={vIsplayed ? delChatMsg !== 'input' ? dealCancel : dealCancelAndBackStt : null}
                      >
                        言い直す
                      </button>
                    </div>
                    <div className={classes.tablet_control_buttons_right_landscape}>
                      {
                        renderOperateBtnLandscape()
                      }
                    </div>
                  </div>
                </div>
              </div>
            </>
        }
      />
      {
        renderPauseDialogByStatus()
      }
      {
        renderRestartDiagByStatus()
      }
      <LoadingMask val={vIsLoadingMask}/>
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
        vIsVertical={vIsVertical}
      />
      <GPTChatFirstConfirmDialog
        open={isFirstConfirmDialog}
        setOpen={setIsFirstConfirmDialog}
        onConfirm={() => setIsFirstConfirmDialog(false)}
      />
    </>
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
export default connect(mapStateToProps, mapDispatchToProps)(TabletGPTChatPage);

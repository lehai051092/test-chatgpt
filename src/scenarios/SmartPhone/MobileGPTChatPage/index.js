import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Col, Row} from 'reactstrap';
import {useHistory, useLocation, useParams} from "react-router-dom";
import {zeroPad} from 'react-countdown';
import ConfirmDialog from "../../../constituents/IConfirmDialog";
import styles from './styles.module.css'
import ICoreFrame from '../../../constituents/ICoreFrame';
import ChatApi from "../../../request/textSpeechTransitionApi/chatApi";
import {
  deleteScoring,
  finishScoring,
  getLessonList,
  getProcessToken,
  postTexhToSpeech,
  sendGPT,
  startChat,
  startGPTMessage
} from '../../../request/backendApi/api';
import {CURRENT_CHAT_INFO, CURRENT_CHOSED_PERSONA, IS_ROLE_PLAY_ONGOING} from '../../../storage/consts';
import store from '../../../storage'
import ShowBut from './ShowBut'
import {getSpeakerId} from '../../../utils/personaImageMapping';
import KeywordList from './KeywordsList'
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import {
  browserRedirect,
  MaximumNumberOfCharactersSentGPTText,
  MaximumNumberOfCharactersSentGPTTextLength,
  onDownload,
  setLocationState,
  WarningGPTTextEndSoon
} from '../../../utils/util';
import {getManualUrl2} from "../../../utils/runtime";
import LoadingMask from '../../../constituents/ILoadingMask';
import cancel from '../../../property/images/free_story/cancel.png'
import rolePlayBtnMicphone from '../../../property/icons/role-play-btn-micphone.png';
import IWaveformMobile from '../../../constituents/IWaveformMobile';
import IWaveformMobileGrey from '../../../constituents/IWaveformMobileGray';
import getGifImage from '../../../utils/newMapFIle';
import clockIcon from '../../../property/images/role-play-timer-black.svg';
import {playGifPersonaAction} from "../../ComputerPages/GPTChatPage/gpt-utils";
import GPTChatErrorDialog from "../../ComputerPages/GPTChatPage/GPTChatErrorDialog";
import GPTChatFinishDialog from "../../ComputerPages/GPTChatPage/GPTChatFinishDialog";
import GPTChatFirstConfirmDialog from "../../ComputerPages/GPTChatPage/GPTChatFirstConfirmDialog";

// record STT first trigger time
var vMsgStartTime = '';
// voice duration that STT detects
var vSTTDuration = 0;
// stt text
let tempTrans = '';
let timerInterval = null;
let timeArray = [];
let currentAudioElement = null
let currentAudioDivElement = null
const FastTextPage = () => {
  const location = useLocation();
  const {t} = useTranslation();
  
  let lastId = 0;
  const autoId = (prefix = 'video-chat-') => {
    lastId++;
    return `${prefix}${lastId}`;
  }
  let {taskID} = useParams();
  let {lessonId} = useParams();
  
  // web cam-video
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
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  // timer
  const [timer, setTimer] = useState(store.getState().current_section_count_down ? store.getState().current_section_count_down : '00:00');
  const [isOpenSuspendDialog, setIsOpenSuspendDialog] = useState(false);
  const [isOpenStartOverDialog, setIsOpenStartOverDialog] = useState(false);
  const [overallScoring, setOverallScoring] = useState(false);
  const [vTextAreaInput, setTextAreaInput] = useState(false);
  // for control button click，when it is blank, clicking is not allowed
  const [vReflectClickIsDisable, setReflectClickIsDisable] = useState(true);
  // whether STT is used
  const [sttOpened, setSttOpened] = useState(false);
  // whether start chat api is completed
  const [isChatInitial, setIsChatInitial] = useState(false);
  // talk script
  const [microphonePermissionm, setMicrophonePermission] = useState(false);
  const [vIsLoadingMask, setIsLoadingMask] = useState(false);
  // waveform
  const [volume, setVolume] = useState([0]);
  const [inputEdit, setInputEdit] = useState(true);
  const [avatarKey, setAvatarKey] = useState(null)
  const [delChatMsg, setDelChatMsg] = useState('');
  const [vProcessToken, setProcessToken] = useState();
  const [isVertical, setIsVertical] = useState(true);
  const [vKeywordCurrentIndex, setKeywordCurrentIndex] = useState(0);
  const [isTimeUpFlg, setIsTimeUpFlg] = useState(false)
  const [isFinishDialog, setIsFinishDialog] = useState(false);
  const [isFirstConfirmDialog, setIsFirstConfirmDialog] = useState(true);
  const [gptErrorDialogContent, setGPTErrorDialogContent] = useState('')
  const [isGPTErrorDialog, setIsGPTErrorDialog] = useState(false)
  const [warningText, setWarningText] = useState('')
  const [name, setName] = useState(false);
  const [isSendMessageRequesting, setIsSendMessageRequesting] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoAnswer, setAutoAnswer] = useState(null)
  const [inFocus, setInFocus] = useState(false)
  
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
      audioOffHandler()
      closeConnection();
    }
  }, [])
  
  useEffect(() => {
    GetProcessToken()
  }, []);
  
  
  useEffect(() => {
    GetTask();
  }, [location.pathname]);
  
  useEffect(() => {
    if (avatarKey) {
      setSpeakerId(getSpeakerId(avatarKey));
      getGif(avatarKey, 'videoHead')
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
  
  function isSingleMode() {
    return !location.pathname.includes('multiple-scenarios');
  }
  
  // timer Interval
  const initTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    timeArray = [vTask?.chat?.roleplayTime ? vTask?.chat?.roleplayTime : 0, 0]
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
    // if to enable google stt
    // ChatApi.sendData(toSend.buffer, new Date().toISOString());
  }, []);
  
  
  function startConnection() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) {
      console.log("This browser does not support mic recording");
    }
    console.log("== startConnection-Start ==", new Date().getTime());
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
        console.log("== startConnection-End ==", new Date().getTime());
      })
      .catch((error) => {
        // audioContextRef?.current?.close().then(() => {
        //     audioContextRef.current = undefined;
        // });
        setDelChatMsg('input')
        setInputEdit(false);
        console.log(`Please check whether the microphone access permission of the browser is turned on normally!`)
        console.log(error.message);
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
    console.log("== closeConnection ==");
    // check the permission for mic and camera
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
      }).catch((error) => {
        console.log(error);
      });
      for (let index = 0; index < 25; index++) {
        setVolume([new Array(20).fill[0]]);
      }
    } catch (error) {
      console.log("Please check whether the microphone access permission of the browser is turned on normally");
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
        vSTTDuration = parseFloat(vSTTDuration) + parseFloat(transcription?.duration);
        setChatMsg(tempTrans);
        setWarningText('')
      }
    }, []
  );
  
  const dealIconShow = () => {
    console.log("== dealIconShow ==");
    // indicate whether stream was opened
    setSttOpened(true);
    // start recording
    setVideoFocus(false)
    setSendFocus(true);
    setDelFocus(false);
    startConnection();
    setTextAreaInput(false);
    setReflectClickIsDisable(false);
  }
  
  // if input by micphone
  const dealIconHide = () => {
    setReflectClickIsDisable(true);
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
  
  const dealCancelAndBackStt = () => {
    setDelChatMsg('stt')
    if (vTask) {
      tempTrans = '';
      setChatMsg('');
      setWarningText('')
      getGif(avatarKey, 'videoHead');
      dealIconShow();
    }
  }
  
  // main initial function
  const GetTask = async () => {
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
      userName: mstDBUserName,
      userRole: userRole,
      isSelectAllModel: isSelectAllModel,
    }
    
    let response;
    // if for single
    if (taskID) {
      response = await startChat(taskID, params);
    }
    setTimer(response.data.chat.roleplayTime + ':00')
    setAvatarKey(response.data.chat.section.persona.avatar)
    setSpeakerId(getSpeakerId(response.data.chat.section.persona.avatar));
    getGif(response.data.chat.section.persona.avatar, 'videoHead')
    setTask(response.data);
    setName(response.data.chat.section.persona.name);
    // for delete record if leaving ongoing role play
    store.dispatch({type: CURRENT_CHAT_INFO, payload: response?.data?.chat});
    buildProcesses(response.data.processes);
    // set chat status as initializtion completed
    setIsChatInitial(true);
    // set talk Script
    setKeywordCurrentIndex(0);
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
        // endTime.setSeconds(endTime.getSeconds() + parseInt(vSTTDuration));
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
      const response = await sendGPT(vTask.chat.id, params);
      setVideoFocus(true);
      setChatMsg('');
      setInputEdit(true);
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
        if (response?.data?.autoAnswer) {
          setAutoAnswer(response?.data?.autoAnswer);
        }
        checkKeywordMatching(response.data.message.matchedWords);
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
    // setIsOpenConfirmDialog(false);
    setIsOpenDialog(false);
    setIsLoadingMask(true)
    await finishScoring(vTask.chat.id, '1');
    store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false});
    setIsLoadingMask(false)
    history.push({pathname: `/ai-score/${taskID}/${lessonId}`});
    setLocationState(
      {
        isShowStory: true,
        isShowKururinpaImg: true,
        chatId: vTask.chat.id,
        item: vTask.chat,
        isGPT: true
      },
      `ai-score/${taskID}/${lessonId}`
    )
  }
  
  const renderOperateBtn = () => {
    return (<div
      className={styles.chatNext}
    >
      <button
        className={`${isVertical ? styles.submit_role_play_btn : styles.submit_role_play_btn_landscape} ${!ableToNext() ? styles.submit_role_play_btn_orange : styles.submit_role_play_btn_gray}`}
        disabled={ableToNext()}
        onClick={() => setIsOpenConfirmDialog(true)}
      >
        採点する
      </button>
    </div>)
    
  }
  
  const renderPauseDialogByStatus = () => {
    return <ConfirmDialog
      open={isOpenSuspendDialog}
      setOpen={setIsOpenSuspendDialog}
      showSecOption="false"
      onConfirm={() => {
        deleteScoring(vTask.chat.id).then(res => {
          if (res?.data?.responseStatus === 'SUCCESS') {
            store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
            
            history.push({pathname: `/start-new-role-play`,});
            setLocationState({lessonId}, 'start-new-role-play')
          }
        })
      }}
      title='採点せずに前の画面に戻ります。<br>よろしいですか？'
    />
  }
  
  const renderRestartDiagByStatus = () => {
    // if single mode
    return <ConfirmDialog
      open={isOpenStartOverDialog}
      setOpen={setIsOpenStartOverDialog}
      onConfirm={startOver}
      title={'採点せずに最初からやり直します。<br> よろしいでしょうか？'}
    />
  }
  
  const ableToNext = () => {
    if (!vIsplayed) {
      return true;
    }
    return !isChatInitial;
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
        item.matchedKeywordCount = 0;
        item.matchedKeywords = [];
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
              if (!TempProcess[index].matchedKeywords.includes(word)) {
                TempProcess[index].matchedKeywords.push(word);
                TempProcess[index].matchedKeywordCount++;
              }
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
      setIsplayed(true);
      getGif(avatarKey, 'Talking')
      getAudio(null, vTask.messages[1].text, true);
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
    if (e !== null) {
      switch (e.keyCode) {
        case 13://enter
        {
          if (vSetSendFocus) {
            dealIconHide()
          }
          if (vSetDelFocus) {
            dealCancel();
          }
          if (vSetVideoFocus) {
            dealIconShow();
          }
        }
          break;
        //up arrow
        case 38: {
          if (!vTextAreaInput) {
            setDelFocus(true);
          }
        }
          break;
        // down arrow
        case 40: {
          if (!vTextAreaInput) {
            setDelFocus(false);
          }
        }
          break;
      }
    }
    
  }
  
  const handleChange = (event) => {
    setOverallScoring(event.target.checked);
  };
  
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
  
  const handleTextareaInputFocus = () => {
    console.log("== handleTextareaInputFocus ==");
    setInFocus(true);
    //setDelChatMsg('input')
    closeConnection();
    //tempTrans = '';
  }
  
  const handleTextareaInputBlur = () => {
    setInFocus(false);
    dealIconShow();
  }
  
  useEffect(() => {
    if (delChatMsg === '' || delChatMsg === 'stt' && vChatMsg.length !== 0) {
      setInputEdit(true);
    } else {
      setInputEdit(false);
    }
  }, [vChatMsg])
  
  useEffect(() => {
    if (vIsplayed) {
      initTimer();
    }
  }, [vIsplayed])
  
  const textSubmitClasses = useMemo(() => {
    if (vIsplayed) {
      if (isTimeUpFlg) {
        return styles.role_play_handle_btn_not_start
      } else {
        return styles.role_play_reflect_btn_active
      }
    } else return styles.role_play_handle_btn_not_start
  }, [vIsplayed, isTimeUpFlg]);
  
  const textSubmitLSClasses = useMemo(() => {
    if (vIsplayed) {
      if (isTimeUpFlg) {
        return styles.role_play_handle_btn_not_start
      } else {
        return styles.role_play_reflect_btn_active_landscape
      }
    } else return styles.role_play_handle_btn_not_start
  }, [vIsplayed, isTimeUpFlg]);
  
  const textReCreateClasses = useMemo(() => {
    if (vIsplayed) {
      if (isTimeUpFlg) {
        return styles.role_play_handle_btn_not_start
      } else {
        return styles.role_play_respeak_btn_active
      }
    } else return styles.role_play_handle_btn_not_start
  }, [vIsplayed, isTimeUpFlg]);
  
  const textReCreateLSClasses = useMemo(() => {
    if (vIsplayed) {
      if (isTimeUpFlg) {
        return styles.role_play_handle_btn_not_start
      } else {
        return styles.role_play_respeak_btn_active_landscape
      }
    } else return styles.role_play_handle_btn_not_start
  }, [vIsplayed, isTimeUpFlg]);
  
  const gptErrorConfirmHandler = useCallback(async () => {
    closeConnection()
    console.log('timerInterval', timerInterval)
    if (timerInterval) clearInterval(timerInterval)
    timerInterval = null
    await GetTask()
    setIsGPTErrorDialog(false)
    setGPTErrorDialogContent('')
    await getGif(avatarKey, 'videoHead')
    setIsplayed(false);
    setChatMsg('')
    setWarningText('')
    setSttOpened(false)
  }, [vTask]);
  
  
  return (
    <>
      <ICoreFrame
        onBack={!(isSingleMode()) ? null : () => {
          dealReturn();
        }}
        component={
          <div className={browserRedirect() === 2 && styles.mobile_view}>
            {isVertical ?
              <>
                {/* vertical */}
                {
                  vTask?.chat?.section.persona.themeName ?
                    <div className={styles.fast_text_name_context}>
                      <label
                        title={`${vTask?.chat?.section.persona.themeName} ${vTask?.chat?.section.persona.scenarioName}`}>{`${vTask?.chat?.section.persona.themeName} ${vTask?.chat?.section.persona.scenarioName}`}</label>
                      <label
                        title={`${vTask?.chat?.section.persona.persona}`}>{`${vTask?.chat?.section.persona.persona}`}</label>
                    </div> : <></>
                }
                <div className={styles.fast_text_main_page}>
                  <div className={styles.fast_text_section_name}>
                    <p id="ongoing_section" name="ongoing_section">{t('videochat.ongoing_section')}</p>
                    <div title={vTask && `${vTask.chat.section.name}`} id="long_term_care_insurance"
                         name="long_term_care_insurance">
                      {
                        vTask &&
                        (vTask?.chat?.section?.name).split('\n').map((v, k) => {
                          return (<div>
                            <p className="video-chat-section-name" key={k}>{v}</p>
                          </div>)
                        })
                      }
                    </div>
                  </div>
                  <div className={styles.image_wrap}>
                      {name &&
                        <div className={styles.chat_name_box_sp}>
                          {name}
                        </div>
                      }
                      {chatPerson && (
                        <img
                          src={chatPerson}
                          alt="Chat People"
                          className={styles.main_chat_people}
                          id="chat_person"
                          name="chat_person"
                        />
                      )}
                  </div>
                  <div className={styles.fast_text_main_bottom}>
                    <button
                      className={vIsplayed ? styles.start_role_play_btn_active : styles.start_role_play_btn}
                      onClick={startRolePlay}>
                      <img src={rolePlayBtnMicphone} alt=""/>
                      <span>ロープレ開始</span>
                    </button>
                    {warningText ?
                      <div
                        className={styles.warning_area}
                        dangerouslySetInnerHTML={{__html: warningText}}
                      />
                      : null}
                    <div className={styles.fast_text_toggle_btns}>
                      <div>
                        <ShowBut
                          onChange={handleChange}
                          checkState={overallScoring}
                          buttonlabel="プロセス/キーワードを表示する"
                          isVertical={isVertical}/>
                      </div>
                      {overallScoring &&
                        <KeywordList
                          vProcesses={vProcesses}
                          setProcesses={setProcesses}
                          currentIndex={vKeywordCurrentIndex}
                          setCurrentIndex={setKeywordCurrentIndex}
                        />}
                    </div>
                    <div className='d-flex'>
                      <div className='d-flex flex-column justify-content-around align-content-center'>
                        <div>
                          <div className={styles.wave_wrap}>
                            {delChatMsg === 'stt' && sttOpened  && !inFocus ?
                              <IWaveformMobile value={volume} isVertical={isVertical}
                                               isTablet={false}/>
                              :
                              <IWaveformMobileGrey isVertical={isVertical} isTablet={false}/>
                            }
                          </div>
                          <div className={styles.timer}>
                            <img src={clockIcon} alt={'clockIcon'}/>
                            <span>{timer}</span>
                          </div>
                          {inFocus ? (<div className={styles.is_editing_vertical}>テキスト編集中</div>) : null}
                        </div>
                      </div>
                      <textarea
                        autoFocus={vSetVideoFocus}
                        className={styles.video_chat_input}
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
                </div>
                <div className={styles.fast_text_pause_btns}>
                  <button
                    className={vIsplayed ? styles.fast_text_pause_btn_started : styles.fast_text_pause_btn}
                    onClick={() => {
                      if (!ableToNext()) {
                        setIsOpenStartOverDialog(true);
                      }
                    }}>最初からやり直す
                  </button>
                </div>
                <div className={styles.fast_text_controller_btns}>
                  <div>
                    <button
                      disabled={vChatMsg.length === 0 || vReflectClickIsDisable || isTimeUpFlg}
                      className={
                        `${styles.role_play_handle_btn} ${textSubmitClasses}`
                      }
                      autoFocus={vSetSendFocus}
                      onClick={dealIconHide}
                      id={autoId()}
                    >
                      反映
                    </button>
                    <button
                      className={`${styles.role_play_handle_btn} ${textReCreateClasses}`}
                      onClick={vIsplayed ? delChatMsg !== 'input' ? dealCancel : dealCancelAndBackStt : null}
                      id="cancel_icon"
                      autoFocus={vSetDelFocus}
                      name="cancel_icon">
                      言い直す
                    </button>
                  
                  </div>
                  {
                    renderOperateBtn()
                  }
                </div>
              </>
              :
              <>
                {/* landscape */}
                <Row className={styles.fast_text_main_page_landscape}>
                  <Col className={styles.fast_text_main_left_landscape}>
                    <div className={styles.fast_text_section_name_landscape}>
                      <p id="ongoing_section"
                         name="ongoing_section">{t('videochat.ongoing_section')}</p>
                      <div title={vTask && `${vTask.chat.section.name}`}
                           id="long_term_care_insurance"
                           name="long_term_care_insurance">
                        {
                          vTask &&
                          (vTask?.chat?.section?.name).split('\n').map((v, k) => {
                            return (
                              <p key={k}>{v}</p>
                            )
                          })
                        }
                      </div>
                    </div>
                    <div className={styles.fast_text_main_left_middle_landscape}>
                      <div className={styles.start_role_play_btn_wrapper_landscape}>
                        <button
                          className={vIsplayed ? styles.start_role_play_btn_active : styles.start_role_play_btn}
                          onClick={startRolePlay}>
                          <img src={rolePlayBtnMicphone} alt=""/>
                          <span>ロープレ開始</span>
                        </button>
                      </div>
                      <div className={styles.video_chat_keyword_wrap_left}>
                        {warningText ?
                          <div
                            className={styles.warning_area}
                            dangerouslySetInnerHTML={{__html: warningText}}
                          />
                          : null}
                      </div>
                      <Row className={styles.fast_text_toggle_btns_landscape}>
                        <Col>
                          <ShowBut
                            onChange={handleChange}
                            checkState={overallScoring}
                            buttonlabel="プロセス/キーワードを表示する"
                            isVertical={isVertical}
                          />
                          {overallScoring &&
                            <KeywordList
                              vProcesses={vProcesses}
                              setProcesses={setProcesses}
                              currentIndex={vKeywordCurrentIndex}
                              setCurrentIndex={setKeywordCurrentIndex}
                            />}
                        </Col>
                      </Row>
                    </div>
                    <div className={styles.fast_text_controller_btns_landscape}>
                      <div>
                        <button
                          disabled={vChatMsg.length === 0}
                          className={`${styles.role_play_handle_btn_landscape} ${textSubmitLSClasses}`}
                          autoFocus={vSetSendFocus}
                          onClick={dealIconHide}
                          id={autoId()}
                        >
                          反映
                        </button>
                        <button
                          className={`${styles.role_play_handle_btn_landscape} ${textReCreateLSClasses}`}
                          onClick={vIsplayed ? delChatMsg !== 'input' ? dealCancel : dealCancelAndBackStt : null}
                          id="cancel_icon"
                          autoFocus={vSetDelFocus}
                          name="cancel_icon">
                          言い直す
                        </button>
                      </div>
                      {
                        renderOperateBtn()
                      }
                    </div>
                  </Col>
                  <Col className={styles.fast_text_main_right_landscape}>
                    <div className={styles.fast_text_page_avatar_landcape}>
                      {name &&
                        <div className={styles.chat_name_box}>
                          {name}
                        </div>
                      }
                      {chatPerson && (
                        <img
                          src={chatPerson}
                          alt="Chat People"
                          className={styles.main_chat_people_l}
                        />
                      )}
                    </div>
                    <div  className='d-flex' style={{marginTop: '10px'}}>
                        <textarea
                          autoFocus={vSetVideoFocus}
                          className={styles.video_chat_input_landscape}
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
                          autoComplete="off"
                        />
                      <div>
                        <div className='w-100 d-flex justify-content-center'>
                          {delChatMsg === 'stt' && sttOpened && !inFocus ?
                            <IWaveformMobile value={volume} isVertical={isVertical}
                                             isTablet={false}/>
                            :
                            <IWaveformMobileGrey isVertical={isVertical} isTablet={false}/>
                          }
                        </div>
                        <div className={styles.timer}>
                          <img src={clockIcon} alt={'clockIcon'}/>
                          <span>{timer}</span>
                        </div>
                        <div className={styles.is_editing}>
                          {inFocus ? 'テキスト編集中' : <span>&nbsp;</span>}
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className={styles.fast_text_pause_btns_landscape}>
                  <button
                    className={vIsplayed ? styles.fast_text_pause_btn_started_landscape : styles.fast_text_pause_btn_landscape}
                    onClick={() => {
                      if (!ableToNext()) {
                        setIsOpenStartOverDialog(true);
                      }
                    }}>最初からやり直す
                  </button>
                </div>
              </>}
          </div>
          
        }
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
              navigator.mediaDevices.getUserMedia({audio: true})
                .then(function (stream) {
                  stream.stop();
                  setMicrophonePermission(false);
                })
                .catch(function () {
                  console.log('No mic for you!')
                });
            }}>
              <div style={{marginLeft: 20}}>
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
      {/** single */}
      <ConfirmDialog
        title={t("videochat.to_score_confirmation")}
        open={isOpenConfirmDialog}
        setOpen={setIsOpenConfirmDialog}
        onConfirm={dealSingleScore}
      />
      <LoadingMask val={vIsLoadingMask}/>
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
        isVertical={isVertical}
      />
      {
        renderPauseDialogByStatus()
      }
      {
        renderRestartDiagByStatus()
      }
    </>
  )
}

export default FastTextPage;

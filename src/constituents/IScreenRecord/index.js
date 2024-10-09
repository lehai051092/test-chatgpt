import { useEffect, useState, useRef, useCallback } from 'react';
import RecordRTC from 'recordrtc';
import styles from './styles.module.css'
import ysFixWebmDuration from 'fix-webm-duration'
import SliderImages from './ISliderImages'
import { uploadFreestoreVideo } from "../../request/backendApi/api";
import free_story_point from '../../property/images/free_story/free_story_point1.png'
import free_story_null from '../../property/images/free_story/free_story_null.png'
import ChatApi from '../../request/textSpeechTransitionApi/chatApi';
import store from '../../storage';
import { UPDATE_TRANSCRIPTION } from '../../storage/consts'
import { sendFreeStoryChatMsg } from '../../request/backendApi/api';
import { finishScoring, updateChatDuration } from '../../request/backendApi/api';
import {
    useHistory,
    useParams,
} from "react-router-dom";
import { isSafari } from '../../utils/util';
import { isDevOrLocalEnv, isStageEnv, isProdEnv } from '../../utils/runtime';
import { getUUID } from '../../utils/encrypt';
import { setLocationState } from '../../utils/util';

// The core of recording resources
let recorder = null;
let captureStream = null;
let video = null;

let audioRecorder = null;
let canvasStream = null;
let audioStream = null;
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
const IScreenRecord = ({ setIsRecordingStop, setChatDetail, processTag, chatDetail, resumeFlg,setMicrophonePermission }) => {

    const [messageId, setMessageId] = useState('');
    const SAMPLING_RATE = 4096;
    const audioContextRef = useRef(AudioContext);
    const streamRef = useRef(MediaStream);
    const streamSourceRef = useRef(MediaStreamAudioSourceNode);
    const processorRef = useRef(AudioWorkletNode);
    const { taskID } = useParams();
    const { lessonId } = useParams();
    const history = useHistory();

    // Trigger immediately when the component is destroyed to prevent the socket from being destroyed
    useEffect(()=>{
        return ()=>{
            closeConnection();
        }
    },[])

    useEffect(() => {
        if (processTag[0]) {
            onStart();
        } else {
            onFinish();
        }
    }, [processTag])

    useEffect(() => {
        if (resumeFlg) {
            onResume();
        }
    }, [resumeFlg])

    useEffect(() => {
        store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: '' });
        return () => {
            onResume();
        }
    }, []);



    const startConnection = (stream) => {
        streamRef.current = stream;
        audioContextRef.current = new AudioContext();
        streamSourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        processorRef.current = audioContextRef.current.createScriptProcessor(SAMPLING_RATE, 1, 1);
        processorRef.current.onaudioprocess = processAudio;

        streamSourceRef.current.connect(processorRef.current);
        processorRef.current.connect(audioContextRef.current.destination);
        ChatApi.startConnection(audioContextRef.current.sampleRate);
        ChatApi.setupTranscriptionCallback(processTranscription);
    }

    // deal response from google speech to text server
    const processTranscription = useCallback(
        (transcription) => {
            let tempTrans = store.getState().transcript_one_time;
            
            // use Azure STT for test
            store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: tempTrans + transcription.transcription })

            let startTime = new Date().toISOString();
            let endTime = new Date(startTime);
            endTime.setMilliseconds(endTime.getMilliseconds() + parseFloat(transcription?.duration).toFixed(2)*1000)
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
                        let t_chatDetail = chatDetail;
                        t_chatDetail["processes"] = t_chatDetail_processes;
                        setChatDetail(t_chatDetail);
                    }
                    store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: '' })
                })
            }
            return;
            // use Google STT for old version release
            // if (transcription.isFinal) {
            //     store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: tempTrans + transcription.transcription })
            //     let params = {
            //         text: store.getState().transcript_one_time,
            //         startTime: new Date(startTime).toISOString(),
            //         endTime: new Date(startTime).toISOString()
            //     }
            //     if (chatDetail && chatDetail["chat"]) {
            //         sendFreeStoryChatMsg(chatDetail["chat"].id, params).then(res => {
            //             if (res.status === 200) {
            //                 console.log(`Message sent: ${store.getState().transcript_one_time}`)
            //                 setMessageId(res["data"]?.messageId);
            //                 let t_chatDetail_processes = chatDetail["processes"];
            //                 for (let i = 0; i < res["data"]["matchedProcessIds"].length; i++) {
            //                     const element = res["data"]["matchedProcessIds"][i];
            //                     for (let j = 0; j < t_chatDetail_processes.length; j++) {
            //                         if (t_chatDetail_processes[j]["id"] === element) {
            //                             t_chatDetail_processes[j]["hitFlg"] = true;
            //                         }
            //                     }
            //                 }
            //                 let t_chatDetail = chatDetail;
            //                 t_chatDetail["processes"] = t_chatDetail_processes;
            //                 setChatDetail(t_chatDetail);
            //             }
            //             store.dispatch({ type: UPDATE_TRANSCRIPTION, transcript: '' })
            //         })
            //     }
            //     return;
            // }
        }, [chatDetail]
    );

    const processAudio = useCallback((event) => {
        const buffer = event.inputBuffer.getChannelData(0) || new Float32Array(SAMPLING_RATE);
        const toSend = new Int16Array(buffer.length);
        for (let index = buffer.length; index >= 0;) {
            toSend[index] = 32767 * Math.min(1, buffer[index]);
            index -= 1;
        }
        ChatApi.sendStream(toSend.buffer);
        // if were to enable google stt
        // ChatApi.sendData(toSend.buffer, new Date().toISOString());
    }, []);

    const closeConnection = async () => {
        // check the permission for mic and camera
        if (navigator.permissions) {
            await navigator.permissions.query(
                { name: 'microphone' }
            ).then(function (permissionStatus) {
                if (permissionStatus.state == 'granted') {
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
            })
        }
    }

    const finishScore = async () => {
        // let params = {
        //     startTime: new Date(startTime).toISOString(),
        //     endTime: new Date(stopTime).toISOString()
        // }
        // if (messageId && messageId != '') {
        //     await updateChatDuration(messageId, params);
        // }

        // send message (1) / not send (0)
        let res = await finishScoring(chatDetail?.chat?.id, '1');
        if(res.status === 200){
            setLocationState({
                saveRecordDataStatus: true,
                chatId: chatDetail?.chat?.id,
                freeStoryFlag:processTag[1]
            },`free-story-score/${taskID}/${lessonId}`)
            history.push({
                pathname: `/free-story-score/${taskID}/${lessonId}`,
            });
        }
        
    }

    const onStart = () => {
        if (processTag[0]) {
            var ua = navigator.userAgent.toLowerCase();
            // 'navigator.permissions' does not support safari
            if (ua.indexOf('safari')<0 && navigator.permissions) {
                if(processTag[1] === 1){
                    // stt
                    onStartHandleStt(); 
                }else if(processTag[1] === 2){
                    // record
                    onStartHandleRecord(); 
                }
            }else{
                if(processTag[1] === 1){
                    // stt
                    onStartHandleStt(); 
                }else if(processTag[1] === 2){
                    // record
                    onStartHandleRecord(); 
                }
            }
        }
    }

    const onStartHandleStt = async () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            startConnection(stream);
            startTime = Date.now();
        }, (error) => {
            console.log("error", error);
            return false;
        });
    }

    const onStartHandleRecord = async () => {
        var ua = navigator.userAgent.toLowerCase();
        try {
            captureStream = await navigator.mediaDevices.getDisplayMedia({
                video: { frameRate: { ideal: 10, max: 15 } },
                cursor: 'always'
            })
        } catch (e) {
            console.log('User refused to record', e);
            setIsRecordingStop();
            isSafari(
                null,
                ()=>{
                    setMicrophonePermission()
                }
            )
            return false;
        }

        if (video) {
            video.remove();
        }
        video = document.createElement("video");
        video.id = "recorder_canvas";
        video.srcObject = captureStream

        recorder = new MediaRecorder(captureStream);
        navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
            startConnection(stream);
            audioStream = stream;

            var finalStream = new MediaStream();
            RecordRTC.getTracks(captureStream, 'video').forEach((track)=> {
                finalStream.addTrack(track);
            });
            RecordRTC.getTracks(stream, 'audio').forEach((track)=> {
                finalStream.addTrack(track);
            });
            audioRecorder = new RecordRTC(finalStream, {
                type: 'video',
            });
            if(!audioRecorder){
                setIsRecordingStop();
            }
            // Immediate invoke
            recorder.start();
            audioRecorder.startRecording();

            startTime = Date.now();

        }, (error) => {
            console.log("error", error);
            setIsRecordingStop();
            isSafari(
                null,
                ()=>{
                    setMicrophonePermission()
                }
            )
            return false;
        });
    }

    const onFinish = async () => {
        // stt
        if (!processTag[0] && processTag[1] === 1 ){
            await closeConnection();
            await finishScore();
        }
        // record
        if (!processTag[0] && processTag[1] === 2) {
            await closeConnection();
            let tracks = video?.srcObject.getTracks()
            tracks?.forEach(track => track.stop())
            recorder?.stop();
            onFinishHandle();
        }
        // 中断
        if (!processTag[0] && processTag[1] === 3) {
            let tracks = video?.srcObject.getTracks()
            tracks?.forEach(track => track.stop())
            recorder?.stop();
            audioStream?.stop();
        }
    }

    const onFinishHandle = () => {
        audioRecorder.stopRecording(() => {
            audioStream.stop();
            stopTime = Date.now();
            ysFixWebmDuration(audioRecorder.getBlob(), Date.now() - startTime, async (fixedBlob) => {
                uploadApi(fixedBlob);
                // const a = document.createElement("a");
                // const url = window.URL.createObjectURL(fixedBlob);
                // const filename = "2.webm";
                // a.href = url;
                // a.download = filename;
                // a.click();
                // window.URL.revokeObjectURL(url);
            });
        });
    }

    const onResume = () => {
        audioRecorder?.stopRecording(() => {
            canvasStream?.stop();
            audioStream?.stop();
        });
    }

    const uploadApi = async (blob) => {
        console.log(blob);
        var size = blob.size;
        let shardSize = 49 * 1024 * 1024;
        let shardCount = Math.ceil(size / shardSize);
        let blob_sliceFile_array = [];
        for(let i = 0;i < shardCount;i++){
            let start = i * shardSize;
            let end = Math.min(size, start + shardSize);
            let blob_sliceFile = new Blob([blob.slice(start,end)], { type: "video/x-matroska;codecs=avc1,opus" });
            blob_sliceFile_array.push(blob_sliceFile);
            var formData = new FormData();
            formData.append('file', blob.slice(start,end));
            await uploadFreestoreVideo(chatDetail["chat"]["id"], i,shardCount,formData);
        }
        finishScore();
    }

    return (
        <div>
            <div id="overlay" className={styles.element_to_record}>
                <div id="element-to-record" style={{width:'58vw'}} >
                    <SliderImages />
                </div>
            </div>
        </div>
    )
}


export default IScreenRecord;
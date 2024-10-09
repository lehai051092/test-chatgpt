import React, { useState } from 'react'
import Webcam from "react-webcam";
import { browserRedirect } from '../../utils/util';

const WebCam = ({setCamera, isVertical}) => {
    const webcamRef = React.useRef(null);
    const [localStream, setLocalStream] = useState('');

    if(webcamRef.current){
        webcamRef.current.video.style.objectFit = 'cover';

        if(localStream && localStream.getVideoTracks().length){
            // console.log('videoTracks_muted',localStream.getVideoTracks()[0]);
            let videoTrack = localStream.getVideoTracks()[0]
            videoTrack.onmute = e => {
                console.log('videoTrack onmute');
                webcamRef.current.video.style.visibility = 'hidden';
            }
            videoTrack.onunmute = e => {
                console.log('videoTrack onunmute');
                webcamRef.current.video.style.visibility = 'visible';
            } 
        }
    }

    const capture = React.useCallback(
        () => {
        const imageSrc = webcamRef.current.getScreenshot();
        },
        [webcamRef]
    );

    const onUserMedia = (stream) => {
        console.log('stream',stream);
        setLocalStream(stream);
        if(stream.oninactive === null){
            stream.oninactive = () => setCamera(false);
        }
    }

    const onUserMediaError = () => {
        setCamera(false);
    }

    return (
        <>
        <Webcam
            id='cam-video'
            audio={false}
            width={browserRedirect() === 1 ? 90 : browserRedirect() === 3 ?  92 : (isVertical ? 86 : 47)}
            height={browserRedirect() === 1 ? 86 : browserRedirect() === 3 ? 86: (isVertical ? 84 : 46)}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
                width: browserRedirect() === 1 ? 90 : browserRedirect() === 3 ?  92 : (isVertical ? 86 : 47),
                height: browserRedirect() === 1 ? 86 : browserRedirect() === 3 ?  86 : (isVertical ? 84 : 46),
                facingMode: "user"
            }}
            onUserMedia={onUserMedia}
            onUserMediaError={onUserMediaError}
        />
        {/* <button onClick={capture}>Capture photo</button> */}
        </>
    );
}

export default WebCam

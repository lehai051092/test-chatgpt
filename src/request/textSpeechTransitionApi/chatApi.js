/**
 * @description use socket.io to send websocket request to start and get data from proxy server,
 * work that to connect to google cloud server must be done in server side, that's why there lies an independent proxy server.
 */
import openSocket, { Socket } from "socket.io-client";
import { server_origin, cognitive_server_url } from '../../configuration/config'

let socket;
let subPath = "/proxy/socket.io";
const ChatApi = {
    startConnection: (sampleRate) => {
        // if(server_origin.indexOf('aflac.platformerfuji.com') > -1){
        //     subPath = '/apigw/va2roleplay/va2/proxy/socket.io';
        // }
        socket = openSocket(server_origin, {
            path: `${cognitive_server_url}/socket.io`,
            transports:["websocket"]
        });
        socket.binaryType = "arraybuffer";
        socket.emit("startConnection", { sampleRate });
    },
    endConnection: () => {
        if(socket instanceof Socket){
            socket.emit("endConnection");
            socket.close();
        }
    },
    sendData: (data, triggerTime, talkMode) => {
        socket.emit("sendData", { data, triggerTime, talkMode});
    },
    sendStream: (stream)=>{
        socket.emit('sendStream', stream)
    },
    setupTranscriptionCallback: (callbackFun) => {
        socket.on("sendTranscription", (transcription) => {
            callbackFun(transcription);       
        });
    },
    getEncryptKey: (callbackFun)=>{
        socket.emit('getEncryptKey');
        socket.on('sendKeyBack',(key) => {
            callbackFun(key);
        })
    }
};
export default ChatApi;

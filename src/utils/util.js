import {getlessonsElearning} from '../request/backendApi/api';
import {useEffect, useState} from "react";


// 1 pc / 2 mobile / 3 pad
export const browserRedirect = () => {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
    var bIsIphone = sUserAgent.match(/iphone os/i) == 'iphone os';
    var bIsMidp = sUserAgent.match(/midp/i) == 'midp';
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
    var bIsUc = sUserAgent.match(/ucweb/i) == 'web';
    var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
    var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';
    var bIsAndroid = sUserAgent.match(/android/i) == 'android';
    if (bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM || bIsAndroid || window.screen.width === 375  || window.screen.width === 414) {
      return 2;
    }
    if (bIsIpad) {
      return 3;
    }
    return 1;
}

const xhrequest = (url, callback) =>{
  var xhr = new XMLHttpRequest();
  xhr.open("get", url, true);
  xhr.responseType = "blob";
  xhr.onload = function() {
  callback(this);
  };
  xhr.send();
}

export function onDownload(url,name,closeLoading) {
  // compatibility to Edge browser in IOS system, or else not able to download files
  if (navigator.userAgent.indexOf("Edg") > 0 && (navigator.userAgent.indexOf("iPhone") > 0 || navigator.userAgent.indexOf("iPad") > 0)){
    // const aaa = new Promise((resolve, reject)=>{
    //   getZipFiles(name, name).then((res) => {
    //     resolve(res.data)
    //   })
    // })
    
    // const bbb = new Promise((resolve, reject) => {
    //   getProcessToken().then((res)=>{
    //     resolve(res.data)
    //   });
    // })
    
    // Promise.all([aaa, bbb]).then((results) => {
      // document.getElementById("fileDownloadIndexButton").href = results.join('?');
      document.getElementById("fileDownloadIndexButton").href = url;
      document.getElementById("fileDownloadIndexButton").click();
      closeLoading();
    // })
  } else {
    xhrequest(url,(e)=>{
      var fileDownload = require('react-file-download');
      fileDownload(e.response,name);
      closeLoading();
    })
  }
}

export const isSafari = (fun,showM) =>{
  var ua = navigator.userAgent.toLowerCase();
  if (ua.indexOf('applewebkit') > -1  && ua.indexOf('safari') > -1 &&
      ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
      ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
      if(showM){
        showM();
      }
      return true;
  }else{
    navigator.permissions.query({ name: 'microphone' }).then((permissionStatus)=> {
      if (permissionStatus.state != 'granted') {
        setTimeout(() => {
          showM();
        }, 500);
      }else{
        if(fun){
          fun();
        }
      }
    })
    
    return false;
  }
}

export const getLightArray = async (curriculum_courseId) =>{
  let res = await getlessonsElearning();
  if(res.status === 200 && Object.keys(res.data).length != 0){
    let eLearningList = res.data;
    return eLearningList[curriculum_courseId]
  }else{
    return [];
  }
}

export const setLocationState = (v,path) =>{
  let sv = {};
  if(sessionStorage.getItem("state")){
    sv = JSON.parse(sessionStorage.getItem("state"));
  }
  sv[`#/${path}`] = v;
  sessionStorage.setItem("state",JSON.stringify(sv));
}

export const getLocationState = () =>{
  return JSON.parse(sessionStorage.getItem("state"))?.[window.location.hash];
}


export const addLocationState = (v,path) =>{
  console.log('=== addLocationState ===',v);
  let sv = {};
  if(sessionStorage.getItem("state")){
    sv = JSON.parse(sessionStorage.getItem("state"));
  }
  sv[`#/${path}`] = {...sv[`#/${path}`],...v}
  sessionStorage.setItem("state",JSON.stringify(sv));
}


export const setLocationRefreshCount = (v) =>{
  sessionStorage.setItem("refeshCount",JSON.stringify(v));
}

export const getLocationRefreshCount = () =>{
  return JSON.parse(sessionStorage.getItem("refeshCount"));
}

export const getNextCount = ()=>{
  let count = getLocationRefreshCount();
  if(count == '1'){
    setLocationRefreshCount('');
  }else{
    setLocationRefreshCount('1')
  }
  return getLocationRefreshCount();
}

export const reloadByHash = ()=>{
  let count = getLocationRefreshCount();
  if(!count){
    count = ''
  }
  window.location.href = window.location.href.replace(`${count}#`,`${getNextCount()}#`)
}

export const initSndAndDf = (snd,df)=>{
  try{
    snd.onended = ()=>{
    }
  }catch(error){
    console.log(error);
  }
  try{
    df.removeChild(snd);
  }catch(error){
    console.log(error);
  }
}

const avatarList = [
  {'key':'20S_F','value':require('../../src/property/phase3_avatars/20S_F/20S_F.gif')},
  {'key':'20S_M','value':require('../../src/property/phase3_avatars/20S_M/20S_M.gif')},
  {'key':'30S_F','value':require('../../src/property/phase3_avatars/30S_F/30S_F.gif')},
  {'key':'30S_M','value':require('../../src/property/phase3_avatars/30S_M/30S_M.gif')},
  {'key':'40S_F_a','value':require('../../src/property/phase3_avatars/40S_F_a/40S_F_a.gif')},
  {'key':'40S_F_b','value':require('../../src/property/phase3_avatars/40S_F_b/40S_F_b.gif')},
  {'key':'40S_M','value':require('../../src/property/phase3_avatars/40S_M/40S_M.gif')},
  {'key':'50S_F','value':require('../../src/property/phase3_avatars/50S_F/50S_F.gif')},
  {'key':'50S_M','value':require('../../src/property/phase3_avatars/50S_M/50S_M.gif')},
  {'key':'60S_M','value':require('../../src/property/phase3_avatars/60S_M/60S_M.gif')},
  {'key': '0S_F','value':require('../../src/property/phase3_avatars/0S_F/0S_F.png')},
];

export const getAllAvatarLink = ()=>{
  return avatarList;
}


export const getOnceAvatar = (key)=>{
  let item = avatarList.filter(item => item.key === key)?.[0];
  if(item){
    let io = item.value.default;
    return io;
  }else{
    return '';
  }
}
export const operateCodeListOfAgent = (codeList)=>{
  if(codeList && codeList.length>0){
    for (let index = 0; index < codeList.length; index++) {
      let agentCode = codeList[index];
      let supplementCodeLength = 7 - String(codeList[index]).length;
      for (let j = 0; j < supplementCodeLength; j++) {
        agentCode = "0"+agentCode;
      }
      codeList[index] = agentCode;
    }
    return codeList;
  }
  return [];
}

export const restrictUploadPdf = (e) =>{
  let file = e.target.files[0]
  console.log(file);
  return file.type === "application/pdf";
}

export const restrictUploadImage = (e) =>{
  let file = e.target.files[0]
  return file.type.indexOf("image")>-1;
}

export function IsIE()  {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
      userAgent.indexOf("msie") !== -1 || userAgent.indexOf("trident") !== -1
  );
}
function handleScroll(event) {
  event.preventDefault();
}

export function resumeScroll() {
  // スマホでのタッチ操作でのスクロール禁止解除
  document.removeEventListener("touchmove", handleScroll);
}

export function suspendScroll() {
  // スマホでのタッチ操作でのスクロール禁止
  document.addEventListener("touchmove", handleScroll, { passive: false });
}

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
};
export const useWindowDimensions = () => {
  // フック
  const [windowDimensions, setWindowDimensions] = useState(
      getWindowDimensions()
  );

  // 反作用フック
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
};


export const WarningGPTTextCannotBeEvaluate = '評価または回答できない言葉が含まれておりました。<br /> 再度言い直してください。'
export const WarningGPTTextEndSoon = 'まもなく終了となります。'
export const MaximumNumberOfCharactersSentGPTText = '送信最大文字数となりました。<br/ >「テキスト反映」ボタンを押してください。'
export const MaximumNumberOfCharactersSentGPTTextLength = 1000

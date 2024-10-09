import React, {useEffect, useState} from "react";
import getGifImage from "../../../../utils/newMapFIle";
import {personaActionEmotion, personaActionNameToKey} from "../../GPTChatPage/gpt-utils";
import styles from "../GPTChatLog/styles.module.css";

const GPTChatLogAvatar = ({vAvatarName, message, defaultAvatarImg}) => {
  const [vAvatarImg, setAvatarImg] = useState('')
  const [altText, setAltText] = useState('')
  useEffect(() => {
    setAltText(personaActionEmotion(message.personaAction))
    vAvatarName && getGifImage(vAvatarName, personaActionNameToKey(message.personaAction)).then(res => {
      setAvatarImg(res)
    })
  }, [vAvatarName, message])
  
  return <div
    className={`${styles.msg_img} ${message.text.length > 20 ? styles.adjust_width : ""} d-flex flex-wrap align-items-center`}>
        <img
          src={vAvatarImg ? vAvatarImg : defaultAvatarImg}
          alt={altText}
          className={`${styles.bot_person_l} d-block mx-auto`}
        />
  </div>
}
export default GPTChatLogAvatar;

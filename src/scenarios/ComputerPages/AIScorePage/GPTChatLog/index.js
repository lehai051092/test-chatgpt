import React, {createRef, useEffect, useRef, useState} from 'react';
import styles from './styles.module.css'
import chat_icon from '../../../../property/images/chat_msg.png'
import {useTranslation} from 'react-i18next'
import {browserRedirect} from '../../../../utils/util';
import GPTChatLogAvatar from "../GPTChatLogAvatar";
import {personaActionEmotion} from "../../GPTChatPage/gpt-utils";
import getGifImage from "../../../../utils/newMapFIle";

const GPTChatLog = ({messages, selectKeyword, vAvatarName, vSelectScore}) => {
  const {t} = useTranslation();
  const [vAvatarImg, setAvatarImg] = useState(true)
  const [loading, setLoading] = useState(true)
  const vChatMsgRef = useRef({})
  const vChatRef = useRef()
  const [isEmotion, setIsEmotion] = useState(false)
  const [isKeywordDensity, setIsKeywordDensity] = useState(false)
  const [keywordDensityText, setKeywordDensityText] = useState('')
  
  useEffect(() => {
    vAvatarName && getGifImage(vAvatarName, null).then(res => {
      setAvatarImg(res)
    })
  }, [messages])
  
  useEffect(() => {
    if (vSelectScore && vSelectScore.gptSetting) {
      setIsEmotion(vSelectScore.gptSetting.emotion)
      setIsKeywordDensity(vSelectScore.gptSetting.keywordDensity)
      setKeywordDensityText(vSelectScore.gptSetting.keywordDensityText)
    } else {
      setIsEmotion(false)
      setIsKeywordDensity(false)
      setKeywordDensityText('')
    }
  }, [vSelectScore]);
  
  useEffect(() => {
    setLoading(false)
    vChatMsgRef.current = messages.map((element, i) => vChatMsgRef.current[i] ?? createRef());
  }, [messages])
  
  useEffect(() => {
    //select keyword auto scroll
    if (selectKeyword !== undefined) {
      let findIndex = messages.findIndex(function (message, _index) {
        if (message.id === selectKeyword.userMessageId) {
          return true
        }
      });
      if (vChatMsgRef.current[findIndex] !== undefined) {
        if (vChatMsgRef.current[findIndex].current != null) {
          vChatRef.current.scrollTop = vChatMsgRef.current[findIndex].current.offsetTop - 200;
        }
      }
    }
  }, [selectKeyword])
  
  const highLightText = (item, _index) => {
    let keywords = []
    item.matchedWords.map((v, _k) => {
      keywords.push(v.word)
    })
    const pattern = Array.isArray(keywords) ? keywords.filter(arg => !!arg).join('|') : keywords;
    const regex = new RegExp(pattern.concat('|<[^>]*>'), 'gi');
    return (item.text).replace(regex, (match) => {
      if (match) {
        return `<b>${match}</b>`
      } else {
        return match
      }
    });
  }
  return (
    <div
      className={`${styles.main_div} ${browserRedirect() !== 1 ? browserRedirect() === 3 ? styles.tablet_view : styles.mobile_view : styles.pc_view}`}
      id="chat_list_container" name="chat_list_container">
      <div className={`${styles.title_div}`}>
        <img src={chat_icon} alt="chat icon" className={styles.chat_icon} id="chat_list_header_icon"
             name="chat_list_header_icon"/>
        <span className="ml-3" id="chat_list_header" name="chat_list_header"><b>{t('aiscore.chat_history')}</b></span>
      </div>
      <div className={`${styles.body_div} ${styles.msger}`} id="chat_lists" name="chat_lists" ref={vChatRef}>
        <main className={styles.msger_chat}>
          {
            !loading ?
              messages.map((msg, index) => {
                if (msg.type === 'IncomingMessage') {
                  return <div key={index} className={`${styles.msg} ${styles.left_msg}`}
                              ref={vChatMsgRef.current[index]}>
                    {
                      isEmotion ?
                        <GPTChatLogAvatar
                          vAvatarName={vAvatarName}
                          message={msg}
                        />
                        :
                        <div
                          className={`${styles.msg_img} ${msg.text.length > 20 ? styles.adjust_width : ""} d-flex flex-wrap align-items-center`}>
                          <img src={vAvatarImg} alt="chat_list_bot_user_icon"
                               className={`${styles.bot_person} d-block mx-auto`}
                               id={`chat_list_bot_user_icon_${index}`} name={`chat_list_bot_user_icon_${index}`}></img>
                        </div>
                    }
                    <div className={styles.msg_bubble_width}>
                      <div className={styles.msg_bubble}>
                        <div className={styles.msg_text} id={`chat_list_bot_user_text_${index}`}
                             name={`chat_list_bot_user_text_${index}`}>
                          {msg.text}
                        </div>
                      </div>
                      {
                        isEmotion || isKeywordDensity ?
                          <div className={styles.emotion}>
                          <span>
                            {
                              isEmotion
                                ? <>
                                  {personaActionEmotion(msg.personaAction)}
                                </>
                                : null
                            }
                          </span>
                            <span
                              style={{
                                marginLeft: isEmotion && personaActionEmotion(msg.personaAction) !== '' ?
                                  '10px' : ''
                              }}
                            >
                          {
                            isKeywordDensity
                              ? <>
                                {
                                  msg.gptResponse && msg.gptResponse.keywordDensity !== undefined && msg.gptResponse.keywordDensity !== '' ?
                                    keywordDensityText + msg.gptResponse.keywordDensity + '%'
                                    : ''
                                }
                              </>
                              : null
                          }
                          </span>
                          </div>
                          : null
                      }
                    </div>
                  </div>
                } else {
                  return <div key={index} ref={vChatMsgRef.current[index]}
                              className={`${styles.msg} ${styles.right_msg}`}>
                    <div>
                      <div className={styles.msg_bubble} dangerouslySetInnerHTML={{__html: highLightText(msg, index)}}/>
                    </div>
                  </div>
                }
              })
              :
              "Loading...."
          }
        </main>
      </div>
    </div>
  )
}

export default GPTChatLog;
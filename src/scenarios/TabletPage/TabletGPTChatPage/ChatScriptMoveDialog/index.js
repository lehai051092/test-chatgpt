import {useDragAndDrop} from "../../../../utils/useDragAndDrop";
import styles from "./styles.module.css";
import React, {memo, useEffect, useRef, useState} from "react";
import close_icon from '../../../../property/images/close_circle_white.svg';
import store from "../../../../storage";
import {updateTalkScriptDialog} from "../../../../storage/reduxActions";
import getGifImage from "../../../../utils/newMapFIle";
import GPTChatLogAvatar from "../../../ComputerPages/AIScorePage/GPTChatLogAvatar";
import {personaActionEmotion} from "../../../ComputerPages/GPTChatPage/gpt-utils";

const ChatScriptMoveDialog = (props) => {
  const {vAvatarName, scripts, vTask, defaultAvatarImg} = props
  const {divRef} = useDragAndDrop({
    onClose: () => {
      store.dispatch(updateTalkScriptDialog(false))
    },
    startPosition:
      store.getState().talkScriptDialogPosition ? store.getState().talkScriptDialogPosition :
        {
          x: {
            direction: "left",
            quantity: '5px'
          },
          y: {
            direction: "top",
            quantity: '65px'
          }
        }
  })
  const [vAvatar, setAvatarImg] = useState(true)
  const lastMessageRef = useRef(null);
  const [messages, setMessages] = useState(scripts)
  const [isEmotion, setIsEmotion] = useState(false)
  const [isKeywordDensity, setIsKeywordDensity] = useState(false)
  const [keywordDensityText, setKeywordDensityText] = useState('')
  
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({behavior: "smooth"});
    }
  }, [lastMessageRef, messages]);
  useEffect(() => {
    vAvatarName && getGifImage(vAvatarName, null).then(res => {
      setAvatarImg(res)
    })
  }, [messages])
  useEffect(() => {
    if (vTask && vTask.gptSettingsParam) {
      setIsEmotion(vTask.gptSettingsParam.emotion)
      setIsKeywordDensity(vTask.gptSettingsParam.keywordDensity)
      setKeywordDensityText(vTask.gptSettingsParam.keywordDensityText)
    }
  }, [vTask]);
  
  useEffect(() => {
    const newArr = scripts.map((value) => {
      if (value.type === "IncomingMessage") return value
      else {
        value.matchedWords.forEach((matchedWord) => {
          const regexPattern = new RegExp(matchedWord.word, "g");
          value.text = value.text.replace(regexPattern,
            '<span style="background:yellow; color: black">' + matchedWord.word + "</span>"
          )
        })
        return value
      }
    })
    setMessages(newArr)
  }, [scripts]);
  
  return (
    <div
      ref={divRef}
      className={styles.moveDialog}
    >
      <div
        className={styles.headerRoot}
        style={{
          backgroundColor: "#00a5d9",
          color: "#ffffff",
        }}
        id={'dragAndDropChatHeader'}
      >
          <span
            className={styles.headerTitle}
            id={'dragAndDropChatHeaderTitle'}
          >
            会話履歴
          </span>
        <button
          className={styles.headerCloseButton}
        >
          <img
            id={"dragAndDropChatHeaderCloseButton"}
            className={styles.headerCloseButtonICon}
            src={close_icon}
            alt="close"
          />
        </button>
      </div>
      {
        scripts ? <div
          className={`${styles.main_div}`}
        >
          <div
            className={`${styles.body_div} ${styles.msger}`}
          >
            <main className={styles.msger_chat}>
              {
                messages.map((msg, index) => {
                  if (msg.type === 'IncomingMessage') {
                    return <div key={index} className={`${styles.msg} ${styles.left_msg}`}>
                      {
                        isEmotion ?
                          <GPTChatLogAvatar
                            vAvatarName={vAvatarName}
                            message={msg}
                            defaultAvatarImg={defaultAvatarImg}
                          />
                          :
                          <div
                            className={`${styles.msg_img} ${msg.text.length > 20 ? styles.adjust_width : ""} d-flex flex-wrap align-items-center`}>
                            <img src={vAvatar} alt="chat_list_bot_user_icon"
                                 className={`${styles.bot_person} d-block mx-auto`}
                                 id={`chat_list_bot_user_icon_${index}`} name={`chat_list_bot_user_icon_${index}`}></img>
                          </div>
                      }
                      <div className={styles.msg_bubble_width}>
                        <div className={styles.msg_bubble} style={{marginTop: '19px'}}>
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
                                    '20px' : ''
                                }}
                              >
                          {
                            isKeywordDensity
                              ? <>
                                {
                                  msg.keywordDensity !== undefined && msg.keywordDensity !== '' ?
                                    keywordDensityText + msg.keywordDensity + '%'
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
                    return <div key={index} className={`${styles.msg} ${styles.right_msg}`}>
                      <div>
                        <div
                          className={styles.msg_bubble}
                          dangerouslySetInnerHTML={{__html: msg.text}}
                        />
                      </div>
                    </div>
                  }
                })
              }
              <div ref={lastMessageRef}/>
            </main>
          </div>
        </div> : null
      }
    </div>
  )
}

export default memo(ChatScriptMoveDialog)
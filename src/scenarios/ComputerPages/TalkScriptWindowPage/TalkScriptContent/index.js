import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
import left_point_msg from '../../../../property/images/left_point_msg.png'
import right_point_msg from '../../../../property/images/right_point_msg.png'
import getGifImage from '../../../../utils/newMapFIle';

const TalkScriptContent = ({messages, vAvatarName, taskScripts}) => {
  const [vAvatarImg, setAvatarImg] = useState(true)


  useEffect(() => {
    vAvatarName && getGifImage(vAvatarName, null).then(res => {
      setAvatarImg(res)
    })
  }, [messages])

  return (
      <div
          className={`${styles.main_div}`}
      >
        <div
            className={`${styles.body_div} ${styles.msger}`}
        >
          <main className={styles.msger_chat}>
            {
              messages.map((msg, index) => {
                if (msg.type == 'IncomingMessage') {
                  return <div key={index} className={`${styles.msg} ${styles.left_msg}`}>
                    <div
                        className={`${styles.msg_img} ${msg.text.length > 20 ? styles.adjust_width : ""} d-flex flex-wrap align-items-center`}>
                      <img src={vAvatarImg} alt="chat_list_bot_user_icon"
                           className={`${styles.bot_person} d-block mx-auto`}
                           id={`chat_list_bot_user_icon_${index}`} name={`chat_list_bot_user_icon_${index}`}></img>
                    </div>
                    <div className={styles.msg_bubble_width}>
                      <div className={styles.msg_bubble} style={{marginTop: '19px'}}>
                        <div className={styles.msg_text} id={`chat_list_bot_user_text_${index}`}
                             name={`chat_list_bot_user_text_${index}`}>
                          {msg.text}
                        </div>
                      </div>
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
          </main>
        </div>
      </div>
  )
}

export default TalkScriptContent;
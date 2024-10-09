import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from './styles.module.css'
import chat_icon from '../../../../property/images/chat_icon.png'
import {useTranslation} from 'react-i18next'

const ChatLog = ({id, messages, selectKeyword, bot_person}) =>{
    const {t} = useTranslation();
    let lastId = 0;
    const [loading, setLoading] = useState(true)
    const chatMsgRef = useRef({})
    const chatRef = useRef()

    const autoId = (prefix = '-chatlog-') => {
        lastId++;
        return `${id}${prefix}${lastId}`;
    }
    useEffect(() => {
        setLoading(false)
        chatMsgRef.current = {}
        chatMsgRef.current = messages.map((element, i) => chatMsgRef.current[i] ?? createRef());
    }, [messages])

    useEffect(() => {
        let index = null;
        for (const [key, value] of Object.entries(messages)) {
            //loop messages
            const parts = value.text.split(new RegExp(`(${selectKeyword})`, 'gi'));
            //loop each word
            for (const [k1, v1] of Object.entries(parts)) {
                if(v1.toLowerCase() === selectKeyword.toLowerCase())
                {
                    index = key
                }
            }
        }
        if(index != null)
        {
            if(chatMsgRef.current[index] != undefined)
            {
                if(chatMsgRef.current[index].current != null)
                {
                    console.log(chatMsgRef.current[index].current.offsetTop);
                    chatRef.current.scrollTop = chatMsgRef.current[index].current.offsetTop;
                }
            }
        }
    }, [selectKeyword])
    
    const getHighlightedText = (text, highlight, index) => {
        if(highlight)
        {
            const parts = text.split(new RegExp(`(${highlight})`, 'gi'));

            return <div className={styles.msg_text} id={`msg_mighlight_text${index+1}`} name={`msg_mighlight_text${index+1}`}>
                {parts.map(part => part.toLowerCase() === highlight.toLowerCase() ? <b key={autoId()} className={styles.msg_highlight}>{part}</b> : part)}
            </div>
        }else{
            return <div className={styles.msg_text} id={`msg_mighlight_text${index+1}`} name={`msg_mighlight_text${index+1}`}>{text}</div>
        }
    }
    
    return(
        <div className={`${styles.main_div}`} id="main_div" name="main_div">
            <div className={`${styles.title_div}`}>
                <img src={chat_icon} alt="chat icon" className={styles.chat_icon} id="chat_icon" name="chat_icon"/>
                <span className="ml-3" id="chat_history" name="chat_history"><b>{t('aiscore.chat_history')}</b></span>
            </div>
            <div className={`${styles.body_div} ${styles.msger}`} id="body_div" name="body_div"  ref={chatRef}>
                <main className={styles.msger_chat}>
                    {
                        !loading ?
                        messages.map((msg, index) => {
                            if(msg.type == 'IncomingMessage')
                            {
                                return <div key={index} className={`${styles.msg} ${styles.left_msg}`} ref={chatMsgRef.current[index]} id={`left_message_${index+1}`} name={`left_message_${index+1}`}>
                                            <div className={`${styles.msg_img} d-flex flex-wrap align-items-center`}>
                                                <img src={bot_person} alt="chat bot person" className={`${styles.bot_person} d-block mx-auto`} id={`chat_bot_person_${index+1}`} name={`chat_bot_person_${index+1}`}></img>
                                            </div>
                    
                                            <div className={styles.msg_bubble}>
                                                <div className={styles.msg_info}>
                                                <div className={styles.msg_info_name} id={`ai_bot_${index+1}`} name={`ai_bot_${index+1}`}>AIボット</div>
                                                </div>
                    
                                                <div className={styles.msg_text} id={`msg_text_${index+1}`} name={`msg_text_${index+1}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                            }else{
                                return <div key={index} ref={chatMsgRef.current[index]} className={`${styles.msg} ${styles.right_msg}`} id={`right_message_${index+1}`} index={`right_message_${index+1}`}>
                                    <div className={styles.msg_bubble}>
                                        {getHighlightedText(msg.text, selectKeyword, index)}
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

export default ChatLog;
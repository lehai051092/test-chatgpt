import React, { useEffect, useState, useRef, createRef } from 'react';
import styles from './styles.module.css'
import chat_icon from '../../../../property/images/chat_msg.png'
import right_point_msg from '../../../../property/images/right_point_msg.png'
import { useTranslation } from 'react-i18next'
import store from '../../../../storage';
import { browserRedirect } from '../../../../utils/util';

const ChatLog = ({ id, messages, selectKeyword, MsgSelectScore }) => {
    const { t } = useTranslation();
    let lastId = 0;
    const [loading, setLoading] = useState(true)
    const vChatMsgRef = useRef({})
    const vChatRef = useRef()
    const [vAvatarImg, setAvatarImg] = useState(true)

    const autoId = (prefix = '-chatlog-') => {
        lastId++;
        return `${id}${prefix}${lastId}`;
    }

    useEffect(() => {
        setLoading(false)
        vChatMsgRef.current = messages.map((element, i) => vChatMsgRef.current[i] ?? createRef());

        let temp_cur_persona = store.getState().currentChosedPersona ? store.getState().currentChosedPersona.id : 1;
    }, [messages])

    useEffect(() => {
        //select keyword auto scroll
        if (selectKeyword != undefined) {
            let findIndex = messages.findIndex(function (message, index) {
                if (message.id == selectKeyword.userMessageId) {
                    return true
                }
            });
            if (vChatMsgRef.current[findIndex] != undefined) {
                if (vChatMsgRef.current[findIndex].current != null) {
                    vChatRef.current.scrollTop = vChatMsgRef.current[findIndex].current.offsetTop - 200;
                }
            }
        }
    }, [selectKeyword])

    const getHighlightedText = (text, selectKeyword, msgId, index) => {
        //select keyword auto hightlight
        if (selectKeyword) {
            if (msgId == selectKeyword.userMessageId) {
                const parts = text.split(new RegExp(`(${selectKeyword.word})`, 'gi'));

                return <div className={styles.msg_text} id={`chat_list_user_text_${index}`} name={`chat_list_user_text_${index}`}>
                    {parts.map(part => part.toLowerCase() === selectKeyword.word.toLowerCase() ? <b key={autoId()} className={styles.msg_highlight}>{part}</b> : part)}
                </div>
            } else {
                return <div className={styles.msg_text} id={`chat_list_user_text_${index}`} name={`chat_list_user_text_${index}`}>{text}</div>
            }
        } else {
            return <div className={styles.msg_text} id={`chat_list_user_text_${index}`} name={`chat_list_user_text_${index}`}>{text}</div>
        }
    }

    const hightText = (item, index) => {
        let keywords = []
        item.matchedWords.map((v, k) => {
            keywords.push(v.word)
        })
        const pattern = Array.isArray(keywords) ? keywords.filter(arg => !!arg).join('|') : keywords;
        const regex = new RegExp(pattern.concat('|<[^>]*>'), 'gi');
        return (item.text).replace(regex, (match) => {
            if(match)
            {
                return `<b>${match}</b>`
            }else{
                return match
            }
        });
    }

    return (
        <div className={`${styles.main_div} ${browserRedirect()===3?styles.main_div_tablet:null}`} id="chat_list_container" name="chat_list_container">
            <div className={`${styles.title_div}`}>
                <img src={chat_icon} alt="chat icon" className={styles.chat_icon} id="chat_list_header_icon" name="chat_list_header_icon" />
                <span className={browserRedirect()===3?`ml-2`:`ml-3`} id="chat_list_header" name="chat_list_header"><b>{t('aiscore.chat_history')}</b></span>
            </div>
            <div className={`${styles.body_div} ${styles.msger}`} id="chat_lists" name="chat_lists" ref={vChatRef}>
                <main className={styles.msger_chat}>
                    {
                        !loading ?
                            messages.map((msg, index) => {
                                if (msg.type == 'IncomingMessage') {
                                    return 
                                    <div></div>
                                    // <div key={index} className={`${styles.msg} ${styles.left_msg}`} ref={vChatMsgRef.current[index]}>
                                    //     <div className={`${styles.msg_img} d-flex flex-wrap align-items-center`}>
                                    //         <img src={vAvatarImg} alt="chat_list_bot_user_icon" className={`${styles.bot_person} d-block mx-auto`} id={`chat_list_bot_user_icon_${index}`} name={`chat_list_bot_user_icon_${index}`}></img>
                                    //     </div>                                        
                                    //     <div>
                                    //         <div className={styles.msg_info}>
                                    //             <div className={styles.msg_info_name} id={`chat_list_bot_user_name_${index}`} name={`chat_list_bot_user_name_${index}`}>AIボット</div>
                                    //         </div>
                                    //         <div className={styles.msg_bubble}>
                                    //             <div className={styles.msg_text} id={`chat_list_bot_user_text_${index}`} name={`chat_list_bot_user_text_${index}`}>
                                    //                 {msg.text}
                                    //             </div>
                                    //         </div>
                                    //     </div>
                                    // </div>
                                } else {
                                    return <div key={index} ref={vChatMsgRef.current[index]} className={`${styles.msg} ${styles.right_msg}`}>
                                        <div>
                                            {/* <div className={styles.msg_info}>
                                                <div className={`${styles.msg_info_name} mr-2 mb-1`} id={`chat_list_bot_user_name_${index}`} name={`chat_list_bot_user_name_${index}`} style={{'opacity':'0'}}>募集人役 </div>
                                            </div> */}
                                            <div className={styles.msg_bubble} dangerouslySetInnerHTML={{ __html: hightText(msg, index) }} />
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
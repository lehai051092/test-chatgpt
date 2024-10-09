import React, {useEffect, useRef} from "react";
import styles from './styles.module.css'

const ShowButTalkScript = (props) => {
    const {onChange,checkState,buttonlabel,showFlg,  vTask, setTalkScript, vTalkScriptList, setCurrentIndex} = props;
    const ref = useRef(null);

    useEffect(() => {
        if (vTask && vTask.inProgressScriptLineId && ref && ref.current) {
            const index = vTalkScriptList?.findIndex((val)=> val.id === vTask.inProgressScriptLineId)
            ref.current.checked = true
            setTalkScript(true)
            setCurrentIndex(index)
        }
    }, [vTask, vTalkScriptList]);

    return (
        showFlg?
        <div className={`d-flex align-items-center float-right ${styles.video_chat_keyword_toggle_btn}`}>
            {/* <span className={`${styles.text_font} mr-1`}>全てを表示する</span> */}
            <span className={`${styles.text_font} mr-1`}>{buttonlabel}</span>
            <div onClick={onChange} style={{padding:'5px', marginTop:'5px'}} >
                <label ref={ref} className={`${styles.switch}`}>
                    <input type="checkbox" className="d-none" checked={checkState}/>
                    <div className={`${styles.slider}`} onClick={(e)=>{e.stopPropagation()}}></div>
                    <div className={`${styles.text}`}></div>
                </label>
            </div>
        </div>
        
        :

        <div className={`d-flex align-items-center float-left ${styles.video_chat_keyword_toggle_btn}`}>
            {/* <span className={`${styles.text_font} mr-1`}>全てを表示する</span> */}
            <div onClick={onChange} style={{padding:'5px', marginTop:'5px'}} >
            <label className={`${styles.switch}`}>
                <input ref={ref} type="checkbox" className="d-none"  checked={checkState}/>
                <div className={`${styles.slider}`} onClick={(e)=>{e.stopPropagation()}}></div>
                <div className={`${styles.text}`}></div>
            </label>
            </div>
            <span className={`${styles.text_font} mr-1`}>{buttonlabel}</span>
        </div>
    );
  };

export default ShowButTalkScript;
import React, {useEffect, useRef} from "react";
import styles from './styles.module.css'

const ShowButTalkScript = (props) => {
  const {onChange, checkState, buttonlabel, vTask, setTalkScript, vTalkScriptList, setCurrentIndex} = props;
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
      <div className={`d-flex align-items-center float-right ${styles.video_chat_keyword_toggle_btn}`}>
        {/* <span className={`${styles.text_font} mr-1`}>全てを表示する​</span> */}
        <span className={`${styles.text_font} mr-1`}>{buttonlabel}</span>
        <label className={`${styles.switch}`}>
          <input ref={ref} type="checkbox" className="d-none" onChange={onChange} checked={checkState}/>
          <div className={`${styles.slider}`}></div>
          <div className={`${styles.text}`}></div>
        </label>
      </div>
  );
};

export default ShowButTalkScript;
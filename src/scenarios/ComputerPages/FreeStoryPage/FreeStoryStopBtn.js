import React, {useEffect, useState} from 'react';
import FreeStoryStartMic from '../../../property/icons/free_story_img/free_story_save.svg';
import styles from './styles.module.css'

const FreeStoreStopBtn = ({processTag, onClick}) => {

  const [flg, setFlg] = useState(false);
  const [toastAnimation, setToastAnimation] = useState(false);
  const [toastAnimationFinished, setToastAnimationFinished] = useState(true);

  useEffect(() => {
    if (!processTag) setFlg(processTag);
    else if (toastAnimation || !toastAnimationFinished) return
    else {
      setFlg(processTag);
      setToastAnimation(true)
      setToastAnimationFinished(false)
      setTimeout(() => {
        setToastAnimation(false)
        setTimeout(() => {
          setToastAnimationFinished(true)
        }, 500)
      }, 2000)
    }
  }, [processTag])

  return (
      <div className={styles.free_story_start_btn_wrapper}>
        {
          !flg && !toastAnimation && toastAnimationFinished ?
              null
              : <div className={toastAnimation ?
                  styles.free_story_start_btn_toast:
                  styles.free_story_start_btn_toast_none}>保存が完了しました</div>
        }
        <button
            style={{background: 'transparent',
              cursor: !flg && !toastAnimation && toastAnimationFinished ? 'pointer' : 'not-allowed'
        }}
            onClick={async () => {
              if (toastAnimation || !toastAnimationFinished) return
              else {
                await onClick()
              }
            }}
        >
        <div className={`${styles.free_story_stop_btn}
         ${!flg && !toastAnimation && toastAnimationFinished ? 
            styles.free_story_stop_btn_not_start : 
            styles.free_story_stop_btn_started}`}
        >
          <img src={FreeStoryStartMic} alt="mic_icon" style={{margin: '-4px 15px 0px 0px'}}/>
          一時保存
        </div>
        </button>
      </div>

  )
}


export default FreeStoreStopBtn
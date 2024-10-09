import { useEffect, useState } from 'react';
import FreeStoryStartMic from '../../../property/icons/free_story_img/free_story_start_mic.svg';
import styles from './styles.module.css'

const FreeStoreStartBtn = ({ processTag, onClick }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div
          className={`${styles.free_story_start_btn} ${flg?styles.free_story_start_btn_started:styles.free_story_start_btn_not_start}`}
          onClick={onClick}
        >
            <img src={FreeStoryStartMic} alt="mic_icon" style={{margin:'-4px 15px 0px 0px'}} />
            ロープレ開始
        </div>
    )
}


export default FreeStoreStartBtn;

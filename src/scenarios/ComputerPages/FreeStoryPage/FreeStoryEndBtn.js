import { useEffect, useState } from 'react';
import FreeStoryEndArrowActive from '../../../property/icons/free_story_img/free_story_end_arrow_active.svg';
import FreeStoryEndArrowInactive from '../../../property/icons/free_story_img/free_story_end_arrow_inactive.svg';
import styles from './styles.module.css'

const FreeStoryEndBtn = ({ processTag, onClick }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div
          className={`${styles.free_story_end_btn} ${flg?styles.free_story_end_btn_started:styles.free_story_end_btn_not_start}`}
          onClick={onClick}
        >
            採点する
            {flg ? <img src={FreeStoryEndArrowActive} alt='arrow icon'/> : <img src={FreeStoryEndArrowInactive} alt='arrow icon'/>}
        </div>
    )
}


export default FreeStoryEndBtn;

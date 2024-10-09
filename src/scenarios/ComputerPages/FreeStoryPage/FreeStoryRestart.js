import { useEffect, useState } from 'react';

import styles from './styles.module.css'


const FreeStoryRestart = ({ processTag, onClick }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div
          className={`${styles.free_story_terminate_btn} ${flg?styles.free_story_terminate_btn_started:styles.free_story_terminate_btn_not_start}`}
          onClick={onClick}
        >
            最初からやり直す
        </div>
    )
}


export default FreeStoryRestart;

import { useEffect, useState } from 'react';

import styles from './styles.module.css'


const FreeStoryBreakoff = ({ processTag }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div className={`${styles.free_story_terminate_btn} ${flg?styles.free_story_terminate_btn_started:styles.free_story_terminate_btn_not_start}`}>
            中断する
        </div>
    )
}


export default FreeStoryBreakoff;
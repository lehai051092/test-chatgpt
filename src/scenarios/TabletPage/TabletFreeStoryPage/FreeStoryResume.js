import { useEffect, useState } from 'react';

import styles from './styles.module.css'


const FreeStoryResume = ({ processTag }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div>
            
            <button className={styles.video_chat_interrupt_btn} >やり直す</button>
        </div>
    )
}


export default FreeStoryResume;
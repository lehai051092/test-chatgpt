import { useEffect, useState } from 'react';

import styles from './styles.module.css'


const FreeStoryInterrupt = ({ processTag }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div>
            {
                !flg ?
                <>
                    <div className={styles.element_to_record_mask}>

                    </div>
                </> : null
            }
            <button className={styles.video_chat_terminate_btn} >中断する</button>


        </div>
    )
}


export default FreeStoryInterrupt;
import { useEffect, useState } from 'react';

import styles from './styles.module.css'
import free_story_start from '../../../property/images/free_story/free_story_start.png'
import free_story_start_disable from '../../../property/images/free_story/free_story_start_disable.png'
import free_story_on_going from '../../../property/images/free_story/free_story_on_going.png'

const FreeStoreStartSvg = ({ processTag }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div>
            {
                flg ?
                    <img src={free_story_on_going} width="201" height="57" style={{ cursor:"not-allowed",marginTop: 5 }} className={styles.animation}/>
                    : <img src={free_story_start} width="201" height="57" style={{ cursor:"pointer",marginTop: 5 }} />

            }
        </div>
    )
}


export default FreeStoreStartSvg;
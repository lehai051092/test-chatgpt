import { useEffect, useState } from 'react';

import styles from './styles.module.css'
import free_story_stop from '../../../property/images/free_story/free_story_stop_orange.png'
import free_story_stop_disable from '../../../property/images/free_story/free_story_stop_orange.png'


const FreeStoreSubmitSvg = ({ processTag }) => {

    const [flg, setFlg] = useState(false);

    useEffect(() => {
        setFlg(processTag);
    }, [processTag])

    return (
        <div>
            {
                !flg ?
                    <img src={free_story_stop_disable} width="189" height="100%" style={{ cursor:"not-allowed",marginTop: 5 }} />
                    : <img src={free_story_stop} width="189" height="100%" style={{ cursor:"pointer",marginTop: 5 }} />
            }

        </div>

    )
}


export default FreeStoreSubmitSvg;



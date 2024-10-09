import React, { useState } from 'react';

import key_word_back from '../../../../property/images/free_story/key_word_back.png';
import key_word_go from '../../../../property/images/free_story/key_word_go.png';
import pointerLeftMobile from '../../../../property/images/free_story/free_story_left.png';
import pointerRightMobile from '../../../../property/images/free_story/free_story_right.png';
import right from '../../../../property/images/free_story/right.png';
import styles from './styles.module.css'

const FastTextPageScorePointMobile = ({ processes, isVertical }) => {

    const [sectionMobileIndex, setSectionMobileIndex] = useState(0);
    
    return (
        <div className={isVertical ? styles.free_story_key_display : styles.free_story_key_display_landscape}>
            {
                processes != null ?
                    <>
                        {
                            sectionMobileIndex === 0 ?
                                <img src={key_word_back} className={styles.mobile_previous} />
                                :
                                <img src={pointerLeftMobile} onClick={() => {
                                    if (sectionMobileIndex === 0) {
                                        return false;
                                    }
                                    let t_sectionMobileIndex = sectionMobileIndex;
                                    t_sectionMobileIndex--;
                                    setSectionMobileIndex(t_sectionMobileIndex);
                                }} className={styles.mobile_previous} />
                        }
                        
                        <section className={styles.task_list_card} key={processes[sectionMobileIndex].id}>
                            <div className={processes[sectionMobileIndex].matched === true ? styles.task_list_card_selection : styles.task_list_card_unselection}>
                                {processes[sectionMobileIndex].matched  === true ? <img src={right} /> : null}
                            </div>
                            
                            <div className={styles.task_list_card_context}>
                               <span className={processes[sectionMobileIndex].matched  === true ? styles.card_title_select : styles.card_title_unselect}>{processes[sectionMobileIndex].name}</span>
                               <span className={processes[sectionMobileIndex].matched  === true ? styles.card_title_select : styles.card_title_unselect}>{processes[sectionMobileIndex].matchedKeywordCount}/{processes[sectionMobileIndex].keywords.length}</span>
                            </div>
                        </section>
                        {
                            sectionMobileIndex == processes.length - 1 ?
                                <img src={key_word_go} className={styles.mobile_next} />
                                :
                                <img src={pointerRightMobile} onClick={() => {
                                    if (sectionMobileIndex == processes.length - 1) {
                                        return false;
                                    }
                                    let t_sectionMobileIndex = sectionMobileIndex;
                                    t_sectionMobileIndex++;
                                    setSectionMobileIndex(t_sectionMobileIndex);
                                }} className={styles.mobile_next} />
                        }
                    </>
                    : null
            }

        </div>
    )
}

export default FastTextPageScorePointMobile;
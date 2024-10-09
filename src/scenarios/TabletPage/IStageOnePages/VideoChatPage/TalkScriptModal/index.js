import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import {saveScriptLine} from "../../../../../request/backendApi/api";
import store from "../../../../../storage";

export default function TalkScript(props) {
  const { talkScriptList, currentIndex, setCurrentIndex, vMatchedKeyWords, vTask, vIsplayed } = props;
  const hasRolePlayingData = store.getState().rolePlayingSavedDuringProcess
  const [content, setContent] = useState([]);
  useEffect(() => {
    var talkScript = document.getElementById("talkScript");
    var result = talkScriptList[currentIndex]?.scriptLines;
    let scoringKeywordsList = talkScriptList[currentIndex]?.["scoringKeywordsList"];
    if (!scoringKeywordsList) return
    for (var i = 0; i < scoringKeywordsList.length - 1; i++) {
        for (var j = 0; j < scoringKeywordsList.length - 1 - i; j++) {
            if (scoringKeywordsList[j].length < scoringKeywordsList[j + 1].length) {
                var temp = scoringKeywordsList[j];
                scoringKeywordsList[j] = scoringKeywordsList[j + 1];
                scoringKeywordsList[j + 1] = temp;
            }
        }
    }
    scoringKeywordsList.forEach((item) => {      let values = result.split(item);
      result = values.join(
        '<span style="background:yellow;">' + item + "</span>"
      );
    });
    talkScript.innerHTML = result;
  }, [vMatchedKeyWords, talkScriptList[currentIndex]?.scriptLines])
  const handleLeftButtonClick = (e) => {
    e.stopPropagation()
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }
  const handleRightButtonClick = (e) => {
    e.stopPropagation()
    if (currentIndex !== talkScriptList.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }
  return (
    <>
      <div className={`${styles.talk_script_modal_body_sp}`}>
        <div className={styles.talk_script_button_box_sp} onClick={handleLeftButtonClick}>
          <div className={`${currentIndex === 0 ? styles.talk_script_button_gray_sp : ''} ${styles.talk_script_button_l_sp}`}></div>
        </div>
        <div className={`${styles.talk_script_content_sp}`} id="talkScript">
          {talkScriptList && currentIndex > talkScriptList.length
            ? ""
            : talkScriptList && talkScriptList.length > 0
              ? talkScriptList[currentIndex]?.scriptLines
              : ""}
        </div>
        <div className={styles.talk_script_button_box_sp} onClick={handleRightButtonClick}>
          <div className={`${currentIndex === talkScriptList.length - 1 ? styles.talk_script_button_gray_sp : ''} ${styles.talk_script_button_r_sp}`}></div>
        </div>
      </div>
    </>
  )
}

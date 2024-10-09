import React, {memo, useCallback, useEffect} from "react";
import styles from "./styles.module.css";
import {saveScriptLine} from "../../../../request/backendApi/api";
import store from "../../../../storage";

function TalkScript(props) {
  const { talkScriptList, currentIndex, setCurrentIndex, talkScriptKey, vTask, vIsplayed } =
    props;
  const hasRolePlayingData = store.getState().rolePlayingSavedDuringProcess

  const handleLeftButtonClick = useCallback(
      () => {
        if (currentIndex !== 0) {
          setCurrentIndex(currentIndex - 1);
        }
      },
      [currentIndex, hasRolePlayingData, setCurrentIndex, talkScriptList, vIsplayed, vTask.chat?.id],
  );

  const handleRightButtonClick = useCallback(
      () => {
        if (currentIndex !== talkScriptList.length - 1) {
          setCurrentIndex(currentIndex + 1);
        }
      },
      [currentIndex, hasRolePlayingData, setCurrentIndex, talkScriptList, vIsplayed, vTask.chat?.id],
  );


  useEffect(() => {
    var talkScript = document.getElementById("talkScript");
    var result = talkScriptList[currentIndex]?.scriptLines;
    let scoringKeywordsList = talkScriptList[currentIndex]?.["scoringKeywordsList"] ?? [];
    for (var i = 0; i < scoringKeywordsList.length - 1; i++) {
        for (var j = 0; j < scoringKeywordsList.length - 1 - i; j++) {
            if (scoringKeywordsList[j].length < scoringKeywordsList[j + 1].length) {
                var temp = scoringKeywordsList[j];
                scoringKeywordsList[j] = scoringKeywordsList[j + 1];
                scoringKeywordsList[j + 1] = temp;
            }
        }
    }
    scoringKeywordsList.forEach((item) => {
      let values = result.split(item);
      result = values.join(
        '<span style="background:yellow;">' + item + "</span>"
      );
    });
    talkScript.innerHTML = result;
  }, [props]);

  return (
    <>
      <div className={`${styles.talk_script_modal_body}`}>
        <div
          className={styles.talk_script_button_box}
          style={{cursor:currentIndex === 0 ? 'not-allowed' : 'pointer'}}
          onClick={() => handleLeftButtonClick()}
        >
          <div style={{ height: "15px" }}></div>
          <div
            className={`${
              currentIndex === 0 ? styles.talk_script_button_gray : ""
            } ${styles.talk_script_button_l}`}
          ></div>
          <span
            className={`${
              currentIndex === 0 ? styles.talk_script_button_gray : ""
            } ${styles.talk_script_button_content}`}
          >
            前へ
          </span>
        </div>
        <div className={`${styles.talk_script_content}`} id="talkScript">
          {talkScriptList && currentIndex > talkScriptList.length
            ? ""
            : talkScriptList && talkScriptList.length > 0
            ? talkScriptList[currentIndex]?.scriptLines
            : ""}
        </div>
        <div
          className={styles.talk_script_button_box}
          style={{cursor:currentIndex === talkScriptList.length - 1 ? 'not-allowed' : 'pointer'}}
          onClick={handleRightButtonClick}
        >
          <div style={{ height: "15px" }}></div>
          <div
            className={`${
              currentIndex === talkScriptList.length - 1
                ? styles.talk_script_button_gray
                : ""
            } ${styles.talk_script_button_r}`}
          ></div>
          <span
            className={`${
              currentIndex === talkScriptList.length - 1
                ? styles.talk_script_button_gray
                : ""
            } ${styles.talk_script_button_content}`}
          >
            次へ
          </span>
        </div>
      </div>
    </>
  );
}
export default memo(TalkScript);

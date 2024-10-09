import React, { memo, useState, useEffect } from "react";
import styles from "./styles.module.css";

function TalkScript(props) {
  const { talkScriptList, currentIndex, setCurrentIndex, talkScriptKey, isVertical } =
    props;

  const handleLeftButtonClick = () => {
    if (currentIndex !== 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  const handleRightButtonClick = () => {
    if (currentIndex !== talkScriptList.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  useEffect(() => {
    var talkScript = document.getElementById("talkScript");
    var result = talkScriptList[currentIndex]?.scriptLines;
    talkScriptList[currentIndex]?.["scoringKeywordsList"].forEach((item) => {
      let values = result.split(item);
      result = values.join(
        '<span style="background:yellow;">' + item + "</span>"
      );
    });
    talkScript.innerHTML = result;
  }, [props]);

  return (
    <>
      <div className={`${isVertical ? styles.talk_script_modal_body : styles.talk_script_modal_body_landscape}`}>
        <div
          className={styles.talk_script_button_box}
          onClick={() => handleLeftButtonClick()}
        >
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
          onClick={handleRightButtonClick}
        >
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
          </span>
        </div>
      </div>
    </>
  );
}
export default memo(TalkScript);

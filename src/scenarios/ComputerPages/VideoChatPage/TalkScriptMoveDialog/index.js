import {useDragAndDrop} from "../../../../utils/useDragAndDrop";
import classes from "./styles.module.css";
import React, {memo, useEffect, useState} from "react";
import TalkScriptContent from "../../TalkScriptWindowPage/TalkScriptContent";
import close_icon from '../../../../property/images/close_circle_white.svg';
import store from "../../../../storage";
import {updateTalkScriptDialog} from "../../../../storage/reduxActions";

const TalkScriptMoveDialog = (props) => {
  const {vAvatarName, talkScripts, dialogTalkScripts} = props
  const {divRef} = useDragAndDrop({
    onClose: () => {
      store.dispatch(updateTalkScriptDialog(false))
    },
    startPosition:
        store.getState().talkScriptDialogPosition ? store.getState().talkScriptDialogPosition :
            {
              x: {
                direction: "left",
                quantity: '110px'
              },
              y: {
                direction: "top",
                quantity: '5px'
              }
            }
  })
  const [vMessages, setMessages] = useState(dialogTalkScripts);

  useEffect(() => {
    if (talkScripts && talkScripts.length > 0 && vMessages && vMessages.length > 0) {
      const newArr = vMessages.map((value) => {
        if (value.type === "IncomingMessage") return value
        const taskScript = talkScripts.find((v) => v.id === value.recordId)
        if (taskScript && taskScript.scoringKeywordsList && taskScript.scoringKeywordsList.length > 0) {
          taskScript.scoringKeywordsList.forEach((scoringKeyword) => {
            const regexPattern = new RegExp(scoringKeyword, "g");
            value.text = value.text.replace(regexPattern, '<span style="background:yellow; color: black">' + scoringKeyword + "</span>")
          })
        }
        return value
      })
      setMessages(newArr)
    }
  }, [talkScripts]);

  return (
      <div
          ref={divRef}
          className={classes.moveDialog}
      >
        <div
            className={classes.headerRoot}
            style={{
              backgroundColor: "#00a5d9",
              color: "#ffffff",
            }}
            id={'dragAndDropChatHeader'}
        >
          <span
              className={classes.headerTitle}
              id={'dragAndDropChatHeaderTitle'}
          >
            トークスクリプト
          </span>
          <button
              className={classes.headerCloseButton}
          >
            <img
                id={"dragAndDropChatHeaderCloseButton"}
                className={classes.headerCloseButtonICon}
                src={close_icon}
                alt="close"
            />
          </button>
        </div>
        {
          vMessages ? <TalkScriptContent
              messages={vMessages}
              vAvatarName={vAvatarName}
              taskScripts={talkScripts}
          /> : null
        }
      </div>
  )
}

export default memo(TalkScriptMoveDialog)
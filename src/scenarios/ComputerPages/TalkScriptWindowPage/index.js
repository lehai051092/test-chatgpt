import React, {useEffect, useState} from "react";
import {getChatScriptLines, getLessonTask, getTaskScriptLines} from "../../../request/backendApi/api";
import {useParams} from "react-router-dom";
import TalkScriptContent from "./TalkScriptContent";


const TalkScriptWindowPage = () => {
  let {taskID, lessonId, chatId} = useParams();
  const [vMessages, setMessages] = useState([]);
  const [taskScripts, setTaskScripts] = useState([]);
  //avata image name
  const [vAvatarName, setAvatarName] = useState('');

  useEffect(async () => {
    if (taskID && lessonId && chatId) {
      await getLessonTask(`lessons/${lessonId}/tasks`).then((res) => {
        res.data.length > 0 && setAvatarName(res.data[0].persona.avatar)
      });
      await getChatScriptLines(chatId).then((res) => {
        if (res && res.data) {
          setMessages(res.data)
        }
      })
      await getTaskScriptLines(taskID).then((res) => {
        if (res && res.data) {
          setTaskScripts(res.data)
        }
      })
    }
  }, []);



  useEffect(() => {
      if (taskScripts && taskScripts.length > 0 && vMessages && vMessages.length > 0) {
        const newArr = vMessages.map((value) => {
          if (value.type === "IncomingMessage") return value
          const taskScript = taskScripts.find((v)=> v.id === value.recordId)
          if (taskScript && taskScript.scoringKeywords && taskScript.scoringKeywords.length > 0) {
            taskScript.scoringKeywords.forEach((scoringKeyword) => {
              const regexPattern = new RegExp(scoringKeyword.keyword, "g");
              value.text = value.text.replace(regexPattern, '<span style="background:yellow; color: black">' + scoringKeyword.keyword + "</span>")
            })
          }
          return value
          // value.text
        })
        setMessages(newArr)
      }
  }, [taskScripts]);
  if (!vMessages) return null
  else return <TalkScriptContent
      messages={vMessages}
      vAvatarName={vAvatarName}
      taskScripts={taskScripts}
  />
}

export default TalkScriptWindowPage
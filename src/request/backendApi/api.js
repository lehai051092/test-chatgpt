import service, {serviceForFile} from "./service";
import chatService from '../textSpeechTransitionApi/chatService';
import axios from "axios";
import moment from "moment/moment";

export function getLessonList(url) {
  return service({
    url: url,
    method: "GET",
  });
}

export function getLessonTask(url) {
  return service({
    url: url,
    method: "GET",
  });
}

export function getLessonInfo(url) {
  return service({
    url: url,
    method: "GET",
  });
}

// no use
export function getRecruiterList() {
  return service({
    url: "/",
    method: "get",
  });
}

export function getHistoryList(url, inputText, theme, scenario) {
  return service({
    url: url,
    method: "get",
    params: {
      agent: inputText,
      role: "",
      theme: theme,
      scenario: scenario,
    }
  });
}

export function getPayOfNumber(url) {
  return service({
    url: url,
    
    method: 'GET'
  })
}

export function getRateOfRiskCirclePercent(taskID, userId) {
  return service({
    url: `tasks/${taskID}/stats/${userId}`,
    method: 'GET'
  })
}

export function getRateOfRiskScoreBar(taskID, userId) {
  return service({
    url: `/tasks/${taskID}/chats/stats/${userId}`,
    method: 'GET'
  })
}

export function getAiScoreHistoryChats(taskID, userId) {
  return service({
    url: `/tasks/${taskID}/chats/${userId}`,
    method: 'GET'
  })
}

export function getHistoryDetailList(userId, agentCode) {
  return service({
    url: `/history/${userId}/${agentCode}`,
    method: "get",
  });
}

export function getHistoryDetailListForAdminAssociate(targetRid) {
  return service({
    url: `/history/employee/${targetRid}`,
    method: "get",
  });
}

export function getCompanyList() {
  return service({
    url: '/history/agent',
    method: "get"
  })
}

export function startChat(taskId, params) {
  return service({
    url: '/tasks/' + taskId + '/start-chat',
    method: 'POST',
    data: {
      ...params,
      startTextNone: params.startTextNone ? params.startTextNone : false
    }
  })
}

export function reStartChat(taskId, chatId) {
  return service({
    url: '/tasks/' + taskId + '/restart-chat/' + chatId,
    method: 'GET',
  })
}

export function getCheckSavedChat() {
  return service({
    url: '/chats/check-unfinished-chat',
    method: 'GET',
  })
}

export function saveChat(chatId, isUnfinished, saveText) {
  return service({
    url: '/chats/' + chatId + '/save',
    method: 'POST',
    data: {
      isUnfinished: isUnfinished,
      text: saveText
    }
  })
}

export function saveScriptLine(chatId, lineId) {
  return service({
    url: '/chats/' + chatId + '/save-script-line',
    method: 'POST',
    data: {
      id: lineId
    }
  })
}

export function getChatMatchWords(chatId) {
  return service({
    url: '/chats/' + chatId + '/match-words',
    method: 'GET'
  })
}

export function getChatScriptLines(chatId) {
  return service({
    url: '/chats/' + chatId + '/script-lines',
    method: 'GET'
  })
}

export function getTaskScriptLines(taskId) {
  return service({
    url: '/tasks/' + taskId + '/script-lines',
    method: 'GET'
  })
}

export function postTexhToSpeech(data) {
  return chatService({
    url: '/node-api/text-to-speech',
    method: 'POST',
    data: data,
  })
}

export function upArrow(chatId, data) {
  return service({
    url: '/chats/' + chatId,
    method: 'PUT',
    data: data
  })
}

export function sendGPT(chatId, data) {
  return service({
    url: '/chat-gpt/' + chatId,
    method: 'PUT',
    data: data
  })
}


export function startGPTMessage(chatId) {
  return service({
    url: '/chat-gpt/start-gpt-message/' + chatId,
    method: 'POST',
  })
}

export function sendGPTIncomingMessage(chatId, data) {
  return service({
    url: '/chat-gpt/' + chatId + '/force-incoming-message',
    method: 'POST',
    data: data
  })
}

export function upArrowFastText(chatId, data) {
  return service({
    url: '/fasttext/' + chatId,
    method: 'PUT',
    data: data
  })
}

export function postVoice(chatId) {
  return chatService({
    url: '/socket.io',
    method: 'POST'
  })
}

export function finishScoring(chatId, status) {
  return service({
    url: '/chats/' + chatId + '/finished/' + status,
    method: 'PUT'
  })
}

export function getChatIdListByCommitIdForMultipleSection(commitId) {
  return service({
    url: `/chats/results/${commitId}`,
    method: 'GET'
  })
}

export function deleteScoring(chatId) {
  if (chatId) {
    return service({
      url: `/chats/${chatId}/score`,
      method: 'DELETE'
    })
  } else {
    return new Promise((resolve, reject) => {
    });
  }
  
}

export function getAuthorizeUserList() {
  return service({
    url: '/users/me',
    method: "post"
  })
}

export function getSectionList() {
  return service({
    url: '/maintain/all-sections',
    method: "get"
  })
}

export function getKeywords(query) {
  return service({
    url: `/synonyms?query=${query}`,
    method: 'GET'
  })
}

export function getAllKeywords() {
  return service({
    url: '/synonyms/all',
    method: 'GET'
  })
}

export function postKeywords(data) {
  return service({
    url: '/synonyms',
    method: 'POST',
    data: data
  })
}

export function deleteKeywords({keyword, synonym}) {
  return service({
    url: `/synonyms/delete-keyword?keyword=${keyword}&synonym=${synonym}`,
    method: 'DELETE'
  })
}

export function getMaintainSection(sectionId) {
  return service({
    url: `/maintain/section/${sectionId}`,
    method: "get"
  })
}

export function getProcessToken() {
  return service({
    url: `/processes/token`,
    method: "get"
  })
}

export function getPersonActions() {
  return service({
    url: `/maintain/section/personaAction`,
    method: "get"
  })
}

export function getMaterialToken() {
  return service({
    url: '/processes/token',
    method: 'GET'
  })
}

export function uploadMaterail(data) {
  return serviceForFile({
    url: `/processes/reference-materials`,
    method: 'POST',
    data: data
  })
}

export function saveAndUpdateMatainSection(data, autoAnswer, sectionId) {
  return service({
    url: `/maintain/section/${sectionId}`,
    method: 'PUT',
    data: {chatProcess: data, gptAutoAnswer: autoAnswer}
  })
}

export function saveAndUpdateMatainSectionNew(data, sectionId) {
  return service({
    url: `/maintain/fasttext/${sectionId}`,
    method: 'PUT',
    data: {chatProcess: data}
  })
}

export function getScoreTable(taskID) {
  return service({
    url: `/processes/task/${taskID}`,
    method: 'GET',
  })
}

export function getCSVExportEmployee() {
  return serviceForFile({
    url: `/history/export/employee`,
    method: 'GET',
  })
}

export function getCSVExportForAllEmployee() {
  return serviceForFile({
    url: `/history/export`,
    method: 'GET',
  })
}

export function getZipFiles(name, path) {
  return serviceForFile({
    url: `/processes/zip`,
    method: 'GET',
    params: {
      name: name,
      path: path
    }
  })
}

export function getFile(referenceId) {
  return serviceForFile({
    url: `/processes/base64/${referenceId}`,
    method: 'GET',
  })
}

export function getBase64Name(referenceName) {
  return service({
    url: `/processes/base64/name/${referenceName}`,
    method: 'GET',
  })
}

export function getLessonCategories(url) {
  return service({
    url: url,
    method: "GET",
  });
}

export function getRadioList() {
  return service({
    url: '/maintain/all-sections',
    method: "get"
  })
}

export function sessionCSVExport() {
  return serviceForFile({
    url: `/maintain/export`,
    method: "GET",
  });
}

//get voc data
export function getAllVOCData(url) {
  return service({
    url: url,
    method: "GET",
  });
}

//get overall ai score
export function getOverallAiScoreData(personaId, commitId, userId) {
  return service({
    url: `/training/${personaId}/results/${commitId}/${userId}`,
    method: "GET",
  });
}

//get aiscore detail by section
export function getAiScoreDetailBySection(sectionId, userId) {
  return service({
    url: `/training/${sectionId}/results/${userId}`,
    method: "GET",
  });
}

export function getFreeStoryAPIForHistoryDetail(url) {
  return service({
    url: url,
    method: "GET",
  });
}

export function publishFreeVideo(referenceParams) {
  return service({
    url: `/free/video/public`,
    method: "PUT",
    data: referenceParams
  });
}

export function deleteFreeVideo(latestReocrdId, status) {
  return service({
    url: `/free/video/status/${latestReocrdId}/${status}`,
    method: "PUT"
  });
}

// Upload free store video
export function uploadFreestoreVideo(chatId, index, size, form) {
  return service({
    url: `/free/video-upload/${chatId}/${index}/${size}`,
    method: "POST",
    headers: {"Content-Type": "multipart/form-data"},
    data: form,
  });
}

export function getProcessDetail(personaId, taskID) {
  return service({
    url: `/processes/persona/${personaId}/${taskID}`,
    method: "GET",
  });
}

export function updateChatDuration(messageId, params) {
  return service({
    url: `/chats/${messageId}/time`,
    method: "PUT",
    data: params
  });
}

//call deptCode api for freestorytable
export function getDeptCodeHistory(url) {
  return service({
    url: url,
    method: "GET",
  });
}

export function getDeptCodeDepartment(deptCode) {
  return service({
    url: `free/department?deptCode=${deptCode}`,
    method: "GET",
  });
}

export function sendFreeStoryChatMsg(chatId, params) {
  return service({
    url: `free/${chatId}`,
    method: "PUT",
    data: params
  });
}

//get check free video active or inactive
export function getCheckFreeVideo(sectionId, userId) {
  return service({
    url: `/free/video/check/${sectionId}/${userId}`,
    method: "GET",
  });
}


export function getFreestoreVideo(chatId) {
  return service({
    url: `/free/video-upload/${chatId}`,
    method: "GET",
  });
}

export function loginOut(boo) {
  axios({
    url: "https://st-aflac.platformerfuji.com/apigw/va2roleplay/va2/logout",
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
    data: 'session_logout'
  }).then((response) => {
    console.log('response', response);
  }).catch((error) => {
    console.log('error', error);
    if (boo) {
      loginOut(false);
    }
  })
}

export function maintainCSVImport(data) {
  return service({
    url: 'maintain/import',
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'text/csv;charset=Shift_JIS'
    }
  })
}

export function maintainCSVExport() {
  return service({
    url: 'maintain/import/history',
    method: 'GET'
  })
}

export function getTaskInfo(taskId) {
  return service({
    url: `/tasks/info/${taskId}`,
    method: 'GET'
  })
}

export function lessonsScenarioOrderInterface(data) {
  return service({
    url: `/lessons/scenario/order`,
    method: 'PUT',
    data: data
  })
}

export function lessonsScenarioAdd(data) {
  return service({
    url: `/lessons/scenario/add`,
    method: 'PUT',
    data: data
  })
}

export function lessonsScenarioUpdate(data) {
  return service({
    url: `/lessons/scenario/update`,
    method: 'PUT',
    data: data
  })
}

export function lessonsScenarioUpdateStatus(data) {
  return service({
    url: `/lessons/scenario/status`,
    method: 'PUT',
    data: data
  })
}

export function getAllScenariosByTheme(data) {
  return service({
    url: `/lessons/scenario`,
    method: 'GET',
    params: data
  })
}

export function getAllPersonasByThemeAndScenario(data) {
  return service({
    url: `/lessons/persona`,
    method: 'GET',
    params: data
  })
}

export function updatePersonaOrder(data) {
  return service({
    url: `/lessons/persona/order`,
    method: 'PUT',
    data: data
  })
}

export function updatePersonaStatus(data) {
  return service({
    url: `/lessons/persona/status`,
    method: 'PUT',
    data: data
  })
}

export function addNewPersona(data) {
  return service({
    url: `/lessons/persona/add`,
    method: 'POST',
    data: data
  })
}

export function updatePersona(id, data) {
  return service({
    url: `/lessons/persona/update/${id}`,
    method: 'PUT',
    data: data
  })
}

export function getPersonaList(themeCode, scenarioCode) {
  return service({
    url: `/lessons/persona?theme=${themeCode}&scenario=${scenarioCode}`,
    method: 'GET',
  })
}

export function addNewSection(personaId, data) {
  return service({
    url: `/tasks/add/${personaId}`,
    method: 'POST',
    data: data,
  })
}

export function updateSection(sectionId, data) {
  return service({
    url: `/tasks/update/${sectionId}`,
    method: 'PUT',
    data: data,
  })
}

export function updateSectionOrder(data) {
  return service({
    url: `/tasks/order`,
    method: 'PUT',
    data: data,
  })
}

export function updateSectionStatus(data) {
  return service({
    url: `/tasks/status`,
    method: 'PUT',
    data: data,
  })
}

export function getAllSectionByPersonaId(personaId) {
  return service({
    url: `/tasks/persona`,
    method: 'GET',
    params: {personaId}
  })
}

export function updateThemes(data) {
  return service({
    url: `/lessons/theme`,
    method: 'PUT',
    data: data
  })
}

export function updateScenariosByTheme(data) {
  return service({
    url: `/lessons/scenario`,
    method: 'PUT',
    data: data
  })
}

export function updateAllPersonasForScenario(params, data) {
  return service({
    url: `/lessons/persona`,
    method: 'PUT',
    params: params,
    data: data
  })
}

export function updateTasksByPersonaId(personaId, data) {
  return service({
    url: `/tasks/persona/${personaId}`,
    method: 'PUT',
    data: data
  })
}

export function getScenarioChangeToActive(themeCode, scenarioCode) {
  return service({
    url: `/lessons/scenario/check?theme=${themeCode}&scenario=${scenarioCode}`,
    method: 'GET',
  })
}

export function getlessonsElearning() {
  return service({
    url: `/lessons/e-learning`,
    method: 'GET',
  })
}

export function getlessonsInfo(id) {
  return service({
    url: `/lessons/${id}`,
    method: 'GET',
  })
}

export function getRolePlayLog(from, to, page, pageSize, sortNames, sortOrder) {
  return service({
    url: `/roleplay-log`,
    method: 'GET',
    params: {
      start: moment(from).format('yyyyMMDD'),
      end: moment(to).format('yyyyMMDD'),
      page: page + 1,
      pagesize: pageSize,
      orderby: sortNames,
      sort: sortOrder
    }
  })
}

export function getRolePlayLogExport(from, to, promptPrice, completionPrice) {
  return service({
    url: `/roleplay-log/export`,
    method: 'GET',
    params: {
      start: moment(from).format('yyyyMMDD'),
      end: moment(to).format('yyyyMMDD'),
      orderby: 'date',
      sort: 'asc',
      promptPrice,
      completionPrice
    }
  })
}


export function getRolePlayLogDetailExport(values) {
  const sorted = values.sort((a, b) => a.no - b.no)
  return service({
    url: `/roleplay-log/download-excel`,
    method: 'GET',
    params: {
      items: sorted.map((item) => item.recordStats.recordId).join(','),
      no: sorted.map((item) => item.no).join(','),
    },
    requestBase: 'excel',
    responseType: 'blob' || 'arraybuffer'
  })
}

export function sendChatGPT(data) {
  return service({
    url: `/chat-gpt`,
    method: "POST",
    data: data,
  });
}


export function getCensoredCharacter() {
  return service({
    url: `/censored-character`,
    method: "GET",
  });
}

export function exportCensoredCharacter() {
  return service({
    url: `/censored-character/export`,
    method: "GET",
  });
}

export function createCensoredCharacter(data) {
  return service({
    url: `/censored-character`,
    method: "POST",
    data: {
      word: data
    }
  });
}

export function deleteCensoredCharacter(data) {
  return service({
    url: `/censored-character/${data}`,
    method: "DELETE",
  });
}

export function getDepartment(code, departmentName, sectionName, nameAbbr, nameEn, page, pageSize, sortNames, sortOrder, deleted) {
  return service({
    url: `/department`,
    method: 'GET',
    params: {
      code: code,
      departmentName: departmentName,
      sectionName: sectionName,
      nameAbbr: nameAbbr,
      nameEn: nameEn,
      page: page + 1,
      pagesize: pageSize,
      orderby: sortNames,
      sort: sortOrder,
      deleted: deleted
    }
  })
}

export function addDepartment(data) {
  return service({
    url: `/department`,
    method: 'POST',
    data: data,
  })
}

export function updateDepartment(id, data) {
  return service({
    url: `/department/${id}`,
    method: 'PUT',
    data: data,
  })
}

export function deleteDepartment(id, data) {
  return service({
    url: `/department/${id}`,
    method: 'DELETE',
    data: data,
  })
}

export function departmentCSVExport() {
  return service({
    url: '/department/export',
    method: 'GET'
  })
}

export function departmentCSVImport(data, userName) {
  return service({
    url: 'department/import?userName=' + userName,
    method: 'POST',
    data: data,
    headers: {
      'Content-Type': 'text/csv;charset=Shift_JIS'
    }
  })
}

export function departmentImportHistoryCSVExport() {
  return service({
    url: '/department/import/history',
    method: 'GET'
  })
}

export function getReplaceWords(original, replaced, inpropriate, hardReplace, page, pageSize, sortNames, sortOrder, deleted) {
  let wordType = "";
  if (inpropriate && hardReplace) {
    wordType = "INPROPRIATE_WORDS,HARD_REPLACE";
  } else if (inpropriate) {
    wordType = "INPROPRIATE_WORDS";
  } else if (hardReplace) {
    wordType = "HARD_REPLACE";
  }
  return service({
    url: `/words/replace`,
    method: 'GET',
    params: {
      originalWord: original,
      replaceWord: replaced,
      wordType: wordType,
      page: page + 1,
      pagesize: pageSize,
      orderby: sortNames,
      sort: sortOrder,
      deleted: deleted
    }
  })
}

export function getFuriganaWords(original, replaced, page, pageSize, sortNames, sortOrder, deleted) {
  return service({
    url: `/words/furigana`,
    method: 'GET',
    params: {
      originalWord: original,
      replaceWord: replaced,
      page: page + 1,
      pagesize: pageSize,
      orderby: sortNames,
      sort: sortOrder,
      deleted: deleted
    }
  })
}

export function addReplaceWord(data) {
  return service({
    url: `/words/replace`,
    method: 'POST',
    data: data,
  })
}

export function updateReplaceWord(id, data) {
  return service({
    url: `/words/replace/${id}`,
    method: 'PUT',
    data: data,
  })
}

export function deleteReplaceWord(id, data) {
  return service({
    url: `/words/replace/${id}`,
    method: 'DELETE',
    data: data,
  })
}

export function addFuriganaWord(data) {
  return service({
    url: `/words/furigana`,
    method: 'POST',
    data: data,
  })
}

export function updateFuriganaWord(id, data) {
  return service({
    url: `/words/furigana/${id}`,
    method: 'PUT',
    data: data,
  })
}

export function deleteFuriganaWord(id, data) {
  return service({
    url: `/words/furigana/${id}`,
    method: 'DELETE',
    data: data,
  })
}

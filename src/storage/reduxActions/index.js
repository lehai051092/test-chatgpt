import {
    CACHE_BACKEND_USER_INFO,
    CACHE_MSTDB_USER_INFO, CONDUCT_ALL_SECTION_ID,
    EVALUATION_TASK_ALL,
    HISTORY_TASK_ALL,
    LESSON_ALL,
    LESSON_TASK_ALL,
    RESET_ALL_2_INITIAL_STATE,
    SELECT_TASK,
    SPECIAL_AS_LIST,
    UPDATE_CHECK_RE_ROLE_PLAYING_DIALOG, UPDATE_CHECKED_START_PAGE_VISITED, UPDATE_GPT_TIMER_ID,
    UPDATE_IS_RE_ROLE_PLAYING, UPDATE_RESTART_TEXT,
    UPDATE_ROLE_PLAYING_SAVED_DURING_PROCESS,
    UPDATE_TALK_SCRIPT_DIALOG,
    UPDATE_TALK_SCRIPT_DIALOG_POSITION,
    UPDATE_TEMP_ROLE_PLAYING,
    USER_SPECIAL_AS
} from '../consts/index';

export function resetAll2InitialState() {
    return { type: RESET_ALL_2_INITIAL_STATE }
}

export function historyTaskAll(body)
{
    return {
        type: HISTORY_TASK_ALL,
    }
}

export function lessonTaskAll(body)
{
    return {
        type: LESSON_TASK_ALL,
        payload: body
    }
}

export function cacheBackendUserInfo(body){
    return {
        type: CACHE_BACKEND_USER_INFO,
        payload: body
    }
}

export function cacheMstUserInfo(body){
    return {
        type: CACHE_MSTDB_USER_INFO,
        payload: body
    }
}

export function cacheSpecialASCodeList(body){
    return {
        type: SPECIAL_AS_LIST,
        payload: body
    }
}

export function setUserSpecialAs(body){
    return {
        type: USER_SPECIAL_AS,
        payload: body
    }
}

export function evaluationTaskAll(body){
    return {
        type: EVALUATION_TASK_ALL,
        payload: body
    }
}
export function selectTask(body){
    return {
        type: SELECT_TASK,
        payload: body
    }
}

export function lessonAll(body)
{
    return {
        type: LESSON_ALL,
        payload: body
    }
}

export function updateRolePlayingSavedDuringProcess(body)
{
    return {
        type: UPDATE_ROLE_PLAYING_SAVED_DURING_PROCESS,
        payload: body
    }
}

export function updateCheckReRolePlayingDialog(body)
{
    return {
        type: UPDATE_CHECK_RE_ROLE_PLAYING_DIALOG,
        payload: body
    }
}


export function updateTempRolePlaying(body)
{
    return {
        type: UPDATE_TEMP_ROLE_PLAYING,
        payload: body
    }
}


export function updateTalkScriptDialog(body)
{
    return {
        type: UPDATE_TALK_SCRIPT_DIALOG,
        payload: body
    }
}

export function updateTalkScriptDialogPosition(body)
{
    return {
        type: UPDATE_TALK_SCRIPT_DIALOG_POSITION,
        payload: body
    }
}

export function updateCheckedStartPageVisited(body)
{
    return {
        type: UPDATE_CHECKED_START_PAGE_VISITED,
        payload: body
    }
}


export function updateRestartText(body)
{
    return {
        type: UPDATE_RESTART_TEXT,
        payload: body
    }
}

export function updateAllSectionId(body) {
    return {
        type: CONDUCT_ALL_SECTION_ID,
        id: body
    }
}



export function updateGPTTimerId(body)
{
    return {
        type: UPDATE_GPT_TIMER_ID,
        payload: body
    }
}
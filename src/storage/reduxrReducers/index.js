import {
    RESET_ALL_2_INITIAL_STATE,
    HISTORY_TASK_ALL,
    LESSON_TASK_ALL,
    CACHE_BACKEND_USER_INFO,
    EVALUATION_TASK_ALL,
    SELECT_TASK,
    UPDATE_REQUEST_HEADER_GROUP_ID,
    UPDATE_REQUEST_HEADER_USER_ID,
    CURRENT_CHOSED_PERSONA,
    LESSON_ALL,
    UPDATE_TRANSCRIPTION,
    CACHE_MSTDB_USER_INFO,
    CONDUCT_ALL_SECTION_ID,
    WEBSITE_TIME_OUT,
    CURRENT_SECTION_COUNT_DOWN,
    IS_ROLE_PLAY_ONGOING,
    SPECIAL_AS_LIST,
    USER_SPECIAL_AS,
    CURRENT_CHAT_INFO,
    IS_CROSS_WINDOW_DIALOGUE_OPEN,
    UPDATE_SIDEBAR_ACTIVE_NAME,
    UPDATE_SELECTED_THEME_NAME,
    UPDATE_SELECTED_SCENARIO_NAME,
    SELECTED_CUSTOMER_DATA,
    UPDATE_ROLE_PLAYING_SAVED_DURING_PROCESS,
    UPDATE_IS_ROLE_PLAYING,
    UPDATE_IS_RE_ROLE_PLAYING,
    UPDATE_CHECK_RE_ROLE_PLAYING_DIALOG,
    UPDATE_TEMP_ROLE_PLAYING,
    UPDATE_TALK_SCRIPT_DIALOG,
    UPDATE_TALK_SCRIPT_DIALOG_POSITION, UPDATE_CHECKED_START_PAGE_VISITED, UPDATE_RESTART_TEXT, UPDATE_GPT_TIMER_ID
} from '../consts';

const initialState = {
    userId: "7a3b9ba8d3cd48d697a5029e12958e4a",
    lesson_all: [],
    lesson_task_all: [],
    select_task: [],
    requestHeaderUserId: 'test-user-id',
    requestHeaderGroupId: 'G1test-agent,G6test-agent,G5ASEmanager,I3ASEadministrator',
    currentChosedPersona: {},
    login_task_all: {},
    transcript_one_time: '',
    cacheMstUserInfo: {},
    conduct_all_section_id: '', // id that generated in backend to mark whether a series of chat records are in one time,
    website_time_out: false, // mark whether website is timeout, 'false' means still active
    current_section_count_down: '', // current time spent in multiple role-play
    is_role_play_ongoing: false,
    special_AS_code_cache: [], // cache the AS code list from MVP1
    current_chat_information: {}, // information of ongoing chat
    dialogue_status: false,
    sidebar_active_name : '',
    selected_theme_name : '',
    selected_scenario_name : '',
    selected_customer_data: [],
    rolePlayingSavedDuringProcess: null,
    checkedReRolePlayingDialog: false,
    tempRolePlaying:null,
    talkScriptDialogOpen: false,
    talkScriptDialogPosition: null,
    checkedStartPageVisit: false,
    restartText:'',
    gptTimerId: null
};

export function customerFrontEnd(state = initialState, action) {
    switch (action.type) {
        case RESET_ALL_2_INITIAL_STATE:
            return { ...initialState }
        case HISTORY_TASK_ALL:
            return {
                ...state,
                history_task_all: action.payload
            }
        case LESSON_TASK_ALL:
            return {
                ...state,
                lesson_task_all: action.payload
            }
        case CACHE_BACKEND_USER_INFO:
            return {
                ...state,
                login_task_all: action.payload
            }
        case CACHE_MSTDB_USER_INFO:
            return {
                ...state,
                cacheMstUserInfo: action.payload
            }
        case EVALUATION_TASK_ALL:
        return {
                ...state,
                evaluation_task_all: action.payload
            }    
        case SELECT_TASK:
            return {
                ...state,
                select_task: action.payload
            }
        case UPDATE_REQUEST_HEADER_USER_ID:
            return {
                ...state,
                requestHeaderUserId: action.userId
            }
        case UPDATE_REQUEST_HEADER_GROUP_ID:
            return {
                ...state,
                requestHeaderGroupId: action.groupId
            }
        case CURRENT_CHOSED_PERSONA:
            return {
                ...state,
                currentChosedPersona: action.persona
            }
        case LESSON_ALL:
            return {
                ...state,
                lesson_all: action.payload
            }
        case UPDATE_TRANSCRIPTION:
            return {
                ...state,
                transcript_one_time: action.transcript
            }
        case CONDUCT_ALL_SECTION_ID:
            return {
                ...state,
                conduct_all_section_id: action.id
            }
        case WEBSITE_TIME_OUT:
            return {
                ...state,
                website_time_out: action.status
            }
        case CURRENT_SECTION_COUNT_DOWN:
            return {
                ...state,
                current_section_count_down: action.time
            }
        case IS_ROLE_PLAY_ONGOING:
            return {
                ...state,
                is_role_play_ongoing: action.status
            }
        case SPECIAL_AS_LIST:            
            return {
                ...state,
                special_AS_code_cache: action.payload
            }
        case USER_SPECIAL_AS:            
            return {
                ...state,
                user_special_as: action.payload
            }   
        case CURRENT_CHAT_INFO:
            return {
                ...state,
                current_chat_information: action.payload
            }
        case IS_CROSS_WINDOW_DIALOGUE_OPEN:
            return {
                ...state,
                dialogue_status: action.payload
            }
        case UPDATE_SIDEBAR_ACTIVE_NAME:
            return {
                ...state,
                sidebar_active_name: action.sidebar_active_name
            }
        case UPDATE_SELECTED_THEME_NAME:
            return {
                ...state,
                selected_theme_name: action.selected_theme_name
            }
        case UPDATE_SELECTED_SCENARIO_NAME:
            return {
                ...state,
                selected_scenario_name: action.selected_scenario_name
            }
        case SELECTED_CUSTOMER_DATA:
            return {
                ...state,
                selected_customer_data: action.selected_customer_data
            }
        case UPDATE_ROLE_PLAYING_SAVED_DURING_PROCESS:
            return {
                ...state,
                rolePlayingSavedDuringProcess: action.payload
            }
        case UPDATE_CHECK_RE_ROLE_PLAYING_DIALOG:
            return {
                ...state,
                checkedReRolePlayingDialog: action.payload
            }
        case UPDATE_TEMP_ROLE_PLAYING:
            return {
                ...state,
                tempRolePlaying: action.payload
            }

        case UPDATE_TALK_SCRIPT_DIALOG:
            return {
                ...state,
                talkScriptDialogOpen: action.payload
            }
        case UPDATE_TALK_SCRIPT_DIALOG_POSITION:
            return {
                ...state,
                talkScriptDialogPosition: action.payload
            }

        case UPDATE_CHECKED_START_PAGE_VISITED:
            return {
                ...state,
                checkedStartPageVisit: action.payload
            }

        case UPDATE_RESTART_TEXT:
            return {
                ...state,
                restartText: action.payload
            }

        case UPDATE_GPT_TIMER_ID:
            return {
                ...state,
                gptTimerId: action.payload
            }
        default:
            return state;
    }
}
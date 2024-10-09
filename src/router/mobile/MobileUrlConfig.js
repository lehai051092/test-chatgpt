
import human_role_play_icon from '../../property/images/sidebar_icon/human_role_play_icon.svg';
import ai_role_play_icon from '../../property/images/sidebar_icon/ai_role_play_icon.svg';
import personal_histories_icon from '../../property/images/sidebar_icon/personal_histories_icon.svg';
import company_wide_history_icon from '../../property/images/sidebar_icon/company_wide_history_icon.svg';
import employee_wide_history_icon from '../../property/images/sidebar_icon/employee_wide_history_icon.svg';
import role_play_setting_icon from '../../property/images/sidebar_icon/role_play_setting_icon.svg';
import synonmys_register_icon from '../../property/images/sidebar_icon/synonmys_register_icon.svg';
import file_export_icon from '../../property/images/sidebar_icon/file_export_icon.svg';
import manual_icon from '../../property/images/sidebar_icon/manual_icon.svg';
import help_center_icon from '../../property/images/sidebar_icon/help_center_icon.svg';

const GENERAL_USER = [
    {
        "url": "/start-new-role-play",
        "icon": ai_role_play_icon,
        "text": "AIとロープレ",
    },
    {
        "url": "/history-check-detail",
        "icon": personal_histories_icon,
        "text": "自分の履歴",
    },
    // {
    //     "url": "/manual",
    //     "icon": manual_icon,
    //     "text": "募集資材",
    // },
    {
        "url": "/help_center",
        "icon": help_center_icon,
        "text": "ヘルプセンター",
    }
];


const EVALUATOR = [
    {
        "url": "/start-new-role-play",
        "icon": ai_role_play_icon,
        "text": "AIとロープレ",
    },
    {
        "url": "/history-check-detail",
        "icon": personal_histories_icon,
        "text": "自分の履歴",
    },
    {
        "url": "/historycheck",
        "icon": company_wide_history_icon,
        "text": "自社の履歴",
    },
    // {
    //     "url": "/manual",
    //     "icon": manual_icon,
    //     "text": "募集資材",
    // },
    {
        "url": "/help_center",
        "icon": help_center_icon,
        "text": "ヘルプセンター",
    }
];


const ADMINISTRATOR = [
    // {
    //     "url": "/outer-link",
    //     "icon": human_role_play_icon,
    //     "text": "人とロープレ",
    // },
    {
        "url": "/start-new-role-play",
        "icon": ai_role_play_icon,
        "text": "AIとロープレ",
    },
    {
        "url": "/history-check-detail",
        "icon": personal_histories_icon,
        "text": "自分の履歴",
    },
    {
        "url": "/historycheck",
        "icon": company_wide_history_icon,
        "text": "ASの履歴",
    },
    {
        "url": "/admin/af-member-free-story",
        "icon": employee_wide_history_icon,
        "text": "社員の履歴",
    },
    // {
    //     "url": "/admin/create",
    //     "icon": role_play_setting_icon,
    //     "text": "ロープレ作成",
    // },
    // {
    //     "url": "/manual",
    //     "icon": manual_icon,
    //     "text": "募集資材",
    // },
    {
        "url": "/help_center",
        "icon": help_center_icon,
        "text": "ヘルプセンター",
    }
];


const I3ASEADMINISTRATOR = [
    // {
    //     "url": "/outer-link",
    //     "icon": human_role_play_icon,
    //     "text": "人とロープレ",
    // },
    {
        "url": "/start-new-role-play",
        "icon": ai_role_play_icon,
        "text": "AIとロープレ",
    },
    {
        "url": "/history-check-detail",
        "icon": personal_histories_icon,
        "text": "自分の履歴",
    },
    {
        "url": "/historycheck",
        "icon": company_wide_history_icon,
        "text": "ASの履歴",
    },
    {
        "url": "/admin/af-member-free-story",
        "icon": employee_wide_history_icon,
        "text": "社員の履歴",
    },
    // {
    //     "url": "/admin/create",
    //     "icon": role_play_setting_icon,
    //     "text": "ロープレ作成",
    // },
    // {
    //     "url": "/admin/register-synonyms",
    //     "icon": synonmys_register_icon,
    //     "text": "類義語登録​",
    // },
    // {
    //     "url": "/admin/csv",
    //     "icon": file_export_icon,
    //     "text": "利用ログ出力",
    // },
    // {
    //     "url": "/manual",
    //     "icon": manual_icon,
    //     "text": "募集資材",
    // },
    {
        "url": "/help_center",
        "icon": help_center_icon,
        "text": "ヘルプセンター",
    }
];

// The following routing page does not display the return button
export const showBack = [
    "/outer-link",
    "/start-new-role-play",
    "/history-check-detail",
    "/historycheck",
    "/admin/af-member-free-story",
    "/admin/create",
    "/admin/register-synonyms",
    "/admin/csv",
    // "/manual"
]

// Permission menu 
export const SidebarList = {
    "GENERAL_USER":GENERAL_USER,
    "EVALUATOR":EVALUATOR,
    "ADMINISTRATOR":ADMINISTRATOR,
    "I3ASEADMINISTRATOR":I3ASEADMINISTRATOR
}






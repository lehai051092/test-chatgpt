
import ai_role_play from '../../property/images/sidebar_icon/sidebar_ai_role_play.svg';
import company_history from '../../property/images/sidebar_icon/sidebar_company_history.svg';
import human_role_play from '../../property/images/sidebar_icon/sidebar_human_role_play.svg';
import manual from '../../property/images/sidebar_icon/sidebar_manual.svg';
import personal_history from '../../property/images/sidebar_icon/sidebar_personal_history.svg';
import resource_export from '../../property/images/sidebar_icon/sidebar_resource_export.svg';
import role_play_create from '../../property/images/sidebar_icon/sidebar_role_play_setting.svg';
import synonmys_word from '../../property/images/sidebar_icon/sidebar_synonmys_register.svg';
import af_member_free_story from '../../property/images/sidebar_icon/af_member_free_story.svg'

import human_role_play_icon from '../../property/images/sidebar_icon/human_role_play_icon.svg';
import ai_role_play_icon from '../../property/images/sidebar_icon/ai_role_play_icon.svg';
import personal_histories_icon from '../../property/images/sidebar_icon/personal_histories_icon.svg';
import company_wide_history_icon from '../../property/images/sidebar_icon/company_wide_history_icon.svg';
import employee_wide_history_icon from '../../property/images/sidebar_icon/employee_wide_history_icon.svg';
import role_play_setting_icon from '../../property/images/sidebar_icon/role_play_setting_icon.svg';
import synonmys_register_icon from '../../property/images/sidebar_icon/synonmys_register_icon.svg';
import sidebar_roleplay_log from '../../property/images/sidebar_icon/sidebar_roleplay_log.svg';
import sidebar_book from '../../property/images/sidebar_icon/sidebar_book.svg';

import file_export_icon from '../../property/images/sidebar_icon/file_export_icon.svg';
import manual_icon from '../../property/images/sidebar_icon/manual_icon.svg';
import department_icon from '../../property/images/sidebar_icon/sidebar_department.svg';
import help_center_icon from '../../property/images/sidebar_icon/help_center_icon.svg';

export const SidebarList = [
    {
        "url": "/outer-link",
        "icon": human_role_play_icon,
        "text": "sidebar.individual_role_play",
        "name": "person_role_play"
    },
    {
        "url": "/start-new-role-play",
        "icon": ai_role_play_icon,
        "text": "sidebar.role_playing_with_ai",
        "name" : "role_play"
    },
    {
        "url": "/history-check-detail",
        "icon": personal_histories_icon,
        "text": "sidebar.check_history",
        "name": "manage"
    },
    {
        "url": "/historycheck",
        "icon": personal_histories_icon,
        "text": "sidebar.check_history",
        "name": "admin_associate"
    },
    {
        "url": "/historycheck",
        "icon": company_wide_history_icon,
        "text": "sidebar.admin_screen",
        "name": "history"
    },
    {
        "url": "/admin/af-member-free-story",
        "icon": employee_wide_history_icon,
        "text": "社員の履歴",
        "name": "af_member_free_story"
    },
    {
        "url": "/admin/departments",
        "icon": department_icon,
        "text": "組織登録",
        "name": "admin_departments"
    },
    {
        "url": "/admin/create",
        "icon": role_play_setting_icon,
        "text": "sidebar.spouse_story1",
        "name" : "admin_create"
    },
    {
        "url": "/admin/register-synonyms",
        "icon": synonmys_register_icon,
        "text": "用語登録",
        "name": "admin_synonyms"
    },
    {
        "url": "/admin/csv",
        "icon": file_export_icon,
        "text": "ログ出力",
        "name": "admin_export"
    },
    // {
    //     "url": "/manual",
    //     "icon": manual_icon,
    //     "text": "sidebar.user_manual",
    //     "name": "manual"
    // },
    {
        "url": "/outer-link",
        "icon": help_center_icon,
        "text": "sidebar.help_center",
        "name": "help_center"
    },
    
]
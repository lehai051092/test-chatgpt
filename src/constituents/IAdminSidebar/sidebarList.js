import React from 'react';
import spouse_story from "../../property/images/sidebar_icon/admin_sidebar/spouse_story.png";
import children_story from "../../property/images/sidebar_icon/admin_sidebar/children_story.png";
import one_person_story from "../../property/images/sidebar_icon/admin_sidebar/one_person_story.png";
import synonym_registration from "../../property/images/sidebar_icon/admin_sidebar/synonym_registration.png";

export const adminSidebarList = [
    {
        "url": "/admin/create/tab1",
        "icon": spouse_story,
        "text": "sidebar.spouse_story",
        "name" : "role_play"
    },
    {
        "url": "/admin/create/tab2",
        "icon": children_story,
        "text": "sidebar.children_story",
        "name": "manage"
    },
    {
        "url": "/admin/create/tab3",
        "icon": one_person_story,
        "text": "sidebar.one_person_story",
        "name": "history"
    },
    {
        "url": "/admin/register-synonyms",
        "icon": synonym_registration,
        "text": "sidebar.synonym_registration",
        "name": "synonyms"
    },
    {
        "url": "/admin/csv",
        "icon": "export",
        "text": "利用ログ出力",
        "name": "export"
    }
]
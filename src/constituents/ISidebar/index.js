import React, {useCallback, useEffect, useRef, useState} from "react";
import {NavLink, useHistory, useLocation} from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {connect} from "react-redux";

import logo from "../../property/images/logo.png";
import {SidebarList} from "./sidebarList";
import ConfirmDialog from "../IConfirmDialogReRolePlay";
import "./styles.css";
import {
  deleteScoring,
  getChatIdListByCommitIdForMultipleSection, getCheckSavedChat,
  getProcessToken,
  saveChat
} from "../../request/backendApi/api";
import {IS_CROSS_WINDOW_DIALOGUE_OPEN, IS_ROLE_PLAY_ONGOING, UPDATE_SIDEBAR_ACTIVE_NAME} from '../../storage/consts'
import store from "../../storage";
import {getRedirectMVP1Url, isDevOrLocalEnv} from "../../utils/runtime";
import {getLocationState, reloadByHash, setLocationState} from "../../utils/util";
import {updateRolePlayingSavedDuringProcess} from "../../storage/reduxActions";

let locationPath = '';

const Sidebar = ({isOpen, setIsOpen, className, style, login_task_all, sidebar_active_name, special_AS_code, gptTimerId}) => {
  const location = useLocation();
  const {t} = useTranslation();
  const history = useHistory();
  const elementRef = useRef(null);

  const [roleList, setRoleList] = useState([]);
  const [removeSidebar, setRemoveSidebar] = useState([]);
  const [currentStatus, setCurrentStatus] = useState('');
  const [vNavClickable, setNavClickable] = useState(false);
  const [vProcessToken, setProcessToken] = useState();
  // const [vClickPdf, setClickPdf] = useState(false);
  const [vShowSideBar, setShowSideBar] = useState(false);
  const [vClickedMenu, setClickedMenu] = useState({});
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [confirmDialogType, setConfirmDialogType] = useState('fixedStory');
  // style control
  const [currentMenu, setCurrentMenu] = useState('');
  const [hrefPath, setHrefPath] = useState('');

  useEffect(() => {
    if (login_task_all) {
      setRoleList(login_task_all.userRoles);
    }
  }, [login_task_all]);

  useEffect(() => {
    if (location.pathname.indexOf('free-story-chat-page') > 0) {
      setHrefPath("free-story-chat-page");
    }
    if (location.pathname.indexOf('associate') > 0) {
      setHrefPath("/admin/associate");
    }

    if (
        // NOTE: フリーストーリーロールプレイングページからの遷移時に必ずリロードされる。
        // (一時保存データの読み込みができず初めからロールプレイングが始まってしまうためコメントアウト。)
        // hrefPath === "free-story-chat-page" ||
        hrefPath === "/admin/associate") {
      setTimeout(() => {
        reloadByHash();
      }, 100);
    }
    SidebarList.map(item => {
      if (item.url === location.pathname) {
        setCurrentMenu(item.name);
        store.dispatch({type: UPDATE_SIDEBAR_ACTIVE_NAME, sidebar_active_name: item.name})
      }
    })
  }, [location.pathname])

  useEffect(() => {
    //////////////////
    // "G1test-agent,G6test-agent" => agent user (regular recruiter)
    // "G1test-agent,G6test-agent,G5ASEmanager" => agent Manager (recruit Manager)
    // "I3ASEadministrators" => Administrator
    let arr = [];
    if (roleList && roleList.length > 0 && login_task_all) {
      if (roleList.includes("GENERAL_USER")) {
        SidebarList.filter(word => {
          return !['person_role_play', 'role_play', 'manage', 'af_member_free_story', 'help_center'].includes(word.name);
        }).map((item) => arr.push(item.name));
      }

      if (roleList.includes("GENERAL_USER") || roleList.includes("EVALUATOR")) {
        arr.push('af_member_free_story')
        if (special_AS_code && special_AS_code.length > 0) {
          let curUserASCodeFull = login_task_all?.agentCode?.value;
          if (curUserASCodeFull && curUserASCodeFull.length == 10) {
            let agentCode = curUserASCodeFull.substring(0, 7);
            if (isDevOrLocalEnv()) {
              if (special_AS_code.find(code => code.code == agentCode) == undefined) {
                // if not in AS code, can not see human role play
                arr.push('person_role_play')
              }
            } else {
              if (special_AS_code.find(code => code == agentCode) == undefined) {
                // if not in AS code, can not see human role play
                arr.push('person_role_play')
              }
            }
          }
        } else {
          // no value of AS code, not show human role play
          arr.push('person_role_play')
        }
      }

      //only ADMINISTRATOR
      if (!(roleList.includes("I3ASEADMINISTRATOR") && (login_task_all.managerFlg.value != '1'))) {
        ["admin_create", "admin_synonyms", "admin_export"].map((item) => arr.push(item))
      }
    }

    if (!location.pathname.includes("/admin/associate")) {
      arr.push("admin_associate")
    } else {
      arr.push("manage")
      // ["manage", "admin_create", "admin_synonyms", "admin_export"].map((item) => arr.push(item))
      if (arr.includes("admin_associate")) {
        const index = arr.indexOf("admin_associate");
        if (index > -1) {
          arr.splice(index, 1);
        }
      }
      setNavClickable(true)
    }

    if (login_task_all && login_task_all.employeeId && login_task_all.employeeId.value === '') {
      arr.push('person_role_play')
    }
    setRemoveSidebar(arr);

  }, [roleList, special_AS_code, login_task_all]);

  useEffect(() => {
    if (location.pathname.indexOf('/history-check-detail') > -1 && location.pathname != '/history-check-detail') {
      setCurrentStatus('')
    } else {
      setCurrentStatus('current');
    }

    GetProcessToken()
  }, [location])

  const handleCompanyName = (menu) => {
    if (menu.name && roleList) {
      if ('history' == menu.name && (roleList.includes("ADMINISTRATOR") || roleList.includes("I3ASEadministrator") || roleList.includes("I3ASEADMINISTRATOR"))) {
        return "ASの履歴";
      }
      if ('history' == menu.name && roleList.includes("EVALUATOR")) {
        return '自社の履歴';
      }
      return t(menu.text);
    }
  }

  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };

  const redirectToMvp1 = () => {
    localStorage.clear();
    return getRedirectMVP1Url();
  }

  const redirectToZendesk = () => {
    let url = '';
    let userRole = login_task_all.userRoles[0];
    switch (userRole) {
      case 'GENERAL_USER':
      case 'EVALUATOR':
        url = "https://aflacva2d.zendesk.com"
        break;
      case 'ADMINISTRATOR':
      case 'I3ASEADMINISTRATOR':
        url = "https://aflacva2s.zendesk.com"
        break;
      default:
        url = window.location.origin;
        break;
    }
    // localStorage.clear();
    return url;
  }

  const showSidebarFull = (menu) => {
    let html;
    switch (menu.name) {
      case 'person_role_play':
        html = <div
            id={`link_${menu.name}`}
            name={`link_${menu.name}`}
            onClick={() => {
              store.dispatch({type: UPDATE_SIDEBAR_ACTIVE_NAME, sidebar_active_name: menu.name})
              setCurrentMenu(menu.name);
              handleRedirect(menu);
            }}
            className="sidebar_common_block"
        >
          <img
              id={`icon_${menu.name}`}
              name={`icon_${menu.name}`}
              src={menu.icon}
              alt="sidebar icon"
              className='d-block'
          />
          <span id={`text_${menu.name}`} name={`text_${menu.name}`} className="pdf_viewer">
          {handleCompanyName(menu)}
        </span>
        </div>
        break;
      case 'help_center':
        html = <div
            id={`link_${menu.name}`}
            name={`link_${menu.name}`}
            onClick={() => {
              let targetUrl = redirectToZendesk();
              window.open(targetUrl, '_blank');
              // store.dispatch({ type: UPDATE_SIDEBAR_ACTIVE_NAME, sidebar_active_name: menu.name })
              // setCurrentMenu(menu.name);
              // handleRedirect(menu);
            }}
            className="sidebar_common_block"
        >
          <img
              id={`icon_${menu.name}`}
              name={`icon_${menu.name}`}
              src={menu.icon}
              alt="sidebar icon"
              className='d-block'
          />
          <span id={`text_${menu.name}`} name={`text_${menu.name}`} className="pdf_viewer">
          {handleCompanyName(menu)}
        </span>
        </div>
        break;
      default:
        html = <div
            id={`link_${menu.name}`}
            name={`link_${menu.name}`}
            className={`sidebar_common_block ${sidebar_active_name == menu.name ? 'current_menu' : ''}`}
            onClick={() => {
              console.log('ai roleplay')
              store.dispatch({type: UPDATE_SIDEBAR_ACTIVE_NAME, sidebar_active_name: menu.name})
              setCurrentMenu(menu.name)
              if (getLocationState() != "multiple-scenarios") {
                setLocationState('');
              }
              if (store.getState().is_role_play_ongoing) {
                store.dispatch({type: IS_CROSS_WINDOW_DIALOGUE_OPEN, payload: true})
                if (location.pathname.indexOf('video-chat') > 0) {
                  setConfirmDialogType('fixedStory')
                } else {
                  setConfirmDialogType('freeStory')
                }

                setIsOpenConfirmDialog(true)
                setClickedMenu(menu);
              } else {
                handleRedirect(menu);
              }
            }}
        >
          <img
              id={`icon_${menu.name}`}
              name={`icon_${menu.name}`}
              src={menu.icon}
              alt="sidebar icon"
              className='d-block'
          />
          <span id={`text_${menu.name}`} name={`text_${menu.name}`}>
          {handleCompanyName(menu)}
        </span>
        </div>
        break;
    }
    return html;
  }


  const handleRedirect = (menu) => {
    clearGPTTimer()
    store.dispatch({type: IS_CROSS_WINDOW_DIALOGUE_OPEN, payload: false});
    // control of redirecting
    let target = {};
    if (menu) {
      // from direct click
      target = menu;
    } else {
      // from confirm dialogue
      target = vClickedMenu;
      setIsOpenConfirmDialog(false);
      store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
    }

    let processingChat = store.getState().current_chat_information;
    let roleplayStatus = store.getState().is_role_play_ongoing;
    // only need to delete chat record when from ongoing roleplay
    if (processingChat && roleplayStatus) {
      // no deletion of chat record if for these two sidebar
      // if(target.name && target.name != 'person_role_play' && target.name != 'pdf_viewer'){
      if (target.name && target.name != 'person_role_play') {
        if (processingChat.commitId && processingChat.commitId != '') {
          // if multiple
          let commitId = processingChat.commitId;
          getChatIdListByCommitIdForMultipleSection(commitId).then(result => {
            let sequence = [];
            if (result && result.data && result.data instanceof Array) {
              result.data.forEach(chatId => {
                sequence.push(deleteScoring(chatId));
              })

              Promise.all(sequence).then(results => {
                if (results && results instanceof Array) {
                  if (results.every(res => res?.data?.responseStatus == 'SUCCESS')) {
                    store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
                  }
                }
              }).catch(e => {
                console.log('Error when deleting chat record' + e);
              })
            }
          })
        } else {
          // if single
          deleteScoring(processingChat.id).then(res => {
            if (res?.data?.responseStatus == 'SUCCESS') {
            }
          })
        }
      }
    }

    if (target.name == 'person_role_play') {
      let targetUrl = redirectToMvp1();
      window.open(targetUrl, '_blank');
    } else if (target.name == 'help_center') {
      // let targetUrl = redirectToZendesk();
      // window.open(targetUrl, '_blank');
    } else {
      // other target
      if (target.name == "role_play") {
        setLocationState({locationCheck: 'clickLink'}, 'start-new-role-play')
      }
      history.push({pathname: target.url});
    }
  }

  const handleCancel = () => {
    store.dispatch({type: IS_CROSS_WINDOW_DIALOGUE_OPEN, payload: false});
  }

  const clearGPTTimer = useCallback(() => {
    if (gptTimerId) clearTimeout(gptTimerId)
  }, [gptTimerId]);
  return (
      <>
        <div id="sidebar" name="sidebar" className="over-height sidebar_static">

          {
            <>
              <div>
                <div className="logo-sec">
                  <h6 className="" id="sidebar_header" name="sidebar_header">
                    募集人<br/>育成AI
                  </h6>
                </div>
                <div className="sidebar_folded">
                  <ul className='sidebar-menu'>
                    {SidebarList.map((menu, index) => {
                      if (!removeSidebar.includes(menu.name)) {
                        return (
                            <li key={index} id={menu.name} name={menu.name}>
                              {showSidebarFull(menu)}
                            </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              </div>
              <NavLink
                  to="/start-new-role-play"
                  activeClassName={`current`}
                  id="sidebar_link"
                  name="sidebar_link"
                  onClick={() => {
                    setLocationState('');
                  }}
              >
                <img
                    src={logo}
                    className="sidebar_logo"
                    alt="logo"
                    id="sidebar_icon"
                    name="sidebar_icon"
                />
              </NavLink>
            </>
          }
          {
            confirmDialogType === 'fixedStory' ?
                <ConfirmDialog
                    open={isOpenConfirmDialog}
                    setOpen={setIsOpenConfirmDialog}
                    showSecOption={'true'}
                    firstTitle={'一時保存して移動'}
                    secondTitle={'はい'}
                    onConfirm={async () => {
                      clearGPTTimer()
                      const chat = store.getState().tempRolePlaying
                      const restartText = store.getState().restartText
                      if(chat) {
                        await saveChat(chat.id, true, restartText)
                        const res = await getCheckSavedChat()
                        store.dispatch(updateRolePlayingSavedDuringProcess(res && res.data ? res.data : null))
                      }
                      await handleRedirect()
                    }}
                    onRollBack={handleRedirect}
                    onCancel={handleCancel}
                    title={`ロープレ画面から移動します。<br>よろしいでしょうか？`}
                />
                :
                <ConfirmDialog
                    open={isOpenConfirmDialog}
                    setOpen={setIsOpenConfirmDialog}
                    showSecOption="false"
                    onConfirm={handleRedirect}
                    onCancel={handleCancel}
                    title={`ロープレ画面から移動します。<br>よろしいでしょうか？`}
                />
          }

        </div>
      </>
  );
};

const stateToProps = (state) => {
  return {
    login_task_all: state.login_task_all,
    sidebar_active_name: state.sidebar_active_name,
    special_AS_code: state.special_AS_code_cache,
    gptTimerId: state.gptTimerId
  };
};

export default connect(stateToProps)(Sidebar);

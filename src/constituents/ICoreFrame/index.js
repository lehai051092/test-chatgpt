import React, {useEffect, useState} from 'react';
import Box from '@material-ui/core/Box';
import Drawer from '@material-ui/core/Drawer';
import styles from './styles.module.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import AppBar from '@material-ui/core/AppBar';
import {useHistory, useLocation} from 'react-router-dom';
import {getBackgroundColor} from '../../utils/themes';
import MainLogo from '../../property/images/logo.png'
import CloseIcon from '../../property/icons/mobile_menu_close.png'
import MenuImg from '../../property/images/menu.png'
import {IS_CROSS_WINDOW_DIALOGUE_OPEN, IS_ROLE_PLAY_ONGOING} from '../../storage/consts'
import store from '../../storage'
import '../../../src/color.css'
import {SidebarList} from '../../router/mobile/MobileUrlConfig'
import MenuBack from '../../property/icons/menu_back.png'
import {browserRedirect, getLocationState, setLocationState} from '../../utils/util';
import {
  deleteScoring,
  getChatIdListByCommitIdForMultipleSection,
  getCheckSavedChat, getLessonTask, saveChat
} from "../../request/backendApi/api";
import './index.css'
import {
  lessonTaskAll, selectTask, updateAllSectionId,
  updateCheckedStartPageVisited,
  updateCheckReRolePlayingDialog,
  updateRolePlayingSavedDuringProcess
} from "../../storage/reduxActions";
import ConfirmDialogReRolePlay from "../IConfirmDialogReRolePlay";

const ICoreFrame = ({component, onBack}) => {
  const location = useLocation();
  const history = useHistory();
  const [menuUnfold, setMenuUnfold] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [targetUrl, setTargetUrl] = useState('');


  const handleRedirect = (url) => {
    store.dispatch({type: IS_CROSS_WINDOW_DIALOGUE_OPEN, payload: false})
    setIsOpenConfirmDialog(false)
    store.dispatch({type: IS_ROLE_PLAY_ONGOING, status: false})
    setLocationState(false, 'start-new-role-play')
    if (url) {
      if (history.location.pathname === url && history.location.pathname === '/start-new-role-play') {
        window.location.reload();
      }
      // if from normal redirection
      history.push(url);
    } else {
      // if from role-play ongoing
      history.push(targetUrl);
      // clear data
      let processingChat = store.getState().current_chat_information;
      let roleplayStatus = store.getState().is_role_play_ongoing;
      // only need to delete chat record when from ongoing roleplay
      if (processingChat && roleplayStatus) {
        // no deletion of chat record if for these two sidebar
        if (processingChat.commitId && processingChat.commitId != '') {
          // if multiple
          let commitId = processingChat.commitId;
          setLocationState(false, 'start-new-role-play')
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
          console.log('=============test!!!')
          deleteScoring(processingChat.id).then(res => {
            if (res?.data?.responseStatus == 'SUCCESS') {
              console.log('Chat record deleted successfully. test!!!')
            }
          })
          setLocationState(false, 'start-new-role-play')
        }
      }
    }

  }

  const handleCancel = () => {
    store.dispatch({type: IS_CROSS_WINDOW_DIALOGUE_OPEN, payload: false})
    setIsOpenConfirmDialog(false)
  }


  const redirectToZendesk = () => {
    let url = '';
    let userRole = store.getState().login_task_all.userRoles[0];
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
    localStorage.clear();
    return url;
  }
  const [confirmDialogType, setConfirmDialogType] = useState('fixedStory');
  const [isConfirmDialog, setIsConfirmDialog] = useState(false)
  const checkedReRolePlayingDialog = store.getState().checkedReRolePlayingDialog
  const hasRolePlayingData = store.getState().rolePlayingSavedDuringProcess
  const checkedStartPageVisit = store.getState().checkedStartPageVisit
  useEffect(async () => {
    const res = await getCheckSavedChat()
    store.dispatch(updateRolePlayingSavedDuringProcess(res && res.data ? res.data : null))
    if (location && location.pathname === "/start-new-role-play") {
      if (res && res.data && !checkedReRolePlayingDialog && !checkedStartPageVisit) {
        setIsConfirmDialog(true)
      }
      store.dispatch(updateCheckedStartPageVisited(true))
    }
  }, []);

  return (
      <React.Fragment>
        {
          browserRedirect() != 1 ?
              <>
                <AppBar
                    className={`${getBackgroundColor()} ${browserRedirect() == 2 ? `${styles.mobile_app_bar}` : `${styles.tablet_app_bar}`}`}>
                  {
                    onBack != null ? <div className={styles.mobile_app_bar_menu_back} onClick={() => {
                      onBack();
                    }}>
                      <img src={MenuBack}/>
                    </div> : null
                  }
                  <img src={MainLogo}
                       className={browserRedirect() == 2 ?
                           `${styles.mobile_app_bar_logo}` :
                           `${styles.tablet_app_bar_logo}`}/> {/** onClick={changeTheame} */}

                  <div
                      className={browserRedirect() == 2 ?
                          `${styles.mobile_app_bar_menu}` :
                          `${styles.tablet_app_bar_menu}`}
                      onClick={() => {
                        setMenuUnfold(true)
                      }}>
                    <img src={MenuImg}
                         className={browserRedirect() == 2 ? `${styles.mobile_app_bar_img}` : `${styles.tablet_app_bar_img}`}/>
                    <span
                        className={browserRedirect() == 2 ? `${styles.mobile_app_bar_text}` : `${styles.tablet_app_bar_text}`}
                    >メニュー</span>
                  </div>
                </AppBar>
                <Box sx={{my: 6}} width={"100vw"} style={{overflowX: 'hidden'}}>
                  <div className="main-content-inr">
                    {component}
                  </div>
                </Box></>
              :
              component
        }

        <Drawer
            anchor={"right"}
            open={menuUnfold}
            onClose={() => setMenuUnfold(false)}
            className={'icore'}
        >
          <div className={styles.mobile_menu}>
            <img src={CloseIcon} className={styles.mobile_menu_close_img} onClick={() => setMenuUnfold(false)}/>
            <div className={styles.mobile_menu_title}>募集人育成AI</div>
            <List className={styles.mobile_menu_list}>
              {store.getState().login_task_all.userRoles != null && SidebarList[store.getState().login_task_all.userRoles[0]].map((item, index) => (
                  <ListItem button key={`menu_${index}`} style={{paddingBottom: 3}} onClick={() => {
                    setMenuUnfold(false);
                    if (item.url === '/help_center') {
                      // open new tab
                      let targetUrl = redirectToZendesk();
                      window.open(targetUrl, '_blank');
                    } else {
                      if (store.getState().is_role_play_ongoing) {
                        store.dispatch({type: IS_CROSS_WINDOW_DIALOGUE_OPEN, payload: true})
                        if (location.pathname.indexOf('video-chat') > 0) {
                          setConfirmDialogType('fixedStory')
                        } else {
                          setConfirmDialogType('freeStory')
                        }
                        setTargetUrl(item.url)
                        setIsOpenConfirmDialog(true)
                      } else {
                        setLocationState(false, 'start-new-role-play')
                        handleRedirect(item.url)
                      }
                    }
                  }}>
                    <label className={styles.mobile_menu_list_item}>
                      <img src={item.icon} style={{marginRight: 10}}/>
                      {item.text}
                    </label>
                  </ListItem>
              ))}
            </List>
          </div>
        </Drawer>
        <ConfirmDialogReRolePlay
            open={isConfirmDialog}
            setOpen={setIsConfirmDialog}
            showSecOption="false"
            firstTitle="途中保存ロープレを再開"
            thirdTitle="閉じる"
            onConfirm={async () => {
              store.dispatch(updateCheckReRolePlayingDialog(true))
              setIsConfirmDialog(false)
              const path = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}`
              const multiPath = `/video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`
              const state = getLocationState();
              if (hasRolePlayingData.record?.isSelectAllModel === '1') {
                const lessonTasksRes = await getLessonTask(`lessons/${hasRolePlayingData.personaId}/tasks`)
                let taskSort = lessonTasksRes.data.sort(
                    (a, b) => a.displayNumber - b.displayNumber
                );
                store.dispatch(lessonTaskAll(taskSort))
                store.dispatch(selectTask(taskSort))
                store.dispatch(updateAllSectionId(hasRolePlayingData.record?.commitId))
                setLocationState({
                  select_task:state,
                  pname:'multiple-scenarios'
                },`video-chat/${hasRolePlayingData.sectionId}/${hasRolePlayingData.personaId}/multiple-scenarios`);
              }
              await history.push({
                pathname: hasRolePlayingData.record?.isSelectAllModel === '1' ? multiPath : path,
                state: {isReRolePlaying: true}
              })
            }}
            onCancel={() => {
              store.dispatch(updateCheckReRolePlayingDialog(true))
            }}
            title='ロープレの途中保存データがあります。
                        <br>再開しますか？'
        />
        {
          confirmDialogType === 'fixedStory' ?
              <ConfirmDialogReRolePlay
                  open={isOpenConfirmDialog}
                  setOpen={setIsOpenConfirmDialog}
                  showSecOption={'true'}
                  firstTitle={'一時保存して移動'}
                  secondTitle={'はい'}
                  onConfirm={async () => {
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
              <ConfirmDialogReRolePlay
                  open={isOpenConfirmDialog}
                  setOpen={setIsOpenConfirmDialog}
                  showSecOption="false"
                  onConfirm={handleRedirect}
                  onCancel={handleCancel}
                  title={`ロープレ画面から移動します。<br>よろしいでしょうか？`}
              />
        }
      </React.Fragment>
)
}

export default ICoreFrame;

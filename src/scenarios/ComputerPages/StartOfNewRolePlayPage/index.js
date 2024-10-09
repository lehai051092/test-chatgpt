import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useHistory, useLocation} from "react-router-dom";
import Step2 from "./ScenariosSelectionPage"
import Step1 from "./PersonaSelectionPage"
import classes from './styles.module.css';

import {getAuthorizeUserList, getLessonTask} from "../../../request/backendApi/api";
import {
  cacheBackendUserInfo,
  cacheMstUserInfo,
  cacheSpecialASCodeList,
  lessonTaskAll,
  selectTask,
  setUserSpecialAs,
  updateAllSectionId
} from '../../../storage/reduxActions/index';
import eventShuttle from '../../../eventShuttle';
import {connect} from 'react-redux';
import {getEmployeeInfo} from '../../../request/masterDBApi/feignApi';
import {getSpecialASCode} from '../../../request/feignApi/api';

import ICoreFrame from '../../../constituents/ICoreFrame'
import {browserRedirect, getLocationState, operateCodeListOfAgent, setLocationState} from '../../../utils/util';
import GeneralButton from "../../../constituents/IButton/GeneralButton";


const ScenariosSelectionPage = ({
                                  cacheBackendUserInfo,
                                  cacheMstUserInfo,
                                  cacheSpecialASCodeList,
                                  setUserSpecialAs,
                                  rolePlayingSavedDuringProcess,
                                  lessonTaskAll,
                                  selectTask,
                                  updateAllSectionId
                                }) => {
  const history = useHistory();
  const {t} = useTranslation();
  const [editStep2, setEditStep2] = useState(false);
  const [vLessonId, setLessonId] = useState(null);
  const location = useLocation();
  const [vLoading, setLoading] = useState(true);
  const [visSelectionPage, setisSelectionPage] = useState(false);
  const [vStep1, setStep1] = useState(true);


  const [vThemeCode, setThemeCode] = useState(null);
  const [vScenarioCode, setScenarioCode] = useState(null);
  const [vCustomerData, setCustomerData] = useState(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 1)
  }, [])


  useEffect(() => {
    let state = getLocationState();
    if (state) {
      if (!state.freeModel) {
        if ((state.locationCheck != 'clickLink') && (state != false)) {
          setStep1(false);
          setEditStep2(true);
          setLessonId(state.lessonId)
        }
      }
    }
    window.location.hash = '/start-new-role-play'
  }, []);

  useEffect(() => {
    let state = getLocationState();
    if (state) {
      if (state.locationCheck == 'clickLink') {
        setStep1(true);
        setEditStep2(false);
      }
    }
  })

  useEffect(() => {
    let state = getLocationState();
    if (state) {
      if (state.locationCheck == 'clickLink') {
        setStep1(true);
        setEditStep2(false);
      }
    }
  }, [getLocationState()])

  useEffect(() => {
    getCurrentLoginUser();
  }, [])

  const onBack = (value) => {
    setLocationState(false, 'start-new-role-play')
    setisSelectionPage(value);
    setStep1(true);
    setEditStep2(false);
  }
  const onEditStep2 = (customerId, customerData, vThemeCode, vScenarioCode) => {
    setThemeCode(vThemeCode)
    setScenarioCode(vScenarioCode)
    setCustomerData(customerData)
    setStep1(false);
    setEditStep2(true);
    setLessonId(customerId);
  };

  function getCurrentLoginUser() {
    try {
      getAuthorizeUserList().then(res => {
        if (res.data) {
          cacheBackendUserInfo(res.data);
          if (res.data.userRoles && res.data.userRoles.length > 0) {
            getSpecialASCodeList(res.data.userRoles, res.data?.agentCode?.value);
            setLoading(false)
          } else {
            console.log('error:userRoles is undefined', res);
          }
          if (res.data?.employeeId?.value === '') {
            cacheMstUserInfo({
              salsmanSeiKj: res.data?.userId?.value, salsmanMeiKj: ''
            });
            return
          }
          // get data from MasterDB
          if (res.data?.agentCode?.value) {
            const ten_digits = res.data.agentCode.value;

            if (10 === ten_digits.length) {
              getEmployeeInfo({
                salsmanCde: res.data?.employeeId?.value
              }).then(results => {
                cacheMstUserInfo(results);
              }).catch(e => {
                console.log('Agent Info List Response error' + e);
              })
            } else {
              console.log('Response of agentCode is invalid :' + res.data?.agentCode?.value);
            }
          }
        }
      })
    } catch (error) {
      eventShuttle.dispatch("履歴リストの取得に失敗しました。詳しくは管理者にお問い合わせください。");
      console.log(error)
    }
  }

  function getSpecialASCodeList(userRoles, userAgentCode) {
    let runtime = process.env.REACT_APP_CURRENT_ENV;
    if (userRoles[0] === 'ADMINISTRATOR' || userRoles[0] === 'I3ASEADMINISTRATOR') {
      setUserSpecialAs(2);
      return false;
    }
    if (runtime == 'stage' || runtime == 'prod') {
      getSpecialASCode().then(result => {
        if (result.data) {
          let codeList = operateCodeListOfAgent(result.data.map(item => item.code));
          console.log(codeList);
          console.log(codeList.find(code => code == userAgentCode.substring(0, 7)))
          if (codeList.find(code => code == userAgentCode.substring(0, 7)) == undefined) {
            // General user .show ‘新商品対応編’
            setUserSpecialAs(1)
          } else {
            // mvp1 list user.show all
            setUserSpecialAs(2)
          }
          cacheSpecialASCodeList(codeList);
        } else {
          // error .show all
          setUserSpecialAs(2)
        }
      })
    } else {
      // Add code by Ozma to mock special agent user
      if (runtime == 'dev' || runtime == 'dev2' || runtime == '' || runtime == undefined) {
        setUserSpecialAs(2);
        cacheSpecialASCodeList([{
          name: 'Mock Agent', code: 9011910, branches: [{id: 1, code: "001", name: "Mock Branch"}]
        }]);
        // if (userAgentCode.substring(0, 7) == '9011910') {
        // } else {
        //   setUserSpecialAs(1);
        // }
        return false
      }
      // dev . show all
      setUserSpecialAs(2)
    }
  }

  return (<ICoreFrame
      onBack={vStep1 ? null : () => {
        setLocationState(false, 'start-new-role-play')
        setisSelectionPage(true);
        setStep1(true);
        setEditStep2(false);
        setTimeout(() => {
          document.documentElement.scrollTop = 0;
        }, 100);
      }}
      component={<>
        {vStep1 ? <>
          <h3 style={browserRedirect() === 3 ? {marginTop: 20} : null} id="start_of_new_role_playing"
              name="start_of_new_role_playing"
              className={`StartOfNewRolePlayPage_header mb-32 font-24 font-weight-bold ${classes.start_of_new_role_playing_sp}`}>
            {t('selectionPageHeader.start_of_new_role_playing')}
            <span className="font-22 ml-4">
                                {t('selectionPageHeader.recruiter_selection')} をしましょう！
                            </span>
          </h3>
          {rolePlayingSavedDuringProcess ?
              <GeneralButton
                  title={"途中保存ロープレを再開"}
                  className={`${classes.re_role_playing_btn}`}
                  onClick={async () => {
                    const path = `/video-chat/${rolePlayingSavedDuringProcess.sectionId}/${rolePlayingSavedDuringProcess.personaId}`
                    const multiPath = `/video-chat/${rolePlayingSavedDuringProcess.sectionId}/${rolePlayingSavedDuringProcess.personaId}/multiple-scenarios`
                    const state = getLocationState();
                    if (rolePlayingSavedDuringProcess.record?.isSelectAllModel === '1') {
                      const lessonTasksRes = await getLessonTask(`lessons/${rolePlayingSavedDuringProcess.personaId}/tasks`)
                      let taskSort = lessonTasksRes.data.sort((a, b) => a.displayNumber - b.displayNumber);
                      lessonTaskAll(taskSort);
                      selectTask(taskSort)
                      updateAllSectionId(rolePlayingSavedDuringProcess.record?.commitId)
                      setLocationState({
                        select_task: state, pname: 'multiple-scenarios'
                      }, `video-chat/${rolePlayingSavedDuringProcess.sectionId}/${rolePlayingSavedDuringProcess.personaId}/multiple-scenarios`);
                    }
                    await history.push({
                      pathname: rolePlayingSavedDuringProcess.record?.isSelectAllModel === '1' ? multiPath : path,
                      state: {
                        isReRolePlaying: true,
                      }
                    })
                  }}
              /> : null}

        </> : ""}
        {vStep1 ? <Step1 onEditScenerio={onEditStep2} isSelectionPage={visSelectionPage}/> :
            <Step2 customerData={vCustomerData} themeCode={vThemeCode} scenarioCode={vScenarioCode}
                   onBack={onBack} lessonId={vLessonId} showStep2={setEditStep2}/>}
      </>}
  />)
}

const mapStateToProps = state => {
  return {
    login_task_all: state.login_task_all,
    mst_user_info: state.cacheMstUserInfo,
    rolePlayingSavedDuringProcess: state.rolePlayingSavedDuringProcess,
    lesson_task_all: state.lesson_task_all,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    cacheBackendUserInfo: (login_task_all) => {
      dispatch(cacheBackendUserInfo(login_task_all));
    },
    cacheMstUserInfo: (mst_user_info) => {
      dispatch(cacheMstUserInfo(mst_user_info));
    },
    cacheSpecialASCodeList: (data) => {
      dispatch(cacheSpecialASCodeList(data))
    },
    setUserSpecialAs: (data) => {
      dispatch(setUserSpecialAs(data))
    },
    lessonTaskAll: (lesson_task_all) => {
      dispatch(lessonTaskAll(lesson_task_all));
    },
    selectTask: (select_task) => {
      dispatch(selectTask(select_task));
    },
    updateAllSectionId: (data) => {
      dispatch(updateAllSectionId((data)))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(ScenariosSelectionPage);
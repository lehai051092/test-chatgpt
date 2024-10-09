import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";

import placeholder_freestory from "../../../property/images/placeholder_freestory.png";
import classes from "./styles.module.css";
import { useLocation, Link } from "react-router-dom";
import {
  getHistoryDetailList,
  getHistoryDetailListForAdminAssociate,
  getFreeStoryAPIForHistoryDetail,
  publishFreeVideo,
  deleteFreeVideo,
} from "../../../request/backendApi/api";
import { connect } from "react-redux";
import logger from "redux-logger";
import lodash from "lodash";
import ErrorMsgApi from "../../../constituents/IErrorMessage/ErrorMsgApi";
import { Duration } from "luxon";
import store from "../../../storage";
import { BrowserRouter as Router, useHistory } from "react-router-dom";
import {
  getAuthorizeUserList,
  getLessonCategories,
  getLessonList,
  getProcessToken,
} from "../../../request/backendApi/api";
import { getSpecialASCode } from "../../../request/feignApi/api";
import {
  cacheBackendUserInfo,
  cacheMstUserInfo,
  cacheSpecialASCodeList,
  setUserSpecialAs
} from "../../../storage/reduxActions/index";
import {
  getAllTraineesForAgentCompany,
  getEmployeeInfo,
} from "../../../request/masterDBApi/feignApi";
import ThemeTab from "../../../constituents/ITabs/ThemeTab";
import LoadingText from "../../../constituents/ILoadingText";
import {CACHE_MSTDB_USER_INFO, CURRENT_CHOSED_PERSONA} from "../../../storage/consts";
import SwitchComponent from "./SwitchComponent";
import PlayIcon from "../../../property/icons/free_story_img/play_icon.svg";
import TimeIcon from "../../../property/icons/free_story_img/time_icon.svg";
import SmileTwoHandIcon from "../../../property/icons/free_story_img/smile_two_hand.svg";
import SmileOneHandIcon from "../../../property/icons/free_story_img/smile_one_hand.svg";
import SmileTwoFingerIcon from "../../../property/icons/free_story_img/smile_two_finger.svg";
import SadHandIcon from "../../../property/icons/free_story_img/sad_icon.svg";
import BgTbNotPass from '../../../property/images/bg_tb_notPass.svg';
import BgTbQualified from '../../../property/images/bg_tb_qualified.svg';
import BgTbnotStart from '../../../property/images/bg_tb_notStart.svg';
import BgTbCompleted from '../../../property/images/bg_tb_completed.svg';
import BgPcNotPass from '../../../property/images/bg_pc_notPass.svg';
import BgPcQualified from '../../../property/images/bg_pc_qualified.svg';
import BgPcnotStart from '../../../property/images/bg_pc_notStart.svg';
import BgPcCompleted from '../../../property/images/bg_pc_completed.svg';
import BgMbNotPass from '../../../property/images/bg_mb_notPass.svg';
import BgMbQualified from '../../../property/images/bg_mb_qualified.svg';
import BgMbnotStart from '../../../property/images/bg_mb_notStart.svg';
import BgMbCompleted from '../../../property/images/bg_mb_completed.svg';
import PlayVideoIcon from "../../../property/icons/free_story_img/play_video_icon.svg";
import RemoveTrashIcon from "../../../property/icons/free_story_img/remove_trash.svg";
import DisableRemoveTrashIcon from "../../../property/icons/free_story_img/disable_remove_trash_icon.svg";
import moment from "moment";
import { getFreestoreVideo } from "../../../request/backendApi/api";
import Modal from "@material-ui/core/Modal";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addLocationState, browserRedirect, getLightArray, getLocationState, operateCodeListOfAgent, setLocationState } from '../../../utils/util';
import ICoreFrame from "../../../constituents/ICoreFrame";
import {isDevOrLocalEnv, isStageEnv, isProdEnv, isDevEnv, isDevFeatureEnv} from '../../../utils/runtime'
import getGifImage from '../../../utils/newMapFIle'
import ConfirmDialog from "../../../constituents/IConfirmDialog";

let blobMap = {};
let blobArray = [];

const ImageComponent = ({ index, avatarkey, emotionKey = null }) => {

  const [img, setImg] = useState(null);

  const getGif = (avatarkey, emotionKey = null) => {
    if (!avatarkey) {
      return false;
    }
    getGifImage(avatarkey, emotionKey).then(res => {
      setImg(res)
    })

    return img;
  }

  return <>
    {
      avatarkey ?
        <img
          className={classes.personal_history_avatar}
          id={`sample_people_${index + 1}`}
          name={`sample_people_${index + 1}`}
          src={getGif(avatarkey, emotionKey)}
          alt="SamplePeople1"
        /> :
        <img
          className={classes.personal_history_placeholder}
          src={placeholder_freestory}
        ></img>
    }
  </>

}

const Index = ({ login_task_all, cacheBackendUserInfo, cacheMstUserInfo, cacheSpecialASCodeList, setUserSpecialAs }) => {

  const { t } = useTranslation();
  const history = useHistory();
  const location = window.location;

  const [vLessonId, setLessonId] = useState([]);
  const [vUserName, setUserName] = useState();
  const [vLessonList, setLessonList] = useState([]);
  const [vLessonResult, setLessonResult] = useState();
  const [vPersonalTaskHistory, setPersonalTaskHistory] = useState();
  const [vShowTable, setShowTable] = useState(false);
  const [vResponseError, setResponseError] = useState(false);
  const [vLessonIdGroup, setLessonIdGroup] = useState();
  const [vErrorMessage, setErrorMessage] = useState();
  const [vTabelManipulationList, setTabelManipulationList] = useState({});
  const [vExecutionTimeArray, setExectionTimeArray] = useState([]);
  const [vDurationTimeArray, setDurationTimeArray] = useState([]);
  const [vStarCountArray, setStarCountArray] = useState([]);
  const [vUserId, setUserId] = useState();
  const [vPassButtonDisable, setPassButtonDisable] = useState(false);
  const [vTargetRid, setTargetRid] = useState();
  const [vLocalMstDBCache, setLocalMstCache] = useState({});

  const [vThemeList, setThemeList] = useState([]);
  const [vVisibleTab, setVisibleTab] = useState(null);

  const [vScenarioList, setScenarioList] = useState([]);
  const [vScenarioVisibleTab, setScenarioVisibleTab] = useState({});

  const [vPersonaAllSection, setPersonaAllSection] = useState([]);
  const [vShowTbodyTable, setShowTbodyTable] = useState(false);
  const [vHasAngentCode, setHasAngentCode] = useState(false);
  const [vFreeStoryResList, setFreeStoryResList] = useState(false);
  const [vLessonSectionResults, setLessonSectionResults] = useState([]);
  const [vScenarioLevelData, setScenarioLevelData] = useState([]);
  const [vAllLessonSectionResults, setAllLessonSectionResults] = useState([]);
  const [vProcessToken, setProcessToken] = useState(null);
  const [vRecordId, setRecordId] = useState(false); //reference id to delete video
  const [vCurrentLoginUser, setCurrentLoginUser] = useState(
    store.getState().login_task_all?.userId?.value
  ); //current login user
  const [vCurrentApiLoginUser, setCurrentApiLoginUser] = useState(); //api selected  user id
  const [vEmployeeId, setEmployeeId] = useState(null);
  const [vCheckUserRole, setCheckUserRole] = useState(true); //login user role list
  const [isDeleteVideo, setIsDeleteVideoConfirmDialog] = useState(false);

  // video record
  const [freeStoryVideoPlay, setFreeStoryVideoPlay] = useState(false);
  const [isVideoLoad, setIsVideoLoad] = useState(false);
  const [vSelectedLessonList, setSelectedLessonList] = useState([])
  const [vSelectedLessonListVisibleTab, setSelectedLessonListVisibleTab] = useState({})
  const [vSpecialASCode, setSpecialASCode] = useState(null)
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isShowToggle, setIsShowToggle] = useState(false); //to control switch toggle

  //set login user role list
  // useEffect(() => {
  //   if (login_task_all && login_task_all.userRoles) {
  //     if(Array.isArray(login_task_all.userRoles))
  //     {
  //       if (
  //         login_task_all.userRoles.includes("GENERAL_USER") ||
  //         login_task_all.userRoles.includes("EVALUATOR")
  //       ) {
  //         setCheckUserRole(false);
  //       }
  //     }
  //   }
  // }, [login_task_all]);

  const GetProcessToken = async () => {
    const response = await getProcessToken();
    setProcessToken(response.data);
  };

  //for switch toggle on off
  useEffect(() => {
    let isPublic = [];
    Object.keys(vScenarioLevelData).map((item, index) => {
      vScenarioLevelData[item].map((subItem) => {
        if (subItem.chatReference) {
          subItem?.chatReference?.isReferencePublic === 0
            ? isPublic.push(false)
            : isPublic.push(true);
        } else {
          isPublic.push(false);
        }
      });
    });
    let filterFreeStory = vLessonList.filter(
      (item) => item.personaType === "freeStory"
    );
    filterFreeStory.length > 0 &&
      filterFreeStory[0].sectionResult[0].chatReference.isReferencePublic === 0
      ? isPublic.push(false)
      : isPublic.push(true);
    let checkIsPublic = isPublic.every((v) => v === false);
    checkIsPublic ? setSwitchStatus(false) : setSwitchStatus(true);
  }, [vScenarioLevelData, vLessonList]);

  const saveAndPublishFreeVideo = (isPublish) => {
    let referenceParams = [];
    Object.keys(vScenarioLevelData).map((item, index) => {
      vScenarioLevelData[item].map((subItem) => {
        referenceParams.push({
          chatId: subItem?.chatReference ? subItem?.chatReference?.recordId : 0,
          isPublic: isPublish,
        });
      });
    });
    let filterFreeStory = vLessonList.filter(
      (item) => item.personaType === "freeStory"
    );
    filterFreeStory.length > 0 &&
      referenceParams.push({
        chatId: filterFreeStory[0]?.sectionResult
          ? filterFreeStory[0]?.sectionResult[0]?.chatReference?.recordId
          : 0,
        isPublic: isPublish,
      });
    let allParams = { reference: referenceParams };
    publishFreeVideo(allParams).then((res) => {
      if (res.status === 200) {
        getFreeStoryAPI();
      }
    });
  };

  // To keep the store data structure consistent with the “PersonaSelectionPage” page
  const [
    vLessonListOfPersonaSelectionPage,
    setLessonListOfPersonaSelectionPage,
  ] = useState([]);
  const [vSwitchStatus, setSwitchStatus] = useState(false);

  useEffect(() => {
    // Prevent data from being contaminated
    try {
      const data = getLessonList("/lessons").then((res) => {
        if (res.data) {
          setLessonListOfPersonaSelectionPage(res.data);
        } else {
          logger.error("Error occured when get API /lessons");
        }
      });
    } catch (error) {
      logger.error(error);
    }
    GetProcessToken();
  }, []);

  const shiftText = (status) => {
    if (status.trim() == "FINISHED") {
      return "受講完了";
    }
    if (status.trim() == "PROCESSING") {
      return "受講中";
    }
    if (status.trim() == "NOT_START") {
      return "未実施";
    }
  };

  useEffect(() => {
    getAuthorizeUserList().then((res) => {
      if (res.data) {
        cacheBackendUserInfo(res.data)
        setEmployeeId(res.data?.employeeId?.value);
        if (location.hash.includes("/admin/associate")) {
          if (isStageEnv() || isProdEnv()) {
            getSpecialASCode().then(result => {
              if (result.data) {
                let codeList = operateCodeListOfAgent(result.data.map(item => item.code));
                cacheSpecialASCodeList(codeList);
              }
            })
          } else {
            cacheSpecialASCodeList([{ name: 'Mock Agent', code: 9011910, branches: [{ id: 1, code: "001", name: "Mock Branch" }] }]);
          }

          setTargetRid(res.data.targetRid.value);
          // get data from MasterDB
          if (
            res.data?.targetRid?.value &&
            res.data?.targetRid?.value.length == 13
          ) {
            getEmployeeInfo({
              salsmanCde: res.data?.targetRid?.value,
            })
              .then((results) => {
                setLocalMstCache(results);
              })
              .catch((e) => {
                console.log("Agent Info List Response error" + e);
              });
          }
          setUserSpecialAs(1);
          setSpecialASCode(1);
        } else {
          if (res.data?.employeeId?.value === '') {
            store.dispatch({type: CACHE_MSTDB_USER_INFO, payload: {
                salsmanSeiKj: res.data?.userId?.value,
                salsmanMeiKj: ''
              }})
          } else if (res.data?.employeeId?.value && res.data?.employeeId?.value.length == 13) {
            getEmployeeInfo({
              salsmanCde: res.data?.employeeId?.value,
            })
              .then((results) => {
                store.dispatch(cacheMstUserInfo(results));
              })
              .catch((e) => {
                console.log("Agent Info List Response error" + e);
              });
          }

        }
        f_getLessonCategories();
      }
    });

    setHasAngentCode(false);

    return () => {
      if (store.getState().login_task_all.userRoles[0] === 'ADMINISTRATOR' || store.getState().login_task_all.userRoles[0] === 'I3ASEADMINISTRATOR') {
        setUserSpecialAs(2);
        return false;
      }
      if (isStageEnv() || isProdEnv()) {
        getSpecialASCode().then(result => {
          if (result.data) {
            let codeList = operateCodeListOfAgent(result.data.map(item => item.code));
            if (codeList.find(code => code == store.getState().login_task_all?.agentCode?.value.substring(0, 7)) == undefined) {
              // General user .show ‘新商品対応編’
              setUserSpecialAs(1)
              setSpecialASCode(1)
            } else {
              // mvp1 list user.show all
              setUserSpecialAs(2)
              setSpecialASCode(2)
            }
            cacheSpecialASCodeList(codeList);
          } else {
            // error .show all
            setUserSpecialAs(2)
            setSpecialASCode(2)
          }
        })
      } else {
        let runtime = process.env.REACT_APP_CURRENT_ENV;
        // Add code by Ozma to mock special agent user
        if (runtime == 'dev' || runtime == 'dev2' || runtime == '' || runtime == undefined) {
          setUserSpecialAs(2);
          setSpecialASCode(2)
          cacheSpecialASCodeList([{ name: 'Mock Agent', code: 9011910, branches: [{ id: 1, code: "001", name: "Mock Branch" }] }]);
          // if (store.getState().login_task_all?.agentCode?.value.substring(0, 7) == '9011910') {
          // } else {
          //   setUserSpecialAs(1);
          //   setSpecialASCode(1)
          // }
        }
        // dev . show all
        setUserSpecialAs(2)
        setSpecialASCode(2)
      }
    }
  }, [location.hash]);


  useEffect(() => {
    if (!location.hash.includes("/admin/associate")) {
      if (
        login_task_all &&
        login_task_all.agentCode &&
        vVisibleTab != null &&
        vScenarioVisibleTab.scenarioName &&
        vSelectedLessonListVisibleTab.personaId
      ) {
        getFreeStoryAPI();
      }
    } else {


      if (
        login_task_all &&
        login_task_all.agentCode &&
        vVisibleTab != null &&
        vScenarioVisibleTab.scenarioName &&
        vSelectedLessonListVisibleTab.personaId
      ) {
        getFreeStoryAPI();
      }
    }
  }, [
    location.hash, // changed by Ozma, original: state
    login_task_all,
    vTargetRid,
    vVisibleTab,
    vSelectedLessonListVisibleTab
  ]);

  function calculatePercentage(value, total) {
    if (total > 0) {
      // var percentage = (value / total) * 100;
      var percentage = value * 100;
      return Number(percentage.toFixed(0));
    }
    return 0;
  }

  const goToAIScorePage = (value, type) => {
    console.log('value, type',value, type)
    let personId = value.personaId;
    vLessonListOfPersonaSelectionPage.forEach((element) => {
      if (element.id === personId) {
        store.dispatch({ type: CURRENT_CHOSED_PERSONA, persona: element });
      }
    });

    if (type == "multiple") {
      if (value.allSectionResult.sectionTimes == "0") {
        return false;
      }
    } else {
      if (value.sectionTimes == "0") {
        return false;
      }
    }
    let filterLesson = vLessonListOfPersonaSelectionPage.filter(
      (item) => item.id === personId
    )[0];
    let path =
      type != "multiple"
        ? filterLesson.personaType === "freeStory"
          ? `/free-story-score/${value.sectionId}/${value.personaId}`
          : `/ai-score/${value.sectionId}/${value.personaId}`
        : `/ai-score/multiple-scenarios/${value.personaId}`;
    setLocationState({
      user_id: vUserId,
      isShowStory: false,
      buttonDisable: vPassButtonDisable,
      item: type == "multiple" ? value.allSectionResult : value,
      personaId: value.personaId,
      selectedThemeName: vVisibleTab.themeName,
      selectedScenarioName: vScenarioVisibleTab.scenarioName,
      selectedCustomerData: value.personaCourse,
      isFastText: filterLesson.personaType === "fastText" ? true : false,
      isGPT: value.personaType === "ChatGPT"
    }, path.substring(1))
    history.push({
      pathname: path,
    });
  };

  const onTabSelect = (item) => {
    setShowTbodyTable(true);
    let currentTab = vThemeList.filter(
      (data) => data.themeCode == item.themeCode
    );

    let scenario = currentTab[0].scenario.filter(scenario => scenario.lessonInfo.length);
    currentTab[0].scenario = scenario;

    setVisibleTab(item);
    setScenarioList(currentTab[0].scenario);
    setScenarioVisibleTab(currentTab[0].scenario[0]);
    setSelectedLessonList(currentTab[0].scenario[0].lessonInfo)
    setSelectedLessonListVisibleTab(currentTab[0].scenario[0].lessonInfo[0])
    // getFreeStoryAPI();
  };

  const getFreeStoryAPI = () => {
    let state = getLocationState();
    let userId = "";
    if (!location.hash.includes("/admin/associate")) {
      let loginUserId = state?.userId
        ? state?.userId
        : login_task_all.userId.value;
      let agentCode = "";

      // Change storage method for Azure AD, need to add new judgement by Ozma
      if (state == false || state == undefined || state?.userId == undefined || location.hash.indexOf("/history-check-detail") === 0) {
        // if query personal result
        agentCode = login_task_all
          ? login_task_all.agentCode.value
          : "";
        userId = loginUserId;
      } else {
        // if from other page, like recruiter manager wants to check other people's results
        userId = state?.userId;
        agentCode = state?.agentCode;
      }
      if (userId == loginUserId) {
        setPassButtonDisable(true);
      }
    } else {
      userId = vTargetRid;
      if (userId == login_task_all?.userId?.value) {
        setPassButtonDisable(true);
      }
    }

    // if(userId != null && userId == "")
    // {
    setShowTbodyTable(false);
    let roleList = login_task_all?.userRoles;
    let url = !location.hash.includes("/admin/associate")
      ? `/free/report/${userId}`
      : `/free/report/employee/${vTargetRid ? vTargetRid : null}`;
    getFreeStoryAPIForHistoryDetail(url).then((res) => {


      if (res.data.errorCode) {
        setShowTable(false);
        setResponseError(true);
        setErrorMessage("そのようなユーザーのデータはありません。");
        return;
      }

      setCurrentApiLoginUser(res.data.userId);
      if (!location.hash.includes("/admin/associate")) {
        if (res.data.userId == vCurrentLoginUser) {
          setPassButtonDisable(true);
        }
      } else {
        userId = vTargetRid;
        if (userId == login_task_all?.userId?.value) {
          setPassButtonDisable(true);
        }
      }

      // Change storage method for Azure AD, need to add new judgement by Ozma
      if (state && state?.userName != undefined && location.hash.indexOf("/history-check-detail")>0) {
        // if from admin history page
        setUserName(state.userName);
      } else {
        // if exist in cache
        const mstUesrInfo = store.getState().cacheMstUserInfo;
        if (mstUesrInfo.salsmanSeiKj) {
          setUserName(mstUesrInfo.salsmanSeiKj + mstUesrInfo.salsmanMeiKj);
        } else if (res?.data?.userName && res?.data?.userName != "") {
          // if not exist in cache
          setUserName(res.data.userName);
        } else {
          setUserName(login_task_all.userId.value);
        }
      }

      setUserId(res.data.userId);

      let resData = res.data;

      resData = resData.report.sort(
        (a, b) => a.displayNumber - b.displayNumber
      );

      let themeFilter = []

      if (browserRedirect() == 2) {
        themeFilter = resData.filter(
          (item) =>
            item.personaTheme == vVisibleTab?.themeCode &&
            item.personaScenario == vScenarioVisibleTab?.scenarioCode &&
            item.personaId == vSelectedLessonListVisibleTab?.personaId
        );
        if (vVisibleTab?.themeCode == "proposal") {
          themeFilter = resData.filter(
            (item) =>
              item.personaTheme == vVisibleTab?.themeCode &&
              item.personaScenario == vScenarioVisibleTab?.scenarioCode &&
              item.personaType == "freeStory" &&
              item.personaId == vSelectedLessonListVisibleTab?.personaId
          );
        } else {
          themeFilter = resData.filter(
            (item) =>
              item.personaTheme == vVisibleTab?.themeCode &&
              item.personaScenario == vScenarioVisibleTab?.scenarioCode &&
              item.personaId == vSelectedLessonListVisibleTab?.personaId
          );
        }
      } else {
        themeFilter = resData.filter(
          (item) =>
            item.personaTheme == vVisibleTab?.themeCode &&
            item.personaScenario == vScenarioVisibleTab?.scenarioCode
        );
        if (vVisibleTab?.themeCode == "proposal") {
          themeFilter = resData.filter(
            (item) =>
              item.personaTheme == vVisibleTab?.themeCode &&
              item.personaScenario == vScenarioVisibleTab?.scenarioCode &&
              item.personaType == "freeStory"
          );
        } else {
          themeFilter = resData.filter(
            (item) =>
              item.personaTheme == vVisibleTab?.themeCode &&
              item.personaScenario == vScenarioVisibleTab?.scenarioCode
          );
        }
      }

      //scenario data level for pc and mobile
      let scenarioLevelFilterData = []
      scenarioLevelFilterData = resData.filter(
        (item) =>
          item.personaTheme == vVisibleTab?.themeCode &&
          item.personaScenario == vScenarioVisibleTab?.scenarioCode
      );
      if (vVisibleTab?.themeCode == "proposal") {
        scenarioLevelFilterData = resData.filter(
          (item) =>
            item.personaTheme == vVisibleTab?.themeCode &&
            item.personaScenario == vScenarioVisibleTab?.scenarioCode &&
            item.personaType == "freeStory"
        );
      } else {
        scenarioLevelFilterData = resData.filter(
          (item) =>
            item.personaTheme == vVisibleTab?.themeCode &&
            item.personaScenario == vScenarioVisibleTab?.scenarioCode
        );
      }
      let scenarioLevelResults = [];

      scenarioLevelFilterData.map((item, i) => {
        item.sectionResult.map((item2, i2) => {
          let obj2 = item2;
          let sectionName = item2.sectionName;
          obj2["personaId"] = item.personaId;
          obj2["personaType"] = item.personaType;
          obj2["personaCourse"] = item.personaCourse;
          // backend will operate sectionName to right ( tianhao. -4 )
          obj2["section_code"] = item2.sectionName
          // .substring(
          //   0,
          //   item2.sectionName.length - 4
          // );
          obj2["sectionName"] = sectionName.split(/\r\n|\n\r|\n|\r/)[0]
          if (item.personaType == "freeStory") {
            if (
              !roleList.includes("EVALUATOR") &&
              !roleList.includes("GENERAL_USER") &&
              (!state || state?.isFreeStory)
            ) {
              scenarioLevelResults.push(obj2);
            }
          } else {
            scenarioLevelResults.push(obj2);
          }
        });
      });
      scenarioLevelResults = scenarioLevelResults.sort(
        (a, b) => a.sectionDisplayNumber - b.sectionDisplayNumber
      );
      let groupedScenarioLevelData = lodash.groupBy(scenarioLevelResults, "sectionName");
      if (vVisibleTab?.themeCode == "proposal") {
        groupedScenarioLevelData = lodash.groupBy(scenarioLevelResults, "section_code");
      }
      setScenarioLevelData(groupedScenarioLevelData);
      //end

      let sectionResults = [];
      let allSectionResults = [];

      themeFilter.map((item, i) => {
        item.sectionResult.map((item2, i2) => {
          let obj2 = item2;
          let sectionName = item2.sectionName;
          obj2["personaId"] = item.personaId;
          obj2["personaType"] = item.personaType;
          obj2["personaCourse"] = item.personaCourse;
          // backend will operate sectionName to right ( tianhao. -4 ) THIS

          obj2["section_code"] = item2.sectionName
          // .substring(
          //   0,
          //   item2.sectionName.length - 4
          // );
          obj2["sectionName"] = sectionName.split(/\r\n|\n\r|\n|\r/)[0]
          if (item.personaType == "freeStory") {
            if (
              !roleList.includes("EVALUATOR") &&
              !roleList.includes("GENERAL_USER") &&
              (state?.isFreeStory === undefined || state?.isFreeStory === true)
            ) {
              sectionResults.push(obj2);
            }
          } else {
            sectionResults.push(obj2);
          }
        });
        if (item.allSectionResult) {
          allSectionResults.push(item.allSectionResult);
        }
      });
      sectionResults = sectionResults.sort(
        (a, b) => a.sectionDisplayNumber - b.sectionDisplayNumber
      );
      let groupBySectionName = lodash(sectionResults)
      .groupBy(item => item.sectionName)
      .sortBy(group => sectionResults.indexOf(group[0]))
      .value()
      // let groupBySectionName = lodash.groupBy(sectionResults, "sectionName");
      if (vVisibleTab?.themeCode == "proposal" && sectionResults.length !== 1) {
        groupBySectionName = lodash.groupBy(sectionResults, "section_code");
      }
      setAllLessonSectionResults(allSectionResults);

      // if (
      //   roleList.includes("EVALUATOR") ||
      //   roleList.includes("GENERAL_USER") ||
      //   (state && !state.isFreeStory)
      // ) {
      //   themeFilter = themeFilter.filter(
      //     (item) => item.personaType != "freeStory"
      //   );
      // }
      if (vVisibleTab?.themeCode != "proposal") {
        let themePersonaIdPluck = themeFilter.map((item) => {
          return {
            personaId: item.personaId,
            personaDisplayNumber: item.personaDisplayNumber
          }
        });

        Object.keys(groupBySectionName).map((item, i) => {
          let groupPluck = groupBySectionName[item].map((i1) => i1.personaId);
          let diffPeronsaId = themePersonaIdPluck.filter(
            (d) => !groupPluck.includes(d.personaId)
          );
          diffPeronsaId.map((i2) => {
            groupBySectionName[item].push({
              personaId: i2.personaId,
              sectionDisplayNumber: null,
              personaDisplayNumber: i2.personaDisplayNumber,
              sectionName:groupBySectionName[item][0].sectionName
            });
          });

          // add sort function for each section result row
          groupBySectionName[item].sort((a, b) => a.personaDisplayNumber - b.personaDisplayNumber)

          let checkFreeStory = [];
          groupBySectionName[item].map((it3, i3) => {
            if (
              it3.personaType == "freeStory" ||
              it3.personaType == undefined
            ) {
              checkFreeStory.push(it3);
            }
          });
          if (checkFreeStory.length == groupBySectionName[item].length) {
            // let freeStoryFilter = checkFreeStory.filter(
            //   (e) => e.personaType == "freeStory"
            // );
            // themeFilter.map((f, i4) => {
            //   if(f.personaType == "freeStory")
            //   {
            //     themeFilter.splice(i4, 1)
            //   }
            // })

            // console.log(freeStoryFilter, 'freeStoryFilter')

            if (browserRedirect() !== 2) {
              delete groupBySectionName[item];
            }
          }
        });
      }
      setLessonList(themeFilter);
      setLessonSectionResults(groupBySectionName);
    });
    // }
  };

  const onScenarioTabSelect = (item) => {
    setShowTbodyTable(true);
    setScenarioVisibleTab(item);
    setSelectedLessonList(item.lessonInfo)
    setSelectedLessonListVisibleTab(item.lessonInfo[0])
    // getFreeStoryAPI();
  };

  const onPersonaTabSelect = (item) => {
    setSelectedLessonListVisibleTab(item)
    setShowTbodyTable(true);
  }

  useEffect(() => {
    f_getLessonCategories()
  }, [vSpecialASCode])

  //get theme list
  const f_getLessonCategories = async () => {
    let state = getLocationState();
    console.log('work function')
    let roleList = login_task_all?.userRoles ? login_task_all?.userRoles : [];
    let specialAsCode = store.getState().user_special_as;
    if (specialAsCode != undefined) {
      let urlParama = state?.isFreeStory != null
        ? state?.isFreeStory === true
          ? "agentHistory"
          :"employeeHistory"
        : login_task_all
          ? roleList.includes("GENERAL_USER") || roleList.includes("EVALUATOR")
            ? "agentHistory"
            : "employeeHistory"
          : "agentHistory";
      try {
        console.log(specialAsCode, 'specialAsCode')
        const data = getLessonCategories(
          `/lessons/category?type=${urlParama}&specialAS=${store.getState().user_special_as}`
        ).then(async (res) => {
          if (res.data) {
            let resData = res.data;
            setThemeList(resData);

            if (state?.selectThemeCode) {
              let selectTheme = resData.filter(
                (data) => data.themeCode == state?.selectThemeCode
              );
              if (selectTheme.length > 0) {
                setVisibleTab(selectTheme[0]);
              } else {
                setVisibleTab(resData[0]);
              }
            }
            if (state?.selectScenarioCode) {
              if (state?.selectThemeCode) {
                let selectTheme = resData.filter(
                  (data) => data.themeCode == state?.selectThemeCode
                );
                if (selectTheme.length > 0) {
                  let selectScenario = selectTheme[0].scenario.filter(
                    (data) => data.scenarioCode == state?.selectScenarioCode
                  );
                  if (selectScenario.length > 0) {
                    setScenarioList(selectTheme[0].scenario);
                    setScenarioVisibleTab(selectScenario[0]);
                    setSelectedLessonList(selectScenario[0].lessonInfo);
                    setSelectedLessonListVisibleTab(selectScenario[0].lessonInfo[0])
                  }
                }
              }
            } else {
              if (state?.selectThemeCode) {
                let selectTheme = resData.filter(
                  (data) => data.themeCode == state?.selectThemeCode
                );
                if (selectTheme.length > 0) {
                  setScenarioList(selectTheme[0].scenario);
                  setScenarioVisibleTab(selectTheme[0].scenario[0]);
                  setSelectedLessonList(selectTheme[0].scenario[0].lessonInfo);
                  setSelectedLessonListVisibleTab(selectTheme[0].scenario[0].lessonInfo[0])
                }
              }
            }

            if (!state?.selectThemeCode && !state?.selectScenarioCode) {
              if (location.hash.includes("/admin/associate")) {
                let loginTaskAll = store.getState().login_task_all;
                if (loginTaskAll.managerFlg.value == "1" && loginTaskAll.lcid.value && loginTaskAll.llid.value) {
                  let lightArray = await getLightArray(`${loginTaskAll.lcid.value}_${loginTaskAll.llid.value}`);
                  console.log("@@@", lightArray, resData);
                  let associate_item = resData.find(item => item.themeCode == lightArray?.[0])
                  let associate_item_scenario = associate_item?.scenario.find(item => item.scenarioCode == lightArray[1])

                  setShowTbodyTable(true);
                  setVisibleTab(associate_item);
                  setScenarioList(associate_item.scenario);
                  setScenarioVisibleTab(associate_item_scenario);
                  setSelectedLessonList(associate_item_scenario.lessonInfo)
                  setSelectedLessonListVisibleTab(associate_item_scenario.lessonInfo[0])
                }
              } else {
                defaultThemeSelect(resData)
              }
              // setVisibleTab(resData[0]);
              // setScenarioList(resData[0].scenario);
              // setScenarioVisibleTab(resData[0]?.scenario[0]);
              // setSelectedLessonList(resData[0]?.scenario[0].lessonInfo);
              // setSelectedLessonListVisibleTab(resData[0]?.scenario[0].lessonInfo[0])
            }
          } else {
            logger.error("Error occured when get API /lessons");
          }
        });
      } catch (error) {
        setResponseError(true);
        setErrorMessage("エラーが発生しました。確認してもう一度お試しください。");
        console.log(
          `Error occured when get API /lessons/category: ${JSON.stringify(error)}`
        );
      }
    }
  };

  useEffect(() => {
    if (
      vLessonList &&
      vLessonSectionResults &&
      vLessonSectionResults != [] &&
      vLessonSectionResults != undefined
    ) {
      setTimeout(() => {
        setShowTbodyTable(true);
      }, 1000);
    }
  }, [vLessonList, vLessonSectionResults]);

  const shifTaskWithPercent = (taskRate, sectionTimes, free_story = false) => {
    let taskRatePercent = taskRate * 100;
    if (sectionTimes != "0") {
      if (taskRatePercent >= 0 && taskRatePercent <= 69) {
        return (
         <>
           <img src={browserRedirect()===1?BgPcNotPass:browserRedirect()===2?BgMbNotPass:BgTbNotPass} className={classes.task_smile_container_bg} />
            {
              browserRedirect()===2?
              <>
                <span
                  className={`${classes.one_hand_icon} ${classes.task_smile_container
                    } ${free_story ? classes.task_freestory : classes.task_not_freestory
                    }`}
                >
                  <img src={SmileOneHandIcon} />
                  <span>もう少し！</span>
                </span>
              </>:null
            }
         </>
        );
      } else if (taskRatePercent >= 70 && taskRatePercent <= 84) {
        return (
          <>
           <img src={browserRedirect()===1?BgPcQualified:browserRedirect()===2?BgMbQualified:BgTbQualified} className={classes.task_smile_container_bg} />
            {
              browserRedirect()===2?
              <>
                <span
                  className={`${classes.tow_finger} ${classes.task_smile_container} ${free_story ? classes.task_freestory : classes.task_not_freestory
                    }`}
                >
                  <img src={SmileTwoFingerIcon} />
                  <span>合格！</span>
                </span>
              </>:null
            }
          </>
        );
      } else if (taskRatePercent >= 85 && taskRatePercent <= 100) {
        return (
          <>
           <img src={browserRedirect()===1?BgPcCompleted:browserRedirect()===2?BgMbCompleted:BgTbCompleted} className={classes.task_smile_container_bg} />
            {
              browserRedirect()===2?
              <>
                <span
                  className={`${classes.two_hand} ${classes.task_smile_container} ${free_story ? classes.task_freestory : classes.task_not_freestory
                    }`}
                >
                  <img src={SmileTwoHandIcon} />
                  <span>完ペキ！</span>
                </span>
              </>:null
            }
          </>
        );
      }
    }
    return (
      <>
        <img src={browserRedirect()===1?BgPcnotStart:browserRedirect()===2?BgMbnotStart:BgTbnotStart} className={classes.task_smile_container_bg} />
        {
          browserRedirect()===2?
          <>
            <span
              className={`${classes.task_smile_container} ${classes.sad_hand_icon} ${free_story ? classes.task_freestory : classes.task_not_freestory
                }`}
            >
              <img src={SadHandIcon} />
              <span>未実施</span>
            </span>
          </>:null
        }
      </>
    );
  };

  useEffect(() => {
    let filterLessonList = vLessonList.filter(
      (item) => item.personaType === "freeStory"
    );
    if (filterLessonList.length > 0) {
      setIsShowToggle(true);
    } else {
      setIsShowToggle(false);
    }
  }, [vLessonList]);

  const freestoreVideoHandle = (recordId, token) => {
    setIsVideoLoad(true);
    blobMap = [];
    blobArray = [];
    getFreestoreVideo(recordId).then((res) => {
      setFreeStoryVideoPlay(true);
      for (let index = 0; index < res["data"].length; index++) {
        console.log(index);
        const blobUrl = res["data"][index]["blob"];
        // promiseAll.push(urlToBase64(element["image"]));
        xhrequest(blobUrl, (e) => {
          console.log(e);
          blobMap[index] = e.response;
        });
      }
      looper(res);
    });
  };

  const xhrequest = (url, callback) => {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
      callback(this);
    };
    xhr.send();
  };

  const dateFormatChg = (item) => {
    if (item.chatReference) {
      if (item.chatReference.referenceDate != null) {
        return moment(item.chatReference.referenceDate).format(
          "YYYY/MM/DD HH:mm"
        );
      } else {
        return "----/--/-- --:--";
      }
    }
    return "----/--/-- --:--";
  };

  //for delete video
  const deleteVideo = (recordId) => () => {
    setRecordId(recordId);
    setIsDeleteVideoConfirmDialog(true);
  };

  const confirmDeleteVideo = () => {
    let status = "INACTIVE";
    deleteFreeVideo(vRecordId, status).then((res) => {
      if (res.status === 200) {
        getFreeStoryAPI();
      }
    });
    setIsDeleteVideoConfirmDialog(false);
  };

  const dealSwitch = async () => {
    let isPublic = 1;
    saveAndPublishFreeVideo(isPublic);
    setIsOpenConfirmDialog(false);
    setSwitchStatus(!vSwitchStatus);
  };

  const switchHandleChange = (event) => {
    if (event.target.checked) {
      setIsOpenConfirmDialog(true);
    } else {
      let isPublish = 0;
      saveAndPublishFreeVideo(isPublish);
      setSwitchStatus(false);
    }
  };

  const looper = (res) => {
    console.log("-- looper --");
    let doneCount = 0;
    for (let index = 0; index < res["data"].length; index++) {
      if (blobMap[index]) {
        doneCount++;
      }
    }
    if (doneCount == res["data"].length) {
      for (let index = 0; index < res["data"].length; index++) {
        blobArray.push(blobMap[index]);
      }
      setIsVideoLoad(false);
      var sumBlob = new Blob(blobArray, { type: "video/webm;codecs=avc1,opus" });

      let videoPlay = document.getElementById("free-story-video-play");
      if (videoPlay) {
        videoPlay.src = window.URL.createObjectURL(sumBlob);
      }
    } else {
      setTimeout(() => {
        looper(res);
      }, 500);
    }
  };

  const defaultThemeSelect = (resData) => {
    let defaultSelect = resData[0];
    setShowTbodyTable(true);
    setVisibleTab(defaultSelect);
    setScenarioList(defaultSelect.scenario);
    setScenarioVisibleTab(defaultSelect.scenario[0]);
    setSelectedLessonList(defaultSelect.scenario[0].lessonInfo)
    setSelectedLessonListVisibleTab(defaultSelect.scenario[0].lessonInfo[0])
    return;
  }

  return (
    <>
      <ICoreFrame
        component={<>{vResponseError == true && (
          <ErrorMsgApi message={vErrorMessage && vErrorMessage} />
        )}
          {!vShowTbodyTable && <LoadingText text="読み込み中....." />}
          <ConfirmDialog
            title=" 録画データを削除します。よろしいでしょうか？​"
            open={isDeleteVideo}
            setOpen={setIsDeleteVideoConfirmDialog}
            onConfirm={confirmDeleteVideo}
          />
          <ConfirmDialog
            title="録画データを公開します。よろしいですか？​"
            open={isOpenConfirmDialog}
            setOpen={setIsOpenConfirmDialog}
            onConfirm={dealSwitch}
          />
          <Row
            className={`${browserRedirect() == 2 ? classes.mobile_view : browserRedirect() == 3 ? classes.tablet_view : classes.pc_view}`}
          >
            <Col className={classes.history_wappers} lg="12">
              <h3
                id="progress"
                name="progress"
                className={`mb-32 pb-2 ${classes.mb_header_text}`}
              >
                進捗状況
              </h3>
              <p
                className={`font-18 mb-4 ${classes.mb_header_title}`}
                id="detail_page_user_name"
                name="detail_page_user_name"
              >
                {browserRedirect() == 3 ? `${t("historycheck.recruiter_name")}` : `${t("historycheck.recruiter_name")}:${" "}`}
                <span
                  className={`font-weight-bold ${classes.mb_header_title_text}`}
                  id="user_name"
                  name="user_name"
                >
                  {vUserName || vUserName != "undefined" ? vUserName != "null" ? vUserName : "--" : "--"}
                </span>
              </p>

              <div className={`cmn-bg-box-inr ${classes.cmn_bg_box_inr_detail} ${classes.cmn_bg_md}`}>

                <div id="theme_div" className={classes.theme_div}>
                  <p
                    id="theme_title"
                    className={`font-18 font-weight-bold ${classes.md_theme_title}`}
                  >
                    学習テーマ
                  </p>
                  {vHasAngentCode ? (
                    <div className={classes.themeTabPlacehoderbox}></div>
                  ) : (
                    <ThemeTab
                      tabItems={vThemeList}
                      type="theme"
                      selectedTab={vVisibleTab}
                      onSelect={onTabSelect}
                      className={`${!browserRedirect() == 2 && 'mb-32'}`}
                    />
                  )}
                </div>

                <div className={classes.theme_option_underline}></div>

                <div id="scenarios_div" className={classes.scenarios_div} style={browserRedirect() === 1 ? { marginTop: '13px' } : null}>
                  <p id="scenarios_title" className={`font-18 font-weight-bold ${classes.md_theme_title}`} >
                    シナリオ
                  </p>
                  <div
                    className={`d-flex justify-content-between ${classes.mb_switch_col}`}
                  >
                    {vHasAngentCode ? (
                      <div className={classes.themeTabPlacehoderbox}></div>
                    ) : (
                      <ThemeTab
                        tabItems={vScenarioList}
                        type="scenario"
                        selectedTab={vScenarioVisibleTab}
                        onSelect={onScenarioTabSelect}
                        className={`${!browserRedirect() == 2 && 'mb-32'}`}
                      />
                    )}
                    { /* video controll */}
                    {isShowToggle && browserRedirect()==1 &&
                      vCheckUserRole &&
                      vCurrentApiLoginUser === vCurrentLoginUser ? (
                      <div style={{minWidth:'221px',paddingLeft:'20px'}}>
                        <SwitchComponent
                          onChange={switchHandleChange}
                          checkState={vSwitchStatus}
                        />
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                {
                  browserRedirect() !== 3 ? <div className={classes.theme_option_underline}></div> : null
                }

                {
                  browserRedirect()==2 ?
                    <div id="persona_div">
                      <p id="persona_title" className={`font-18 font-weight-bold ${classes.md_theme_title}`} >
                        コース
                      </p>
                      <div
                        className={`d-flex justify-content-between ${classes.mb_switch_col}`}
                      >
                        {vHasAngentCode ? (
                          <div className={classes.themeTabPlacehoderbox}></div>
                        ) : (
                          <ThemeTab
                            tabItems={vSelectedLessonList}
                            type="persona"
                            selectedTab={vSelectedLessonListVisibleTab}
                            onSelect={onPersonaTabSelect}
                            className={`${!browserRedirect()==2 && 'mb-32'}`}
                          />
                        )}
                    {isShowToggle && browserRedirect()==1 &&
                          vCheckUserRole &&
                          vCurrentApiLoginUser === vCurrentLoginUser ? (
                          <div>
                            <SwitchComponent
                              onChange={switchHandleChange}
                              checkState={vSwitchStatus}
                            />
                          </div>
                        ) : (
                          ""
                        )}
                      </div>
                    </div> : ""
                }

                {/* {
                  browserRedirect() == 2 ?
                    <div id="persona_div">
                      <p id="persona_title" className={`font-18 font-weight-bold ${classes.md_theme_title}`} >
                        コース
                      </p>
                      <div
                        className={`d-flex justify-content-between ${classes.mb_switch_col}`}
                      >
                        {vHasAngentCode ? (
                          <div className={classes.themeTabPlacehoderbox}></div>
                        ) : (
                          <ThemeTab
                            tabItems={vSelectedLessonList}
                            type="persona"
                            selectedTab={vSelectedLessonListVisibleTab}
                            onSelect={onPersonaTabSelect}
                            className={`${!browserRedirect() == 2 && 'mb-32'}`}
                          />
                        )}
                      </div>
                    </div> : ""
                } */}

                <div className={browserRedirect() === 3 && vLessonList.length <= 3 ? `d-block mt-3 ${classes.hidden}` : `table-responsive d-block mt-3`}>
                  <table
                    className={`table text-center ${classes.cmn_table} ${browserRedirect() === 3 && classes.cmn_table_tablet}`}
                    id="history_detail_table_1"
                    name="history_detail_table_1"
                    style={
                      browserRedirect() === 1 && vLessonList.length === 1?{textAlign:'center',width:'50%'}:{width:'100%'}
                    }
                  >
                    <tbody>
                    { browserRedirect() !==3 ? (
                        <tr
                          id="header_row"
                          name="header_row"
                          className={`${classes.bg_gray}`}
                        >
                          <th
                            rowSpan="2"
                            className={`align-middle ${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                            style={{ width: "25%", minWidth: '122px' }}
                            id="persona"
                            name="persona"
                          >
                            {vVisibleTab?.themeCode != "proposal"
                              ? "ペルソナ"
                              : "コース"}
                          </th>
                          {vLessonList.map(
                            (item, index) =>
                              vVisibleTab?.themeCode != "proposal" && (
                                <th
                                  key={index}
                                  style={{ width: "25%" }}
                                  id={`lesson_name_${index + 1}`}
                                  name={`lesson_name_${index + 1}`}
                                  className={`${classes.th_head_persona_name_bg}`}
                                >
                                  {item.personaName}
                                </th>
                              )
                          )}
                        </tr>) : (
                        <tr
                          id="header_row"
                          name="header_row"
                          className={`${classes.bg_gray}`}
                        >
                          <th
                            rowSpan="2"
                            className={`align-middle ${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                            style={{ width: "25%" }}
                            id="persona"
                            name="persona"
                          >
                            ペルソナ
                          </th>
                          {vLessonList.map(
                            (item, index) =>
                                <th
                                  key={index}
                                  style={{ width: "25%" }}
                                  id={`lesson_name_${index + 1}`}
                                  name={`lesson_name_${index + 1}`}
                                  className={`${classes.th_head_persona_name_bg} ${classes.th_head_persona_name_font} ${vLessonList.length > 3 ? classes.multiple_lessons_not_col1 : null}`}
                                >
                                  {item.personaName}
                                </th>
                          )}
                        </tr>)
                      }

                      {browserRedirect() !== 3 ? (
                        vVisibleTab?.themeCode != "proposal" && (
                          <tr
                            id="people_icon"
                            name="people_icon"
                            className={`${classes.bg_gray}`}
                          >
                            {vLessonList.map((item, index) => (
                              <td
                                className={`border-left-0 ${classes.image_td_border}`}
                                id="people_1"
                                key={index + 1}
                              >

                                {item.personaType != "freeStory" ? (
                                  <ImageComponent index={index} avatarkey={item.personaAvatar} />
                                ) : (
                                  <img
                                    className={classes.personal_history_placeholder}
                                    src={placeholder_freestory}
                                  ></img>
                                )}
                              </td>
                            ))}
                          </tr>)
                      ) : (
                        <tr
                          id="people_icon"
                          name="people_icon"
                          className={`${classes.bg_gray}`}
                        >
                          {vLessonList.map((item, index) => (
                            <td
                              className={`border-left-0 ${classes.image_td_border}`}
                              id="people_1"
                              key={index + 1}
                            >
                              {item.personaType != "freeStory" ? (
                                <ImageComponent index={index} avatarkey={item.personaAvatar} />
                              ) : (
                                <img
                                  className={classes.personal_history_placeholder}
                                  src={placeholder_freestory}
                                ></img>
                              )}
                            </td>
                          ))}
                        </tr>)
                      }

                      {browserRedirect() !== 3 ? <>
                        <tr id="lesson_persona_row" name="lesson_persona_row">
                          {vVisibleTab?.themeCode != "proposal" && (
                            <th
                              id="course"
                              name="course"
                              className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                            >
                              コース
                            </th>
                          )}
                          {vLessonList.map((item, index) => (
                            <td
                              className={`${classes.tr_top_border}`}
                              key={index}
                              id={`lesson_persona_${index + 1}`}
                              name={`lesson_persona_${index + 1}`}
                              style={browserRedirect()===1?{minWidth:'240px'}:null}
                            >
                              {item.personaCourse}
                            </td>
                          ))}
                        </tr> </> : <>
                        <tr id="lesson_persona_row" name="lesson_persona_row">
                          <th
                            id="course"
                            name="course"
                            className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                          >
                            コース
                          </th>
                          {vLessonList.map((item, index) => (
                            <td
                              className={`${classes.tr_top_border}`}
                              key={index}
                              id={`lesson_persona_${index + 1}`}
                              name={`lesson_persona_${index + 1}`}
                              style={browserRedirect() === 3 ? { whiteSpace: 'normal' } : null}
                            >
                              {item.personaCourse}
                            </td>
                          ))}
                        </tr></>
                      }

                      <tr id="progress_row" name="progress_row">
                        <th
                          id="progress"
                          name="progress"
                          className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                        >
                          進捗率
                        </th>
                        {vLessonList.map((item, index) => (
                          <td
                            key={index}
                            className=""
                            id={`progress_rate_${index + 1}`}
                            name={`progress_rate_${index + 1}`}
                          >
                            {item.personaType === "rolePlay"
                              ? calculatePercentage(
                                item.progress,
                                item.sectionCount
                              )
                              : Math.round(item.progress * 100)}
                            %
                            {item.personaType === "rolePlay" && (
                              <span>
                                &nbsp;&nbsp;({item.clearSectionCount}/
                                {item.sectionCount})
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>

                      <tr id="total_execution" name="total_execution">
                        <th
                          id="execution"
                          name="execution"
                          className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                        >
                          総プレイ回数
                        </th>
                        {vLessonList.map((item, index) => (
                          <td
                            key={index}
                            id={`total_execution_time_${index + 1}`}
                            name={`total_execution_time_${index + 1}`}
                          >
                            {item.personaTimes}回
                          </td>
                        ))}
                      </tr>

                      <tr id="total_duration" name="total_duration">
                        <th
                          id="duration"
                          name="duration"
                          className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                        >
                          総プレイ時間
                        </th>
                        {vLessonList.map((item, index) => (
                          <td
                            key={index}
                            id={`total_duration_${index + 1}`}
                            name={`total_duration_${index + 1}`}
                          >
                            {item.personaDuration.substr(0,1)=='0' ? item.personaDuration.substr(1) : item.personaDuration}
                          </td>
                        ))}
                      </tr>

                      <tr id="total_star" name="total_star">
                        <th
                          id="start"
                          name="start"
                          className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                        >
                          習熟度
                        </th>
                        {vLessonList.map((item, index) => (
                          <td
                            key={index}
                            id={`total_start_count_${index + 1}`}
                            name={`total_start_count_${index + 1}`}
                          >
                            {Math.round(item.personaProficiency * 100)}%
                            {item.personaType === "rolePlay" && (
                              <span>
                                &nbsp;&nbsp;({item.personaClearStars}/
                                {item.personaStars})
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>

                      <tr id="status_row" name="status_row">
                        <th
                          id="status"
                          name="status"
                          className={`${classes.th_head_bg_sky_blue} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                        >
                          ステータス
                        </th>
                        {vLessonList.map((item, index) => (
                          <td
                            key={index}
                            className="font-weight-bold"
                            id={`lesson_status_${index + 1}`}
                            name={`lesson_status_${index + 1}`}
                          >
                            {shiftText(item.personaStatus)}
                          </td>
                        ))}
                      </tr>
                      {!vHasAngentCode && (
                        <>
                          {Object.keys(vLessonSectionResults).map((item, i) => {
                            let personaIdSort = vLessonSectionResults[item].sort(
                              (a, b) => a.displayNumber - b.displayNumber
                            );
                            return (
                              <tr
                                key={i}
                                id={`persona_task_history_${i + 1}`}
                                name={`persona_task_history_${i + 1}`}
                              >
                                <td
                                  style={{ width: "25%" }}
                                  id={`task_name_${i + 1}`}
                                  name={`task_name_${i + 1}`}
                                  className={`text-left font-weight-bold ${classes.cm_table_body_index_no_bg} ${vLessonList.length > 3 ? classes.multiple_lessons_col1 : null}`}
                                >
                                  <div>
                                    <span
                                      className={`${classes.margin_srno} d-inline-block ml-2`}
                                    >
                                      {i + 1}.{vLessonSectionResults[item]?.[0].sectionName}
                                    </span>
                                  </div>
                                </td>
                                {personaIdSort.map((item1, index) => {
                                  return (
                                    <td
                                      key={index}
                                      style={{ width: "25%", height: "60px", position: 'relative' }}
                                      id={`no_implemented_${i + 1}${index + 1}`}
                                      name={`no_implemented_${i + 1}${index + 1}`}
                                      className={classes.person_td_mobile}
                                    >
                                      {item1.sectionDisplayNumber != null ? (
                                        <>
                                          <span
                                            className={`${classes.task_cotainer} ${classes.no_cursor} ${classes.ct_d_flex}`}
                                            style={{justifyContent: browserRedirect() === 3 && vLessonList.length === 1 ? 'center' : null}}
                                          >
                                            <span
                                              className={`${vVisibleTab?.themeCode != "proposal"
                                                ? "order-3"
                                                : "order-1"
                                                } ${browserRedirect() == 3 ? classes.task_cotainer_right : null}`}
                                            >
                                              <span
                                                className="d-block font-black"
                                                id={`task_execution_time_${i + 1}${index + 1
                                                  }`}
                                                name={`task_execution_time_${i + 1
                                                  }${index + 1}`}
                                              >
                                                <img
                                                  src={PlayIcon}
                                                  className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                  style={browserRedirect() == 3 ? { width: '13px' } : null}
                                                />
                                                {item1.sectionTimes}回
                                              </span>
                                              <span className={`d-block font-black ${browserRedirect() !== 3 ? `mt-1 mb-1` : null}`}>
                                                <img
                                                  src={TimeIcon}
                                                  className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                  style={browserRedirect() == 3 ? { width: '13px' } : null}
                                                />
                                                {item1.sectionDuration
                                                  ? item1.sectionDuration.substr(0,1) == '0' ? item1.sectionDuration.substr(1) : item1.sectionDuration
                                                  : "0:00:00"}
                                              </span>
                                            </span>
                                            <span
                                              className={` ${classes.star_icon} ${classes.star_icon_arr}`}
                                              id={`task_rate_${i + 1}${index + 1}`}
                                              name={`task_rate_${i + 1}${index + 1
                                                }`}
                                            >
                                              {shifTaskWithPercent(
                                                item1.highestScore,
                                                item1.sectionTimes,
                                                true
                                              )}
                                            </span>
                                          </span>
                                          {
                                              browserRedirect()==1?
                                              vVisibleTab?.themeCode == "proposal" && (
                                                <span className="d-flex align-items-baseline font-black">
                                                  <img
                                                    src={PlayVideoIcon}
                                                    className={`mr-2 ${classes.play_video_task_icon}`}
                                                  />
                                                  <span>
                                                    {item1.sectionTimes != "0" ? (
                                                      <>
                                                        {item1.chatReference
                                                          .recordId !== 0 &&
                                                          (item1.chatReference
                                                            .isReferencePublic === 1 ||
                                                            vCurrentApiLoginUser ===
                                                            vCurrentLoginUser) ? (
                                                          <a
                                                            target="_blank"
                                                            onClick={() =>
                                                              freestoreVideoHandle(
                                                                item1?.chatReference
                                                                  ?.recordId,
                                                                vProcessToken
                                                              )
                                                            }
                                                            className={`d-block text-left ${classes.text_decoration} ${classes.cursor_pointer}`}
                                                          >
                                                            録画データ
                                                          </a>
                                                        ) : (
                                                          <a
                                                            className={`d-block text-left ${classes.cursor_none_a_tag}`}
                                                          >
                                                            録画データ
                                                          </a>
                                                        )}
                                                        <span
                                                          className={
                                                            classes.text_decoration
                                                          }
                                                        >
                                                          {dateFormatChg(item1)}
                                                        </span>
                                                        {item1.chatReference
                                                          .recordId !== 0 &&
                                                          vCurrentApiLoginUser ===
                                                          vCurrentLoginUser ? (
                                                          <img
                                                            src={RemoveTrashIcon}
                                                            className={`mr-2 ${classes.remove_trash_task_icon} ${classes.cursor_pointer}`}
                                                            onClick={deleteVideo(
                                                              item1.chatReference
                                                                .recordId
                                                            )}
                                                          />
                                                        ) : (
                                                          <img
                                                            src={DisableRemoveTrashIcon}
                                                            className={`mr-2 ${classes.remove_trash_task_icon}`}
                                                          />
                                                        )}
                                                      </>
                                                    ) : (
                                                      <>
                                                        <a
                                                          className={`d-block text-left ${classes.cursor_none_a_tag}`}
                                                        >
                                                          録画データ
                                                        </a>
                                                        <span
                                                          className={
                                                            classes.text_decoration
                                                          }
                                                        >
                                                          ----/--/-- --:--
                                                        </span>
                                                        <img
                                                          src={DisableRemoveTrashIcon}
                                                          className={`mr-2 ${classes.remove_trash_task_icon}`}
                                                        />
                                                      </>
                                                    )}
                                                  </span>
                                                </span>
                                            )
                                            :
                                            null
                                          }
                                          {item1.sectionTimes != "0" ? (
                                            <span
                                              onClick={() =>
                                                goToAIScorePage(item1, "single")
                                              }
                                              className={classes.task_under_text}
                                            >
                                              {vVisibleTab?.themeCode ==
                                                "proposal" ||
                                                item1.personaType == "freeStory"
                                                ? "＞"
                                                : ""}
                                              採点画面を表示する
                                            </span>
                                          ) : (
                                            <span
                                              className={`${classes.task_under_text} ${classes.no_cursor} ${classes.disable_color}`}
                                            >
                                              {vVisibleTab?.themeCode ==
                                                "proposal" ||
                                                item1.personaType == "freeStory"
                                                ? "＞"
                                                : ""}
                                              採点画面を表示する
                                            </span>
                                          )}
                                        </>
                                      ) : (
                                        <>
                                          <span
                                            className={`${classes.task_cotainer} ${classes.no_cursor} ${classes.ct_d_flex} ${classes.null_task}`}
                                          >
                                            <span className={browserRedirect() == 3 ? classes.task_cotainer_left : null}>--</span>
                                            <span className={classes.null_wrapper}>
                                              <span>
                                                <img
                                                  src={PlayIcon}
                                                  className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                  style={browserRedirect() == 3 ? { width: '13px' } : null}
                                                />
                                                <span>0回</span>
                                              </span>
                                              <span>
                                                <img
                                                  src={TimeIcon}
                                                  className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                  style={browserRedirect() == 3 ? { width: '13px' } : null}
                                                />
                                                <span>0:00:00</span>
                                              </span>
                                            </span>
                                          </span>
                                        </>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>
                            );
                          })}
                        </>
                      )}
                      {(
                        // conditions for displaying "全" && != "proposal" 社员用
                        //  -1. maximum number of section >1
                        vVisibleTab?.themeCode != "proposal" && ( vLessonList.length != 0 && Object.entries(vLessonSectionResults).length > 1
                        || // or
                        //  -2. number of freestory > 0
                        vLessonList.filter(v=>v.personaType === 'freeStory').length > 0)
                        ) && (
                          <>
                            <tr className={`${classes.no_data}`}>
                              <td></td>
                            </tr>
                            <tr
                              id={`persona_task_history_all`}
                              name={`persona_task_history_all`}
                            >
                              <td
                                id={`task_name_all`}
                                name={`task_name_all`}
                                className={`
                                  text-left align-middle font-weight-bold 
                                  ${classes.cm_table_body_index_no_bg}
                                  
                                `}
                                // ${classes.all_section_header_td }
                              >
                                <div>
                                  <span className="ml-2 d-inline-block">
                                    全セクション
                                  </span>
                                </div>
                              </td>
                              {vLessonList.map((item1, i) => {
                                return (
                                  <td
                                    key={i}
                                    style={{ width: "25%", height: "60px" }}
                                    id={`no_implemented_${i + 1}`}
                                    name={`no_implemented_${i + 1}`}
                                    className={classes.tr_top_border}
                                  >
                                    {item1.personaType == "freeStory" ? (
                                      <>
                                        <span
                                          className={`${classes.task_cotainer} ${classes.no_cursor} ${classes.ct_d_flex}`}
                                        >
                                          <span className={browserRedirect() == 3 ? `${classes.task_cotainer_right} order-1` : `order-1`}>
                                            <span
                                              className="d-block font-black"
                                              id={`task_execution_time_${i + 1}${i + 1
                                                }`}
                                              name={`task_execution_time_${i + 1}${i + 1
                                                }`}
                                            >
                                              <img
                                                src={PlayIcon}
                                                className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                style={browserRedirect() == 3 ? { width: '13px' } : null}
                                              />
                                              {
                                                item1["sectionResult"][0]
                                                  ?.sectionTimes
                                              }
                                              回
                                            </span>
                                            <span className="d-block mt-1 mb-1 font-black">
                                              <img
                                                src={TimeIcon}
                                                className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                style={browserRedirect() == 3 ? { width: '13px' } : null}
                                              />
                                              {item1["sectionResult"][0]?.sectionDuration
                                                ? item1["sectionResult"][0]?.sectionDuration.substr(0,1) == '0' ? item1["sectionResult"][0]?.sectionDuration.substr(1) : item1["sectionResult"][0]?.sectionDuration
                                                : "0:00:00"}
                                            </span>
                                          </span>
                                          <span
                                            className={` ${classes.star_icon} ${classes.star_icon_arr}`}
                                            id={`task_rate_${i + 1}${i + 1}`}
                                            name={`task_rate_${i + 1}${i + 1}`}
                                          >
                                            {shifTaskWithPercent(
                                              item1["sectionResult"][0]
                                                ?.highestScore,
                                              item1["sectionResult"][0]
                                                ?.sectionTimes,
                                              true
                                            )}
                                          </span>
                                        </span>
                                        {browserRedirect()==1?
                                          vVisibleTab?.themeCode != "proposal" && (
                                          <span className="d-flex align-items-baseline font-black">
                                            <img
                                              src={PlayVideoIcon}
                                              className={`mr-2 ${classes.play_video_task_icon}`}
                                            />
                                            <span>
                                              {item1["sectionResult"][0]
                                                ?.sectionTimes != "0" ? (
                                                <>
                                                  {item1["sectionResult"][0]
                                                    ?.chatReference.recordId !==
                                                    0 &&
                                                    (item1["sectionResult"][0]
                                                      ?.chatReference
                                                      .isReferencePublic === 1 ||
                                                      vCurrentApiLoginUser ===
                                                      vCurrentLoginUser) ? (
                                                    <a
                                                      target="_blank"
                                                      onClick={() =>
                                                        freestoreVideoHandle(
                                                          item1["sectionResult"][0]
                                                            ?.chatReference
                                                            ?.recordId,
                                                          vProcessToken
                                                        )
                                                      }
                                                      className={`d-block text-left ${classes.text_decoration} ${classes.cursor_pointer}`}
                                                    >
                                                      録画データ
                                                    </a>
                                                  ) : (
                                                    <a
                                                      className={`d-block text-left ${classes.cursor_none_a_tag}`}
                                                    >
                                                      録画データ
                                                    </a>
                                                  )}
                                                  <span
                                                    className={
                                                      classes.text_decoration
                                                    }
                                                  >
                                                    {dateFormatChg(
                                                      item1["sectionResult"][0]
                                                    )}
                                                  </span>
                                                  {item1["sectionResult"][0]
                                                    ?.chatReference.recordId !==
                                                    0 &&
                                                    vCurrentApiLoginUser ===
                                                    vCurrentLoginUser ? (
                                                    <img
                                                      src={RemoveTrashIcon}
                                                      className={`mr-2 ${classes.remove_trash_task_icon} ${classes.cursor_pointer}`}
                                                      onClick={deleteVideo(
                                                        item1["sectionResult"][0]
                                                          ?.chatReference.recordId
                                                      )}
                                                    />
                                                  ) : (
                                                    <img
                                                      src={DisableRemoveTrashIcon}
                                                      className={`mr-2 ${classes.remove_trash_task_icon}`}
                                                    />
                                                  )}
                                                </>
                                              ) : (
                                                <>
                                                  <a
                                                    className={`d-block text-left ${classes.cursor_none_a_tag}`}
                                                  >
                                                    録画データ
                                                  </a>
                                                  <span
                                                    className={
                                                      classes.text_decoration
                                                    }
                                                  >
                                                    ----/--/-- --:--
                                                  </span>
                                                  <img
                                                    src={DisableRemoveTrashIcon}
                                                    className={`mr-2 ${classes.remove_trash_task_icon}`}
                                                  />
                                                </>
                                              )}
                                            </span>
                                          </span>
                                        ):null}
                                        {item1["sectionResult"][0]?.sectionTimes !=
                                          "0" ? (
                                          <span
                                            onClick={() =>
                                              goToAIScorePage(
                                                item1["sectionResult"][0],
                                                "single"
                                              )
                                            }
                                            className={classes.task_under_text}
                                          >
                                            {vVisibleTab?.themeCode == "proposal" ||
                                              (item1["sectionResult"][0]
                                                ?.personaType == "freeStory" &&
                                                "＞")}
                                            採点画面を表示する
                                          </span>
                                        ) : (
                                          <span
                                            className={`${classes.task_under_text} ${classes.no_cursor} ${classes.disable_color}`}
                                          >
                                            {vVisibleTab?.themeCode == "proposal" ||
                                              (item1["sectionResult"][0]
                                                ?.personaType == "freeStory" &&
                                                "＞")}
                                            採点画面を表示する
                                          </span>
                                        )}
                                      </>
                                    ) : (
                                      <>
                                        <span
                                          className={`${classes.task_cotainer} ${classes.no_cursor} d-flex justify-content-center `}
                                        >
                                          <span
                                            className={classes.first_task_section}
                                          >
                                            <span
                                              className="d-block font-black"
                                              id={`task_execution_time_${i + 1}${i + 1
                                                }`}
                                              name={`task_execution_time_${i + 1}${i + 1
                                                }`}
                                            >
                                              <img
                                                src={PlayIcon}
                                                className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                style={browserRedirect() == 3 ? { width: '13px' } : null}
                                              />
                                              {item1.allSectionResult.sectionTimes}
                                              回
                                            </span>
                                            <span className="d-block font-black">
                                              <img
                                                src={TimeIcon}
                                                className={`${classes.task_icon} ${browserRedirect() == 3 ? `mr-1` : `mr-2`}`}
                                                style={browserRedirect() == 3 ? { width: '13px' } : null}
                                              />
                                              {item1.allSectionResult.sectionDuration
                                                ? item1.allSectionResult.sectionDuration.substr(0,1) ? item1.allSectionResult.sectionDuration.substr(1) : item1.allSectionResult.sectionDuration
                                                : "0:00:00"}
                                            </span>
                                          </span>
                                        </span>
                                        {item1.allSectionResult.sectionTimes !==
                                          "0" ? (
                                          <span
                                            onClick={() =>
                                              goToAIScorePage(item1, "multiple")
                                            }
                                            className={classes.task_under_text}
                                          >
                                            {vVisibleTab?.themeCode == "proposal" ||
                                              (item1.personaType == "freeStory" &&
                                                "＞")}
                                            採点画面を表示する
                                          </span>
                                        ) : (
                                          <span
                                            className={`${classes.task_under_text} ${classes.no_cursor} ${classes.disable_color}`}
                                          >
                                            {vVisibleTab?.themeCode == "proposal" ||
                                              (item1.personaType == "freeStory" &&
                                                "＞")}
                                            採点画面を表示する
                                          </span>
                                        )}
                                      </>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          </>
                        )}
                    </tbody>
                  </table>
                </div>
                {/* all seection */}
              </div>
            </Col>
          </Row>
        </>}
      />
      <Modal
        open={freeStoryVideoPlay}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          {isVideoLoad ? (
            <CircularProgress
              color="inherit"
              style={{ position: "absolute", top: "50%", left: "50%" }}
            />
          ) : (
            <video
              id="free-story-video-play"
              x5-video-player-type="h5-page"
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
              controls="controls"
              width={"60%"}
            />
          )}
          <span
            style={{
              position: "absolute",
              right: "5%",
              top: "5%",
              color: "white",
              fontSize: 30,
              cursor: "pointer",
            }}
            onClick={() => {
              setFreeStoryVideoPlay(false);
            }}
          >
            X
          </span>
        </div>
      </Modal>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    login_task_all: state.login_task_all,
    mst_user_info: state.cacheMstUserInfo,
  };
};

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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Index);
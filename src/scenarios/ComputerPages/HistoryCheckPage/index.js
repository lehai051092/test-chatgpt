import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
} from "react-router-dom";

import GeneralTextbox from "../../../constituents/ITextboxes/GeneralTextbox02";
import HistoryButton from "../../../constituents/IButton/HistoryButton";
import { getLessonCategories } from "../../../request/backendApi/api";

import { useTranslation } from "react-i18next";
import classes from "./styles.module.css";
import { getHistoryList } from "../../../request/backendApi/api";
import { connect } from "react-redux";
import logger from "redux-logger";
import { historyTaskAll } from "../../../storage/reduxActions/index";
import { useLocation } from "react-router-dom";
import ErrorMessage from "../../../constituents/IErrorMessage/index";
import ErrorMsgApi from "../../../constituents/IErrorMessage/ErrorMsgApi";
import {
  getAgentInfo,
  getBranchInfo,
} from "../../../request/masterDBApi/feignApi";
import store from "../../../storage";
import {
  cacheBackendUserInfo,
  cacheMstUserInfo,
} from "../../../storage/reduxActions/index";
import { getAuthorizeUserList } from "../../../request/backendApi/api";
import { getEmployeeInfo } from "../../../request/masterDBApi/feignApi";
import ThemeFilter from "./ThemeFilter/index";
import { faLeaf } from "@fortawesome/free-solid-svg-icons";
import {CACHE_MSTDB_USER_INFO, UPDATE_SIDEBAR_ACTIVE_NAME} from "../../../storage/consts";
import ICoreFrame from "../../../constituents/ICoreFrame";
// import SamplePersonaData from './SamplePersonaData.json'
import { browserRedirect,setLocationState } from '../../../utils/util';
import { ControlPointSharp } from "@material-ui/icons";

let res2_str = '';
function HistoryCheck(props) {
  const { t } = useTranslation();

  const location = useLocation();
  const [vShowTable, setShowTable] = useState(false);

  const [vThemeFilterHistoryList, setThemeFilterHistoryList] = useState([]);
  const [vHistoryList, setHistoryList] = useState([]);

  const [vLessonList, setLessonList] = useState([]);
  const [vThemeFilterLessonList, setThemeFilterLessonList] = useState([]);
  const [vCompanyList, setCompanyList] = useState([]);
  const [vCompanyCode, setCompanyCode] = useState("");
  const [vBranchCode, setBranchCode] = useState("");
  const [vCompanyName, setCompanyName] = useState("");
  const [vBranchName, setBranchName] = useState("");
  const [vResponseError, setResponseError] = useState(false);
  const [vAgentShowError, setAgentShowError] = useState(false);
  const [vInputAgentErrorMes, setInputAgentErrorMes] = useState("");
  const [vBranchShowError, setBranchShowError] = useState(false);
  const [vInputBranchErrorMes, setInputBranchErrorMes] = useState("");
  const [vErrorMessage, setErrorMessage] = useState();
  const [vDisableAgentInput, setDisableAgentInput] = useState(false);
  const [vEnableSearchBtn, setEnableSearchBtn] = useState(false);
  const [vEnableSecInputText, setEnableSecInputText] = useState(false);
  const [vThemeCode, setThemeCode] = useState(null);
  const [vScenarioCode, setScenarioCode] = useState(null);
  const [vTableScenarioList, setTableScenarioList] = useState([]);
  const [vHasAngentCode, setHasAngentCode] = useState(false);

  const [vControlTheme, setControlTheme] = useState(false);
  useEffect(() => {
    getAuthorizeUserList().then((res) => {
      if (res.data) {
        store.dispatch(cacheBackendUserInfo(res.data));
        // if afla-c employee, no need to retrieve username, cause doesn't exist
        if (res.data?.employeeId?.value === '') {
          store.dispatch(
              cacheMstUserInfo({
                salsmanSeiKj: res.data?.userId?.value,
                salsmanMeiKj: 'lsls'
              })
          );
          return
        }
        if (
          res?.data?.userRoles[0] != "ADMINISTRATOR" &&
          res?.data?.userRoles[0] != "I3ASEADMINISTRATOR"
        ) {
          if (res.data?.employeeId?.value === '') {
            store.dispatch({
              type: CACHE_MSTDB_USER_INFO, payload: {
                salsmanSeiKj: res.data?.userId?.value,
                salsmanMeiKj: ''
              }
            })
          } else if (
            res.data?.employeeId?.value &&
            res.data?.employeeId?.value.length == 13
          ) {
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
      }
    });
  }, []);

  useEffect(() => {
    if (store.getState().login_task_all?.userRoles) {
      // show agentCode of current login user by default
      let userRoles = store.getState().login_task_all?.userRoles[0];
      if (userRoles == "EVALUATOR") {
        let loginUserInfo = store.getState().login_task_all;

        if (
          loginUserInfo.targetAcd?.value &&
          loginUserInfo.targetAcd?.value != ""
        ) {
          if (loginUserInfo.targetAcd.value.length > 7) {
            document.getElementById(
              "agency_code_textbox"
            ).value = loginUserInfo.targetAcd.value.substring(0, 7);
          } else if (7 >= loginUserInfo.targetAcd.value.length) {
            document.getElementById("agency_code_textbox").value =
              loginUserInfo.targetAcd.value;
          }

          setDisableAgentInput(true);
          getAgentCompanyDetail("agent").then();
        } else if (
          loginUserInfo.agentCode &&
          loginUserInfo.agentCode.value.length == 10
        ) {
          document.getElementById(
            "agency_code_textbox"
          ).value = loginUserInfo.agentCode.value.substring(0, 7);
          setDisableAgentInput(true);
          getAgentCompanyDetail("agent").then();
        } else {
          setDisableAgentInput(false);
        }
      }
    }
  }, [store.getState().login_task_all]);

  const getAgentCompanyDetail = (caller, text) => {
    return new Promise((resolve, reject) => {
      var agntCode, agstCode;
      if(!text){
        agntCode = document.getElementById("agency_code_textbox").value;
        agstCode = document.getElementById("recruiter_code_textbox").value;
      } else {
        if("agent" == caller){
          agntCode = text;
        } else if("branch" == caller){
          agntCode = document.getElementById("agency_code_textbox").value;
          agstCode = text;
        } 
      }

      let params = {};
      if (agntCode && agstCode && agntCode != "" && agstCode != "") {
        params = {
          agntCde: agntCode,
          agstCde: agstCode,
        };
      } else if (agntCode && agntCode != "") {
        params = {
          agntCde: agntCode,
        };
      }
      setCompanyCode(agntCode);

      console.log(`request params: ${JSON.stringify(params)}`)
      if (agntCode && agntCode != "" && "agent" == caller) {
        console.log('agent sent')
        getAgentInfo(params)
          .then((res) => {
            if (res.agntNmeK) {
              setCompanyName(res.agntNmeK);
              setAgentShowError(false);
              setEnableSearchBtn(true);
              setEnableSecInputText(true);
              resolve();
            } else {
              setCompanyName("");
              setAgentShowError(true);
              setInputAgentErrorMes("該当の代理店コードはありません");
              setEnableSearchBtn(false);
              setEnableSecInputText(false)
              resolve();
            }
          })
          .catch((e) => {
            console.log("MasterDB query failed" + e);
            setCompanyName("");
            setAgentShowError(true);
            setInputAgentErrorMes("該当の代理店コードはありません");
            setEnableSearchBtn(false);
            setEnableSecInputText(false)
            reject();
          });
      } else if (
        agntCode &&
        agstCode &&
        agntCode != "" &&
        agstCode != "" &&
        "branch" == caller
      ) {
        console.log('branch sent')
        getBranchInfo(params)
          .then((result) => {
            if (result.agstNmeK) {
              setBranchName(result.agstNmeK);
              setBranchShowError(false);
              setEnableSearchBtn(true);
              setEnableSecInputText(true)
              resolve();
            } else {
              setBranchShowError(true);
              setInputBranchErrorMes("該当の出先コードはありません");
              setBranchName("");
              setEnableSearchBtn(false);
              // setEnableSecInputText(false)
              resolve();
            }
          })
          .catch((e) => {
            console.log("MasterDB query failed" + e);
            setCompanyName("");
            setBranchShowError(true);
            setInputBranchErrorMes("該当の出先コードはありません");
            setBranchName("");
            setEnableSearchBtn(false);
            setEnableSecInputText(false)
            reject();
          });
      } else {
        resolve();
      }
    });
  };

  const getDefaultHistoryList = () => {
    const setData = async () => {
      try {
        //get all data for initial state
        let params = "";
        let agentCodeTemp = store.getState().login_task_all;
        if (
          agentCodeTemp.agentCode &&
          agentCodeTemp.agentCode.value.length >= 10
        ) {
          params = agentCodeTemp.agentCode.value.substring(0, 7);
        } else if (
          agentCodeTemp.targetAcd &&
          agentCodeTemp.targetAcd.value.length >= 10
        ) {
          params = agentCodeTemp.targetAcd.value.substring(0, 7);
        }

        // get login user's information
        let role = "RECRUITER";

        getHistoryList(params, role).then((res) => {
          console.log("--- getHistoryList");
          if (res.data) {
            setHistoryList(res.data);
            setLessonList(res.data.personaResult);
            props.historyTaskAll(res.data);
            if (res.data.persona.length >= 1) {
              setShowTable(true);
            }
          } else {
            logger.error("Something-went-wrong ! Please check and try again ");
          }
        });
      } catch (error) {
        setResponseError(true);
        setErrorMessage(
          "エラーが発生しました。確認してもう一度お試しください。"
        );
        console.log(
          "failed to get history list, try to contact Administrator for details." +
            error
        );
      }
    };
    setData();
  };
  useEffect(() => {
    setHasAngentCode(false)
  }, [])

  const [searchSubmitText,setSearchSubmitText] = useState('');

  // 検索
  const onClickSearchBtn = () => {
    validteExistence()
      .then((result) => {
        if (result) {
          const setData = async () => {
            try {
              // get login user's information
              let role = "RECRUITER";
              if (
                store.getState().login_task_all?.userRoles[0] != "GENERAL_USER"
              ) {
                role = "";
              }
              let agentCodeFull = vCompanyCode + vBranchCode;
              console.log(agentCodeFull);
              getHistoryList("/history?", agentCodeFull).then((res) => {
                if(res.data && res.data.personaResult){
                  
                  // related to role  
                  // r1.personaScenario = r2.scenario / r1.personaTheme = r2.theme / r1.persona = r2.personaInfo
                  // r1 getHistoryList r2 getLessonCategories
                  getLessonCategories("/lessons/category?type=startRolePlay&specialAS="+store.getState().user_special_as).then((res2) => {
                    if (res2.data) {
                      console.log(res2);
                      res2_str = '';
                      for (let j = 0; j < res2.data.length; j++) {
                        const r2_1 = res2.data[j];
                        for (let k = 0; k < r2_1["scenario"].length; k++) {
                          const r2_2 = r2_1["scenario"][k];
                          for (let e = 0; e < r2_2["lessonInfo"].length; e++) {
                            const element = `${r2_2["lessonInfo"][e].persona}-${r2_2["lessonInfo"][e].theme}`;
                            res2_str += element;
                          }
                        }
                      }

                      let resData_persona = res.data.persona.filter((num) => {
                        return res2_str.indexOf(`${num.personaInfo}-${num.personaTheme}`)>-1?num:null;
                      });
                      let resData = {'persona':resData_persona,'personaResult':res.data.personaResult}
                      console.log("getSelectedTheme",resData_persona);
                      if(vTableScenarioList.length > 0){
                        let personSort = [];
                     
                        vTableScenarioList.map((item, index) => {
                          item.scenario.lessonInfo.map((item1, index1) => {
                            personSort.push(item1.personaId);
                          });
                        });
                        
                        resData.personaResult.map((item, index) => {
                          item.personaResult.sort(
                            (a, b) =>
                              personSort.indexOf(a.personaId) - personSort.indexOf(b.personaId)
                          );
                        });
                        resData.persona.sort(
                          (a, b) =>
                            personSort.indexOf(a.personaId) - personSort.indexOf(b.personaId)
                        );
                      }
                      console.log("jjj",resData);
                      setHistoryList(resData);
                      setLessonList(resData.personaResult);
                      //themefilter
                      setThemeFilterHistoryList(resData);
                      let _str = document.getElementById('agency_code_textbox').value + '-' + document.getElementById('recruiter_code_textbox').value;
                      if(_str === searchSubmitText){
                        return false;
                      }else{
                        setSearchSubmitText(_str);
                        setThemeFilterLessonList(resData.personaResult);
                        setTimeout(() => {
                          if(store.getState().user_special_as === 1){
                            getLessonCategories("/lessons/category?type=startRolePlay&specialAS="+store.getState().user_special_as).then((res2) => {
                              let _arr = [];
                              for (let index = 0; index < res2.data.length; index++) {
                                let _arr_1 = res2.data[index];
                                for (let j = 0; j < _arr_1.scenario.length; j++) {
                                  
                                  _arr.push({
                                    'scenario':_arr_1.scenario[j],
                                    'themeCode':_arr_1.themeCode,
                                    'themeName':_arr_1.themeName
                                  });
                                }                              
                              }

                              getSelectedTheme('newProduction',null,_arr,resData)
                            })
                          }
                        }, 0);
                      }
                      //themefilter
                      props.historyTaskAll(resData);
                      if (resData.persona.length >= 1) {
                        setShowTable(true);
                      }
                      setControlTheme(true);
                    }
                  });

                  
                }
              });
            } catch (error) {
              setResponseError(true);
              setErrorMessage(
                "エラーが発生しました。確認してもう一度お試しください。"
              );
            }
          };
          setData();
        } else {
          setShowTable(false);
        }
      })
      .catch((e) => {
        console.log("Error while validating agent code and branch code:" + e);
      });
  };

  const validteExistence = () => {
    return new Promise((resolve, reject) => {
      var agstCode = document.getElementById("recruiter_code_textbox").value;
      if (
        vCompanyName &&
        vCompanyName.length != 0 &&
        (agstCode.length == 0 || agstCode.length == 3)
      ) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  };

  const onInputBranchCodeChange = (event) => {
    handleBranchCodeSearch(event, event.target.value, 'change');
  };

  const onPasteBranchCode = (event) => {
    handleBranchCodeSearch(event, event.clipboardData.getData('Text'), 'paste')
  }

  function handleBranchCodeSearch(event, text, origin) {
    let cCode = document.getElementById("agency_code_textbox").value;
    if (event.target.value.length >= 3) {
      if (cCode >= 7) {
        if('paste' == origin){
          getAgentCompanyDetail("branch", text).then();
        } else {
          getAgentCompanyDetail("branch").then();
        }
      }
      event.target.validity.valid?setBranchCode(event.target.value):setBranchCode(vBranchCode);
    } else if (3 > event.target.value.length) {
      event.target.validity.valid?setBranchCode(event.target.value):setBranchCode(vBranchCode);
      setBranchName("");
      setBranchShowError(false);
      // if(!cCode && 0 == event.target.value.length){
      //   getDefaultHistoryList();
      // }
    }

    if (event.target.value.length != 0 && event.target.value.length != 3) {
      setEnableSearchBtn(false);
    } else {
      if (cCode == "") {
        setEnableSearchBtn(false);
      } else {
        setEnableSearchBtn(true);
      }
    }
  }

  const onInputAgentCodeChange = (event) => {
    handleAgentCodeSearch(event, event.target.value, 'change')
  };

  const onPasteAgentCode = (event) => {
    handleAgentCodeSearch(event, event.clipboardData.getData('Text'), 'paste')
  }

  function handleAgentCodeSearch(event, text, origin){
    if (text.length != 0) {
      setEnableSearchBtn(true);
      setEnableSecInputText(true)
    } else {
      setEnableSearchBtn(false);
      setEnableSecInputText(false)
    }
    if (text.length >= 7) {
      event.target.validity.valid?setCompanyCode(text):setCompanyCode(vCompanyCode);
      if('paste' == origin){
        getAgentCompanyDetail("agent", text).then();
      } else {
        getAgentCompanyDetail("agent").then();
      }
    } else{
      event.target.validity.valid?setCompanyCode(event.target.value):setCompanyCode(vCompanyCode);
      setCompanyName("");
      setAgentShowError(false);
      setBranchName("");
      // if(!bCode && 0 == event.target.value.length){
      //   getDefaultHistoryList()
      // }
    }
  };

  const onAgentCodeBlur = () => {
    var agntCode = document.getElementById("agency_code_textbox").value;
    if (agntCode.length !== 0 && agntCode.length !== 7) {
      setAgentShowError(true);
      setInputAgentErrorMes("該当の代理店コードはありません");
      setCompanyName("");
      setEnableSearchBtn(false);
      setEnableSecInputText(false)
    } else if (agntCode.length == 7) {
      getAgentCompanyDetail("agent").then();
      setEnableSearchBtn(true);
      setEnableSecInputText(true)
    } else if (agntCode.length == 0) {
      setEnableSearchBtn(false);
      setEnableSecInputText(false)
    }
  };

  const onBranchCodeBlur = () => {
    var agntCode = document.getElementById("agency_code_textbox").value;
    let branchCode = document.getElementById("recruiter_code_textbox").value;
    if (branchCode.length != 3 && branchCode.length != 0) {
      setBranchShowError(true);
      setInputBranchErrorMes("該当の出先コードはありません");
      setBranchName("");
    } else if (branchCode.length == 0 && agntCode.length != 0) {
      setEnableSearchBtn(true);
      setEnableSecInputText(true)
      setBranchShowError(false);
      setBranchName("");
    } else {
      getAgentCompanyDetail("branch").then();
    }
  };

  const shiftColor = (status) => {
    if (status == "FINISH") {
      return classes.complete;
    }
    if (status == "PROCESSING") {
      return classes.processing;
    }
    if (status == "NOT_START") {
      return classes.not_start;
    }
  };

  const shiftText = (status) => {
    if (status.trim() == "FINISH") {
      return "受講完了";
    }
    if (status.trim() == "PROCESSING") {
      return "受講中";
    }
    if (status.trim() == "NOT_START") {
      return "未受講";
    }
  };

  const getSelectedTheme = (themeCode, scenarioCode, scenario,resData) => {
    console.log('getSelectedTheme',[themeCode, scenarioCode, scenario,resData]);
    
    let scenarioFilter = scenario.filter(
      (item) => {
        return item.scenario.lessonInfo.length > 0
      }
    );
    scenario.length > 0 && setTableScenarioList(scenarioFilter);
    setThemeCode(themeCode);
    setScenarioCode(scenarioCode);

    //theme filter
    if (themeCode == null && scenarioCode == null) {
      if(scenario.length > 0)
      {
        if(vHistoryList?.persona)
        {
          let xThemeCodes = scenario.map((item) => item.themeCode);
          let xScenarioCode = scenario.map((item) => item.scenario.scenarioCode);
          let personaThemeFilter = vHistoryList?.persona.filter(
            (item) =>
            xThemeCodes.includes(item.personaTheme) && xScenarioCode.includes(item.personaScenario)
          );
          let personaResultArray = [];
          vLessonList.map((item, key) => {
            let personaResultThemeFilterIndex = item?.personaResult.filter(
              (item2) =>
                xThemeCodes.includes(item2.personaTheme) && xScenarioCode.includes(item2.personaScenario)
            );
            let pushArray = {
              personaResult: personaResultThemeFilterIndex,
              userId: item.userId,
              userName: item.userName,
            };
            personaResultArray.push(pushArray);
          });

          setThemeFilterHistoryList({
            persona: personaThemeFilter,
          });
          setThemeFilterLessonList(personaResultArray);
          return true;

        }else{
          setThemeFilterHistoryList(vHistoryList);
          setThemeFilterLessonList(vLessonList);
          return true;

        }
      }else{
        setThemeFilterHistoryList(vHistoryList);
        setThemeFilterLessonList(vLessonList);
        return true;
      }
    }

    if (scenarioCode == null) {

      let xScenarioCode = scenario.map((item) => item.scenario.scenarioCode);
      
      let onlyPersonaThemeFilter = (resData?resData:vHistoryList)?.persona.filter(
        (item) => item.personaTheme == themeCode && xScenarioCode.includes(item.personaScenario)
      );
      
      let OnlyThemePersonaResultArray = [];
      (resData?resData.personaResult:vLessonList).map((item, key) => {
        let personaResultThemeFilterIndex = item?.personaResult.filter(
          (item2) => item2.personaTheme == themeCode && xScenarioCode.includes(item2.personaScenario)
        );
        let pushArray = {
          personaResult: personaResultThemeFilterIndex,
          userId: item.userId,
          userName: item.userName,
        };
        OnlyThemePersonaResultArray.push(pushArray);
      });

      setThemeFilterHistoryList({
        persona: onlyPersonaThemeFilter,
      });
      setThemeFilterLessonList(OnlyThemePersonaResultArray);
      return true;
    } else {
      console.log('vHistoryList',vHistoryList);
      let personaThemeFilter = [];
      if(vHistoryList.length > 0)
      {
        personaThemeFilter = vHistoryList?.persona.filter(
          (item) =>
            item.personaTheme == themeCode && item.personaScenario == scenarioCode
        ); 
      }
      console.log('personaThemeFilter',personaThemeFilter);
      let personaResultArray = [];
      console.log("333",vLessonList)
      vLessonList.map((item, key) => {
        
        let personaResultThemeFilterIndex =  item?.personaResult.filter(
          (item2) =>
            item2.personaTheme == themeCode &&
            item2.personaScenario == scenarioCode
        );
        console.log(personaResultThemeFilterIndex);
        let pushArray = {
          personaResult: personaResultThemeFilterIndex,
          userId: item.userId,
          userName: item.userName,
        };
        personaResultArray.push(pushArray);
      });

      setThemeFilterHistoryList({
        persona: personaThemeFilter,
      });
      setThemeFilterLessonList(personaResultArray);
      return true;
    }
  };

  const tableScenarioSpan = (index) => {
    return vTableScenarioList[index]?.scenario?.lessonInfo.length;
  };

  //for store sidebar active when navigation
  const storeActiveSidebarName = () => {
    store.dispatch({type : UPDATE_SIDEBAR_ACTIVE_NAME ,sidebar_active_name:'manage'})
  }
  return (
    <ICoreFrame
      component={<>
        {vResponseError == true && (
          <ErrorMsgApi message={vErrorMessage && vErrorMessage} />
        )}
        <Row className={browserRedirect()===3&&classes.historycheck_title_tablet}>
          <Col>
            <h3
              id="manager_screen"
              name="manager_screen"
              className={`mb-32 pb-2 text-lg-left text-center`}
            >
              {t("historycheck.manager_screen")}
            </h3>
          </Col>
        </Row>
        <Row className={browserRedirect()===3&&classes.historycheck_body_tablet}>
          <Col lg="12" className={`${classes.sp_margin} ${classes.tb_padding}`}>
            <Row>
              <Col xs="12">
                <label
                  className="font-16 font-weight-bold"
                  id="agency_code"
                  name="agency_code"
                >
                  {t("historycheck.agency_code")}
                </label>
              </Col>
              <Col lg="12" className="d-flex align-items-center">
                <GeneralTextbox
                  placeholder={t("historycheck.please_enter_agency_code")}
                  onChange={onInputAgentCodeChange}
                  onPaste={onPasteAgentCode}
                  disabled={vDisableAgentInput}
                  onBlur={onAgentCodeBlur}
                  id="agency_code_textbox"
                  name="agency_code_textbox"
                  icon={vAgentShowError === true ? "show" : ""}
                  className={`${vAgentShowError === true ? "border_danger" : ""} ${classes.history_txt_box}`}
                  pattern="[0-9]*"
                  text={vCompanyCode}
                  inputtype="text"
                  maxlength={7}
                />              
                 <p
                  id="company_name"
                  name="company_name"
                  className={`mt-2 font-16 font-weight-bold ml-2`}
                >
                  {vCompanyName}
                </p>
              </Col>                    
            </Row>
            <div>
            {vAgentShowError === true && (
                  <ErrorMessage message={vInputAgentErrorMes} />
                )}
            </div>         
            <Row className="mt-4">
              <Col xs="12">
                <label
                  className="font-16 font-weight-bold"
                  id="recruiter_code"
                  name="recruiter_code"
                >
                  {t("historycheck.recruiter_code")} 
                </label> 
                <span className={`${classes.keepAll}`}>{ t("historycheck.please_enter_destination_code_short")}</span>              
              </Col>
              <Col lg="12" className="d-flex align-items-center">
                <GeneralTextbox
                  placeholder={t("historycheck.please_enter_recruiter_code")}
                  onChange={onInputBranchCodeChange}
                  onPaste={onPasteBranchCode}
                  onBlur={onBranchCodeBlur}
                  id="recruiter_code_textbox"
                  name="recruiter_code_textbox"
                  icon={vBranchShowError == true ? "show" : ""}
                  className={`${vBranchShowError == true ? "border_danger" : ""} ${classes.history_txt_box}`}
                  disabled={!vEnableSecInputText}
                  pattern="[0-9]*"
                  text={vBranchCode}
                  inputtype="text"
                  maxlength={3}
                />
                <p
                  id="company_name"
                  name="company_name"
                  className={`mt-2 font-16 ml-2`}
                >
                  {vBranchName}
                </p>             
              </Col>                      
            </Row>
            <div>
            {vBranchShowError == true && (
                  <ErrorMessage message={vInputBranchErrorMes} />
                )}
            </div>          
            <Row className="mt-4">
              <Col sm="2" xs="3" className="text-left mt-3 mb-3 col-12">
                <HistoryButton
                  title={t("historycheck.search")}
                  className={`small-btn mx-auto d-block ${classes.history_btn}`}
                  onClick={onClickSearchBtn}
                  disabled={!vEnableSearchBtn}
                  id="search_button"
                />
              </Col>
            </Row>
          </Col>
  
          <Col
            lg="12"
            className={`mt-4 ${vShowTable ? "d-block" : "d-none"} ${classes.historycheck_table}`}
          >
            <div className="cmn-bg-box-inr">
              <h5 className="font-20 mb-3" style={browserRedirect()==3?{padding:'8px 0px 0px 2px'}:null}>ユーザー一覧</h5>
              <ThemeFilter f_getSelectedTheme={getSelectedTheme} vControlTheme={vControlTheme} setControlTheme={setControlTheme} vHasAngentCode={vHasAngentCode}/>
              <Row className="mt-4">
  
              <Col lg="12" className={classes.table_wrapper}>
                {
                  vHasAngentCode ? <div className={classes.themeTabPlacehoderbox}></div> :
                  <div className={`table-responsive ${classes.table_scroll}`}>
                    <table
                      className={`table text-center ${classes.cmn_table} ${classes.cmn_table_index}`}
                      id="history_table"
                      name="history_table"
                    >
                      <tbody className={classes.table_thead}>
                        <tr>
                          <td
                            rowSpan="2"
                            className={`align-middle ${classes.td_gray} ${classes.fixedLeft} ${vTableScenarioList.length!==1?classes.td_col_1_all:classes.td_col_1_filter_scenario}`}
                            style={{ width: "12%" }}
                            id="header_recruiter_name"
                            name="header_recruiter_name"
                          >
                            氏名
                          </td>
                          {vTableScenarioList &&
                            vTableScenarioList.map((item, key) => {
                              return (
                                <td
                                  className={`align-middle ${classes.td_gray}`}
                                  colSpan={tableScenarioSpan(key)}
                                  id="header_course_name"
                                  name="header_course_name"
                                  key={key}
                                  style={browserRedirect()===3?{height:'33px'}:null}
                                >
                                  {item?.scenario?.scenarioName} ({item?.themeName})
                                </td>
                              );
                            })}
                        </tr>
                        <tr
                          id="header_row_lesson_persona"
                          name="header_row_lesson_persona"
                        >
                          {vTableScenarioList &&
                            vTableScenarioList.map((item, key) => {
                              return (
                                item.scenario.lessonInfo &&
                                item.scenario.lessonInfo.map((item1, key1) => {
                                  return (
                                    <td
                                      key={key1}
                                      className={`
                                        border-left-0 
                                        ${classes.td_gray} 
                                        ${classes.not_sticky} 
                                        ${classes.header_th_min_width_mb} 
                                        ${vTableScenarioList.length!==2 ? vTableScenarioList.length ===1 ? classes.td_content_filter_scenario : classes.td_content_all : classes.td_content_filter_catergory}
                                      `}
                                      id={`header_lesson_persona_${key1 + 1}`}
                                      name={`header_lesson_persona_${key1 + 1}`}
                                      colSpan={1}
                                      style={browserRedirect()===3?{height:'59px'}:null}
                                    >
                                      {item1.persona}
                                    </td>
                                  );
                                })
                              );
                            })}
                        </tr>
                      </tbody>


                      <tbody
                        id="recruiter_list_table_body"
                        name="recruiter_list_table_body"
                        className={`${classes.table_scroll} ${classes.table_body}`}
                      >
                        {vThemeFilterLessonList ? (
                          vThemeFilterLessonList.map((item, index) => (
                            <tr
                              id={`data_row_${index + 1}`}
                              name={`data_row_${index + 1}`}
                              key={index}
                            >
                              <td
                                id={`user_name_${index + 1}`}
                                name={`user_name_${index + 1}`}
                                className={browserRedirect()!=1 ? browserRedirect()===3? classes.tablet_tr_user_tag : classes.mobile_tr_user_tag : classes.pc_tr_user_tag}
                              >
                                <Link
                                  to={{
                                    pathname: `/history-check-detail/${item.userId}`,
                                  }}
                                  className={classes.link_txt}
                                  onClick={()=>{
                                    storeActiveSidebarName();
                                    setLocationState({
                                      userId: item.userId,
                                      userName: item.userName,
                                      selectThemeCode: vThemeCode,
                                      selectScenarioCode: vScenarioCode,
                                      agentCode: document.getElementById(
                                        "agency_code_textbox"
                                      ).value,
                                    }, `history-check-detail/${item.userId}`);
                                  }}
                                >
                                  {item.userName}
                                </Link>
                              </td>
                              {console.log(item.personaResult)}
                              {item
                                ? item.personaResult.map((data, tdindex) => {
                                    return (
                                      <td
                                        key={tdindex}
                                        className={`${shiftColor(
                                          data.personaStatus
                                        )} `}
                                        id={`status_${index + 1}${tdindex + 1}`}
                                        name={`status_${index + 1}${tdindex + 1}`}
                                      >
                                        {shiftText(data.personaStatus)}
                                      </td>
                                    );
                                  })
                                : ""}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <th>Loading...</th>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                }
              </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </>}
    />
  );
}

const stateToProps = (state) => {
  return {
    history_task_all: state.history_task_all,
    login_task_all: state.login_task_all,
    mst_user_info: state.cacheMstUserInfo,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    historyTaskAll: (history_task_all) => {
      dispatch(historyTaskAll(history_task_all));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(HistoryCheck);
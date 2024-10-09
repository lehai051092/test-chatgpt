import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { BrowserRouter as Router, Link } from "react-router-dom";

import GeneralTextbox from "../../../constituents/ITextboxes/GeneralTextbox02";
import HistoryButton from "../../../constituents/IButton/HistoryButton";

import { useTranslation } from "react-i18next";
import classes from "./styles.module.css";
import {
  getDeptCodeHistory,
  getDeptCodeDepartment,
} from "../../../request/backendApi/api";
import { connect } from "react-redux";
import { historyTaskAll } from "../../../storage/reduxActions/index";
import { useLocation } from "react-router-dom";
import ErrorMessage from "../../../constituents/IErrorMessage/index";
import ErrorMsgApi from "../../../constituents/IErrorMessage/ErrorMsgApi";
import store from "../../../storage";
import ThemeFilter from "./ThemeFilter";
import SamplePersonaData from "./SamplePersonaData.json";
import LoadingText from "../../../constituents/ILoadingText";
import { UPDATE_SIDEBAR_ACTIVE_NAME } from "../../../storage/consts";
import ICoreFrame from "../../../constituents/ICoreFrame";
import { browserRedirect, setLocationState } from '../../../utils/util';


function AfMemberFreeStory(props) {
  const { t } = useTranslation();

  const location = useLocation();
  const [vShowTable, setShowTable] = useState(false);

  const [vThemeFilterHistoryList, setThemeFilterHistoryList] = useState([]);
  const [vHistoryList, setHistoryList] = useState([]);

  const [vLessonList, setLessonList] = useState([]);
  const [vThemeFilterLessonList, setThemeFilterLessonList] = useState([]);
  const [vResponseError, setResponseError] = useState(false);
  const [vAgentShowError, setAgentShowError] = useState(false);
  const [vInputAgentErrorMes, setInputAgentErrorMes] = useState("");
  const [vErrorMessage, setErrorMessage] = useState();
  const [vThemeCode, setThemeCode] = useState(null);
  const [vScenarioCode, setScenarioCode] = useState(null);
  const [vTableScenarioList, setTableScenarioList] = useState([]);
  const [vHasAngentCode, setHasAngentCode] = useState(false);

  const [vControlTheme, setControlTheme] = useState(false);
  const [vDeptCode, setDeptCode] = useState("");
  const [vDeptSectionName, setDeptSectionName] = useState(null);
  const [vDeptDepartmentName, setDeptDepartmentName] = useState(null);
  const [vShowTbodyTable, setShowTbodyTable] = useState(false);

  useEffect(() => {
    //check special agent code
    let ASCodeList = store.getState().special_AS_code_cache;
    // console.log('special AS codes: <br>' + JSON.stringify(ASCodeList));
    if (ASCodeList && ASCodeList.length != 0) {
      let userAgentCode = store.getState().login_task_all?.agentCode?.value;
      let userRole = store.getState().login_task_all.userRoles[0];
      if (userRole == "GENERAL_USER" || userRole == "EVALUATOR") {
        if (userAgentCode && userAgentCode.length == 10) {
          if (
            ASCodeList.find((code) => code == userAgentCode.substring(0, 7)) ==
            undefined
          ) {
            setHasAngentCode(true);
          }
        }
      }
    }
  }, []);

  const getCallHistoryDeptHistory = (url) => {
    setShowTbodyTable(true);
    // let url = vDeptCode != "" ? (deptCodeValidate(vDeptCode) ? `/free/history?deptCode=${vDeptCode.substring(2, 8)}` : `/free/history`) : `/free/history`
    getDeptCodeHistory(url).then((res) => {
      let resData = res.data;
      // let resData = SamplePersonaData;
      if (vTableScenarioList.length > 0) {
        let personSort = [];

        vTableScenarioList.map((item, index) => {
          item.scenario.lessonInfo.map((item1, index1) => {
            personSort.push(item1.personaId);
          });
        });

        resData.personaResult.map((item, index) => {
          item.personaResult.sort(
            (a, b) =>
              personSort.indexOf(a.personaDisplayNumber) - personSort.indexOf(b.personaDisplayNumber)
          );
        });
        resData.persona.sort(
          (a, b) =>
            personSort.indexOf(a.personaDisplayNumber) - personSort.indexOf(b.personaDisplayNumber)
        );
      }

      setHistoryList(resData);
      setLessonList(resData.personaResult);
      setThemeFilterHistoryList(resData);
      setThemeFilterLessonList(resData.personaResult)
      //default
      // let personaThemeFilter = resData?.persona.filter(
      //   (item) =>
      //     item.personaTheme == item.personaScenario == "income"
      // );
      // let personaResultArray = [];
      // resData.personaResult.map((item, key) => {
      //   let personaResultThemeFilterIndex = item?.personaResult.filter(
      //     (item2) =>
      //       item2.personaTheme == "proposal" &&
      //       item2.personaScenario == "income"
      //   );
      //   let pushArray = {
      //     personaResult: personaResultThemeFilterIndex,
      //     userId: item.userId,
      //     userName: item.userName,
      //     deptNameAbbr: item.deptNameAbbr,
      //   };
      //   personaResultArray.push(pushArray);
      // });

      // setThemeFilterHistoryList({
      //   persona: personaThemeFilter,
      // });
      // setThemeFilterLessonList(personaResultArray);
      //themefilter
      // setThemeFilterHistoryList(resData);
      // setThemeFilterLessonList(resData.personaResult);
      //themefilter
      props.historyTaskAll(resData);
      if (resData.persona.length >= 1) {
        setShowTable(true);
      }
      setShowTbodyTable(false);
    });
  };

  const onClickSearchBtn = () => {
    setControlTheme(true);
    if (
      vDeptCode.length != 0 &&
      (vDeptCode.length < 5 || vDeptCode.length > 5)
    ) {
      setAgentShowError(true);
      setInputAgentErrorMes("該当の部門コードはありません");
      setDeptSectionName(null);
      setDeptDepartmentName(null);
      return false;
    }
    if (vDeptCode && vDeptCode.length == 5) {
      getDeptCodeName().then((res) => {
        if (res) {
          getCallHistoryDeptHistory(`/free/history?deptCode=${vDeptCode}`);
        }
      });
    } else if (vDeptCode.length == 0) {
      getCallHistoryDeptHistory(`/free/history`);
    }
  };

  const getDeptCodeName = async () => {
    if (deptCodeValidate(vDeptCode)) {
      const res = await getDeptCodeDepartment(vDeptCode);
      if (res.data.errorCode == "400") {
        setAgentShowError(true);
        setInputAgentErrorMes("該当の部門コードはありません");
        setDeptSectionName(null);
        setDeptDepartmentName(null);
        return false;
      } else {
        setDeptSectionName(res.data.sectionName);
        setDeptDepartmentName(res.data.departmentName);
        setAgentShowError(false);
        setInputAgentErrorMes(null);
        return true;
      }
    }
  };

  const deptCodeValidate = (inputText) => {
    let isNumCheck = isNaN(inputText);
    if (isNumCheck) {
      setAgentShowError(true);
      setInputAgentErrorMes("該当の部門コードはありません");
      return false;
    } else {
      setAgentShowError(false);
      setInputAgentErrorMes(null);
      return true;
    }
  };

  const onInputAgentCodeChange = (event) => {
    let inputText = event.target.value;
    event.target.validity.valid
      ? setDeptCode(inputText)
      : setDeptCode(vDeptCode);
    // deptCodeValidate(inputText)
    if (event.target.validity.valid && deptCodeValidate(inputText)) {
      if (inputText.length == 5) {
        getDeptCodeDepartment(inputText).then((res) => {
          if (res.data.errorCode == "400") {
            setAgentShowError(true);
            setInputAgentErrorMes("該当の部門コードはありません");
            setDeptSectionName(null);
            setDeptDepartmentName(null);
            return false;
          } else {
            setDeptSectionName(res.data.sectionName);
            setDeptDepartmentName(res.data.departmentName);
            setAgentShowError(false);
            setInputAgentErrorMes(null);
            return true;
          }
        });
      } else {
        setAgentShowError(false);
        setInputAgentErrorMes(null);
        setDeptSectionName(null);
        setDeptDepartmentName(null);
      }
    }
  };

  const shiftColor = (status) => {
    if (status == "FINISHED") {
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

  const getSelectedTheme = (themeCode, scenarioCode, scenario) => {
    console.log('scenario',scenario);
    let scenarioFilter = scenario.filter(
      (item) => item.scenario.lessonInfo.length > 0
    );
    setTableScenarioList(scenarioFilter);

    setThemeCode(themeCode);
    setScenarioCode(scenarioCode);

    //theme filter
    if (themeCode == null && scenarioCode == null) {
      setThemeFilterHistoryList(vHistoryList);
      setThemeFilterLessonList(vLessonList);
      return true;
    }
    console.log('scenario',scenario);
    if (scenarioCode == null) {
      let onlyPersonaThemeFilter = vHistoryList?.persona.filter(
        (item) => item.personaTheme == themeCode
      );

      let OnlyThemePersonaResultArray = [];
      vLessonList.map((item, key) => {
        let personaResultThemeFilterIndex = item?.personaResult.filter(
          (item2) => item2.personaTheme == themeCode
        );
        let pushArray = {
          personaResult: personaResultThemeFilterIndex,
          userId: item.userId,
          userName: item.userName,
          deptNameAbbr: item.deptNameAbbr,
        };
        OnlyThemePersonaResultArray.push(pushArray);
      });

      setThemeFilterHistoryList({
        persona: onlyPersonaThemeFilter,
      });
      setThemeFilterLessonList(OnlyThemePersonaResultArray);
      return true;
    } else {
      let personaThemeFilter = vHistoryList?.persona.filter(
        (item) =>
          item.personaTheme == themeCode && item.personaScenario == scenarioCode
      );
      let personaResultArray = [];
      vLessonList.map((item, key) => {
        let personaResultThemeFilterIndex = item?.personaResult.filter(
          (item2) =>
            item2.personaTheme == themeCode &&
            item2.personaScenario == scenarioCode
        );
        let pushArray = {
          personaResult: personaResultThemeFilterIndex,
          userId: item.userId,
          userName: item.userName,
          deptNameAbbr: item.deptNameAbbr,
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
    store.dispatch({
      type: UPDATE_SIDEBAR_ACTIVE_NAME,
      sidebar_active_name: "manage",
    });
  };

  return (
    <ICoreFrame
      component={
        <>
          {vResponseError == true && (
            <ErrorMsgApi message={vErrorMessage && vErrorMessage} />
          )}
          {vShowTbodyTable && <LoadingText text="読み込み中....." />}
          <div className={browserRedirect()!=1 ? browserRedirect() === 3 ? classes.tablet_view : classes.mobile_view :  classes.pc_view}>

            <Row>
              <Col>
                <h3
                  id="manager_screen"
                  name="manager_screen"
                  className={`mb-32 pb-2 ${classes.title_text}`}
                >
                  社員の履歴
                </h3>
              </Col>
            </Row>

            <Row >

              <Col lg="12">

                <Row className={classes.input_row}>
                  <Col xs="12" className={classes.input_col_wrapper}>
                    <label
                      className="font-16 font-weight-bold"
                      id="agency_code"
                      name="agency_code"
                    >
                      部門コード
                    </label>
                  </Col>
                  <Col lg="12" className={`d-flex align-items-center ${classes.input_wrapper}`}>
                    <GeneralTextbox
                      placeholder={"部門コードを入力"}
                      onChange={onInputAgentCodeChange}
                      id="agency_code_textbox"
                      name="agency_code_textbox"
                      icon={vAgentShowError == true ? "show" : ""}
                      className={`${
                        vAgentShowError == true ? "border_danger" : ""
                      } ${classes.history_txt_box}`}
                      pattern="[0-9]*"
                      text={vDeptCode}
                      inputtype="text"
                      maxlength={5}
                    />

                    <p
                      id="company_name"
                      name="company_name"
                      className={`mt-2 font-16 font-weight-bold ml-3 ${classes.input_search_text}`}
                    >
                      <span>{vDeptDepartmentName}</span>
                      <span>{vDeptSectionName}</span>
                    </p>
                  </Col>
                </Row>

                <div>
                  {vAgentShowError == true && (
                    <ErrorMessage message={vInputAgentErrorMes} />
                  )}
                </div>

                <Row className="mt-4">
                  <Col xs="12" className={`text-left mt-3 mb-4 ${classes.search_btn_wrapper}`}>
                    <HistoryButton
                      title={t("historycheck.search")}
                      className={`small-btn ${classes.history_btn}`}
                      onClick={onClickSearchBtn}
                      disabled={vAgentShowError? true : false}
                      // disabled={(vDeptCode === "" || vAgentShowError) ? true : false}
                      id="search_button"
                    />
                  </Col>
                </Row>

              </Col>

              <Col
                lg="12"
                className={`mt-4 ${vShowTable ? "d-block" : "d-none"} ${classes.tablet_table}`}
              >
                <div className={`cmn-bg-box ${classes.cm_bg_box_padding}`}>
                  <h5 className="font-20 mb-3">ユーザー一覧</h5>
                  <ThemeFilter
                    f_getSelectedTheme={getSelectedTheme}
                    vControlTheme={vControlTheme}
                    setControlTheme={setControlTheme}
                    vHasAngentCode={vHasAngentCode}
                  />
                  <Row className="mt-4">
                    <Col lg="12" className="">
                      {vHasAngentCode ? (
                        <div className={classes.themeTabPlacehoderbox}></div>
                      ) : (
                        <div
                          className={`table-responsive ${classes.table_scroll}`}
                        >
                          <table
                            className={`table text-center ${classes.cmn_table} ${browserRedirect()===1&&classes.cmn_table_pc}`}
                            id="history_table"
                            name="history_table"
                          >
                            <thead className={classes.table_thead}>
                              <tr id="header_row" name="header_row">
                                <th
                                  rowSpan="2"
                                  className={`
                                    align-middle 
                                    z-index-10 
                                    ${classes.td_gray} 
                                    ${classes.fixedLeft} 
                                    ${vTableScenarioList.length===1?`${classes.col_1_2_width_selected}`:`${classes.col_1_2_width} ${classes.col_1_2_text_wrap}`}
                                  `}
                                  style={{ width: "12%" }}
                                  id="header_depth_name"
                                  name="header_depth_name"
                                >
                                  部門名 (略語)
                                </th>
                                <th
                                  rowSpan="2"
                                  className={`
                                    align-middle 
                                    ${classes.td_gray} 
                                    ${classes.fixedLeft} 
                                    ${vTableScenarioList.length===1?`${classes.col_1_2_width_selected} ${classes.col_2_left_selected}`:`${classes.col_1_2_width} ${classes.col_2_left}`}
                                  `}
                                  style={{ width: "12%" }}
                                  id="header_recruiter_name"
                                  name="header_recruiter_name"
                                >
                                  氏名
                                </th>
                                {vTableScenarioList &&
                                  vTableScenarioList.map((item, key) => {
                                    return (
                                      <th
                                        className={`align-middle ${classes.td_gray} ${classes.td_group_header} ${classes.thead_tr_1_th_height_tablet}`}
                                        colSpan={tableScenarioSpan(key)}
                                        id="header_course_name"
                                        name="header_course_name"
                                        key={key}
                                      >
                                        {item?.scenario?.scenarioName} (
                                        {item?.themeName})
                                      </th>
                                    );
                                  })}
                              </tr>
                              <tr
                                id="header_row_lesson_persona"
                                name="header_row_lesson_persona"
                                className={classes.tb_scenario_header}
                              >
                                {vTableScenarioList &&
                                  vTableScenarioList.map((item, key) => {
                                    return (
                                      item.scenario.lessonInfo &&
                                      item.scenario.lessonInfo.map(
                                        (item1, key1) => {
                                          return (
                                            <th
                                              key={key1}
                                              className={`border-left-0 ${classes.td_gray} ${vTableScenarioList.length===1?`${classes.col_content_width_selected}`:`${classes.col_content_width}`} ${classes.thead_tr_2_th_height_tablet}`}
                                              id={`header_lesson_persona_${
                                                key1 + 1
                                              }`}
                                              name={`header_lesson_persona_${
                                                key1 + 1
                                              }`}
                                              colSpan={1}
                                            >
                                              {item1.persona}
                                            </th>
                                          );
                                        }
                                      )
                                    );
                                  })}
                              </tr>
                            </thead>
                            <tbody
                              id="recruiter_list_table_body"
                              name="recruiter_list_table_body"
                              className={`${classes.table_scroll} ${classes.table_body}`}
                            >
                              {vThemeFilterLessonList ? (
                                vThemeFilterLessonList.map((item, index) => (
                                  <tr
                                    className={classes.table_tbody_tr_height}
                                    id={`data_row_${index + 1}`}
                                    name={`data_row_${index + 1}`}
                                    key={index}
                                  >
                                    <td
                                      id={`user_name_${index + 1}`}
                                      name={`user_name_${index + 1}`}
                                      className={`
                                        ${browserRedirect()!=1 ? classes.mobile_tr_user_tag : classes.pc_tr_user_tag}
                                        ${vTableScenarioList.length===1&&classes.col_1_2_width_selected}
                                        ${classes.col_1_2_text_wrap}
                                        ${classes.td_bg_gray}
                                      `}
                                    >
                                      {item.deptNameAbbr}
                                    </td>
                                    <td
                                      id={`user_name_${index + 1}`}
                                      name={`user_name_${index + 1}`}
                                      className={`
                                        ${classes.td_bg_gray}
                                        ${vTableScenarioList.length===1?`${classes.col_1_2_width_selected} ${classes.col_2_left_selected}`:`${classes.col_1_2_width} ${classes.col_2_left}`}
                                        ${classes.col_1_2_text_wrap}
                                      `}
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
                                            isFreeStory: true,
                                            selectThemeCode: vThemeCode,
                                            selectScenarioCode: vScenarioCode,
                                          }, `history-check-detail/${item.userId}`)
                                        }}
                                      >
                                        {item.userName}
                                      </Link>
                                    </td>
                                    {item? item.personaResult.sort((a, b) => a.personaDisplayNumber - b.personaDisplayNumber).map(
                                          (data, tdindex) => {
                                            return (
                                              <td
                                                key={tdindex}
                                                className={`
                                                  ${shiftColor(data.personaStatus)} 
                                                  ${tdindex === item.personaResult.length-1 ? classes.mobile_tr_end_tag : ''}
                                                  ${tdindex === 0 && classes.tablet_tr_start_tag}
                                                  ${vTableScenarioList.length===1?`${classes.col_content_width_selected}`:`${classes.col_content_width}`}
                                                `}
                                                id={`status_${index + 1}${
                                                  tdindex + 1
                                                }`}
                                                name={`status_${index + 1}${
                                                  tdindex + 1
                                                }`}
                                              >
                                                {shiftText(data.personaStatus)}
                                              </td>
                                            );
                                          }
                                        )
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
                      )}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
        </>
      }
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

export default connect(stateToProps, dispatchToProps)(AfMemberFreeStory);

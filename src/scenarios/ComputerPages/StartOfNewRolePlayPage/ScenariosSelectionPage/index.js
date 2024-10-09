import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col } from "reactstrap";
import BackButton from "../../../../constituents/IButton/BackButton";
import GeneralButton from "../../../../constituents/IButton/GeneralButton";
import { getLessonInfo, getLessonTask } from "../../../../request/backendApi/api";

import classes from "./styles.module.css";
import { connect } from "react-redux";
import RolePlayCard from "../../../../constituents/ICard/RolePlayCard";
import { BrowserRouter as Router, useHistory, useLocation } from "react-router-dom";
import { lessonTaskAll } from "../../../../storage/reduxActions/index";

import goalStartImg from "../../../../property/images/roleplay_card/goal_start.svg";
import goalEndUnFillImg from "../../../../property/images/roleplay_card/goal_end_unfill.svg";
import goalEndFillImg from "../../../../property/images/roleplay_card/goal_end_fill.svg";
import goalFIllImg from "../../../../property/images/roleplay_card/goal_fill.svg";
import goalUnFIllImg from "../../../../property/images/roleplay_card/goal_unfill.svg";
import LoadingText from "../../../../constituents/ILoadingText";
import { browserRedirect, getLocationState, setLocationState } from '../../../../utils/util';
import getGifImage from "../../../../utils/newMapFIle";

const ScenariosSelectionPage = ({
  onBack,
  showStep2,
  lessonId,
  lessonTaskAll,
  customerData
}) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [vProgress, setProgress] = useState(0);
  const [vLoading, setLoading] = useState(true);
  const [vPersonaProgress, setPersonaProgress] = useState();
  const [vSuccessTaskCount, setSuccessTaskCount] = useState(0);
  const [vGoalCount, setGoalCount] = useState(0);
  const [vLessonInfo, setLessonInfo] = useState(null);
  const [vCustomerData, setCustomerData] = useState();
  const [vIsVertical, setIsVertical] = useState(true);

  const getGif = async(avatarkey, emotionKey = null) => {
    if(!avatarkey)
    {
      return false;
    }
    let img = await getGifImage(avatarkey, emotionKey)
    setPersonaProgress(img)
  }


  useEffect(() => {

    if(!lessonId)
    {
      goBack()
    }
    const state = getLocationState();
    setCustomerData(customerData ?? state?.selectPersona)
    getLessonInfo(`/tasks/lesson/${lessonId}`).then((res) => {
      setLessonInfo(res.data);
      setGoalCount(res.data?.lessonSectionCount - 1)
      setSuccessTaskCount(res.data?.lessonSectionClearCount);

      let progress = res.data?.lessonProgress * 100;

      setProgress(progress.toFixed(0))

      if (progress < 100) {
        getGif(res.data.lessonAvatar, 'Section_Selection')
      } else {
        getGif(res.data.lessonAvatar, 'Section_Selection_Animated')
      }

      setLoading(false);
    });
  }, [showStep2]);

  useEffect(() => {
    window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function () {
      if (window.orientation === 180 || window.orientation === 0) {
          setIsVertical(true);
      }
      if ((window.orientation === 90 || window.orientation === -90)) {
          setIsVertical(false);
      }
    }, false);

    if (window.orientation === 180 || window.orientation === 0) {
        setIsVertical(true);
    } else if ((window.orientation === 90 || window.orientation === -90)) {
        setIsVertical(false);
    }
  },[]);

  const goBack = () => {
    onBack(true);
  };

  const dialogus = () => {
    if (vProgress) {
      if (vProgress < 14) {
        return "さあ始めよう！";
      } else if (vProgress >= 14 && vProgress < 29) {
        return "今日もがんばろう！";
      } else if (vProgress >= 29 && vProgress < 43) {
        return "これからこれから！";
      } else if (vProgress >= 43 && vProgress < 57) {
        return "あと少しで折り返しだよ！";
      } else if (vProgress >= 57 && vProgress < 71) {
        return "さあ後半戦！今日もがんばろう！";
      } else if (vProgress >= 71 && vProgress < 86) {
        return "よくやったね！あと少し！";
      } else if (vProgress >= 86 && vProgress < 100) {
        return "ゴールまでもう少し！";
      } else if (vProgress >= 100) {
        return "おめでとう！";
      }
    } else {
      return "さあ始めよう！";
    }
  };

  const getDiffGoalCountStyle = (count) => {
      if(count === 0){
        if(browserRedirect() === 1){
          return classes.rogressbar_one_goal_ul_pc;
        }else if(browserRedirect() === 2){
          return classes.rogressbar_one_goal_ul_mb;
        }else if(browserRedirect() === 3){
          if(vIsVertical){
            return classes.rogressbar_one_goal_ul_tb;
          }else{
            return classes.rogressbar_one_goal_ul_tb_landscape;
          }
        }
      }else if(count === 1){
        if(browserRedirect() === 1){
          return classes.rogressbar_two_goals_ul_pc;
        }else if(browserRedirect() === 2 && !vIsVertical){
          return classes.rogressbar_two_goals_ul_mb_landscape;
        }else if(browserRedirect() === 3){
          if(vIsVertical){
            return classes.rogressbar_two_goals_ul_tb;
          }else{
            return classes.rogressbar_two_goals_ul_tb_landscape;
          }
        }
      }else if(count === 2){
        if(browserRedirect() === 1){
          return classes.rogressbar_three_goals_ul_pc;
        }else if(browserRedirect() === 2 && !vIsVertical){
          return classes.rogressbar_three_goals_ul_mb_landscape;
        }else if(browserRedirect() === 3){
          return classes.rogressbar_three_goals_ul_tb;
        }
      }else if(count === 3){
        if(browserRedirect() === 1){
          return classes.rogressbar_four_goals_ul_pc;
        }else if(browserRedirect() === 2 && !vIsVertical){
          return classes.rogressbar_four_goals_ul_mb_landscape;
        }else if(browserRedirect() === 3){
          return classes.rogressbar_four_goals_ul_tb;
        }
      }else if(count === 4){
        if(browserRedirect() === 2 && !vIsVertical){
          return classes.rogressbar_five_goals_ul_mb_landscape;
        }
      }
  }


  const clickAllScenario = () => {
    getLessonTask(`lessons/${lessonId}/tasks`).then((res) => {
      let taskSort = res.data.sort(
        (a, b) => a.displayNumber - b.displayNumber
      );

      lessonTaskAll(taskSort);

      setLocationState(taskSort, `rate-of-risk/multiple-scenarios/${lessonId}`);
      history.push({
        pathname: `/rate-of-risk/multiple-scenarios/${lessonId}`,
      });
    })
  };

  return (
    <>
      {vLoading ? <LoadingText text="読み込み中....." /> : ""}
      <div>
        <div className={`${browserRedirect()!=1 ? '' : 'd-flex'} ${classes.themename_container_flex}`}>
          {
            // only pc
            browserRedirect() === 1 ?
            <div>
              <BackButton
                title={t('scenario.return')}
                className={`mr-4 mt-2 ${classes.btn_font_adjust}`}
                onClick={goBack}
              />
            </div>:
            <></>
          }
          {
            // not tablet
            browserRedirect()!= 3 ?
              <>
                <div className={`${browserRedirect()===2 ? '' : 'mr-3'} ${classes.themename_container}`}>
                  <span className={`mr-2 ${classes.themename_container_span_child1}`}>{vLessonInfo?.lessonTheme}</span>
                  <span className={`${classes.themename_container_span_child1}`}>{vLessonInfo?.lessonScenario}</span>
                  <br/>
                  <span className={`${classes.themename_container_span_child2}`}>{vLessonInfo?.lessonPersona}</span>
                </div>
                <div className={classes.themename_wrapper}>
                  <span>セクションの選択をしましょう!</span>
                </div>
              </>
              :
              // tablet
              <>
                <div className={classes.tablet_themename_container}>
                  <span>{vLessonInfo?.lessonTheme}</span>
                  <span>{vLessonInfo?.lessonScenario}</span>
                  <span>{vLessonInfo?.lessonPersona}</span>
                  <span>セクションの選択をしましょう!</span>
                </div>
              </>
          }
          
        </div>
        <div className={`cmn-bg-box-inr ${browserRedirect()!=1 ? '' : 'p-32'} mb-3`}>
          <Row>
            <Col xl="12" className="pt-0">
              <Row className="mb-4 align-items-end mt-4 mt-xl-0">
                <Col
                  xl="8"
                  className={`position-relative d-flex align-items-end mb-3 mb-xl-0 ${classes.clear_p_m}`}
                >
                  {
                    !vLoading ?
                      <div className={`${classes.rp_progressbar} w-100 ${browserRedirect() === 1 ? classes.progressbar_pc : browserRedirect() === 3 ? classes.progressbar_tablet : classes.progressbar_mobile}`}
                        style={{
                          left: `${browserRedirect() === 2 ? (
                                    vGoalCount > 7 ? `${(115 - 10 * vGoalCount) + 'px'}` : (
                                      vGoalCount === 0 ? '62px' :
                                        vGoalCount === 1 ? '37px' :
                                          vGoalCount === 2 ? '24px' :
                                            vGoalCount === 3 ? '16px' :
                                              vGoalCount === 4 ? '11px' :
                                                vGoalCount === 5 ? '8px' :
                                                  vGoalCount === 6 ? '4px' :
                                                    vGoalCount === 7 ? '30px' : '2px'
                                    )
                                  ) : browserRedirect() === 3 ? (vGoalCount > 6 ? `${6 * (vGoalCount - 2)}px` : 0) 
                                  : 0}`
                        }}
                      >
                        <ul className={`list-unstyled clearfix ${getDiffGoalCountStyle(vGoalCount)} `}>
                          <li
                            className={`
                              ${vSuccessTaskCount >= 1 ? classes.prog_active : classes.prog_unactive}
                              ${
                                browserRedirect() ===1 ? (`${vGoalCount > 6 ? (vGoalCount % 2 === 0 ? classes.prog_exceed7_start_active_short : classes.prog_exceed7_start_active) : vGoalCount===0 ? classes.one_goal_start_pc : null}`)
                                : 
                                browserRedirect() ===2 ? (`${vGoalCount > 6 ? (vGoalCount % 2 === 0 ? classes.prog_exceed7_start_active_short : classes.prog_exceed7_start_active) : vGoalCount===0 ? classes.one_goal_start_mb : null}`)
                                :
                                (`${vGoalCount > 6 ? vGoalCount % 2 === 0 ? classes.prog_exceed7_start_horizontal_tablet : classes.prog_exceed7_start_diagonal_tablet : vGoalCount===0 ? classes.one_goal_start_tablet : null}`)
                              }
                            `}
                          >
                            {vSuccessTaskCount == 0 && (
                              <>
                                <img
                                  src={vPersonaProgress}
                                  className={classes.v_person_icon_1}
                                />
                                <p
                                  className={classes.progress_bar_msg}
                                  name="progress_text"
                                >
                                  {dialogus()}
                                </p>
                              </>
                            )}
                            <img src={goalStartImg} className={classes.start_png} />
                          </li>
                          {Array.from(Array(vGoalCount), (e, i) => {
                            return (
                              <li
                                className={`
                                  ${vSuccessTaskCount >= i + 2 ? classes.prog_active : classes.prog_unactive} 
                                  ${browserRedirect() !==3 ?
                                    (`${vGoalCount > 6 ? (
                                        vGoalCount % 2 === 0 ? (
                                          i % 2 === 0 ? classes.prog_exceed7_odd_active : classes.prog_exceed7_even_active
                                        ) : (
                                          i % 2 === 0 ? classes.prog_exceed7_even_active : classes.prog_exceed7_odd_active
                                        )
                                      ) : ''}
                                      ${vGoalCount > 6 ? (i === vGoalCount - 1 ? (vGoalCount % 2 === 0 ? classes.prog_exceed7_last_even_active : classes.prog_exceed7_last_odd_active) : '') : ''}
                                    `)
                                    : //tablet_view
                                    (`${vGoalCount > 6 ? 
                                        (vGoalCount % 2 === 0 ?
                                          (i % 2 === 0 ? classes.prog_exceed7_odd_tablet : classes.prog_exceed7_even_tablet)
                                          :
                                          (i % 2 === 0 ? classes.prog_exceed7_even_tablet : classes.prog_exceed7_odd_tablet)
                                        ) 
                                        : null}
                                      ${vGoalCount > 6 && i === vGoalCount - 1 && i % 2 !== 0 && classes.prog_exceed7_last_even_tablet}
                                    `)}
                                  `}
                                key={i}
                                id={i}
                                style={{
                                  top: `${browserRedirect() === 2 ? 
                                          (vGoalCount > 6 ? (vGoalCount % 2 === 0 ? (i % 2 === 0 ? 0 : '-18px') : (i % 2 === 0 ? '-18px' : 0)) : 0) 
                                          : 
                                          browserRedirect() === 3 ?
                                          (vGoalCount > 6 ? (vGoalCount % 2 === 0 ? (i % 2 === 0 ? 0 : '-40px') : (i % 2 === 0 ? '-40px' : 0)) : 0)
                                          : 0}`,
                                  left: `${browserRedirect() === 2 ? 
                                          (vGoalCount > 6 ? (i === 0 ? '5px' : `${(-10 * i + 5) + 'px'}`) : 0) 
                                          :
                                          browserRedirect() === 3 ?
                                          (vGoalCount > 6 ? (i === 0 ? '6px' : `${(-12 * i + 6) + 'px'}`) : 0) 
                                          : 0}`,
                                }}
                              >
                                {vSuccessTaskCount == i + 1 && (
                                  <>
                                    <img
                                      src={vPersonaProgress}
                                      className={classes.v_person_icon_1}
                                    />
                                    <p
                                      className={`${classes.progress_bar_msg} ${i > parseInt(Array.from(Array(vGoalCount)).length / 2) ? classes.progress_bar_msg_half_end : ''}`}
                                      name="progress_text"
                                    >
                                      {dialogus()}
                                    </p>
                                  </>
                                )}
                                <img
                                  src={
                                    vSuccessTaskCount >= i + 1
                                      ? goalFIllImg
                                      : goalUnFIllImg
                                  }
                                  className={classes.goal_png}
                                />
                              </li>
                            );
                          })}
                          <li 
                            className={`
                                ${classes.prog_goal} 
                                ${browserRedirect() === 3 && vGoalCount > 6 && vGoalCount % 2 === 0 && classes.prog_goal_horizontal}
                                ${vGoalCount === 0 ? browserRedirect() === 1 ? classes.one_goal_end_pc : browserRedirect() === 2 ? classes.one_goal_end_mb : classes.one_goal_end_tb : null}
                            `}
                            style={{
                              left: `${
                                      browserRedirect() === 2 ? (vGoalCount <= 6 ? 0 : `${(-10 * (vGoalCount - 2)) + 'px'}`) : 
                                      browserRedirect() === 3 ? (vGoalCount > 6 ? `${(-10 * (vGoalCount - 2)) + 'px'}` : 0) : 
                                      0}`,
                              top: `${
                                      browserRedirect() === 2 ? (vGoalCount > 6 ? (vGoalCount % 2 === 0 ? '-15px' : 0) : 0) : 
                                      browserRedirect() === 3 ? (vGoalCount > 6 && vGoalCount % 2 === 0 ? '-30px' : 0) : 
                                      0}`,
                            }}
                          >
                            {vSuccessTaskCount > vGoalCount && (
                              <>
                                <img
                                  src={vPersonaProgress}
                                  className={classes.v_person_icon_end}
                                />
                                <p
                                  className={`${classes.progress_bar_msg} ${classes.progress_bar_msg_end} ${browserRedirect() === 3 && classes.progress_bar_msg_end_tablet}`}
                                  id="progress_text"
                                  name="progress_text"
                                >
                                  {dialogus()}
                                </p>
                              </>
                            )}
                            <img
                              src={
                                vSuccessTaskCount > vGoalCount
                                  ? goalEndFillImg
                                  : goalEndUnFillImg
                              }
                              className={classes.end_png}
                            />
                          </li>
                        </ul>
                      </div>
                      : 'loading.....'
                  }
                </Col>
                <Col xl="4" className={`${classes.pd0}`}>
                  <table
                    className={`table mb-0 ${classes.roleplay_step2_tb} ${browserRedirect() === 3 ? classes.roleplay_step2_tb_tablet : null}`}
                    id="progress_table"
                    name="progress_table"
                  >
                    <tbody>
                      <tr className="text-center">
                        <td
                          className="font-weight-bold font-16 text-center"
                          id="precision_percent_title"
                          name="precision_percent_title"
                        >
                          進捗率
                        </td>
                        <td
                          className="font-weight-bold font-16 text-center"
                          id="precision_percent"
                          name="precision_percent"
                        >
                          <span
                            className="ml-2 font-weight-bold font-16"
                            id="star_count"
                            name="star_count"
                          >
                            {vProgress}%(<span className={classes.fix}>{vSuccessTaskCount}/{vGoalCount + 1}</span>
                            &nbsp;セクション)
                          </span>
                        </td>
                       {browserRedirect()==3 ? 
                        <><td
                            className="font-weight-bold font-16 text-center"
                            id="progress_table_td_2"
                            name="progress_table_td_2"
                          >
                            総プレイ時間
                          </td>
                          <td id="progress_table_td_2" name="progress_table_td_2">
                            <span
                              className="ml-2 font-weight-bold font-16"
                              id="star_count"
                              name="star_count"
                            >
                              {vLessonInfo?.lessonExecutionDuration}
                            </span>
                          </td></> : null}
                      </tr>
                      <tr
                        id="progress_table_tr_2"
                        name="progress_table_tr_2"
                        className="text-center"
                      >
                        <td
                          className="font-weight-bold font-16 text-center"
                          id="progress_table_td_2_title"
                          name="progress_table_td_2_title"
                        >
                          総プレイ回数
                        </td>
                        <td id="progress_table_td_2" name="progress_table_td_2">
                            <span
                              className="ml-2 font-weight-bold font-16"
                              id="star_count"
                              name="star_count"
                            >
                              {vLessonInfo?.lessonExecutionCount}回
                            </span>
                          </td>
                        { browserRedirect()==3 ? 
                          <><td
                            className="font-weight-bold font-16 text-center"
                            id="progress_table_td_3"
                            name="progress_table_td_3"
                          >
                              習熟度
                            </td><td id="progress_table_td_3" name="progress_table_td_3">
                              <span
                                className="ml-2 font-weight-bold font-16"
                                id="proficiency_level"
                                name="proficiency_level"
                              >
                                {(Number(vLessonInfo?.lessonExecutionProficiency)*100).toFixed(0)}%
                              </span>
                            </td></> : null }
                      </tr>
                      {browserRedirect()!==3 ? <tr
                        id="progress_table_tr_2"
                        name="progress_table_tr_2"
                        className="text-center"
                      >
                        <td
                          className="font-weight-bold font-16 text-center"
                          id="progress_table_td_2"
                          name="progress_table_td_2"
                        >
                          総プレイ時間
                        </td>
                        <td id="progress_table_td_2" name="progress_table_td_2">
                          <span
                            className="ml-2 font-weight-bold font-16"
                            id="star_count"
                            name="star_count"
                          >
                            {vLessonInfo?.lessonExecutionDuration}
                          </span>
                        </td>
                      </tr> : null }
                      {browserRedirect()!==3 ? <tr
                        id="progress_table_tr_3"
                        name="progress_table_tr_3"
                        className="text-center"
                      >
                        <td
                          className="font-weight-bold font-16 text-center"
                          id="progress_table_td_3"
                          name="progress_table_td_3"
                        >
                          習熟度
                        </td>
                        <td id="progress_table_td_3" name="progress_table_td_3">
                          <span
                            className="ml-2 font-weight-bold font-16"
                            id="proficiency_level"
                            name="proficiency_level"
                          >
                            {(Number(vLessonInfo?.lessonExecutionProficiency)*100).toFixed(0)}%
                          </span>
                        </td>
                      </tr> : null }
                    </tbody>
                  </table>
                </Col>
              </Row>
              <Row
                className=""
                id="scenario_selection_card_container"
                name="scenario_selection_card_container"
              >
                {/* pr-2 pl-2 pt-1 pb-0 */}
                {!vLoading
                  ? vLessonInfo?.sectionList.map((task, index) => {
                    return (
                      <Col xl="4" lg="6" md="6" className={`mb-4 ${classes.pd0} ${classes.mw50}`} key={task.sectionId}>
                        <RolePlayCard
                          status={true}
                          task={task}
                          index={index}
                          selectedThemeName={vLessonInfo?.lessonTheme}
                          selectedScenarioName={vLessonInfo?.lessonScenario}
                          selectedCustomerData={vCustomerData}
                        />
                      </Col>
                    );
                  })
                  : <Col className={classes.pd0}>loading......</Col>}
              </Row>
              <Row className="mt-2">
                {" "}
                {!vLoading && vGoalCount > 0 ? (
                  <>
                    <Col lg="12" className={`text-center row_box_cancel_flex_sp ${classes.tl}`}>
                      <p className="font-16 font-weight-bold">
                        全てのセクションを一度にプレイする場合はこちら
                      </p>
                    </Col>
                    <Col lg="4" className="mx-auto text-center">
                      <GeneralButton
                        onClick={() => clickAllScenario()}
                        title="全セクションをプレイ"
                        className={browserRedirect()==3 ? `${classes.decision_btn} ${classes.table_view_decision_btn} `: `${classes.decision_btn}`}
                      />
                    </Col>
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};
const stateToProps = (state) => {
  return {
    lesson_task_all: state.lesson_task_all,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    lessonTaskAll: (lesson_task_all) => {
      dispatch(lessonTaskAll(lesson_task_all));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(ScenariosSelectionPage);

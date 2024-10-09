import React, {useState, useEffect} from 'react';
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  useHistory,
} from "react-router-dom";

import Img96per from "../../../property/images/roleplay_card/100per_icon.svg";
import smileImg from "../../../property/images/roleplay_card/96per_icon.svg";
import Img69per from "../../../property/images/roleplay_card/69per_icon.svg";
import NoSmileImg from "../../../property/images/roleplay_card/noper_icon.svg";
import MarkIcon from "../../../property/images/roleplay_card/mark_icon.svg";
import PlayIcon from "../../../property/images/roleplay_card/play_icon.svg";
import ClockIcon from "../../../property/images/roleplay_card/clock_icon.svg";
import LockImage from "../../../property/images/lock_icon.png";
import classes from "./styles.module.css";
import { connect } from "react-redux";
import { selectTask } from "../../../storage/reduxActions/index";
import GeneralButton from "../../IButton/GeneralButton";
import { browserRedirect,getLocationState,setLocationState } from "../../../utils/util";

function RolePlayCard({
  task,
  status,
  index,
  selectTask,
  f_starCount,
  f_totalNumberOfPlay,
  selectedThemeName,
  selectedScenarioName,
  selectedCustomerData
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [payOfNumber, setPayOfNumber] = useState(0);
  const state= getLocationState();
  const [nSelectedCustomerData, setNSelectedCustomerData] = useState(state ? state.selectPersona:selectedCustomerData);
  const smileFace = (percent, cardRolePlayNumber) => {
    let taskRatePercent = parseFloat(percent).toFixed(0);
    if (cardRolePlayNumber != 0) {
      if (taskRatePercent >= 0 && taskRatePercent <= 69) {
        return Img69per;
      } else if (taskRatePercent >= 70 && taskRatePercent <= 84) {
        return Img96per;
      } else if (taskRatePercent >= 85 && taskRatePercent <= 100) {
        return smileImg;
      }
      return NoSmileImg;
    }
    return NoSmileImg;
  };

  const clickTask = (item, status) => {
    const selectedCustomerData = nSelectedCustomerData;
    if (status) {
      selectTask(item);
      setLocationState({
        task,
        selectedThemeName,
        selectedScenarioName,
        selectedCustomerData,
      },`rate-of-risk/${task.sectionId}/${task.personaId}`)
      history.push({
        pathname: `/rate-of-risk/${task.sectionId}/${task.personaId}`,
      });
    }
    return false;
  };

  const taskSplit = (item) => {
    // remove the contents after \n, which is useless in this page, and used for personal history
    // need to confirm with Tianhao
    if(item.includes('\n')){
      // return item.split("\n")[0];
      return item.replace('\n', '')
    }
    return item;
  };

  const smileFaceClass = (percent, cardRolePlayNumber) => {
    let percentTask = parseFloat(percent).toFixed(0);
    if (cardRolePlayNumber != 0) {
      if (percentTask >= 0 && percentTask <= 69) {
        return classes.per_69;
      } else if (percentTask >= 70 && percentTask <= 84) {
        return classes.per_96;
      } else if (percentTask >= 85 && percentTask <= 100) {
        return classes.per_100;
      }
    }
    return classes.per_0;
  };

  const smileFaceClassTablet = (percent, cardRolePlayNumber) => {
    let percentTask = parseFloat(percent).toFixed(0);
    if (cardRolePlayNumber != 0) {
      if (percentTask >= 0 && percentTask <= 69) {
        return classes.tablet_view_per_69;
      } else if (percentTask >= 70 && percentTask <= 84) {
        return classes.tablet_view_per_96;
      } else if (percentTask >= 85 && percentTask <= 100) {
        return classes.tablet_view_per_100;
      }
    }
    return classes.tablet_view_per_0;
  };

  const cardText = (percent, cardRolePlayNumber) => {
    let percentFixed = parseFloat(percent).toFixed(0);
    if (cardRolePlayNumber != "0") {
      if (percentFixed >= 0 && percentFixed <= 69) {
        return "もう少し！";
      } else if (percentFixed >= 70 && percentFixed <= 84) {
        return "合格！";
      } else if (percentFixed >= 85 && percentFixed <= 100) {
        return "完ペキ！";
      }
    }
    return "未実施";
  };

  return (
    <div
      className={`${classes.scenario_selection_card} ${!status ? classes.disable : ""
        } ${!status ? classes.cursor_not_allowed : ""}`}
      id={`scenario_selection_card_${index}`}
      name={`scenario_selection_card_${index}`}
      onClick={() => clickTask(task, status)}
    >
      <img
        src={LockImage}
        alt="lock_img"
        className={`${classes.lock_img}`}
        id={`scenario_selection_card_lock_img_${index}`}
        name={`scenario_selection_card_lock_img_${index}`}
      />
      <div className={classes.bottom_wrapper}>
        <Row className={`mb-3 ${browserRedirect()==3 ? classes.tablet_view_height_68 : classes.height_72}`}>
          <Col xs="5" className={browserRedirect()==3 ? classes.tablet_view_left_side_wrapper : classes.left_side_wrapper}>
            <div>
              {
                <p
                  className={`font-16 font-weight-bold  ${classes.text_ellipsis}`}
                  id={`task_name_${index}_${0}`}
                  name={`task_name_${index}_${0}`}
                  style={browserRedirect()==3 ? {overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}: null}
                >
                  {taskSplit(task.sectionName)}
                </p>
              }
            </div>
            <div>
              <p
                className={`
                  ${classes.right_side_width} 
                  ${smileFaceClass(task.sectionBestScore, task.sectionExecutionTimes)}
                  ${browserRedirect() === 3 && smileFaceClassTablet(task.sectionBestScore, task.sectionExecutionTimes)}`}
              >
                <img
                  className={`mr-1`}
                  src={smileFace(task.sectionBestScore, task.sectionExecutionTimes)}
                  id={`percision_percent_emotion_${index}`}
                  name={`percision_percent_emotion_${index}`}
                  alt="emotion_icon"
                />
                <span>{cardText(task.sectionBestScore, task.sectionExecutionTimes)}</span>
              </p>
            </div>
          </Col>
          <Col xs="7" className={`${classes.pr_0}`}>
            <p
              className={`d-flex align-items-start ${classes.bottom_text}`}
              id={`number_of_pay_number_wrapper${index}`}
              name={`number_of_pay_number_wrapper${index}`}
            >
              <img src={PlayIcon} alt="PlayIcon" className="mr-2" />
              <span
                id={`number_of_pay_number_text_${index}`}
                name={`number_of_pay_number_text_${index}`}
                style={browserRedirect() ===3  ? {fontSize: '13px'} : null}
              >
                {t("scenario.number_of_implementations")}：{task.sectionExecutionTimes}回
              </span>
            </p>
            <p
              className={`d-flex align-items-start ${classes.bottom_text}`}
              id={`percision_percent_wrapper_${index}`}
              name={`percision_percent_wrapper_${index}`}
            >
              <img src={MarkIcon} alt="MarkIcon" className="mr-2" />
              <span
                id={`percision_percent_text_${index}`}
                name={`percision_percent_text_${index}`}
                style={browserRedirect() ===3  ? {fontSize: '13px'} : null}
              >
                {t("scenario.maximum_achievement_rate")}：
                {task.sectionStatus == 'NOT_START' ? '-' : task.sectionBestScore ? task.sectionBestScore : '-'}％
              </span>
            </p>
            <p
              className={`mb-0 d-flex align-items-start ${classes.bottom_text}`}
              id={`percision_percent_wrapper_${index}`}
              name={`percision_percent_wrapper_${index}`}
            >
              <img src={ClockIcon} alt="ClockIcon" className={`mr-2`} />
              <span
                id={`percision_percent_text_${index}`}
                name={`percision_percent_text_${index}`}
                style={browserRedirect() ===3  ? {fontSize: '13px'} : null}
              >
                {t("scenario.play_time")}：{task.sectionStatus == 'NOT_START' ? '-' : task.sectionExecutionDuration ? task.sectionExecutionDuration : '-'}
              </span>
            </p>
          </Col>
        </Row>
        <GeneralButton
          onClick={() => clickTask(task, status)}
          title="決定"
          className={`${classes.decision_btn} ${browserRedirect()===3&&classes.decision_btn_tablet}`}
        />
      </div>
    </div>
  );
}

// export default RolePlayCard

const stateToProps = (state) => {
  return {
    select_task: state.select_task,
    lesson_task_all: state.lesson_task_all
  };
};

const dispatchToProps = (dispatch) => {
  return {
    selectTask: (select_task) => {
      dispatch(selectTask(select_task));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(RolePlayCard);

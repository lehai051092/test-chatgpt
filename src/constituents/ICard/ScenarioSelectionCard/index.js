import React, { useState, useEffect } from "react";
import { Row, Col } from "reactstrap";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  NavLink,
  useHistory,
} from "react-router-dom";

import smileImg from "../../../property/images/icons/smile.png";
import NoSmileImg from "../../../property/images/icons/nosmile.png";
import starImg from "../../../property/images/icons/star.png";
import starImgWhite from "../../../property/images/icons/star_white.png";
import MarkIcon from "../../../property/images/mark_icon.svg";
import PlayIcon from "../../../property/images/play_icon.svg";
import LockImage from "../../../property/images/lock_icon.png";
import classes from "./styles.module.css";
import { getPayOfNumber } from "../../../request/backendApi/api";
import eventShuttle from "../../../eventShuttle";
import ClockIcon from "../../../property/images/icons/clock_icon.png";
import { connect } from "react-redux";
import { selectTask } from "../../../storage/reduxActions/index";
import { setLocationState } from '../../../utils/util';


function ScenarioSelectionCard({
  task,
  f_starCount,
  status,
  index,
  f_totalNumberOfPlay,
  selectTask,
}) {
  const history = useHistory();
  const { t } = useTranslation();
  const [payOfNumber, setPayOfNumber] = useState(0);

  const precisionPercentage = (task) => {
    if (task.highestScore) {
      return (parseFloat(task.highestScore.precision).toFixed(2) * 100).toFixed(0);
    }
    return 0;
  };

  const precisionPercent = (task) => {
    if (task.highestScore) {
      return (parseFloat(task.highestScore.precision).toFixed(2) * 100).toFixed(0);
    }
    return "-";
  };

  const smileFace = (percent) => {
    return parseFloat(percent).toFixed(0) <= 69 ? NoSmileImg : smileImg;
  };

  useEffect(() => {
    // get pay of number api
    const setData = async () => {
      try {
        const data = getPayOfNumber(`tasks/${task.id}/chats/stats`).then(
          (res) => {
            f_totalNumberOfPlay(res.data.length);
            setPayOfNumber(res.data.length);
          }
        );
      } catch (error) {
        eventShuttle.dispatch("something_went_wrong");
      }
    };
    setData();
  }, [task]);

  const cardStar = (percent, task, cardIndex) => {
    let starCount = task.highestScore
      ? f_starCount(parseFloat(percent).toFixed(0))
      : 0; //get full star count
    let starHtml = [];
    for (let index = 0; index < starCount; index++) {
      //push full start count
      starHtml.push(
        <img
          className={classes.top_img}
          key={index}
          src={starImg}
          alert="star_img"
          id={`scenario_selection_card_star_card${cardIndex}_${index}`}
          name={`scenario_selection_card_star_card${cardIndex}_${index}`}
        />
      );
    }
    if (starCount < 3) {
      let starWhiteCount = 3 - starCount; //get white star count

      for (let index = 0; index < starWhiteCount; index++) {
        //push white star count
        starHtml.push(
          <img
            className={classes.top_img}
            key={index + starCount}
            src={starImgWhite}
            id={`scenario_selection_card_star_card${cardIndex}_${
              index + starCount
            }`}
            alert="star_img"
            name={`scenario_selection_card_star_card${cardIndex}_${
              index + starCount
            }`}
          />
        );
      }
    }
    return starHtml;
  };

  const clickTask = (item, status) => {
    if (status) {
      selectTask(item);
      setLocationState(task,`rate-of-risk/${task.id}/${task.persona.id}`);
      history.push({
        pathname: `/rate-of-risk/${task.id}/${task.persona.id}`,
      });
    }
    return false;
  };

  const taskSplit = (item) => {
    return item.split("\n");
  };

  return (
    <div
      className={`${classes.scenario_selection_card} ${
        !status ? classes.disable : ""
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
      <div className={classes.top_wrapper}>
        <Row>
          <span
            className={classes.star_img}
            id={`scenario_selection_card_stars_${index}`}
            name={`scenario_selection_card_stars_${index}`}
          >
            {cardStar(precisionPercentage(task), task, index)}
          </span>
        </Row>
        {/* <Row>
                    <span className={`${classes.top_head_text} font-weight-bold`} id={`task_folder_name_${index}`} name={`task_folder_name_${index}`}>
                        {task.folder}
                    </span>
                </Row> */}
        <div className="align-middle">
          {taskSplit(task.name).map((v, k) => {
            return (
              <Row key={k} className={classes.card_title_area}>
                <span
                  className={`${classes.top_head_text} font-weight-bold`}
                  id={`task_name_${index}_${k}`}
                  name={`task_name_${index}_${k}`}
                >
                  {v}
                </span>
              </Row>
            );
          })}
        </div>
      </div>
      <div className={classes.bottom_wrapper}>
        <div className={classes.bottom_flex}>
          <div>
            <p
              className={`d-flex align-items-start ${classes.bottom_text}`}
              id={`number_of_pay_number_wrapper${index}`}
              name={`number_of_pay_number_wrapper${index}`}
            >
              <img src={PlayIcon} alt="PlayIcon" className="mr-2" />
              <span
                id={`number_of_pay_number_text_${index}`}
                name={`number_of_pay_number_text_${index}`}
              >
                {t("scenario.number_of_implementations")}：{payOfNumber}回
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
              >
                {t("scenario.maximum_achievement_rate")}：
                {precisionPercent(task)}％
              </span>
            </p>
            <p
              className={`d-flex align-items-start ${classes.bottom_text}`}
              id={`percision_percent_wrapper_${index}`}
              name={`percision_percent_wrapper_${index}`}
            >
              <img
                src={ClockIcon}
                alt="ClockIcon"
                className={`mr-2 ${classes.w_8}`}
              />
              <span
                id={`percision_percent_text_${index}`}
                name={`percision_percent_text_${index}`}
              >
                {t("scenario.play_time")}：{task.duration ? task.duration : "-"}
              </span>
            </p>
          </div>
          <div className={classes.right_side_div}>
            <span className={classes.right_side_width}>
            {task.highestScore && 
            <img
            className={classes.bottom_img}
            src={smileFace(precisionPercentage(task))}
            id={`percision_percent_emotion_${index}`}
            name={`percision_percent_emotion_${index}`}
            alt="emotion_icon"
            />
            }
           </span>
            <button onClick={() => clickTask(task, status)} className={classes.decision_btn}>決定</button>
          </div>
        </div>
      </div>
    </div>
    // </Link>
  );
}

// export default ScenarioSelectionCard

const stateToProps = (state) => {
  return {
    select_task: state.select_task,
  };
};

const dispatchToProps = (dispatch) => {
  return {
    selectTask: (select_task) => {
      dispatch(selectTask(select_task));
    },
  };
};

export default connect(stateToProps, dispatchToProps)(ScenarioSelectionCard);
